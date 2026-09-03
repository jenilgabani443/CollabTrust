CollabTrust 🤝

A Collaboration Platform for Brands and Content Creators

CollabTrust is a full-stack web application that helps brands and content creators collaborate, manage campaigns, communicate, and track deliverables in one platform.

The goal is to make creator collaborations more organized, transparent, and reliable.

🚀 Features

* 🔐 Secure Authentication – JWT-based login and registration with role-based access.
* 🔎 Creator Discovery – Brands can discover creators based on niche, location, and performance.
* 📢 Campaign Management – Create, manage, and track brand–creator campaigns.
* 📋 Deliverable Management – Creators can submit campaign deliverables for review.
* 💬 Real-Time Chat – Brands and creators can communicate using Socket.IO.
* 🛡️ Message Protection – Detects and redacts contact information from campaign messages.
* 📊 Creator Analytics – Track creator performance using views and content metrics.
* 🔏 Contract Integrity – SHA-256 hashing helps maintain the integrity of campaign agreements.

🛠️ Tech Stack

Frontend

* Next.js
* React
* Tailwind CSS
* Framer Motion
* Socket.IO Client

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Socket.IO

🏗️ Project Structure

CollabTrust/
├── client/              # Next.js frontend
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
│
├── src/                 # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── .env.example
├── package.json
└── README.md

🔄 How It Works

Brand
  ↓
Discover Creators
  ↓
Create Campaign
  ↓
Creator Accepts
  ↓
Creator Submits Deliverables
  ↓
Brand Reviews
  ↓
Campaign Completed

Both users can communicate through real-time campaign chat, while campaign data and analytics are stored in MongoDB.

⚙️ Installation

1. Clone the repository

git clone https://github.com/jenilgabani443/CollabTrust.git
cd CollabTrust

2. Install backend dependencies

npm install

3. Configure environment variables

Create a .env file using .env.example and add your MongoDB and JWT configuration.

4. Install frontend dependencies

cd client
npm install

5. Run the application

Start the backend:

npm run dev

Start the frontend in another terminal:

cd client
npm run dev

The application will be available at:

Frontend: http://localhost:3000
Backend:  http://localhost:3001

👨‍💻 Author

Jenil Gabani

GitHub: https://github.com/jenilgabani443
