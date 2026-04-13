SETUP GUIDE - Complete Backend Implementation

STEP 1: Install MySQL Server
- Download from: https://dev.mysql.com/downloads/mysql/
- Install MySQL Server with default root user (no password)
- Install MySQL Workbench for easy database management

STEP 2: Create Database
- Open MySQL Workbench or MySQL Command Line
- Create new connection: localhost, user: root, password: (empty)
- Copy entire content from database.sql file
- Paste and execute in MySQL Workbench

Or run from command line:
  mysql -u root < database.sql

STEP 3: Install Node.js
- Download from: https://nodejs.org/
- Install Node.js (includes npm)

STEP 4: Setup Backend
- Open command prompt
- Navigate to backend folder: cd backend
- Install dependencies: npm install
- This installs: express, mysql2, jwt-simple, cors, body-parser

STEP 5: Configure Environment (Optional)
- File .env already configured for localhost
- Change only if using different database settings
- DB_PASSWORD can stay empty if no password set for root user

STEP 6: Start Backend Server
- In backend folder, run: npm start
- Should see: Server running on port 5000
- Test API: http://127.0.0.1:5500 (should show API running message)

STEP 7: Test API Endpoints
- Use Postman or similar tool to test endpoints
- Or use curl from command line

Example Postman requests:

1. Register User:
   URL: http://127.0.0.1:5500/api/auth/register
   Method: POST
   Body (JSON):
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "pass123",
     "phone": "1234567890"
   }

2. Login User:
   URL: http://127.0.0.1:5500/api/auth/login
   Method: POST
   Body (JSON):
   {
     "email": "john@example.com",
     "password": "pass123"
   }
   Response will include auth token

3. Create Initiative (with token):
   URL: http://127.0.0.1:5500/api/initiatives
   Method: POST
   Headers:
     authorization: [token from login]
   Body (JSON):
   {
     "title": "New Initiative",
     "description": "Description here",
     "image_url": "http://example.com/image.jpg",
     "status": "active"
   }

INTEGRATION WITH FRONTEND:
- Use api-examples.js as reference
- Add functions to your js/main.js
- Call from your HTML forms
- Store token in localStorage after login

Database Schema Overview:

users table:
- id (Primary Key)
- name
- email (unique)
- password (store hashed in production)
- phone
- created_at, updated_at

initiatives table:
- id (Primary Key)
- title
- description
- image_url
- status (active/inactive)
- created_by (Foreign Key to users)
- created_at, updated_at

events table:
- id (Primary Key)
- title
- description
- event_date
- location
- image_url
- created_by (Foreign Key to users)
- created_at, updated_at

contacts table:
- id (Primary Key)
- name
- email
- phone
- subject
- message
- created_at

IMPORTANT NOTES:
- This is basic setup without password hashing
- For production: use bcryptjs for password hashing
- Change JWT_SECRET to random string
- Add proper error handling in production
- Add input validation in production
- Enable HTTPS in production

TROUBLESHOOTING:
1. Port 5000 already in use:
   Change SERVER_PORT in .env file

2. Cannot connect to database:
   - Check MySQL is running
   - Verify username and password in .env
   - Check database name in .env

3. Module not found errors:
   - Run: npm install again
   - Delete node_modules folder
   - Run: npm install

4. Token authentication issues:
   - Make sure token is in authorization header
   - Format: authorization: [token_value]
   - Check token hasn't expired
