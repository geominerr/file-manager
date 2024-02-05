class Colorant {
  static instance = null;

  colors = {
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    purple: '\x1b[35m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    orange: '\x1b[38,5,208m',
    brightYellow: '\x1b[93m',
    brightGreen: '\x1b[92m',
    reset: '\x1b[0m',
  };

  constructor() {
    if (!Colorant.instance) {
      Colorant.instance = this;
    }

    return Colorant.instance;
  }

  paintHint(message) {
    return this.colorize(message, this.colors.yellow);
  }

  paintError(error) {
    return this.colorize(error, this.colors.red);
  }

  paintCurrDir(message) {
    return this.colorize(message, this.colors.blue);
  }

  paintResult(message) {
    return this.colorize(message, this.colors.brightGreen);
  }

  paintPrompt(message) {
    return this.colorize(message, this.colors.green);
  }

  paintUsername(message) {
    return this.colorize(message, this.colors.purple);
  }

  paintFarewell(message) {
    return this.colorize(message, this.colors.brightYellow);
  }

  colorize(text, escapeCode) {
    return `${escapeCode}${text}${this.colors.reset}`;
  }
}

export default Colorant;
