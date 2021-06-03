const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compile = require('compile');

const abi = compile.abi;
const bytecode = compile.evm.bytecode.object;

const provider = new HDWalletProvider(
    
);
