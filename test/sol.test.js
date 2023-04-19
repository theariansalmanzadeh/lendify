// const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { compileString } = require("sass");

describe("Token Contract", function () {
  let contract;
  let nftContract;

  it("depoloyment contracts", async function () {
    const Token = await ethers.getContractFactory("contractFactory");
    const nft = await ethers.getContractFactory("NFTMarket");

    contract = await Token.deploy();
    nftContract = await nft.deploy();
  });

  it("liquidity provider", async function () {
    const [account1] = await ethers.getSigners();
    await contract
      .connect(account1)
      .liquidityProvider({ value: ethers.utils.parseEther("0.3") });
    const lp = await contract
      .connect(account1)
      .getlpFromAddress(account1.address);
    console.log(lp);
  });

  it("mint nfts", async function () {
    const [account1, account2] = await ethers.getSigners();

    await nftContract
      .connect(account2)
      .mintToken(ethers.utils.parseEther("0.1"), "arian.com", {
        value: ethers.utils.parseEther("0.025"),
      });
    const owner = await nftContract.connect(account1).ownerOf(1);

    console.log(owner, account2.address);
  });

  it("create contract", async function () {
    const [account1, account2] = await ethers.getSigners();

    await contract
      .connect(account2)
      .createContract(
        0,
        nftContract.address,
        1,
        ethers.utils.parseEther("0.3")
      );

    const childContract = await contract
      .connect(account2)
      .showNftOwnerContract();
    const bal = await await ethers.provider.getBalance(childContract);
    console.log(bal, childContract);
  });

  it("fund nftOwner", async function () {
    const [account1, account2] = await ethers.getSigners();

    const childContractAddress = await contract
      .connect(account2)
      .showNftOwnerContract();

    await nftContract.connect(account2).approve(childContractAddress, 1);

    await nftContract
      .connect(account2)
      .transferFrom(account2.address, childContractAddress, 1);

    const newOwner = await nftContract.ownerOf(1);
    console.log("newOwner", newOwner, childContractAddress);
    const bal1 = await account2.getBalance();
    console.log("before ", bal1);

    const child = await ethers.getContractFactory("LoanCOntract");
    const childContract = await child.attach(childContractAddress);

    await childContract.connect(account2).fundNftOwner();

    const bal2 = await account2.getBalance();
    const balcont = await await ethers.provider.getBalance(
      childContractAddress
    );
    console.log("after", bal2);
    console.log("contract", balcont);
  });

  it("refund and cancle contract", async function () {
    const [account1, account2] = await ethers.getSigners();

    const childContractAddress = await contract
      .connect(account2)
      .showNftOwnerContract();

    const child = await ethers.getContractFactory("LoanCOntract");
    const childContract = await child.attach(childContractAddress);

    const newOwner = await nftContract.ownerOf(1);

    const res = await childContract
      .connect(account2)
      .refundLoan({ value: ethers.utils.parseEther("0.33") });

    // console.log(res);

    const newOwnerAfter = await nftContract.ownerOf(1);

    console.log(newOwner, newOwnerAfter);
  });
});
