const fs = require("fs");
const solc = require('solc')
const path = require('path')
const typechain = require('typechain')

const contracts_root = "Farsight-Contracts\\src";
const output_root = "contracts";
const types_out = "types"
const abi_out = "abi";

const output_path = path.resolve(__dirname, output_root);
const types_output_path = path.resolve(output_path, types_out);
const abi_output_path = path.resolve(output_path, abi_out);

if (!fs.existsSync(output_path)) {
  fs.mkdirSync(output_path);
}
if (!fs.existsSync(types_output_path)) {
  fs.mkdirSync(types_output_path);
}
if (!fs.existsSync(abi_output_path)) {
  fs.mkdirSync(abi_output_path);
}

var sources = {
  'RegistrarController.sol': {
     content: fs.readFileSync(path.resolve(contracts_root, "mainchain\\RegistrarController.sol"), 'utf8')
  }
};
var input = {
  language: 'Solidity',
  sources: sources  ,
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

function findImports(relativePath) {
  //my imported sources are stored under the node_modules folder!
  const absolutePath = path.resolve(__dirname, contracts_root, 'mainchain', relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  return { contents: source };
}

var output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

const compiledContract = output.contracts['RegistrarController.sol']["RegistrarController"];

let data = JSON.stringify(compiledContract.abi);

const abiOutFile = path.resolve(abi_output_path, 'RegistrarController.abi');

fs.writeFileSync(abiOutFile, data , 'utf8');

const cwd = process.cwd();
const allFiles = [abiOutFile];

typechain.runTypeChain({
  cwd,
  filesToProcess: allFiles,
  allFiles,
  outDir: types_output_path,
  target: 'web3-v1',
});
