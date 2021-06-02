const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // O ethers.js como alternativa más liviana.

const compile = require('../compile');

const web3 = new Web3(ganache.provider());
const abi = compile.abi;
const bytecode = compile.evm.bytecode.object;

let accounts;
let contractInstance;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    contractInstance = await new web3.eth.Contract(abi).deploy({
        data: bytecode,
        arguments: ['Daniel'],
    })
    .send({ from: accounts[0], gas: '1000000'});
});

describe('StorageName', () => {
    it('deploy a contract', () => {
        console.log(contractInstance._address);
        console.log(accounts);
    });
    it('Original name', async () => {
        const name = await contractInstance.methods.getName().call();
        assert.strictEqual(name, 'Daniel');
    });
    it('Can change name', async () => {
        await contractInstance.methods.setName('Tania').send({ from: accounts[0], gas: '1000000'});
        const name = await contractInstance.methods.getName().call();
        assert.strictEqual(name, 'Tania');
    });
})