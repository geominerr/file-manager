import Colorant from './ec-colorant.js';

class ErrorHandler {
  static instance = null;
  defaultMessage = 'An unknown error has occurred. Please try again.';

  constructor() {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = this;

      this.colorant = new Colorant();
    }

    return ErrorHandler.instance;
  }

  handle(err) {
    // TO DO HANDLING!!!

    if (err?.message) {
      return console.error(this.colorant.paintError(err.message));
    }

    return console.error(this.colorant.paintError(this.defaultMessage));
  }
}

export default ErrorHandler;
