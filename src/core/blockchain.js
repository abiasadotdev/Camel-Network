const Block = require("./block");

const Transaction = require("./transaction");

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = 1;
  }

  createGenesisBlock() {
    return new Block(
      0,
      Date.now(),
      new Transaction("system", "system", 0, "Genesis block"),
      0
    );
  }

  createTransaction(tx) {
    this.pendingTransactions.push(tx);

    return "Transaction added to pending transactions.";
  }

  minePendingTransaction(minerAddress) {
    const block = new Block(
      this.chain[this.chain.length - 1].index + 1,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mine(this.difficulty);

    this.pendingTransactions = [];

    const tx = new Transaction("system", minerAddress, 5, "Mining reward");

    this.pendingTransactions.push(tx);

    this.chain.push(block);

    console.log("Mine pending transaction success!");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}

module.exports = Blockchain;
