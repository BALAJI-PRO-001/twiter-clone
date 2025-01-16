# Full Stack X Clone

This project is a full-stack web application built as a practice project for mastering full-stack web development. It replicates the core functionality of x, including user authentication, creating and following users, posting tweets, and viewing others' timelines.

## Tech Stack

- **Frontend:** React.js, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens) for secure user login and authorization

- **Styling:** Tailwind CSS
- **Additional Libraries:** bcryptjs, express-validator, etc
- **Deployment:** Render.com

## Features

### Authentication
- **Sign Up:** Create a new account with a username, email, and password.
- **Login:** Authenticate using email and password.
- **JWT Authentication:** Secure user sessions with JWT tokens.
- **Password Hashing:** Store passwords securely using bcryptjs.


### User Functionality
- **Create Tweets:** Post tweets, including text and images (optional).
- **Follow Users:** Follow other users to see their tweets in your timeline.
- **User Profile:** View and update the user profile with a profile picture and bio.
- **Timeline:** View tweets from the people you follow.
- **Like/Comment on Tweets:** Interact with tweets by liking or commenting.

### Admin Panel
- **User Management:** Admins can view all users, block/unblock accounts, or delete tweets.

## Installation

To set up the project locally, follow the steps below.

### Prerequisites
- Node.js installed on your machine (download from [here](https://nodejs.org/))
- MongoDB (or use MongoDB Atlas for a cloud database)
- Git for version control

### Steps to Install and Run

1. Clone this repository:
   ```bash
   git clone https://github.com/BALAJI-PRO-001/x-clone.git

   cd x-clone

2. Create .env file in root folder:
   ```bash
   MONGODB_CONNECTION_URI=<your mongodb connection URI> // local or atlas
   ...
 
3. Build the application:
   ```bash
   npm run build

   (or)

   npm i && npm run build

4. Start the application:
   ```base
   npm start

   Output:
   =======

   Mongodb database connected.

   Server is running on port: 3000

5. Make Request to application:
  - Open any browser in your computer.
  - Make request to this url.
  - **http://localhost:3000/**
