# DApps

## Solidity
* https://cryptozombies.io/es/ >> Divertido curso de Solidity.
* https://remix.ethereum.org/ >> Editor online para smartcontracts.

## IPFS
* https://pinata.cloud/ >> Storage Blockchain con IPFS
* https://fleek.co/ >> Hosting IPFS

## Otros links de interes:
* https://rarible.com/ >> NFT

## Sesiones virtuales inversas con Alberto Lasa (Freelance)

* Blockchain != criptomoneda.
* Blockchain: descentralizado y distribuido.
* UTXO: histórico de transacciones no gastadas.
* Ethereum: Máquina singleton transaccional criptográficamente segura con estado compartido.
    * Singleton: La ejecución se dispara a causa de una transacción externa.
    * Criptográficamente segura: emplea criptografía para garantizar al integridad de la información.
    * Con estado compartido: la ejecución se produce en las diferentes máquinas de la red de forma determinista. Todas las máquinas ejecutan los mismos procesos y llegan a las mismas conclusiones.

### Cripto asimetrica y hash

### Cuentas
160 bits
* Cuentas de propiedad externa:
    * wallets
    * envía transacción a un nodo de la blockchain
    * El nodo propaga a la red
    * Transaccines de cuenta externa a externa directa
    * Transacción cuenta externa a contrato:
        * A una funccion del contrato, que ejecuta, al margen de envío de saldo
        * Envío de saldo, que será gestionada por una función de respaldo
* Cuentas de contrato
    * Una función disparada por una transacción puede ejecutar otras funciones de otros contratos
* Estado: variables que definen el esado de una cuenta de propiedad o contrato:
    * Nonce: contador de transacciones para cuent. externas o de contratos generados (cont. facto) para las cuentas de contrato
    * Balance: cantidad de weis en la cuenta
    * StorageRoot: hash del arbol de Merkele
    * codeHash: hash del código fuente del contrato
### Llamadas a smartcontracts
* Calling:
    * no se mina (es rápido)
    * no cuesta wei
    * no modifica el estado del smartcontract
    * retrona un valor (una variable?)
* Transacción:
    * se mina (toma tiempo, crea bloque)
    * cuesta wei
    * modifica el estado del smartcontract
* Para realizar una transacción (o llamada?)
    * hemos de crear un objeto de transacción
        * nonce
        * gasPrice: precio máximo que estamos dispuestos a pagar por el gas
        * gasLimit: cantidad máxima de gas que estás dispuesto a pagar
        * to: dirección de cuenta
        * value: weis a transferir
        * data: uno de
            * smartcontract a publicar
            * parámetros a transferir a un contrato existente
            * ¿?...
        * v,r,s: firma
## Firma offline
    * Airgap
    
# Solidity

## Esquema del proyecto

```bash
npm init -y

mkdir contracts
mkdir test
touch compile.js
touch deploy.js
touch contracts/storageName.sol
touch test/myContract.test.js
```
### Fuente del smart contract

Editamos contracts/storageName.sol

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity >= 0.8.0;

contract StorageName {
    
    string name;
    
    constructor(string memory name_) {
        name = name_;
    }
    
    function setName (string memory name_) public {
        name = name_;
    }
    
    function getName () public view returns(string memory) {
        return name;
    }
    
}
```

## Compilación del smart contract

Instalamos el módulo necesario.

```bash
npm install solc
```

Editamos compile.js

```javascript
    const path = require('path');
    const fs = require('fs');
    const solc = require('solc');
    
    const storageName = path.resolve(__dirname, 'contracts', 'storageName.sol');
    const source = fs.readFileSync(storageName, 'utf8');
    
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
    
```

Podemos descomentar las lineas de console log y ver las salidas ejecutando compile.js

```bash
node compile.js
```
## Tests

Instalamos los módulos necesarios.

```bash
npm install assert
npm install ganache-cli
npm install web3
npm install mocha
# o npm install ethers como alternativa liviana
```
Editamos package.json y editamos la linea 'tests' para que indique mocha.

```JSON
{
  "name": "storagename",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "mocha"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "solc": "^0.8.4"
  }
}
```
Editamos test/myContract.test.js

```javascript
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

