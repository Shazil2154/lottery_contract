const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, bytecode } = require("./compile");
const inboxBuild = require("./build/Inbox.json");
const abiObj = require("solc/abi");

let newABI;
newABI = abiObj.update("0.3.6", inboxBuild);

const provider = new HDWalletProvider(
  "west claim bind diary predict flat desk aim cat mule cabbage ensure",
  "https://rinkeby.infura.io/v3/34618f87c12040efae12dd19ce8f40b0"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from " + accounts[0]);

  const result = await new web3.eth.Contract(newABI)
    .deploy({ data: bytecode, arguments: ["Hi there!"] })
    .send({
      from: accounts[0],
      gas: "1000000",
    });

  console.log("contract deployed to " + result.options.address);
  provider.engine.stop();
};

deploy();
