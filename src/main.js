const net = require("net");

const CamelNetwork = require("./core");

const Transaction = require("./core/transaction");

const port = 8000;

const server = net.createServer((socket) => {
  console.log(`Some node connected.`);

  socket.on("data", (buffer) => {
    const data = JSON.parse(buffer);

    if (data.event == "getBlock") {
      socket.write(JSON.stringify(CamelNetwork.chain));
    }

    if (data.event == "getPendingTransaction") {
      socket.write(JSON.stringify(CamelNetwork.pendingTransactions));
    }

    if (data.event == "createTransaction") {
      const { from, to, amount, note } = data.data;

      const tx = new Transaction(from, to, amount, note);

      CamelNetwork.createTransaction(tx);

      socket.write(`Transaction created and added to pending transaction.`);
    }

    if (data.event == "mine") {
      CamelNetwork.minePendingTransaction(data.data.address);

      socket.write(`Mining success`);

      console.log(CamelNetwork.chain);
    }
  });

  socket.on("end", () => {
    console.log(`Some node disconnected.`);
  });

  socket.on("error", (error) => {
    console.log(error);
  });
});

server.listen(port, () => {
  console.log(`Network running on port ${port}`);
});
