import AppError from '../utils/AppError.js';

/**
 * Service to manage business logic for Example resource.
 */
class ExampleService {
  /**
   * Fetch list of items.
   * @returns {Promise<Array>} List of items
   */
  async getItems() {
    return [
      { id: 1, name: 'Item Alpha', description: 'This is the first example item.' },
      { id: 2, name: 'Item Beta', description: 'This is the second example item.' },
      { id: 3, name: 'Item Gamma', description: 'This is the third example item.' },
    ];
  }

  /**
   * Retrieve an item by ID.
   * @param {number} id - Item identifier
   * @returns {Promise<Object>} Item details
   * @throws {AppError} If item is not found
   */
  async getItemById(id) {
    const items = await this.getItems();
    const item = items.find((i) => i.id === Number(id));

    if (!item) {
      throw new AppError(`Item with ID ${id} not found`, 404);
    }

    return item;
  }

  /**
   * Test an unhandled promise rejection.
   * Creates a promise that rejects, but does not catch it locally.
   */
  async triggerRejection() {
    // Return a promise that will reject in a separate context without a catch block
    setTimeout(() => {
      Promise.reject(new Error('This is an unhandled promise rejection test!'));
    }, 100);
    return { message: 'Unhandled rejection triggered' };
  }
}

export default new ExampleService();
