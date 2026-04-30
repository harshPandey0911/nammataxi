import { body, param, query } from 'express-validator';

export const createCaseValidator = [
    body('subject').notEmpty().withMessage('Subject is required').trim(),
    body('description').notEmpty().withMessage('Description is required').trim(),
    body('category').optional().isIn(['payment', 'refund', 'driver', 'pickup_delay', 'cancellation', 'pricing', 'behavior', 'technical', 'other']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('bookingId').optional().isMongoId().withMessage('Invalid booking ID'),
    body('assignedTo').optional().isMongoId().withMessage('Invalid staff ID'),
];

export const updateCaseValidator = [
    param('caseId').isMongoId().withMessage('Invalid case ID'),
    body('status').optional().isIn(['open', 'in_progress', 'waiting_customer', 'resolved', 'closed']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('assignedTo').optional().isMongoId().withMessage('Invalid staff ID'),
];

export const addNoteValidator = [
    param('caseId').isMongoId().withMessage('Invalid case ID'),
    body('body').notEmpty().withMessage('Note body is required').trim(),
];

export const listCasesValidator = [
    query('status').optional().isIn(['open', 'in_progress', 'waiting_customer', 'resolved', 'closed']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    query('range').optional().isIn(['today', '7d', '30d', 'all']),
    query('search').optional().trim(),
];
