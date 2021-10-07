const Token = artifacts.require('Token');
const NFTApp = artifacts.require('NFTApp');

module.exports = async function (deployer) {
  //deploy Token
  await deployer.deploy(Token);
  //assign token into variable to get it's address
  const token = await Token.deployed();
  //pass token address for dBank contract(for future minting)
  await deployer.deploy(NFTApp, token.address);
  //assign dBank contract into variable to get it's address
  const nftApp = await NFTApp.deployed();
  //change token's owner/minter from deployer to dBank
  await token.passMinterRole(nftApp.address);
};
