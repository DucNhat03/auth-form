# Authentication System with Vue.js and MongoDB

A complete authentication system with email verification, password reset, and Google OAuth integration.

## Features

- User registration with email verification
- Login with JWT authentication
- Password reset functionality
- Google OAuth integration
- Profile management (update profile, change password, upload avatar)
- Modern UI with Bootstrap
- Form validation

## Project Structure

The project consists of two main parts:

1. **Frontend** (Vue.js)
   - Located in the `auth-form` directory
   - Built with Vue.js 3, Pinia, Vue Router, and Bootstrap

2. **Backend** (Express.js + MongoDB)
   - Located in the `auth-form-backend` directory
   - Built with Express.js, MongoDB, and JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account for sending emails
- Google OAuth credentials
- Cloudinary account for avatar storage

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd auth-form-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a MongoDB database

4. Configure environment variables:
   - Rename `config.env.example` to `config.env` (or create a new one)
   - Update the values with your credentials:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/auth-system
     JWT_SECRET=your_jwt_secret_key
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     EMAIL_USER=your_gmail_email
     EMAIL_PASS=your_gmail_app_password
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     CLIENT_URL=http://localhost:5173
     ```

5. Create an `uploads` directory:
   ```
   mkdir uploads
   ```

6. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd auth-form
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### User Management

- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload user avatar
- `PUT /api/users/change-password` - Change user password

## License

This project is licensed under the ISC License. 