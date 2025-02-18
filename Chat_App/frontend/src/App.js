import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";

const contractAddress = "0x9C041AF536bA3524f47D22782486f0B6666Fa626";
const contractABI =  [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contact",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "nickname",
        "type": "string"
      }
    ],
    "name": "ContactAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "photo",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "MessageSent",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_text",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_photo",
        "type": "string"
      }
    ],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_withUser",
        "type": "address"
      }
    ],
    "name": "getMessages",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "text",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "photo",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct ChatApp.Message[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_wallet",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_nickname",
        "type": "string"
      }
    ],
    "name": "addContact",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContacts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "wallet",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "nickname",
            "type": "string"
          }
        ],
        "internalType": "struct ChatApp.Contact[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [newContact, setNewContact] = useState({ wallet: "", nickname: "" });
  const [showAddContactPopup, setShowAddContactPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [photo, setPhoto] = useState(null);
  const [popupImage, setPopupImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setPopupImage(imageUrl);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uploadPhotoToIPFS = async (file) => {
    if (!file) {
      console.error("No file selected");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: "ChatApp Photo",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload photo: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.IpfsHash) {
        throw new Error("Invalid IPFS hash returned");
      }

      return `https://ipfs.io/ipfs/${data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading photo to IPFS:", error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!contract || !selectedContact || (!message && !photo)) {
      console.error("Invalid input or contract not loaded");
      return;
    }

    let photoUrl = "";
    if (photo) {
      photoUrl = await uploadPhotoToIPFS(photo);
    }

    try {
      const receipt = await contract.methods
        .sendMessage(selectedContact.wallet, message, photoUrl)
        .send({ from: account });

      const messages = await contract.methods
        .getMessages(selectedContact.wallet)
        .call({ from: account });
      setChatHistory(messages);

      setMessage("");
      setPhoto(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchContacts = async (chatContract) => {
    if (!chatContract || !account) return;

    try {
      const result = await chatContract.methods.getContacts().call({ from: account });
      setContacts(result);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const selectContact = async (contact) => {
    setSelectedContact(contact);

    if (!contract) {
      console.error("Contract not loaded");
      return;
    }

    try {
      const messages = await contract.methods
        .getMessages(contact.wallet)
        .call({ from: account });
      setChatHistory(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const addContact = async () => {
    if (!contract || !newContact.wallet || !newContact.nickname) {
      console.error("Invalid input or contract not loaded");
      return;
    }

    try {
      const receipt = await contract.methods
        .addContact(newContact.wallet, newContact.nickname)
        .send({ from: account });

      fetchContacts(contract);
      setNewContact({ wallet: "", nickname: "" });
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  useEffect(() => {
    async function loadBlockchainData() {
      if (window.ethereum) {
        const web3Instance = new Web3("https://fe74-120-138-99-152.ngrok-free.app");

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const chatContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(chatContract);

        const contacts = await chatContract.methods.getContacts().call({ from: accounts[0] });
        setContacts(contacts);
      } else {
        alert("Please install MetaMask!");
      }
    }
    loadBlockchainData();
  }, []);

  return (
    <div className="chat-app">
      <div className="sidebar">
        <h3>Your Contacts</h3>
  
        <div className="search-box">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
  
        <ul className="contacts-list">
          {filteredContacts.map((contact, index) => (
            <li key={index} onClick={() => selectContact(contact)}>
              {contact.nickname} ({contact.wallet})
            </li>
          ))}
        </ul>
  
        <button className="add-contact-button" onClick={() => setShowAddContactPopup(true)}>
          +
        </button>
  
        {showAddContactPopup && (
          <div className="add-contact-popup">
            <h3>Add Contact</h3>
            <input
              type="text"
              placeholder="Wallet Address"
              value={newContact.wallet}
              onChange={(e) => setNewContact({ ...newContact, wallet: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nickname"
              value={newContact.nickname}
              onChange={(e) => setNewContact({ ...newContact, nickname: e.target.value })}
            />
            <button
              onClick={() => {
                addContact();
                setShowAddContactPopup(false);
              }}
            >
              Add
            </button>
            <button
              onClick={() => setShowAddContactPopup(false)}
              style={{ marginLeft: "10px", backgroundColor: "#ccc" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
  
      {selectedContact && (
        <div className="chat-window">
          <div className="chat-header">Chat with {selectedContact.nickname}</div>
  
          <div className="chat-history">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === account ? "you" : "other"
                }`}
              >
                <strong>{msg.sender === account ? "You" : selectedContact.nickname}</strong>
                {msg.text && <p>{msg.text}</p>}
                {msg.photo && (
                  <img
                    src={msg.photo}
                    alt="Sent photo"
                    onClick={() => handleImageClick(msg.photo)}
                  />
                )}
              </div>
            ))}
          </div>
  
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
  
      {popupImage && (
        <div className="image-popup" onClick={closePopup}>
          <img src={popupImage} alt="Enlarged" />
        </div>
      )}
    </div>
  );
}

export default App;
