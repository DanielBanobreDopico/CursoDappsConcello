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