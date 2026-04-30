import Booking from '../model/booking.model.js';
import Quote from '../../quotes/model/quote.model.js';
import Customer from '../../customers/model/customer.model.js';
import { AppError } from '../../../utils/AppError.js';

function generateBookingRef() {
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const randomNums = Math.floor(1000 + Math.random() * 9000);
  return `NT-${randomChars}${randomNums}`;
}

export async function createBooking(data) {
  const { quoteId, categoryId, customerInfo } = data;

  // 1. Verify quote and get fare details
  const quote = await Quote.findById(quoteId);
  if (!quote) {
    throw AppError.badRequest('Invalid or expired quote');
  }

  const categoryQuote = quote.availableCategories.find(
    (c) => c.vehicleCategoryId.toString() === categoryId
  );

  if (!categoryQuote) {
    throw AppError.badRequest('Selected vehicle category is not available in this quote');
  }

  // 2. Manage Customer (Upsert or use existing ID)
  let customer;
  if (data.customerId) {
    customer = await Customer.findById(data.customerId);
  }
  
  if (!customer) {
    customer = await Customer.findOne({ phone: customerInfo.phone });
    if (!customer) {
      customer = await Customer.create({
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
      });
    }
  }

  // 3. Create Booking
  const bookingRef = generateBookingRef();

  const booking = await Booking.create({
    bookingRef,
    customerId: customer._id,
    customerInfo,
    tripSummary: {
      serviceType: quote.serviceType,
      tripMode: quote.tripMode,
      pickupLocation: quote.pickupLocation,
      dropLocation: quote.dropLocation,
      pickupDate: quote.pickupDate,
      pickupTime: quote.pickupTime,
      returnDate: quote.returnDate,
      distanceKm: quote.distanceKm,
      estimatedDuration: quote.estimatedDuration,
      quoteSource: quote.quoteSource,
    },
    selectedVehicleCategory: {
      categoryId: categoryQuote.vehicleCategoryId,
      name: categoryQuote.categoryName,
    },
    fareDetails: {
      computedFare: categoryQuote.computedFare,
      breakdown: categoryQuote.breakdown,
    },
    quoteId: quote._id,
    status: 'new',
  });

  // 4. Trigger Notification
  const notificationService = await import('../../notifications/service/notification.service.js');
  notificationService.triggerNotification('booking_created', {
    bookingId: booking._id,
    customerId: customer._id,
    bookingRef: booking.bookingRef,
    customerName: customerInfo.name,
    customerPhone: customerInfo.phone,
    customerEmail: customerInfo.email,
    pickupLocation: quote.pickupLocation,
    amount: categoryQuote.computedFare
  }).catch(err => console.error('Notification failed:', err));

  return booking;
}

export async function getBookingById(id) {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw AppError.notFound('Booking not found');
  }
  return booking;
}

export async function getPublicBookingInfo(id) {
  const booking = await Booking.findById(id).select('bookingRef status selectedVehicleCategory createdAt');
  if (!booking) {
    throw AppError.notFound('Booking not found');
  }
  return booking;
}

export async function getAllBookings(filters = {}) {
  const { range, search, ...restFilters } = filters;
  const matchQuery = { ...restFilters };
  const now = new Date();

  // Search logic
  if (search) {
    matchQuery.$or = [
      { bookingRef: { $regex: search, $options: 'i' } },
      { 'customerInfo.name': { $regex: search, $options: 'i' } },
      { 'customerInfo.phone': { $regex: search, $options: 'i' } }
    ];
  }

  // Handle multiple statuses if provided as comma-separated string
  if (restFilters.status && typeof restFilters.status === 'string' && restFilters.status.includes(',')) {
    matchQuery.status = { $in: restFilters.status.split(',') };
  }

  // Handle multiple payment methods if provided as comma-separated string
  if (restFilters.paymentMethod && typeof restFilters.paymentMethod === 'string' && restFilters.paymentMethod.includes(',')) {
    matchQuery.paymentMethod = { $in: restFilters.paymentMethod.split(',') };
  }
  
  // Date-based grouping
  if (range === 'today') {
    const today = now.toISOString().split('T')[0];
    matchQuery['tripSummary.pickupDate'] = today;
  } else if (range === 'tomorrow') {
    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(now.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];
    matchQuery['tripSummary.pickupDate'] = tomorrow;
  } else if (range === 'upcoming') {
    const today = now.toISOString().split('T')[0];
    matchQuery['tripSummary.pickupDate'] = { $gte: today };
    matchQuery.status = { $nin: ['completed', 'cancelled'] };
  } else if (range === 'advanced') {
    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(now.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];
    matchQuery['tripSummary.pickupDate'] = { $gte: tomorrow };
    matchQuery.status = { $nin: ['completed', 'cancelled'] };
  } else if (range === 'unassigned') {
    matchQuery.status = 'confirmed';
    matchQuery['assignedDriver.driverId'] = { $exists: false };
  }

  // Admin only logic - Aggregate notification counts for each booking
  return Booking.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: 'notifications',
        localField: '_id',
        foreignField: 'bookingId',
        as: 'notifications'
      }
    },
    {
      $addFields: {
        notificationCount: { $size: '$notifications' }
      }
    },
    { $project: { notifications: 0 } },
    { 
      $sort: ['today', 'tomorrow', 'upcoming', 'unassigned'].includes(range)
        ? { 'tripSummary.pickupDate': 1, 'tripSummary.pickupTime': 1 }
        : { createdAt: -1 } 
    }
  ]);
}

