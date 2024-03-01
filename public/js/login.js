document.getElementById("loginButton").addEventListener("click", function () {
    if (window.ethereum) {
        const ethereum = window.ethereum;
        ethereum.request({ method: 'eth_requestAccounts' })
            .then((accounts) => {
                const userAddress = accounts[0];
                console.log('User address:', userAddress);
                window.location.href = '/dashboard';
            })
            .catch((error) => {
                console.error('Error requesting accounts:', error);
            });
    } else {
        console.error('MetaMask is not installed');
    }
});
