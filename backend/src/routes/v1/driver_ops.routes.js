import { Router } from 'express';
import * as driverOpsController from '../../modules/drivers/controller/driver_ops.controller.js';
import * as earningController from '../../modules/drivers/controller/earning.controller.js';
import { protect, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

import * as driverValidators from '../../modules/drivers/validators/driver.validators.js';
import { validate } from '../../middleware/validate.js';

const router = Router();

// All routes here require driver role
router.use(protect, authorize('driver'));

router.get('/bookings', asyncHandler(driverOpsController.getDriverBookings));
router.get('/bookings/:id', driverValidators.driverBookingQueryValidator, validate, asyncHandler(driverOpsController.getDriverBookingDetail));
router.patch('/bookings/:id/status', driverValidators.driverUpdateStatusValidator, validate, asyncHandler(driverOpsController.updateBookingStatus));
router.post('/bookings/:id/respond', asyncHandler(driverOpsController.respondToAssignment));
router.get('/earnings', earningController.getMyEarnings);

export default router;
