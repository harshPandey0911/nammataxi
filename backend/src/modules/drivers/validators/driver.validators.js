import { body, param, query } from 'express-validator';

export const createDriverValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('vehicleCategoryId').optional().isMongoId().withMessage('Invalid vehicle category ID'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('passwordHash').optional().notEmpty().withMessage('Password PIN is required'),
  body('profileImage').optional().isURL().withMessage('Invalid profile image URL'),
];

export const updateDriverValidator = [
  param('id').isMongoId().withMessage('Invalid driver ID'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('passwordHash').optional().notEmpty().withMessage('Password PIN cannot be empty'),
  body('status').optional().isIn(['available', 'busy', 'offline']).withMessage('Invalid status'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('profileImage').optional().isURL().withMessage('Invalid profile image URL'),
];

export const driverIdValidator = [
  param('id').isMongoId().withMessage('Invalid driver ID'),
];

export const driverProfileValidator = [
  param('id').isMongoId().withMessage('Invalid driver ID'),
];

export const driverEarningsValidator = [
  query('driverId').optional().isMongoId().withMessage('Invalid driver ID'),
  query('status').optional().isIn(['pending', 'settled']),
];

export const listDriversValidator = [
  query('status').optional().isIn(['available', 'busy', 'offline']),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

export const driverBookingQueryValidator = [
  param('id').isMongoId().withMessage('Invalid booking ID'),
];

export const driverUpdateStatusValidator = [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('status')
    .isIn(['enroute', 'arrived', 'started', 'completed'])
    .withMessage('Invalid status transition for driver'),
];
