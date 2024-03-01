const CryptoPortfolio = artifacts.require("CryptoPortfolio");

module.exports = function (deployer) {
  deployer.deploy(CryptoPortfolio);
};
