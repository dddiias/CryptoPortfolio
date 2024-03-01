// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoPortfolio {
    struct Asset {
        string name;
        uint256 spent;
        uint256 amount;
    }

    mapping(address => Asset[]) public portfolios;

    function addAsset(
        string memory _name,
        uint256 _spent,
        uint256 _amount
    ) public {
        portfolios[msg.sender].push(Asset(_name, _spent, _amount));
    }

    function getAssetCount() public view returns (uint256) {
        return portfolios[msg.sender].length;
    }

    function getAssetByIndex(
        uint256 _index
    ) public view returns (string memory, uint256, uint256) {
        require(_index < portfolios[msg.sender].length, "Index out of range");
        Asset memory asset = portfolios[msg.sender][_index];
        return (asset.name, asset.spent, asset.amount);
    }

    function removeAssetByIndex(uint256 _index) public {
        require(_index < portfolios[msg.sender].length, "Index out of range");
        portfolios[msg.sender][_index] = portfolios[msg.sender][
            portfolios[msg.sender].length - 1
        ];
        portfolios[msg.sender].pop();
    }

    function modifyAsset(
        uint256 _index,
        string memory _name,
        uint256 _spent,
        uint256 _amount
    ) public {
        require(_index < portfolios[msg.sender].length, "Index out of range");
        Asset storage asset = portfolios[msg.sender][_index];
        asset.name = _name;
        asset.spent = _spent;
        asset.amount = _amount;
    }

    function removeAsset(uint256 _index) public {
        require(_index < portfolios[msg.sender].length, "Index out of range");
        portfolios[msg.sender][_index] = portfolios[msg.sender][
            portfolios[msg.sender].length - 1
        ];
        portfolios[msg.sender].pop();
    }
}
