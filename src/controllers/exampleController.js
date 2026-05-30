import exampleService from '../services/exampleService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * Controller to handle requests for Example resource.
 */
class ExampleController {
  /**
   * Get all items.
   */
  getAllItems = catchAsync(async (req, res) => {
    const items = await exampleService.getItems();
    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items },
    });
  });

  /**
   * Get an item by its ID.
   */
  getItem = catchAsync(async (req, res, next) => {
    const item = await exampleService.getItemById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { item },
    });
  });

  /**
   * Trigger an operational error (e.g., manual throw).
   */
  triggerError = catchAsync(async (req, res, next) => {
    throw new AppError('This is an intentional operational error!', 400);
  });

  /**
   * Trigger an unhandled promise rejection (outside express request cycle or uncaught in process).
   */
  triggerRejection = catchAsync(async (req, res, next) => {
    const result = await exampleService.triggerRejection();
    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  });
}

export default new ExampleController();
