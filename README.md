# Project Athena - Frontend/Backend API Connection

This project demonstrates a basic API connection between a Next.js frontend and a Flask backend.

## Project Structure


## Setup Instructions

### Backend Setup (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python main.py
   ```

   The backend will be available at: `http://localhost:5000`

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:3000`

## API Endpoints

### Backend Endpoints

- `GET /api/hello` - Returns a hello message
- `GET /api/numbers` - Returns an array of numbers

### Frontend Features

- Interactive buttons to test API connections
- Real-time data fetching from the backend
- Error handling and loading states
- Modern UI with Tailwind CSS

## Local Server Ports

- **Frontend (Next.js)**: `http://localhost:3000`
- **Backend (Flask)**: `http://localhost:5000`

## Testing the Connection

1. Start both servers (backend first, then frontend)
2. Open `http://localhost:3000` in your browser
3. Click the "Fetch Hello Message" button to test the hello API
4. Click the "Fetch Numbers" button to test the numbers API

The frontend will display the responses from the backend APIs in real-time. 
