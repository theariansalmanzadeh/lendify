// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./TimebaseContract.sol";

contract contractFactory{

    using Counters for Counters.Counter;

    struct liqiudityProviderDetails{
        address addr;
        uint amount;
        bool available;

    }

    struct nftDetails{
        address nftContact;
        uint tokenId;
    }

    address[] public allContracts;

    //for testing
    mapping(address => address) public allContractsMapping;

    Counters.Counter totalLPCount;
    Counters.Counter totalCurrentContracts;
    uint maxTolorancePercentage = 10;

    liqiudityProviderDetails [] totalLP;
    mapping(address => uint) addressToindexLP;
    mapping(uint => address) indexToLpAddress;
    mapping(address => bool) isliquidProvider;
    // mapping(bytes32 => address) indexToAddressContract;
    mapping(address => uint) contractAddressToLpIndex;
    mapping(address => address) NftOwnertoContractAddess;
    mapping(address => uint) borrowerToContractInfo;
    mapping(uint => address) indexToLoanContract;
    mapping(address=>address)LpAddressToContractAddress;

    address owner;

    modifier onlyOwner{
        require(msg.sender == owner,"not eligible");
        _;
    }

    modifier msgValue{
        require(msg.value > 0,"not eligible for liquidity providing");
        _;
    }
    modifier NftLenderIsNotLP(address lp){
        require(msg.sender !=lp,"your a liquid provider");
        _;
    }

    modifier NftBorrowerNotLender(uint lenderIndex){
        address lenderAddress = indexToLpAddress[lenderIndex];
        require(msg.sender != lenderAddress , "your not eligible");
        _;
    }

    modifier isLenderAvailable(uint indexLp){
        liqiudityProviderDetails memory lpTarget = totalLP[indexLp];

        require(lpTarget.available == true , "liuid provider unavailable");
        _;
    }

    modifier isLender(address lender){
        require(isliquidProvider[lender], "not a lender");
        _;
    }

    modifier isNftOwner(address nftOwner,address Contract){
        address loanContract = NftOwnertoContractAddess[nftOwner];
        require(Contract == loanContract , "your not the contract owner");
        _;
    }

    constructor(){
        owner = msg.sender;

    }

    receive()payable external  {}

    function liquidityProvider()public payable msgValue{
        if(!isliquidProvider[msg.sender]){

        liqiudityProviderDetails memory lp = liqiudityProviderDetails(msg.sender ,msg.value ,true);

        totalLP.push(lp);

        totalLPCount.increment();

        uint totalLPs = getTotalLPCounts();

        addressToindexLP[msg.sender]=totalLPs-1;

        indexToLpAddress[totalLPs - 1] = msg.sender;

        isliquidProvider[msg.sender]=true;

        }else{
            uint indx = addressToindexLP[msg.sender];

            require(totalLP[indx].amount + msg.value > totalLP[indx].amount, "input amount not acceptable");

            totalLP[indx].amount += msg.value;
            
        }
        

    }

    function showLender()public view isLender(msg.sender) returns(liqiudityProviderDetails memory){
        uint indx = addressToindexLP[msg.sender];
        return totalLP[indx];

    }

    function getTotalLpinfos()public view returns(liqiudityProviderDetails [] memory){
        return totalLP;
    }

    function getTotalLPCounts()public view returns(uint){
        return totalLPCount.current();
    }

    function contractBalance()view public returns(uint){
        return address(this).balance;
    }

    function getlpFromAddress(address _addr)public view returns(liqiudityProviderDetails memory){
        uint index = addressToindexLP[_addr];

        require(isliquidProvider[_addr], "no user Found");

        return totalLP[index];
    }

    function addressToindexLender(address _lender)view public returns(uint){
        return addressToindexLP[_lender];
    }


    function changeTolaranceBorrow(uint newTolorance)public onlyOwner{
        maxTolorancePercentage = newTolorance;
    }

    function totalOngoingContracts()public view returns(uint){
        return totalCurrentContracts.current();
    }

    function indexToContactAddress(uint index)public view returns(address){
        return indexToLoanContract[index];
    }

    function contractAddressToIndex(address _addr)public view returns(uint){
        return borrowerToContractInfo[_addr];
    }

    function contractInfoNftLender(address _addr)public view returns(address){
        return NftOwnertoContractAddess[_addr];
    }

    function LpContractAddress()public view returns(address){
        return LpAddressToContractAddress[msg.sender];
    }

    // lender availibilty check must be added
    function createContract(uint indexLender,address nftContract , uint tokenId,uint amount)public NftBorrowerNotLender(indexLender) returns(address){

        liqiudityProviderDetails memory lenderDetails = totalLP[indexLender];

        address timebaseContract = address(new LoanCOntract(msg.sender ,lenderDetails.addr ,lenderDetails.amount));
        allContracts.push(timebaseContract);

        NftOwnertoContractAddess[msg.sender] = timebaseContract;

        indexToLoanContract[totalCurrentContracts.current()] = timebaseContract;

        borrowerToContractInfo[timebaseContract] = totalCurrentContracts.current();

        totalCurrentContracts.increment();

        LpAddressToContractAddress[totalLP[indexLender].addr] = timebaseContract;

        totalLP[indexLender].available = false;
        contractAddressToLpIndex[timebaseContract] = indexLender;

        fundContractBuilt(payable(timebaseContract),nftContract,tokenId,amount);

        return timebaseContract;
    }

    //testing perposes
    function getBalance(address payable _addr)public returns(uint){
        
        (bool status,bytes memory data) = _addr.call{value:0}(abi.encodeWithSignature("getBalanceContract()" ));
        require(status,"not allowed");

        uint balance = abi.decode(data,(uint));
        return balance;
    }

    //**public=>internal
    function fundContractBuilt(address payable newContract ,address nftContract , uint tokenId,uint amount) public isNftOwner(msg.sender,newContract)  {
        (bool status,)=newContract.call{value:amount}(abi.encodeWithSignature("fundContract(address,uint256)",nftContract,tokenId));
        require(status,"Contract not funded");
    }

    function contractRevoked(address _nftOwner,address _contractAddr)public payable{
        
        address contractAddress = NftOwnertoContractAddess[_nftOwner];
        require(contractAddress == msg.sender, "not eligible");

        

        uint indexLender = contractAddressToLpIndex[contractAddress];

        delete LpAddressToContractAddress[totalLP[indexLender].addr];
        
        totalLP[indexLender].available = true;

        uint indexContract = borrowerToContractInfo[_contractAddr];

        deletContract(indexContract);

        delete NftOwnertoContractAddess[_nftOwner];
    }

    //**public=>internal
    function deletContract(uint index) payable public {

        uint totalContracts = allContracts.length;

        address contractAddress = allContracts[index];

        totalCurrentContracts.decrement();

        

        if(index == totalContracts -1){
            allContracts.pop();
            delete indexToLoanContract[index];
        }else{
            allContracts[index] = allContracts[totalContracts-1];

            indexToLoanContract[index] = indexToLoanContract[totalContracts - 1];

            delete indexToLoanContract[totalContracts - 1];

            allContracts.pop();

        }

        // address Address = payable (contractAddress);

        // (bool status,) = Address.call{value:0}(abi.encodeWithSignature("revokeContract()"));

        // require(status , "contract not deleted");

    }

    //**public=>internal
    function showNftOwnerContract()public view returns(address){
        address nftContract = NftOwnertoContractAddess[msg.sender];

        return nftContract;
    }

    function deadlineDeleteContract(address _nftOwner,uint index)public{
        
        uint totalContracts = allContracts.length;

        address contractAddress = allContracts[index];

        totalCurrentContracts.decrement();

        

        if(index == totalContracts -1){
            allContracts.pop();
            delete indexToLoanContract[index];
        }else{
            allContracts[index] = allContracts[totalContracts-1];

            indexToLoanContract[index] = indexToLoanContract[totalContracts - 1];

            delete indexToLoanContract[totalContracts - 1];

            allContracts.pop();

        }

        delete NftOwnertoContractAddess[_nftOwner];
    }


    function desotroyingContract(address _nftOwner,address _contractAddr) public {

        address contractAddress = NftOwnertoContractAddess[_nftOwner];
        require(contractAddress == msg.sender, "not eligible");

        uint indexLender = contractAddressToLpIndex[_contractAddr];

        totalLP[indexLender].available = false;

        totalLP[indexLender].amount = 0;

        delete LpAddressToContractAddress[totalLP[indexLender].addr];

        uint indexContract = borrowerToContractInfo[_contractAddr];

        deadlineDeleteContract(_nftOwner,indexContract);

        // (bool status,) = Address.call{value:0}(abi.encodeWithSignature("destroyContract()"));

        // require(status , "contract not deleted");
    }
    
}