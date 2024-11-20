// Crypto Payment Integration for Data Marketplaces
// Authors: Vipul Walunj, Vasanth Rajaraman, Jyotirmoy Dutta, Abhay Sharma
// Purpose: Simplify crypto transactions using Metamask and Ethereum blockchain.

// Global constants
const predefinedAddress = 'destination_address'; // Replace with the recipient's Ethereum address.
const predefinedAmount = '0.00001'; // Example amount in ETH.
const POLLING_INTERVAL = 1000; // Polling interval in milliseconds.
const MAX_POLLS = 15; // Maximum number of polling attempts.

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        // Elements
        const connectButton = document.getElementById('connectButton');
        const payButton = document.getElementById('payButton');
        const accountContainer = document.getElementById('accountContainer');
        const accountAddress = document.getElementById('accountAddress');
        const transactionContainer = document.getElementById('transactionContainer');
        const transactionDetailsDiv = document.getElementById('transactionDetails');

        let userAccount;

        // Display MetaMask setup instructions if not configured
        connectButton.addEventListener('click', async () => {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                userAccount = accounts[0];
                console.log('User connected:', userAccount);
                accountAddress.innerText = userAccount;
                accountContainer.style.display = 'block';

                // Provide instructions to switch to the desired network
                const currentChainId = await ethereum.request({ method: 'eth_chainId' });
                console.log('Current Chain ID:', currentChainId);
                if (currentChainId !== '0xaa36a7') { // Example: Sepolia Testnet Chain ID
                    alert(
                        'Please switch to the Sepolia Test Network in MetaMask. Follow the setup guide in the README if needed.'
                    );
                }
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        });

        // Handle payment transaction
        payButton.addEventListener('click', async () => {
            try {
                const web3 = new Web3(window.ethereum);

                // Prepare transaction details
                const amountInWei = web3.utils.toWei(predefinedAmount, 'ether');
                const transactionParameters = {
                    to: predefinedAddress,
                    from: userAccount,
                    value: amountInWei,
                    chainId: await web3.eth.net.getId(),
                };

                // Send transaction
                const txHash = await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });
                console.log('Transaction sent. Hash:', txHash);

                // Poll for transaction confirmation
                await pollTransactionDetails(txHash);
                transactionContainer.style.display = 'block';
            } catch (error) {
                console.error('Transaction failed:', error);
            }
        });

        // Poll transaction status
        async function pollTransactionDetails(txHash) {
            let pollCount = 0;
            const apiKey = 'your_etherscan_api_key'; // Replace with your Etherscan API key.

            const poll = async () => {
                if (pollCount >= MAX_POLLS) {
                    transactionDetailsDiv.innerText = 'Transaction confirmation timed out.';
                    return;
                }
                try {
                    // Fetch transaction and receipt data
                    const transactionResponse = await fetch(
                        `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`
                    );
                    const receiptResponse = await fetch(
                        `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${apiKey}`
                    );

                    const transactionData = await transactionResponse.json();
                    const receiptData = await receiptResponse.json();

                    if (transactionData.result && receiptData.result) {
                        transactionDetailsDiv.innerText = `Transaction Details:\n${JSON.stringify({
                            ...transactionData.result,
                            ...receiptData.result,
                        }, null, 2)}`;

                        if (receiptData.result.status === '0x1') {
                            alert('Transaction successful!');
                        } else {
                            alert('Transaction failed.');
                        }
                    } else {
                        pollCount++;
                        setTimeout(poll, POLLING_INTERVAL);
                    }
                } catch (error) {
                    console.error('Error fetching transaction details:', error);
                }
            };

            poll();
        }
    } else {
        alert(
            'MetaMask is not installed. Please install it from https://metamask.io and configure it for the Ethereum blockchain.'
        );
    }
});
