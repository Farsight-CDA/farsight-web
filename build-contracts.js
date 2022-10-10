const fs = require("fs");
const solc = require('solc')
const path = require('path')
const typechain = require('typechain')

const contracts_root = path.join("Farsight-Contracts", "src");
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

function getAllFiles(dirPath, arrayOfFiles) {
  arrayOfFiles = arrayOfFiles || [];
  files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      if (path.extname(file) != '.sol') {
        return;
      }

      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

const sourceFiles = getAllFiles(contracts_root, null);

var sources = {};

sourceFiles.forEach(file => {
  sources[path.basename(file)] = fs.readFileSync(file, 'utf-8');
});

var input = {
  language: 'Solidity',
  sources: { 'RegistrarController.sol': { content: sources['RegistrarController.sol'] } },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

function findImports(relativePath) {
  const source = sources[path.basename(relativePath)];
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
