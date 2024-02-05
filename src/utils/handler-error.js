import Colorant from './ec-colorant.js';

class ErrorHandler {
  static instance = null;
  defaultMessage = 'An unknown error has occurred. Please try again.';
  startMessage = 'Operation failed!\n';

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
      const errorMessage = this.colorant.paintError(
        `${
          err.message?.startsWith('\nInvalid command or args')
            ? ''
            : this.startMessage
        }${err.message}`
      );

      return console.error(errorMessage);
    }

    return console.error(this.colorant.paintError(`${this.defaultMessage}`));
  }
}

export default ErrorHandler;
