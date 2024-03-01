async function calculateTotalCapital() {
    const assetCount = await contract.getAssetCount();
    let totalCapital = ethers.BigNumber.from(0);

    for (let i = 0; i < assetCount; i++) {
        const asset = await contract.getAssetByIndex(i);
        totalCapital = totalCapital.add(asset[1]);
    }

    return ethers.utils.formatEther(totalCapital);
}

async function displayTotalCapital() {
    try {
        const totalCapital = await calculateTotalCapital();
        const capitalMetric = document.getElementById("capitalMetric");
        capitalMetric.innerHTML = `<strong>Total Capital:</strong> <span class="text-success">${totalCapital} ETH</span>`;
    } catch (error) {
        console.error('Error fetching total capital:', error);
    }
}

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = "0x79315cea72ef9d8ded947aeeae483e0d7cc086be";
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_spent",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "addAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_spent",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "modifyAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "removeAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "removeAssetByIndex",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getAssetByIndex",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAssetCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "portfolios",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "spent",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]; // Ваш ABI
const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function requestAccount() {
    await provider.send("eth_requestAccounts", []);
}

async function addAsset(name, spent, amount) {
    if (!name || spent <= 0 || amount <= 0) {
        console.error('Invalid input');
        return;
    }

    try {
        updateStatus('Processing transaction...');
        const transaction = await contract.addAsset(name, spent, amount);
        await transaction.wait();
        updateStatus('Asset added successfully.');
        await displayPortfolioInfo();
        await displayTotalCapital();
    } catch (error) {
        console.error('Error adding asset:', error);
        updateStatus('Error adding asset: ' + error.message, false);
    }
}

async function displayPortfolioInfo() {
    const portfolioContainer = document.getElementById("portfolioTableBody");
    portfolioContainer.innerHTML = "";

    try {
        const assetCount = await contract.getAssetCount();
        for (let i = 0; i < assetCount; i++) {
            const asset = await contract.getAssetByIndex(i);
            const assetElement = document.createElement("tr");

            assetElement.innerHTML = `
                <td>${asset[0]}</td>
                <td>${ethers.utils.formatUnits(asset[2], 'ether')}</td>
                <td>${ethers.utils.formatEther(asset[1])} ETH</td>
                <td>
                    <button class="btn btn-primary" onclick="modifyAssetPrompt(${i})">Modify</button>
                    <button class="btn btn-danger" onclick="removeAsset(${i})">Remove</button>
                </td>
            `;
            portfolioContainer.appendChild(assetElement);
        }
    } catch (error) {
        console.error('Error fetching assets:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await displayPortfolioInfo();
    await displayTotalCapital();
});

document.getElementById("assetForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await requestAccount();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const spent = ethers.utils.parseEther(formData.get("spent"));
    const amount = ethers.utils.parseEther(formData.get("amount"));

    await addAsset(name, spent, amount);
    await displayPortfolioInfo();
    await displayTotalCapital();
    event.target.reset();
});

async function modifyAssetPrompt(index) {
    const newName = prompt("Enter new name:");
    const newSpent = prompt("Enter new amount spent:");
    const newAmount = prompt("Enter new amount owned:");
    modifyAsset(index, newName, newSpent, newAmount);
}

async function modifyAsset(index, newName, newSpent, newAmount) {
    try {
        updateStatus('Modifying asset...');
        await requestAccount();
        const transaction = await contract.modifyAsset(index, newName, ethers.utils.parseUnits(newSpent, 'ether'), ethers.utils.parseUnits(newAmount, 'ether'));
        await transaction.wait();
        updateStatus('Asset modified successfully.');
        await displayPortfolioInfo();
        await displayTotalCapital();
    } catch (error) {
        console.error('Error modifying asset:', error);
        updateStatus('Error modifying asset: ' + error.message, false);
    }
}

async function removeAsset(index) {
    try {
        updateStatus('Removing asset...');
        await requestAccount();
        const transaction = await contract.removeAsset(index);
        await transaction.wait();
        updateStatus('Asset removed successfully.');
        await displayPortfolioInfo();
        await displayTotalCapital();
    } catch (error) {
        console.error('Error removing asset:', error);
        updateStatus('Error removing asset: ' + error.message, false);
    }
}

async function fetchCryptoPrices() {
    const cryptocurrencies = ['BTC', 'ETH', 'ADA', 'XRP', 'SOL'];
    const cryptoPricesContainer = document.getElementById('cryptoPricesContainer');

    for (const crypto of cryptocurrencies) {
        try {
            const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${crypto}&tsyms=USD`);
            const data = await response.json();
            const price = data.USD;
            const cryptoPriceElement = document.createElement('div');
            cryptoPriceElement.classList.add('cryptoPrice');
            cryptoPriceElement.textContent = `${crypto}: $${price}`;
            cryptoPricesContainer.appendChild(cryptoPriceElement);
        } catch (error) {
            console.error(`Failed to fetch price for ${crypto}:`, error);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCryptoPrices();
});


function updateStatus(message, isSuccess = true) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.style.color = isSuccess ? 'green' : 'red';
}