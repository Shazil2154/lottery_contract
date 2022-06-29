const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3"); //Web3 is a constructor of the web3 module

const web3 = new Web3(ganache.provider()); //web3 is an instance of the web3 module
const { abi, bytecode } = require("../compile");
const inboxBuild = require("../build/Inbox.json");
const abiObj = require("solc/abi");

let newABI;
newABI = abiObj.update("0.3.6", inboxBuild);

let accounts;
let inbox;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(newABI)
    .deploy({ data: bytecode, arguments: ["Hi there!"] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi there!");
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("bye!").send({
      from: accounts[0],
    });
    const message = await inbox.methods.message().call();
    assert.equal(message, "bye!");
  });
});

//https://rinkeby.infura.io/v3/34618f87c12040efae12dd19ce8f40b0
