const path = require('path');
const fs = require('fs');
const solc = require('solc');

const storageName = path.resolve(__dirname, 'contracts', 'storageName.sol');
const source = fs.readFileSync(storageName, 'utf8');

console.log(source);