const VALID_TRANSITIONS = {
  'new': ['confirmed', 'cancelled'],
  'confirmed': ['assigned', 'cancelled'],
  'assigned': ['enroute', 'cancelled'],
  'enroute': ['arrived', 'cancelled'],
  'arrived': ['started', 'cancelled'],
  'started': ['completed'],
  'completed': [],
  'cancelled': []
};

export async function updateBookingStatus(id, newStatus, updatedBy = null) {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw AppError.notFound('Booking not found');
  }

  const currentStatus = booking.status;
  
  // 1. Validate transition
  if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
    throw AppError.badRequest(`Invalid status transition from ${currentStatus} to ${newStatus}`);
  }

  // 2. Perform transition
  booking.status = newStatus;
  booking.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy: updatedBy?.id,
    updatedByModel: updatedBy?.role === 'staff' || updatedBy?.role === 'admin' ? 'Staff' : (updatedBy?.role === 'driver' ? 'Driver' : 'Customer')
  });

  // 3. Driver Status Synchronization
  if (booking.assignedDriver?.driverId) {
    const Driver = (await import('../../drivers/model/driver.model.js')).default;
    
    // If completed or cancelled, make driver available again IF they have no other active bookings
    if (['completed', 'cancelled'].includes(newStatus)) {
      const activeBookingsCount = await Booking.countDocuments({
        _id: { $ne: booking._id },
        'assignedDriver.driverId': booking.assignedDriver.driverId,
        status: { $in: ['assigned', 'enroute', 'arrived', 'started'] }
      });

      if (activeBookingsCount === 0) {
        await Driver.findByIdAndUpdate(booking.assignedDriver.driverId, { status: 'available' });
      }
    }
  }

  await booking.save();
  
  // 4. Earnings Integration
  if (newStatus === 'completed') {
    const earningService = await import('../../drivers/service/earning.service.js');
    earningService.recordTripEarning(booking._id).catch(err => console.error('Earning creation failed:', err));
  }

  return booking;
}

export async function getBookingsByCustomerId(customerId) {
  return Booking.find({ customerId }).sort({ createdAt: -1 });
}

export async function assignDriver(bookingId, driverId) {
  const Driver = (await import('../../drivers/model/driver.model.js')).default;
  
  const booking = await Booking.findById(bookingId);
  if (!booking) throw AppError.notFound('Booking not found');

  // 1. Validate booking eligibility
  // We only allow assignment for 'confirmed' (first time) or 'assigned' (reassignment)
  // We block 'new' because it must be confirmed first to follow strict lifecycle
  if (!['confirmed', 'assigned'].includes(booking.status)) {
    throw AppError.badRequest(`Booking in ${booking.status} state cannot be dispatched`);
  }

  const driver = await Driver.findById(driverId);
  if (!driver) throw AppError.notFound('Driver not found');
  
  if (!driver.isActive || driver.status !== 'available') {
    throw AppError.badRequest('Driver is not available for assignment');
  }

  // 2. Handle old driver if reassignment
  const oldDriverId = booking.assignedDriver?.driverId;
  if (oldDriverId && oldDriverId.toString() !== driverId.toString()) {
    // If reassigned, check if old driver is now free
    const activeBookingsCount = await Booking.countDocuments({
      _id: { $ne: booking._id },
      'assignedDriver.driverId': oldDriverId,
      status: { $in: ['assigned', 'enroute', 'arrived', 'started'] }
    });

    if (activeBookingsCount === 0) {
      await Driver.findByIdAndUpdate(oldDriverId, { status: 'available' });
    }
  }

  // 3. Update booking assignment
  booking.assignedDriver = {
    driverId: driver._id,
    name: driver.name,
    phone: driver.phone,
    vehicleNumber: driver.vehicleNumber,
    licenseNumber: driver.licenseNumber,
    assignedAt: new Date(),
  };

  const oldStatus = booking.status;
  booking.status = 'assigned';
  
  // Only push history if it's a real status change or first assignment
  if (oldStatus === 'confirmed') {
    booking.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      note: 'Driver assigned for the first time'
    });
  } else if (oldStatus === 'assigned') {
    booking.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      note: 'Driver reassigned by dispatch'
    });
  }

  // 4. Mark new driver busy
  driver.status = 'busy';

  await Promise.all([booking.save(), driver.save()]);

  // 5. Trigger Notification
  const notificationService = await import('../../notifications/service/notification.service.js');
  notificationService.triggerNotification('driver_assigned', {
    bookingId: booking._id,
    customerId: booking.customerId,
    bookingRef: booking.bookingRef,
    customerName: booking.customerInfo.name,
    customerPhone: booking.customerInfo.phone,
    customerEmail: booking.customerInfo.email,
    driverName: driver.name,
    driverPhone: driver.phone,
    vehicleNumber: driver.vehicleNumber
  }).catch(err => console.error('Notification failed:', err));

  return booking;
}

