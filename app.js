window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        const checkoutButton = document.getElementById('checkoutButton');

        checkoutButton.addEventListener('click', () => {
            window.location.href = 'iudx.html';
        });
    } else {
        alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
});
