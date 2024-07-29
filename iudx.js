const predefinedAddress = 'destination address';
const predefinedAmount = '0.00001';
const POLLING_INTERVAL = 1000;
const MAX_POLLS = 15;

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        const connectButton = document.getElementById('connectButton');
        const payButton = document.getElementById('payButton');
        const accountContainer = document.getElementById('accountContainer');
        const accountAddress = document.getElementById('accountAddress');
        const transactionContainer = document.getElementById('transactionContainer');
        const transactionDetailsDiv = document.getElementById('transactionDetails');

        let userAccount;

        connectButton.addEventListener('click', async () => {
            console.log('Connect button clicked');
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                userAccount = accounts[0];
                console.log('User account:', userAccount);
                accountAddress.innerText = userAccount;
                accountContainer.style.display = 'block';
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        });

        payButton.addEventListener('click', async () => {
            try {
                const web3 = new Web3(window.ethereum);

                const amountInWei = web3.utils.toWei(predefinedAmount, 'ether');
                console.log('Amount to be paid (ETH):', predefinedAmount);
                console.log('Amount in Wei:', amountInWei);

                const transactionParameters = {
                    to: predefinedAddress,
                    from: userAccount,
                    value: amountInWei,
                    chainId: await web3.eth.net.getId()
                };

                console.log('Transaction parameters:', transactionParameters);

                const txHash = await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters]
                });

                console.log('Transaction hash:', txHash);

                await pollTransactionDetails(txHash);

                transactionContainer.style.display = 'block';
            } catch (error) {
                console.error('Error sending transaction:', error);
                alert('Transaction failed.');
            }
        });

        async function pollTransactionDetails(txHash) {
            let pollCount = 0;
            const apiKey = 'Etherscan API Key';

            const poll = async () => {
                if (pollCount >= MAX_POLLS) {
                    transactionDetailsDiv.innerText = 'Transaction not found or taking too long to confirm.';
                    return;
                }

                try {
                    const transactionResponse = await fetch(`https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`);
                    const transactionData = await transactionResponse.json();

                    const receiptResponse = await fetch(`https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${apiKey}`);
                    const receiptData = await receiptResponse.json();

                    if (transactionData.result && receiptData.result) {
                        const transactionDetails = {
                            ...transactionData.result,
                            ...receiptData.result
                        };

                        transactionDetailsDiv.innerText = `Transaction Details: ${JSON.stringify(transactionDetails, null, 2)}`;


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
                    transactionDetailsDiv.innerText = 'Error fetching transaction details.';
                }
            };

            poll();
        }
    } else {
        alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
});
