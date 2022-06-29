const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");

var input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const buildPath = path.resolve(__dirname, "build");
output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.log(err.formattedMessage);
  });
} else {
  const contracts = output.contracts["Inbox.sol"];
  for (let contractName in contracts) {
    const contract = contracts[contractName];

    module.exports = { abi: contract.abi, bytecode: contract.evm.bytecode.object };
    fs.writeFileSync(
      path.resolve(buildPath, `${contractName}.json`),
      JSON.stringify(contract.abi, null, 2),
      "utf8"
    );
  }
}