```
## Deploy

Muchos de los módulos necesarios ya han sido instalados para la realización de los tests. Añadimos los faltantes.

```bash
npm install truffle-hdwallet-provider
```
Necesitamos una cuenta para hacer el deploy. Podemos hacerlo en la herramienta online [https://iancoleman.io/bip39/](https://iancoleman.io/bip39/) para crear nuestra semilla o frase de recuperación. Si queremos hacerlos de forma más segura, podemos hacerlo con la versión offline: [https://github.com/iancoleman/bip39#standalone-offline-version](https://github.com/iancoleman/bip39#standalone-offline-version)

Editamos deploy.js

```javascript

```

# Apuntes Solidity

* Variables fuertemente tipadas: hemos de decir que tipo de valor almacenamos en cada variable
* No existe undefined
* ';' obligatorio al final de la instrucción
* Las variables declaradas fuera de una función son el "estado" del contrato y son los valores que serán almacenados y conservados.

Esqueleto general de un smart contract.
```solidity
// SPDX-Licenses-Identifier: UNLISENCED

pragma solidity >= 0.8.0;

contract MyContract {

    // Declaramos las variables de estado del contrato
    
    constructor ( argumentos ) {
        
        // Inicializamos los valores del estado del contrato
        // o cualquier otro proceso inicial.

    }

    // Declaramos funciones
}

```
* [Tipos de datos de Solidity](https://docs.soliditylang.org/en/v0.8.0/types.html)
* [Array, lista en Solidity](https://www.geeksforgeeks.org/solidity-arrays/)
* [Maps](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e)
## Notas sobre Arrays y Maps
La ejecución de smart contracts tiene un coste. Recorrer cada uno de los elementos de un array con muchos elementos puede ser muy costoso.

En Solidity los maps suelen ser emplados para crear índices que nos permitan localizar de forma inmediata información almacenada en un array.

Si solicitamos un valor de un map para una clave que no existe, no responderá con el tipo de valor 'vacío' para ese tipo de dato: false, 0...

Ejemplo:
```// SPDX-License-Identifier: UNLISENCED

pragma solidity >= 0.8.0;

contract MyContract {
    address owner;
    uint256 valorInicial;
    string public company;
    uint8[] public miLista;
    
    mapping(address => uint256) balances;
    mapping(address => mapping(address => bool)) permisos;
    mapping(address => string[]) vehiculosPoseidos;
    
    struct Vehiculo {
        string marca;
        uint8 kilometros;
        string matricula;
        uint8 potencia;
    }
    
    Vehiculo[] public vehiculos;
    mapping(string => uint256) indiceMatriculaVehiculo;
    
    event avisoIngreso(address destinatarioIngreso, uint256 cantidad);
    
    constructor ( uint256 valor, string memory companyName ) {
        owner = msg.sender;
        valorInicial = valor * 2;
        company = companyName;
    }
    
    function setToMiLista (uint8 numero) public {
        miLista.push(numero);
    }
    
    //------------------------------------------------------------
    
    function establecerBalance(address address_, uint256 cantidad_) public {
        balances[address_] = cantidad_;
    }
    
    function establecerMiBalance(uint256 cantidad_) public {
        balances[msg.sender] = cantidad_;
    }
    
    function consultarBalance(address address_) public view returns(uint256) {
        return balances[address_];
    }
    
    function miBalance() public view returns(uint256) {
        return balances[msg.sender];
    }
    
    function transferir (address destinatario_, uint256 cantidad_) public {
        require(balances[msg.sender] >= cantidad_);
        balances[destinatario_] += cantidad_;
        balances[msg.sender] -= cantidad_;
        emit avisoIngreso(destinatario_, cantidad_);
    }

    //-------------------------------------------------------------
        
    function establecePermisos(address propietario_, address autorizado_, bool permiso) public {
        permisos[propietario_][autorizado_] = permiso;
    }
    
    function consultarPermisos(address propietario_, address autorizado_) public view returns (bool) {
        return permisos[propietario_][autorizado_];
    }
    
    function autorizarCuenta(address autorizado_) public {
        permisos[msg.sender][autorizado_] = true;
    }
    
    function desautorizarCuenta(address autorizado_) public {
        permisos[msg.sender][autorizado_] = false;
    }
    
    //-------------------------------------------------------------
        
    function asignarVehiculo(address address_, string memory matricula_) public {
        vehiculosPoseidos[address_].push(matricula_);
    }
    
    function verVehiculos(address address_) public view returns (string[] memory) {
        return vehiculosPoseidos[address_];
    }
    
    function borrarMatriculaEnPosicion(address address_, uint256 idx_) public {
        delete vehiculosPoseidos[address_][idx_];
    }
    
    //-------------------------------------------------------------
    
    function nuevoVehiculo(string memory marca_, uint8 kilometros_, string memory matricula_, uint8 potencia_) public {
        
        vehiculos.push(
            Vehiculo(
                {
                    marca: marca_,
                    kilometros: kilometros_,
                    matricula: matricula_,
                    potencia: potencia_
                }
            )
        );
        
        indiceMatriculaVehiculo[matricula_] = vehiculos.length - 1;
    }
    
    function actualizaKilometros(uint8 kilometros_, string memory matricula_) public {
        vehiculos[indiceMatriculaVehiculo[matricula_]].kilometros = kilometros_;
    }
    
    function verKilometros(string memory matricula_) public view returns (uint8) {
        return vehiculos[indiceMatriculaVehiculo[matricula_]].kilometros;
    }
    
    //-------------------------------------------------------------
    
    
}
```

## Almacenamientos en Solidity

* Pila
  * No lo explica... menciona algo parecido a las pilas FiFo.
* Memory
  * Como la memoria RAM. El contenido sólo se almacena durante el procesamiento de la transacción y luego se pierde.
* Storage
    * Es a lo que pertenecen las variables de estado del smartcontract. Se lamacenan de forma persistente.

```solidity

