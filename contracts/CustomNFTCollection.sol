// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CustomNFTCollection is ERC1155Upgradeable, OwnableUpgradeable {
    string public name;
    uint256 public mintPrice;
    mapping(uint256 => uint256) public totalSupplyPerToken;
    mapping(uint256 => uint256) public currentMintedSupplyPerToken;
    bool public mintingComplete;

    function initialize(
        string memory _name, 
        string memory _baseURI, 
        uint256 _mintPrice
    ) public {
        __ERC1155_init(_baseURI);
        __Ownable_init(msg.sender);
        name = _name;
        mintPrice = _mintPrice;
    }

    function ownerMintBatch(
        address to, 
        uint256 tokenId, 
        uint256 amount
    ) public onlyOwner {
        require(!mintingComplete, "Minting is already complete");
        require(
            currentMintedSupplyPerToken[tokenId] + amount <= totalSupplyPerToken[tokenId], 
            "Exceeds total supply"
        );

        _mint(to, tokenId, amount, "");
        currentMintedSupplyPerToken[tokenId] += amount;

        if (currentMintedSupplyPerToken[tokenId] == totalSupplyPerToken[tokenId]) {
            mintingComplete = true;
        }
    }

    function mint(
        address to, 
        uint256 tokenId, 
        uint256 amount
    ) public payable {
        require(mintingComplete, "Initial minting not complete");
        require(balanceOf(owner(), tokenId) > 0, "No tokens available for sale");
        
        require(msg.value >= mintPrice * amount, "Insufficient payment");
        
        // Transfer from owner's balance
        _safeTransferFrom(owner(), to, tokenId, amount, "");
    }

    function setTokenSupply(uint256 tokenId, uint256 supply) external onlyOwner {
        require(!mintingComplete, "Cannot set supply after minting is complete");
        totalSupplyPerToken[tokenId] = supply;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return super.uri(tokenId);
    }
}
