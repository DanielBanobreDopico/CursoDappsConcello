const path = require('path');
const fs = require('fs');
const solc = require('solc');

const storageName = path.resolve(__dirname, 'contracts', 'storageName.sol');
const source = fs.readFileSync(storageName, 'utf8');

//console.log(source);

const input = {
    language: 'Solidity',
    sources: {
        'storageName.sol': {
            content: source,
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
}

const output = JSON.parse(solc.compile(JSON.stringify(input)));

//console.log(output);
//console.log(output.contracts['storageName.sol'].StorageName.abi);
//console.log(output.contracts['storageName.sol'].StorageName.evm.bytecode.object);

module.exports = output.contracts['storageName.sol'].StorageName