Backend Setup Instructions

1. Install Dependencies
   Open command prompt in backend folder and run:
   npm install

2. Setup MySQL Database
   - Open MySQL command line or MySQL Workbench
   - Copy all code from database.sql
   - Execute it to create database and tables
   OR
   - Run: mysql -u root -p < database.sql

3. Configure Environment
   - The .env file is already created
   - Default settings:
     DB_HOST: localhost
     DB_USER: root
     DB_PASSWORD: (empty)
     DB_NAME: eco_action
     JWT_SECRET: your_secret_key_here_change_in_production
     SERVER_PORT: 5000

4. Start Server
   
   **Method 1: Using npm (Recommended)**
   npm start
   
   **Method 2: Using Node.js directly**
   node server.js
   
   Server will run on http://127.0.0.1:5000
   
   **What to see:**
   - Terminal message: "Server running on port 5000"
   - You should see no errors in the console
   - The server is now ready to receive API requests

API Endpoints:

Authentication:
  POST /api/auth/register
  POST /api/auth/login
  GET /api/auth/profile/:userId

Initiatives:
  GET /api/initiatives
  GET /api/initiatives/:id
  POST /api/initiatives (auth required)
  PUT /api/initiatives/:id (auth required)
  DELETE /api/initiatives/:id (auth required)

Events:
  GET /api/events
  GET /api/events/:id
  POST /api/events (auth required)
  PUT /api/events/:id (auth required)
  DELETE /api/events/:id (auth required)

Contact:
  POST /api/contact
  GET /api/contact

Authentication:
  Send token in header as: authorization: token_value
