class Transaction {
  constructor(from, to, amount, note) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.note = note;
  }
}

module.exports = Transaction;
