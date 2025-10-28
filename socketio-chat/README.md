# socketio-chat

## Project overview
A full-featured real-time chat application built with Socket.IO, React, and Node.js. This project demonstrates bidirectional communication, real-time messaging, and advanced chat features.

## Tech stack
- Node.js
- Express
- Socket.IO
- HTML/CSS/Vanilla JS

## Project Structure
socketio-chat/
├── client/                  # React front-end
│   ├── public/
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── context/         # React context providers
│   │   │   ├── ChatContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useChatSocket.js
│   │   ├── pages/           # Page components
│   │   │   ├── ChatPage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── socket/          # Socket.io client setup
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── server/                  # Node.js back-end
│   ├── controllers/         # Socket event handlers
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── roomController.js
│   │   └── userController.js
│   ├── models/              # Data models
│   │   ├── Message.js
│   │   └── User.js
│   ├── socket/              # Socket.io server setup
│   │   └── socketHandler.js
│   ├── utils/               # Utility functions
│   │   ├── messageStore.js
│   │   ├── roomManager.js
│   │   └── userManager.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── README.md
└── screenshot.png

## Quick setup

Prerequisites:
- Node.js (v16+ recommended)
- npm or yarn

Installation:
1. Clone the repository
```bash
git clone <your-repo-url>
cd socketio-chat
```
2. Install server depedancies
```bash
cd server
npm install
```
3. Install client dependencies
```bash
cd ../client
npm install
```
4. Set up environment variables
Server .env file:
```env
PORT=3001
CLIENT_URL=http://localhost:5173
```
Client .env file:
```env
VITE_SOCKET_URL=http://localhost:3001
```
## Running the Application
1. Start the server
```bash
cd server
npm run dev
```
Server will run on http://localhost:3001

2. Start the client (in a new terminal)
```bash
cd client
npm run dev
```
Client will run on http://localhost:5173

## Features implemented
- Real-time messaging with Socket.IO
- Broadcast join/leave notifications
- Online user list
- Room support (create/join rooms) — if present in code
- Typing indicator
- Message timestamps
- Simple responsive UI served from `public/`

## Development tips
- Use multiple browser tabs or devices to test real-time behavior.
- If making client changes, refresh or use a file watcher like nodemon/webpack dev server depending on setup.

## Screenshot
Include a screenshot of the running app in `public/` and reference it here:
![Chat app screenshot](socketio-chat/screenshot.png)

## Contributing
- Fork, create a branch, implement changes, open a PR.
- Keep changes focused and add short descriptions for new features.

## License
This project is licensed under the MIT License.

## Author
Collins Otinga - https://github.com/OtingaC

## Acknowledgments

Socket.IO documentation and community
React documentation
Node.js community

## Support
For support, email collinsotinga@gmail.com or open an issue in the repository.
