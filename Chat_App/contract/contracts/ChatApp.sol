// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ChatApp {
    struct Message {
        address sender;
        address receiver;
        string text;
        string photo; 
        uint256 timestamp;
    }

    struct Contact {
        address wallet;
        string nickname;
    }

    mapping(address => mapping(address => Message[])) private messages;
    mapping(address => Contact[]) private userContacts;

    event MessageSent(address indexed from, address indexed to, string message, string photo, uint256 timestamp);
    event ContactAdded(address indexed user, address indexed contact, string nickname);

    function sendMessage(address _receiver, string memory _text, string memory _photo) public {
        require(_receiver != msg.sender, "Cannot send message to yourself");

        messages[msg.sender][_receiver].push(Message(msg.sender, _receiver, _text, _photo, block.timestamp));
        messages[_receiver][msg.sender].push(Message(msg.sender, _receiver, _text, _photo, block.timestamp));

        emit MessageSent(msg.sender, _receiver, _text, _photo, block.timestamp);
    }

    function getMessages(address _withUser) public view returns (Message[] memory) {
        return messages[msg.sender][_withUser];
    }

    function addContact(address _wallet, string memory _nickname) public {
        require(_wallet != msg.sender, "Cannot add yourself");
        userContacts[msg.sender].push(Contact(_wallet, _nickname));

        emit ContactAdded(msg.sender, _wallet, _nickname);
    }

    function getContacts() public view returns (Contact[] memory) {
        return userContacts[msg.sender];
    }
}