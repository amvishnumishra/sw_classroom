# SW Classroom

A simple classroom project for real-time collaboration between teachers and students.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Classroom Interaction](#classroom-interaction)
- [Contact](#contact)

## Features

- Real-time collaboration
- Role-based functionality (Teacher/Student)
- Classroom session management
- WebSocket integration for live communication

## Technologies

This project was built using:

- **Frontend**: [React](https://reactjs.org/)
- **Backend**: [Node.js](https://nodejs.org/) with [Socket.io](https://socket.io/)
- **Database**: MongoDB
- **Styling**: CSS

## Installation

### Prerequisites

- Ensure you have [Node.js v16](https://nodejs.org/en/) and `npm` installed on your machine.
- Ensure you have [MongoDB](https://www.mongodb.com/) installed and running locally or access to a MongoDB cloud database.

### Setup

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/amvishnumishra/sw_classroom.git
   cd sw_classroom
   ```

2. Install the project dependencies:

   ```bash
   cd backend/
   npm install

   cd ../frontend/
   npm install
   ```

3. Setup MongoDB Configuration:

   - Navigate to the `backend/.env` file and configure your MongoDB connection details, such as:
   
   ```bash
   MONGO_URI=mongodb://localhost:27017/classroom
   ```

4. Start the backend development server:

   ```bash
   cd backend/
   npm start
   ```

5. Start the frontend development server:

   ```bash
   cd frontend/
   npm start
   ```

6. Open the application in your browser:

   Navigate to [http://localhost:3000](http://localhost:3000).

### Usage

1. Select your role (Teacher or Student) after launching the app.
2. Enter your ID (e.g., teacher ID or student ID) when prompted.
3. The system will connect you to the classroom, where you can collaborate with others in real-time.

## Classroom Interaction

- **Teachers** can start or stop classroom sessions.
- **Students** can join the active classroom and collaborate with others in real-time.
- Real-time updates via WebSockets ensure synchronized communication.

## Contact

For any inquiries, feel free to reach out:

- **Name**: Vishnu Mishra
- **Email**: [amvishnumishra@gmail.com](mailto:amvishnumishra@gmail.com)
- **Phone**: +91 9654475525
