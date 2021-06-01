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
    
## Remix
npm init -y
mkdir contracts
mkdir test
touch compile.js
touch deploy.js

cd contracts
touch storageName.sol

    #storageName.sol
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

    #compile.js
    const path = require('path');
    const fs = require('fs');
    const solc = require('solc');

    const storageName = path.resolve(__dirname, 'contracts', 'storageName.sol');
    const source = fs.readFileSync(storageName, 'utf8');

    console.log(source)
    
npm install solc
node compile.js