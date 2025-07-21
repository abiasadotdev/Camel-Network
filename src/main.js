const net = require("net");

const CamelNetwork = require("./core");

const Transaction = require("./core/transaction");

const Nodes = require('./nodes');

const port = 8000;

const server = net.createServer((socket) => {
  console.log(`Some node connected.`);
  
  const newNode = socket.remoteAddress + ':' + socket.remotePort;
  
  if (!Nodes.Nodes.includes(newNode)) {
    Nodes.Nodes.push(newNode.replace('::ffff:', ''));
    
    console.log(`New node added to nodes list. Node : ${newNode.replace('::ffff:', '')}`);
    
    console.log(`Node list : ${Nodes.Nodes}`)
  }

  socket.on("data", (buffer) => {
    const data = JSON.parse(buffer);

    if (data.event == 'registerNode') {
      console.log(`New node register. Node : ${data.data.node}`);
      
      Nodes.Nodes.push(data.data.node);
      
      socket.write('Node register success.');
    }

    if (data.event == "getBlock") {
      socket.write(JSON.stringify(CamelNetwork.chain));
    }

    if (data.event == "getPendingTransaction") {
      socket.write(JSON.stringify(CamelNetwork.pendingTransactions));
    }

    if (data.event == 'newTrasaction') {
      console.log(`New transaction. Transaction: ${data.data}`)
    }

    if (data.event == "createTransaction") {
      const { from, to, amount, note } = data.data;

      const tx = new Transaction(from, to, amount, note);

      CamelNetwork.createTransaction(tx);

      socket.write(`Transaction created and added to pending transaction.`);
      
      Nodes.Nodes.forEach(node => {
        const address = node.split(':');
        
        const socket = net.createConnection({host: address[0], port: address[1] }, () => {
          socket.write(JSON.stringify({event: newTransaction, data: tx}))
        })
      })
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

if (!Nodes.genesisNode) {
  const socket = net.createConnection({host: '192.168.100.85', port: 8000}, () => {
    console.log(`Connected to genesis node ${Nodes.Nodes[0]}`);
    
    socket.write(JSON.stringify({event: 'registerNode', data: {node: '192.168.100.57:8000'}}));
  });
}