// SPDX-License-Identifier: UNLISENCED

pragma solidity >= 0.8.0;

contract MyContract {
    uint256[] public variableEnEstado;
    
    constructor () {
        variableEnEstado.push(22);
    }

    function myFunction () public view returns(uint256, uint256) {
        // Public: puede ser llamada por un wallet, otro smartcontract o de cualquier otra manera por cualquiera.
        // Asignación por valor al emplear 'memory'.
        uint256[] memory variableEnFuncion = variableEnEstado;
        variableEnFuncion[0] = 39;
        return (variableEnFuncion[0], variableEnEstado[0]);
    }
    
    function myFunction2 () external returns (uint256, uint256) {
        // External: solo se puede llamar desde un wallet
        // Asignación por referencia al emplear 'storage'.
        uint256[] storage variableEnFuncion = variableEnEstado;
        variableEnFuncion[0] = 39;
        return (variableEnFuncion[0], variableEnEstado[0]);
        // Esta function no nos dará la salida directamente en remix. Hemos de buscarla en el campo 'decoded output' de la transacción.
    }
}
```

## Condiciones de ejecución
```solidity
// SPDX-License-Identifier: UNLISENCED

pragma solidity >= 0.8.0;

contract MyContract {
    /*
    throw -> obsoleto
    require -> si no se cumple la condición, la transacción y cualquier cambio es descartada. El gas es consumido hasta el punto en que el require detiene la ejecución.
        Orientado a comprobar que los argumentos para una funcion sean adecuados
    revert -> idem. a require, pero enfocado a errores inprevistos.
    assert -> Consume la totalidad del gas previsto para la función.
    */
    constructor() payable {
        // payable: permite transferir una cantidad en la transacción, en este caso del despliegue del smartcontract
        
    }
    
    function handleRequireError() public payable {
        //Almacena true/false dependiendo de si en la llamada a la función se transfieren 1 o más wei.
        bool error = msg.value >= 1 ether;
        require(error, 'Error tipo require: no has trasnferido uno o mas Ethers');
    }
    
    function handleRequireError2() public payable {
        bool error = msg.value >= 5 ether;
        require(error, 'Error de tipo require2: no has trasnferido cinco o mas Ethers');
    }
    
    function handlerReverseError() public view {
        // El método address obtiene una dirección del objeto del argumento. This es el contrato. address.balance es el balance del la dirección
        if (address(this).balance > 2 ether) {
            revert('Error tipo revert: El smartcontract acumula mas de 2 Ethers');
        }
    }
    
    function handlerReverseError2() public view {
        // El método address obtiene una dirección del objeto del argumento. This es el contrato. address.balance es el balance del la dirección
        if (address(this).balance < 5 ether) {
            revert('Error tipo revert: El smartcontract acumula mas de 5 Ethers');
        }
    }
    
    function assertError() public view {
        assert(address(this).balance < 5 ether);
    }
}
```
## Modifiers

```solidity
// SPDX-License-Identifier: UNLISENCED

pragma solidity >= 0.8.0;

contract MyContract {
    address public propietario;
    uint256 public numero;
    
    modifier soloPropietario {
        require(msg.sender == propietario, "No autorizado");
        _;
    }
    
    constructor () {
        propietario = msg.sender;
        numero = 0;
    }
    
    function incrementaNumero () public soloPropietario {
        numero ++;
    }
}
```