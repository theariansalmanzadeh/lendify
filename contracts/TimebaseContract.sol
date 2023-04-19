// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
interface IERC721 {
    
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract LoanCOntract {

    struct nftDetails{
        address nftContact;
        uint tokenId;
    }
    

    address public nftLender;
    address public etherLEnder;
    address public nftContract;
    address immutable owner;
    address immutable contractAddress;
    nftDetails nftInfo;
    uint testing;
    uint amountBorrowed;
    uint constant intrestRatePercentage = 10;
    uint constant time = 60 days;
    uint deadline;

    modifier onlyNftLender{
        require(msg.sender == nftLender,"your not the borrower");
        _;
    }

    modifier checkAmountRefund{
        uint refundAmount = amountBorrowed + amountBorrowed * intrestRatePercentage/100;
        require(msg.value == refundAmount , "incoorect value");
        _;
    }

    modifier onlyetherLender{
        require(msg.sender == etherLEnder, "your not the lender");
        _;

    }

    modifier onlyOwner(){
        require(msg.sender == owner , "not the owner");
        _;
    }

    modifier checkNftTrasnfer(){
        require(IERC721(nftContract).ownerOf(nftInfo.tokenId) == address(this), "no transfer done");
        _;
    }

    modifier checkValueRecieved(){
        require(msg.value == amountBorrowed , "not sufficcent amount");
        _;
    }
    modifier checkDeadlineReached(){
        require(block.timestamp >= deadline,"deadline not reached yet");
        _;
    }

    constructor(address _nftLender ,address _EthLender ,uint _amountBorrowed){
        nftLender = _nftLender;
        etherLEnder=_EthLender;
        amountBorrowed = _amountBorrowed;
        owner = msg.sender;
        contractAddress = address(this);
        deadline = block.timestamp + time;
    }

    

    function fundContract(address _nftContract ,uint tokenId)public payable checkValueRecieved{
         nftInfo = nftDetails(_nftContract,tokenId);
         nftContract = _nftContract;
        // testing = tokenId;
    }

    function fundNftOwner()public checkNftTrasnfer{
        payable(nftLender).transfer(amountBorrowed);
    }
    

    function refundLoan()public payable onlyNftLender checkAmountRefund{

        //change ownerShip nft;
        transferNtfToCurrnetOwner();

        address ownerAddress = payable(owner);

        (bool status,)= ownerAddress.call{value:msg.value}
        (abi.encodeWithSignature("contractRevoked(address,address)",nftLender,address(this) ));

        require(status , "falid to send Ether");
        revokeContract();
        
        
    }

    function getBalanceContract()public payable returns(uint){
        return address(this).balance;
    }

    function revokeContract()payable public {

        selfdestruct(payable(owner));
    }

    function destroyContract()payable public onlyOwner{

        selfdestruct(payable(owner));
    }

    function deadlineReached()public{

        (bool status,)=owner.call{value:0}
        (abi.encodeWithSignature("desotroyingContract(address,address)",nftLender,address(this) ));

        require(status,"not successful transaction");
    }

    function takingCollaretal()public onlyetherLender checkDeadlineReached{
        deadlineReached();
    }


    //make private
    function transferNtfToCurrnetOwner()internal{

        
        (bool status,bytes memory calldat) = nftContract.call{value:0}
        (abi.encodeWithSignature("transferFrom(address,address,uint256)",address(this),nftLender,nftInfo.tokenId));
        

        require(status,"transfer to owner failed");
    }

    //make private
    function transferNftToLender()internal{
              
        (bool status,) = nftContract.call{value:0}
        (abi.encodeWithSignature("transferFrom(address,address,uint256)",address(this),etherLEnder,nftInfo.tokenId));

        require(status,"transfer to owner failed");
    }

    function ownerOfNft(uint tokenId)public view returns(address){
        return IERC721(nftContract).ownerOf(tokenId);
    }

    function isDeadlineReached()public view returns(bool){
        bool temp = block.timestamp >= deadline ? true:false;
        return temp;
    }

    function contractDetails()public view returns(address,address,uint){
        return (nftContract,etherLEnder,nftInfo.tokenId);
    }

    function timeRemaining()public view returns(uint,uint){
        return (block.timestamp,deadline);
    }

    function valueOfContract()public view returns(uint){
        return amountBorrowed;
    }

    function RefundValue()public view returns(uint){
        return amountBorrowed + amountBorrowed * intrestRatePercentage/100;
    }

    function ownerContract()public view returns(address){
        return owner;
    }

}