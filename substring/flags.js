const FLAG_START = '-';

class FlagRecord {
  constructor(longName, value, shortName) {
    this.longName = longName;
    this.value = value;
    this.shortName = shortName;
  }
}

class Flags {
  constructor() {
    this.params = {};
    this.flags = {};
    this.other = {};
  }

  addParameter(longName, shortName, defaultValue) {
    this.params[longName] = new FlagRecord(longName, defaultValue, shortName);

    if (shortName != undefined)
      this.params[shortName] = this.params[longName];
  }

  addFlag(longName, shortName) {
    this.flags[longName] = new FlagRecord(longName, false, shortName);

    if (shortName != undefined)
      this.flags[shortName] = this.flags[longName];
  }

  exsistsParam(name) {
    return this.params[name] != undefined;
  }

  exsistsFlag(name) {
    return this.flags[name] != undefined;
  }

  static trimStart(argument) {
    let j = 0;
    while (argument[j] == FLAG_START)
      j++;

    let flagName = argument.slice(j);

    return flagName;
  }

  parse(argv) {
    let flags = { ...this.params, ...this.flags };

    for (let i = 0; i < argv.length; ++i) {
      const argument = argv[i];

      let flagName = Flags.trimStart(argument);

      if (this.exsistsParam(flagName)) {
        let value = argv[++i];

        if (value == undefined) {
          console.error('error: there is too few arguments');
          process.exit(-1);
        }

        if (!isNaN(value))
          value = Number(value);

        flags[flagName].value = value;
      } else if (this.exsistsFlag(flagName))
        flags[flagName].value = true;
    }

    let flagsValues = {};

    for (const prop of Object.getOwnPropertyNames(flags))
      flagsValues[prop] = flags[prop].value;

    return flagsValues;
  }
}

module.exports = { Flags };