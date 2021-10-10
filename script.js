/*** 
Metamask connect 
***/


// Connecting Metamask account and show Wallet Address
const connectButton = document.querySelector('#metamaskButton');
const showAccount = document.querySelector('#showAccount');

// Showing balance of ERC-20 Token and symbol
const balanceButton = document.querySelector('#balanceButton');
const showBalance = document.querySelector('#showBalance');
const showSymbol = document.querySelector('#showSymbol');


let currentAccount = null;

// Connect to Metamask Button
connectButton.addEventListener('click', () => {
  connect();
});

// User submit Token Address input
function getAddress() {
  const tokenAddress = document.getElementById("token-address").value;
  document.getElementById('display').innerHTML  = tokenAddress;
  console.log("Token address: " + tokenAddress);
}

// Show Token Balance button
balanceButton.addEventListener('click', () => {
    getBalance(currentAccount);
    getToken();
})


// Connecting to Metamask Wallet & display wallet address

function detectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {                
      return true
  } else {                
      return false
  }
}

function connect() {
  console.log('Calling connect()');
  ethereum
  .request({ method: 'eth_requestAccounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
  if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      console.log('Please connect to MetaMask.');
      console.log('You refused to connect Metamask');
  } else {
      console.error(err);
  }
  });
}

function handleAccountsChanged(accounts) {
  console.log('Calling HandleChanged');

  if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
      
  } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      $('#showAccount').html(currentAccount)
      
      if(currentAccount != null) {
          // Set the button label
          $('#showAccount').html(currentAccount)
      }
  }
  console.log('WalletAddress in HandleAccountChanged ='+currentAccount)
}

// Web3

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
      console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
      web3 = new Web3(window.ethereum);
  } else {
      console.log('No Web3 Detected...')
  }
})

// try {            
//     web3 = new Web3(window.ethereum);
// } 
// catch (error) {
//     console.log(error);
// }


// ABI to get ERC20 Token balance

const minABI = [  
  // balanceOf
  {    
    constant: true,

    inputs: [{ name: "_owner", type: "address" }],

    name: "balanceOf",

    outputs: [{ name: "balance", type: "uint256" }],

    type: "function",
  },
];

// Wallet address is stored in currentAccount variable
// Token address from user input field tokenAddress

// console.log(web3);
// console.log(web3.eth);

// test contract address: 0xBA50B5c6E12e8fB99014A185D18CFE2a1b428031


// .balanceOf()
async function getBalance(currentAccount) {
  const tokenAddress = document.getElementById("display").innerText;
  console.log(tokenAddress);
  const contract = new web3.eth.Contract(minABI, tokenAddress); 
  const result = await contract.methods.balanceOf(currentAccount).call(); 
  // convert wei to ether, with comma separators for large numbers
  const tokenAmount = web3.utils.fromWei(result).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
  console.log("Token balance: " + tokenAmount);
  

  
  $('#showBalance').html(tokenAmount);
}

// ABI to get ERC20 Token symbol

const symbolABI = [  
  // symbol
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


// .symbol() 
async function getToken() {
  const tokenAddress = document.getElementById("display").innerText;
  const contract = new web3.eth.Contract(symbolABI, tokenAddress);
  tokenSymbol = await contract.methods.symbol().call();
  console.log("Token symbol: " + tokenSymbol);

  
  $('#showSymbol').html(tokenSymbol);
}





