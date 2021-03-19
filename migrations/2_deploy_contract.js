const DrawingCollectible = artifacts.require("DrawingCollectible");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(DrawingCollectible, { from: accounts[0] });
};