export async function cancelBooking(id, authContext = {}, reason = 'Customer cancelled') {
  const { userId, guestPhone } = authContext;
  const booking = await Booking.findById(id);
  if (!booking) {
    throw AppError.notFound('Booking not found');
  }

  // 1. Ownership / Eligibility Check (Safe parity with initiatePayment)
  const isAdmin = authContext.role === 'admin' || authContext.role === 'staff';
  if (!isAdmin) {
    if (userId) {
      // Authenticated user: must own the booking
      if (!booking.customerId || booking.customerId.toString() !== userId.toString()) {
        throw AppError.forbidden('You do not have permission to cancel this booking');
      }
    } else {
      // Guest flow: must provide phone that matches the booking
      if (!guestPhone || booking.customerInfo.phone !== guestPhone) {
        throw AppError.forbidden('Guest verification failed for this booking');
      }
    }
  }

  const currentStatus = booking.status;

  // 2. Validate if cancellable
  const CANCELLABLE_STATUSES = ['new', 'confirmed', 'assigned', 'enroute', 'arrived'];
  if (!CANCELLABLE_STATUSES.includes(currentStatus)) {
    throw AppError.badRequest(`Booking in ${currentStatus} state cannot be cancelled`);
  }

  // 3. Perform cancellation
  booking.status = 'cancelled';
  booking.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: reason,
    updatedBy: userId,
    updatedByModel: userId ? 'Customer' : null // Simplification for guest
  });

  // 4. Driver Status Synchronization
  if (booking.assignedDriver?.driverId) {
    const Driver = (await import('../../drivers/model/driver.model.js')).default;
    const activeBookingsCount = await Booking.countDocuments({
      _id: { $ne: booking._id },
      'assignedDriver.driverId': booking.assignedDriver.driverId,
      status: { $in: ['assigned', 'enroute', 'arrived', 'started'] }
    });

    if (activeBookingsCount === 0) {
      await Driver.findByIdAndUpdate(booking.assignedDriver.driverId, { status: 'available' });
    }
  }

  await booking.save();

  // 4. Refund Policy Integration
  const paymentService = await import('../../payments/service/payment.service.js');
  await paymentService.initiateRefund(booking._id, reason, userId ? { id: userId, role: 'customer' } : null);

  // Refresh booking to get updated refund status before notification
  const updatedBooking = await Booking.findById(booking._id);

  // 5. Trigger Cancellation Notification
  const notificationService = await import('../../notifications/service/notification.service.js');
  notificationService.triggerNotification('booking_cancelled', {
    bookingId: updatedBooking._id,
    customerId: updatedBooking.customerId,
    bookingRef: updatedBooking.bookingRef,
    customerName: updatedBooking.customerInfo.name,
    customerPhone: updatedBooking.customerInfo.phone,
    customerEmail: updatedBooking.customerInfo.email,
    refundStatus: updatedBooking.refundStatus
  }).catch(err => console.error('Notification failed:', err));

  return updatedBooking;
}

export async function getDriverBookings(driverId) {
  return Booking.find({ 'assignedDriver.driverId': driverId }).sort({ createdAt: -1 });
}

export async function getDriverBookingById(bookingId, driverId) {
  const booking = await Booking.findOne({ _id: bookingId, 'assignedDriver.driverId': driverId });
  if (!booking) throw AppError.notFound('Booking not found or not assigned to you');
  return booking;
}

export async function updateBookingStatusByDriver(bookingId, driverId, newStatus) {
  const booking = await Booking.findOne({ _id: bookingId, 'assignedDriver.driverId': driverId });
  if (!booking) throw AppError.notFound('Booking not found or not assigned to you');

  const DRIVER_ALLOWED_TRANSITIONS = {
    'assigned': ['enroute'],
    'enroute': ['arrived'],
    'arrived': ['started'],
    'started': ['completed']
  };

  const currentStatus = booking.status;
  if (!DRIVER_ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus)) {
    throw AppError.badRequest(`Driver cannot transition from ${currentStatus} to ${newStatus}`);
  }

  // Reuse the existing status update logic but with driver context
  return updateBookingStatus(bookingId, newStatus, { id: driverId, role: 'driver' });
}
