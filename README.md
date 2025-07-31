## About
This project provides a robust and secure backend API for managing user authentication and profile functionalities. It handles user registration, login, logout, password changes, and user detail updates with a focus on security using JWT (JSON Web Tokens), refresh tokens, and token blacklisting.
## Features
* **User Registration:** Securely register new user accounts.
* **User Login:** Authenticate users and issue access and refresh tokens.
* **User Logout:** Invalidate access and refresh tokens upon logout.
* **Token Refresh:** Obtain new access tokens using a valid refresh token without re-logging in.
* **Password Change:** Allow authenticated users to change their password.
* **User Details Update:** Enable authenticated users to update their profile information.
* **JWT Authentication:** Utilizes Access and Refresh Tokens for secure API access.
* **Token Blacklisting:** Enhances security by blacklisting invalidated tokens (e.g., on logout).
* **Middleware Protection:** Implements various middleware to secure routes and validate requests.
npm install express cors bcryptjs jsonwebtoken cookie dotenv multer mongoose@6 --save
**Middleware Explained**
This API leverages several custom middleware functions to enhance security and handle authentication flows:
checkBlacklists: Blocks requests if the provided access or refresh token is blacklisted.
verifyRefreshToken: Verifies the refresh token and ensures it's not blacklisted, crucial for generating new access tokens.
verifyAccessToken: Validates the access token, ensuring the user is authenticated for protected routes.

**Technologies Used**
Node.js: JavaScript runtime.
Express.js: Web application framework.
Mongoose v6: MongoDB object data modeling (ODM) for Node.js.
bcryptjs: For password hashing.
jsonwebtoken: For generating and verifying JSON Web Tokens.
cookie-parser: Middleware to parse Cookie headers.
dotenv: To load environment variables from a .env file.
cors: Middleware for enabling Cross-Origin Resource Sharing.
multer: Middleware for handling multipart/form-data, primarily for file uploads (if applicable in user details).
validateToken: Used during logout to identify and blacklist the tokens.
