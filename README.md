# Crypto-Payment-Gateway

This project provides a web application that allows users to make cryptocurrency payments using MetaMask. It includes two main pages: the main page (index.html) which offers a choice between paying with RazorPay or crypto, and the checkout page (iudx.html) for handling MetaMask transactions.

# Project Structure
index.html: The main entry point for the application.
app.js: JavaScript file for handling interactions on the main page.
iudx.html: The page for handling MetaMask transactions.
iudx.js: JavaScript file for managing MetaMask transactions on the checkout page.

# Features
Connect MetaMask: Allows users to connect their MetaMask wallet.
Pay with Crypto: Facilitates payments through MetaMask.
Transaction Details: Displays transaction details after payment.

# Usage
Open index.html in a web browser.
Click the "Checkout with Crypto" button to navigate to the checkout page.
On the checkout page, connect your MetaMask wallet by clicking the "Connect MetaMask" button.
Once connected, click the "Pay with Crypto" button to initiate a transaction.
The transaction details will be displayed after the payment is processed.

# Files Description
index.html
This is the main page that provides the initial options to the user. It includes buttons for paying with RazorPay or proceeding to crypto checkout.

app.js
JavaScript for index.html. It checks for MetaMask installation and redirects to iudx.html for crypto payments.

iudx.html
The checkout page where users can connect their MetaMask wallet and make payments.

iudx.js
JavaScript for iudx.html. It handles MetaMask wallet connection, initiates the transaction, and polls for transaction details.

# MetaMask Setup
Install MetaMask from https://metamask.io/.
Create a new wallet or import an existing one.
Ensure you have some ETH in your MetaMask wallet for transaction fees.

# API Key
In iudx.js, replace Etherscan API Key with your actual Etherscan API key to fetch transaction details.

# Cross Chain Transactions
To perform cross-chain transactions using MetaMask, you need tokens supported on both the source and destination blockchains, like ERC-20 tokens on Ethereum and BEP-20 tokens on Binance Smart Chain (BSC). First, configure MetaMask to interact with both networks by adding the custom RPC endpoint for BSC. Then, use a bridge like Anyswap or Binance Bridge to transfer assets. These bridges lock tokens on one chain (e.g., Ethereum) and mint equivalent tokens on the other (e.g., BSC). You'll need enough native tokens (ETH for Ethereum, BNB for BSC) to cover gas fees. Once complete, you can switch MetaMask to the destination network to access your transferred tokens. This process allows you to benefit from the features of multiple blockchains while ensuring secure transactions.

# License
This project is licensed under the MIT License. See the LICENSE file for details.
