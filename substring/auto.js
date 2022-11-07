const { Find, NOT_FOUND } = require('./find');

class FindAuto extends Find {
	constructor(query) {
		super(query);

		this.table = AutomataTable.buildFrom(query);
	}

	findNext(buffer) {
		let index = NOT_FOUND;

		while (buffer.left() > 0 && index == NOT_FOUND) {
			if (this.table.move(buffer.get()))
				index = buffer.cursor - this.queryLen + 1;

			buffer.moveCursor(1);
		}

		return index;
	}
}

class AutomataTable {
	constructor(queryLen) {
		this.queryLen = queryLen;
		this.transitions = [];
		this.current = 0;
	}

	move(next) {
		let nextIndex = this.transitions[this.current][next];

		this.current = nextIndex || 0;

		let isEnd = this.current == this.queryLen;

		if (isEnd)
			this.current = 0;

		return isEnd;
	}

	static buildFrom(query) {
		let autoTable = new AutomataTable(query.left());

		for (let i = 0; i < autoTable.queryLen; ++i) {
			autoTable.transitions[i] = [];

			autoTable.transitions[i][query.get(i)] = i + 1;

			for (let j = 1; j < i; ++j) {
				let len = query.lenEqualParts(0, j, i - j, i);

				autoTable.transitions[i][query.get(len - 1)] = len;
			}
		}

		return autoTable;
	}
}



module.exports = { FindAuto };