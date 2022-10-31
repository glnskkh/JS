class Flags {
  constructor() {
    this.params = {};
    this.flags = {};
  }

  addParameter(name, defaultValue) {
    this.params[name] = defaultValue;
  }

  addFlag(name) {
    this.flags[name] = false;
  }

  isFlag(string) {
    return this.flags[string] != undefined;
  }

  isParameter(string) {
    return this.params[string] != undefined;
  }

  parse(argv) {
    let flags = { ...this.params, ...this.flags };

    for (let i = 0; i < argv.length; ++i) {
      const arg = argv[i];

      if (this.isFlag(arg)) {
        flags[arg] = true;
      } else if (this.isParameter(arg)) {
        let value = argv[i + 1];

        if (value == undefined) {
          console.error('error: there is too few arguments');
          return null;
        }

        if (!isNaN(value))
          value = Number(value);

        flags[arg] = value;
      }
    }

    return flags;
  }
}

module.exports = { Flags };