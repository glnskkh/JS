class Flags {
  constructor() {
    this.params = {};
    this.flags = {};
    this.other = {};
  }

  addParameter(name, defaultValue) {
    this.params[name] = defaultValue;
  }

  addFlag(name) {
    this.flags[name] = false;
  }

  parse(argv) {
    let flags = { ...this.params, ...this.flags, other: [] };

    for (let i = 0; i < argv.length; ++i) {
      const arg = argv[i];

      if (this.flags[arg] != undefined) {
        flags[arg] = true;
      } else if (this.params[arg] != undefined) {
        let value = argv[i + 1];

        if (value == undefined) {
          console.error('error: there is too few arguments');
          return null;
        }

        if (!isNaN(value))
          value = Number(value);

        flags[arg] = value;
      } else {
        flags.other.push(arg);
      }
    }

    return flags;
  }
}

module.exports = { Flags };