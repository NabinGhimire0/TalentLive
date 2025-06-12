# TalentLive

TalentLive is a dynamic web platform designed to connect users for learning, collaboration, and real-time communication. Built with a React frontend and Laravel backend, it offers features like user authentication, course management, and video calls, empowering users to engage in a seamless and interactive experience.

## Table of Contents

- Features
- Tech Stack
- Prerequisites
- Installation
- Configuration
- Running the Application
- API Endpoints
- Contributing
- License
- Contact
  
![Uploading Screenshot 2025-06-12 225240.png…]()

![Uploading Screenshot 2025-06-12 224856.png…]()

![Uploading Screenshot 2025-06-12 224930.png…]()

![Uploading Screenshot 2025-06-12 224944.png…]()

![Uploading Screenshot 2025-06-12 225146.png…]()

![Screenshot 2025-06-12 225200](https://github.com/user-attachments/assets/f4e01f26-d3bb-4a89-aa0c-c2d90100896d)

## Features

- **User Authentication**: Secure JWT-based login and registration.
- **Course Management**: Enroll in and track progress for learning tutorials with MMR rewards.
- **Real-Time Video Calls**: Initiate peer-to-peer video calls using PeerJS and Laravel Reverb for WebSocket communication.
- **Responsive UI**: Modern, user-friendly interface built with React and Tailwind CSS.
- **Notifications**: Real-time feedback using react-toastify for user actions.

## Tech Stack

### Frontend

- **React**: JavaScript library for building the user interface.
- **Vite**: Fast build tool and development server.
- **Axios**: HTTP client for API requests.
- **PeerJS**: Peer-to-peer video call functionality.
- **Laravel Echo**: Real-time event broadcasting with Reverb.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **react-toastify**: Notification system for user feedback.

### Backend

- **Laravel 11**: PHP framework for robust backend development.
- **Tymon\\JWTAuth**: JWT-based authentication for secure APIs.
- **Laravel Reverb**: WebSocket server for real-time communication.
- **MySQL**: Database for storing user and course data.

## Prerequisites

- **Node.js** (v18 or higher)
- **PHP** (v8.1 or higher)
- **Composer** (v2 or higher)
- **MySQL** (v8 or higher)
- **Git**

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/talentlive.git
   cd talentlive
   ```

2. **Set Up Backend**

   ```bash
   cd server
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   ```

3. **Set Up Frontend**

   ```bash
   cd ../talentlive-frontend
   npm install
   cp .env.example .env
   ```

## Configuration

1. **Backend Configuration (**`server/.env`)Update the `.env` file with your database and Reverb settings:

   ```env
   APP_NAME=TalentLive
   APP_ENV=local
   APP_DEBUG=true
   APP_URL=http://localhost:8000
   APP_FRONTEND_URL=http://localhost:5173
   
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=talentlive
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   
   BROADCAST_DRIVER=reverb
   REVERB_APP_ID=your-app-id
   REVERB_APP_KEY=your-app-key
   REVERB_APP_SECRET=your-app-secret
   REVERB_HOST=localhost
   REVERB_PORT=8080
   REVERB_SCHEME=http
   
   JWT_SECRET=your-jwt-secret
   ```

2. **Frontend Configuration (**`talentlive-frontend/.env`)Update the `.env` file:

   ```env
   VITE_REVERB_APP_KEY=your-app-key
   VITE_REVERB_HOST=localhost
   VITE_REVERB_PORT=8080
   VITE_REVERB_SCHEME=http
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. **Database Migration**

   ```bash
   cd server
   php artisan migrate
   ```

## Running the Application

1. **Start Backend**

   ```bash
   cd server
   php artisan serve
   php artisan reverb:start
   ```

2. **Start Frontend**

   ```bash
   cd talentlive-frontend
   npm run dev
   ```

3. **Access the Application**Open `http://localhost:5173` in your browser.

## API Endpoints

- **Authentication**

  - `POST /api/register`: Register a new user.
  - `POST /api/login`: Authenticate a user and return a JWT token.
  - `GET /api/user`: Get authenticated user details (requires JWT).

- **Courses**

  - `GET /api/user/courses`: List user’s enrolled courses.
  - `POST /api/course-enrollments`: Enroll in a course.

- **Video Calls**

  - `GET /api/contacts`: List available contacts.
  - `POST /api/video-call/request/{user}`: Initiate a video call.
  - `POST /api/video-call/request/status/{user}`: Accept or reject a call.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
