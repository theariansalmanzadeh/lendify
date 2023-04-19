// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

// This is just a simple example of a coin-like contract.
// It is not ERC20 compatible and cannot be expected to talk to other
// coin/token contracts.

contract  NFTMarket is ERC721URIStorage,Ownable {
  using Counters for Counters.Counter;

  Counters.Counter NFTlist;
  Counters.Counter totalItems;

  struct NFTItem{
    uint price;
    uint tokedId;
    address creator;
    address currentOwner;
    bool isListed;
  }

  mapping(uint=>NFTItem)private idToTokenInfo;

  mapping(uint=>uint)private idToTokenIndex;

  mapping(string=>bool)private NFTAvalable;

  mapping(address=>mapping(uint=>uint))private ownedToken;

  mapping(uint=>uint)private idOwnedTokenToIndex;

  NFTItem [] public allNfts;

  uint constant mintPrice=0.025 ether;
  uint  listingPrice=0.025 ether;

  constructor() ERC721("octoCreatures","OCTK"){

  }
  function NftExist(string memory tokenURIData)public view returns(bool){
    return NFTAvalable[tokenURIData] == true;
    
  }
  function NFTPrice(uint tokenId)public view returns(uint){
    return idToTokenInfo[tokenId].price;
  }

  function mintToken(uint price,string memory tokenURIData)public payable{

    require(msg.value == mintPrice,"not correct eth");
    require(!NftExist(tokenURIData),"token already exist");

    NFTlist.increment();
    totalItems.increment();

    uint NFTId = NFTlist.current();

    _safeMint(msg.sender, NFTId);

    _setTokenURI(NFTId, tokenURIData);
    setNfTData(msg.sender,price,NFTId);
    
    beforeTokenTransfer(address(0),msg.sender,NFTId);
    
  }

  function getNftById(uint NFTId)public view returns(NFTItem memory){
    require(NFTId <= totalItems.current(),"NFT not available");
    return idToTokenInfo[NFTId];
  }

  function getNFTindex(uint NFTId)public view returns(uint){
    return idToTokenIndex[NFTId];
  }

  function getAllNfts()view public returns(NFTItem[] memory){
    return allNfts;
  }

  function buyNFT(uint tokenId)public payable {

    address owner=_ownerOf(tokenId);

    require(owner != msg.sender,"you are the owner");

    require(msg.value == idToTokenInfo[tokenId].price,"incorrect ETH");

    _transfer(owner, msg.sender, tokenId);

    beforeTokenTransfer(owner,msg.sender, tokenId);

    NFTlist.decrement();

    payable(owner).transfer(msg.value); 
  }

  function setNfTData(address creator,uint price,uint NFTId)private{
    idToTokenInfo[NFTId]=NFTItem(price,NFTId,creator,creator,true);
  }

  function totalSupply()public view returns(uint){
    return allNfts.length;
  }

  function beforeTokenTransfer(address from, address to,uint tokenId)private {

    if(from == address(0)){
      allNfts.push(idToTokenInfo[tokenId]);

      AddTokenToOwner(to,tokenId);

      idToTokenIndex[tokenId] = totalItems.current();
    }
    else if(to == address(0)){
      RemoveOwnerToken(from, tokenId);

      uint tokenIndex = idToTokenIndex[tokenId];
      uint lastIndex =totalItems.current()-1;
      uint lastTokenId = allNfts[lastIndex].tokedId;

      if(tokenIndex != totalItems.current()){

      delete allNfts[tokenIndex-1];
      allNfts[tokenIndex-1] = allNfts[lastIndex];
      idToTokenIndex[lastTokenId] = idToTokenIndex[tokenIndex];
      }
      allNfts.pop();

      totalItems.decrement();

      delete idToTokenIndex[tokenIndex];
      
    }
    else if(to != from){ 
      uint tokenIndex = idToTokenIndex[tokenId];
      tokenIndex--;

      allNfts[tokenIndex].currentOwner = to;
      allNfts[tokenIndex].isListed = false;

      RemoveOwnerToken(from,tokenId);
      AddTokenToOwner(to,tokenId);
    }

  }

  //--------------------------------------------------------

  function AddTokenToOwner(address to ,uint tokenId)public returns(uint){
    uint len = ERC721.balanceOf(to);
    
    ownedToken[to][len] = tokenId;
    idOwnedTokenToIndex[tokenId] = len;

    return len;
  }

  function getOwnedTokens()public view returns(NFTItem[] memory){
      address owner = msg.sender;
      uint ind=0;
      uint counter=0;

      require(ERC721.balanceOf(owner)>0,"you dont own anything");

      uint totalTokensOwned = ERC721.balanceOf(owner);

      NFTItem[] memory ownedItems = new NFTItem[](totalTokensOwned);

      
        while(ind<totalTokensOwned){

          if(allNfts[counter].currentOwner == owner){
            ownedItems[ind]=allNfts[counter];
            ind++;
          }
          counter++;
      }
      return ownedItems;
  }

  function getOwnedNFTIndexs()public view returns( uint[] memory){
    uint  len = ERC721.balanceOf(msg.sender);
    address owner = msg.sender;

    require(len>0,"you dont own anything");

    uint totalTokensOwned = ERC721.balanceOf(owner);

    uint[] memory ownedItems = new uint[](totalTokensOwned);

    for(uint i=0;i<totalTokensOwned;i++){
      ownedItems[i]= ownedToken[msg.sender][i];
    }

    return ownedItems;
  }

    //------------------------------------------------------
    function RemoveOwnerToken(address from,uint tokenId)private {
      uint len = ERC721.balanceOf(from);

      len++;

      uint tokenIndex = idOwnedTokenToIndex[tokenId];

      if(tokenIndex != len){
        uint indexTokenRemoved = ownedToken[from][tokenId];

        uint lastOwnedToken = ownedToken[from][len];

        idOwnedTokenToIndex[lastOwnedToken] = indexTokenRemoved;

        ownedToken[from][indexTokenRemoved] = lastOwnedToken;

      }
      
        delete ownedToken[from][len];

        delete idOwnedTokenToIndex[tokenId];
      

    }

    function burnToken(uint tokenId)public {
      require(ERC721.ownerOf(tokenId) == msg.sender,"only is able to burn token");
      ERC721._burn(tokenId);
      beforeTokenTransfer(msg.sender,address(0),tokenId);

    }

    function setListingPrice(uint newListingPrice)onlyOwner external{
      require(newListingPrice > 1, "new price most be bigger than 1 Wei");

      listingPrice = newListingPrice;
    }

    function listNFT(uint tokenId,uint newPrice)public payable{
      require(msg.value == listingPrice, "not sufficcent fund");
      require(msg.sender == ERC721.ownerOf(tokenId),"only the owner is allowed to list the new price");
      require(newPrice > 0 , "wrong value entered");

      uint tokenIndex = idToTokenIndex[tokenId];

      allNfts[tokenIndex].isListed=true;
      allNfts[tokenIndex].price = newPrice;

    }

    function unlistNft(uint tokenId) public{
      require(msg.sender == ERC721.ownerOf(tokenId),"only the owner is allowed to list the new price");

      uint tokenIndex = idToTokenIndex[tokenId];

      allNfts[tokenIndex].isListed=false;
    }
    

    function testing(uint tokenId)public view returns(uint){

      uint tokenIndex = idToTokenIndex[tokenId];

      return(tokenIndex);

    }


    //-------------------------------------------------



}
