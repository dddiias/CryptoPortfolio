const CryptoPortfolio = artifacts.require("CryptoPortfolio");

contract("CryptoPortfolio", (accounts) => {
  it("should add and retrieve assets correctly", async () => {
    const cryptoPortfolioInstance = await CryptoPortfolio.deployed();

    // Добавление активов
    await cryptoPortfolioInstance.addAsset("Bitcoin", web3.utils.toWei("1", "ether"), web3.utils.toWei("2", "ether"), { from: accounts[0] });
    await cryptoPortfolioInstance.addAsset("Ethereum", web3.utils.toWei("2", "ether"), web3.utils.toWei("3", "ether"), { from: accounts[0] });

    // Получение активов
    const asset1 = await cryptoPortfolioInstance.getAssetByIndex(0);
    const asset2 = await cryptoPortfolioInstance.getAssetByIndex(1);

    // Вывод информации в консоль
    console.log("Asset 1:", asset1);
    console.log("Asset 2:", asset2);

    // Проверка значений
    assert.equal(asset1[0], "Bitcoin", "Asset 1 name should be Bitcoin");
    assert.equal(asset1[1].toString(), web3.utils.toWei("1", "ether"), "Asset 1 spent should be 1 ether");
    assert.equal(asset1[2].toString(), web3.utils.toWei("2", "ether"), "Asset 1 amount should be 2 ether");

    assert.equal(asset2[0], "Ethereum", "Asset 2 name should be Ethereum");
    assert.equal(asset2[1].toString(), web3.utils.toWei("2", "ether"), "Asset 2 spent should be 2 ether");
    assert.equal(asset2[2].toString(), web3.utils.toWei("3", "ether"), "Asset 2 amount should be 3 ether");
  });
});
