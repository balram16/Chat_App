
<h1 align="center">Decentralized Chat App</h1>

<p align="center">
  <strong>A decentralized chat application built with React and Solidity.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity">
  <img src="https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white" alt="IPFS">
  <img src="https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white" alt="Ethereum">
</p>

---

## <h2>✨ Features</h2>

- **Send Text Messages**: Users can send text messages to other users.
- **Send Images**: Users can upload and send images, which are stored on IPFS.
- **Add Contacts**: Users can add other users as contacts by their wallet address and nickname.
- **IPFS Based Sending**: Sends the images using the IPFS to maintain decentraliztion.
- **Responsive Design**: The app is fully responsive and works on both desktop and mobile devices.

---

## <h2>🚀 Technologies Used</h2>

- **Frontend**: React, Web3.js
- **Smart Contract**: Solidity
- **Storage**: IPFS (via Pinata)
- **Blockchain**: Ethereum (or any EVM-compatible blockchain)

---

## <h2>🛠️ Setup and Installation</h2>

Follow these steps to set up and run the project locally.

### <h3>1. Clone the Repository</h3>

```bash
git clone https://github.com/your-username/Chat_App.git
cd Chat_App
```

### <h3>2. Install Dependencies</h3>

Install the required dependencies for the React app:

```bash
npm install
```

### <h3>3. Set Up Environment Variables</h3>

Create a `.env` file in the root directory and add the following variables:

```plaintext
REACT_APP_PINATA_API_KEY=Your_Pinata_api_key
REACT_APP_PINATA_API_SECRET=Your_Pinata_api_secret_key

```

Replace `REACT_APP_PINATA_API_KEY` & `REACT_APP_PINATA_API_SECRET` with your actual Pinata Key.

### <h3>4. Deploy the Smart Contract</h3>

1. Compile and deploy the smart contract using **Remix** or **Hardhat**.
2. Update the `contractAddress` and `contractABI` in the `App.js` file with your deployed contract address and ABI.

### <h3>5. Run the React App</h3>

Start the development server:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## <h2>📱 Usage</h2>

### <h3>1. Connect Wallet</h3>

- Open the app in your browser.
- Connect your wallet (e.g., MetaMask) to the app.

### <h3>2. Add Contacts</h3>

- Click the **+** button in the sidebar to add a new contact.
- Enter the wallet address and nickname of the contact.

### <h3>3. Send Messages</h3>

- Select a contact from the sidebar.
- Type a message in the input box and click **Send**.
- To send an image, click the file input, select an image, and click **Send**.


---

## <h2>📜 Smart Contract Details</h2>

The smart contract (`ChatApp.sol`) handles the following:
- Storing messages and contacts.
- Emitting events for message sent and contact added.

### <h3>Key Functions</h3>

- `sendMessage`: Sends a message to another user.
- `getMessages`: Retrieves messages between two users.
- `addContact`: Adds a new contact.
- `getContacts`: Retrieves the list of contacts.

---

## <h2>🔗 Pinata Integration</h2>

The app uses **Pinata** to upload images to **IPFS**. Follow these steps to set up Pinata:

1. Sign up for a Pinata account at <a href="https://pinata.cloud" target="_blank">Pinata</a>.
2. Generate an API Key and JWT from the Pinata dashboard.
3. Add the "REACT_APP_PINATA_API_KEY"  & "REACT_APP_PINATA_API_SECRET"  to the `.env` file .

---

## <h2>🤝 Contributing</h2>

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## <h2>📄 License</h2>

This project is licensed under the **MIT License**. See the <a href="LICENSE">LICENSE</a> file for details.

---

## <h2>📧 Contact</h2>

For any questions or feedback, feel free to reach out:

- **Your Name**
- **Email**: <a href="mailto:your-email@example.com">panigrahibalram16@gmail.com</a>
- **GitHub**: <a href="https://github.com/your-username" target="_blank">balram16</a>

---

<p align="center">
  <strong>Enjoy using the Decentralized Chat App! 🚀</strong>
</p>

---
