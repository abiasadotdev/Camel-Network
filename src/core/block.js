const crypto = require("crypto");

class Block {
  constructor(index, timestamp, transactions, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.createHash();
  }

  createHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.previousHash +
          this.nonce +
          this.hash
      )
      .digest("hex");
  }

  mine(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.createHash();
    }

    console.log(`Block mined! n\Nonce : ${this.nonce}`);
  }
}

module.exports = Block;
