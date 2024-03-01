const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config(); // Подключаем dotenv для загрузки переменных окружения

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // localhost
      port: 7545,            // порт, на котором работает Ganache
      network_id: "*",       // Match any network id
    },
    sepolia: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, "https://sepolia.network");
      },
      network_id: 12345, // Идентификатор сети Sepolia
      gas: 5500000,      // Максимальный лимит газа
      gasPrice: 20000000000,  // Цена газа (в wei)
      confirmations: 2,  // Количество подтверждений для транзакции
      timeoutBlocks: 200,  // Таймаут для блоков
      skipDryRun: true   // Пропуск Dry Run для операций с контрактами
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        }
      }
    }
  },
};
