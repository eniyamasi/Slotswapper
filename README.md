# SlotSwapper

A peer-to-peer time-slot scheduling application where users can mark busy calendar slots as "swappable" and request to swap them with other users' swappable slots.

## Features

- **User Authentication**: Sign up and login with JWT-based authentication
- **Calendar Management**: Create, view, update, and delete events
- **Slot Swapping**: Mark events as swappable and request swaps with other users
- **Swap Requests**: View and respond to incoming/outgoing swap requests
- **Real-time Updates**: Dynamic state management without page refreshes

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB

## Project Structure

```
SlotSwapper/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   ├── config/      # Database config
│   │   └── server.js    # Server entry point
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app component
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (or use Docker)
- npm or yarn

## Setup Instructions

### Option 1: Local Development

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/slotswapper
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. Make sure MongoDB is running locally, or update `MONGODB_URI` to point to your MongoDB instance.

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will be running on `http://localhost:5000`

#### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory (optional, defaults work):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:3000`

### Option 2: Docker Setup

1. Make sure Docker and Docker Compose are installed.

2. From the root directory, run:
   ```bash
   docker-compose up --build
   ```

   This will start:
   - MongoDB on port 27017
   - Backend API on port 5000
   - Frontend on port 3000

3. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Signup Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Events

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all user's events | Yes |
| POST | `/api/events` | Create a new event | Yes |
| PUT | `/api/events/:id` | Update an event | Yes |
| DELETE | `/api/events/:id` | Delete an event | Yes |

**Create Event Request Body:**
```json
{
  "title": "Team Meeting",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "status": "BUSY"  // or "SWAPPABLE"
}
```

### Swaps

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/swaps/swappable-slots` | Get all swappable slots from other users | Yes |
| POST | `/api/swaps/swap-request` | Create a swap request | Yes |
| POST | `/api/swaps/swap-response/:requestId` | Respond to a swap request | Yes |
| GET | `/api/swaps/incoming-requests` | Get incoming swap requests | Yes |
| GET | `/api/swaps/outgoing-requests` | Get outgoing swap requests | Yes |

**Create Swap Request Body:**
```json
{
  "mySlotId": "slot_id_1",
  "theirSlotId": "slot_id_2"
}
```

**Swap Response Body:**
```json
{
  "accepted": true  // or false
}
```

## Usage

1. **Sign Up**: Create a new account with your name, email, and password.

2. **Create Events**: 
   - Go to the Calendar page
   - Click "New Event" to create a busy slot
   - Enter title, start time, and end time

3. **Make Slots Swappable**:
   - Find an event in your calendar
   - Click "Make Swappable" to mark it as available for swapping

4. **Browse Marketplace**:
   - Go to the Marketplace page
   - View all available swappable slots from other users
   - Click "Request Swap" on a slot you want

5. **Respond to Requests**:
   - Go to the Requests page
   - View incoming requests (slots others want to swap with you)
   - Accept or Reject swap requests
   - View outgoing requests (your pending swap requests)

6. **Swap Execution**:
   - When a swap is accepted, both users' calendars are automatically updated
   - The slots are transferred to the new owners and set to BUSY status

## Design Choices

- **MongoDB**: Chosen for flexibility in schema evolution and ease of development
- **JWT Authentication**: Stateless authentication for scalability
- **React Context**: For global authentication state management
- **RESTful API**: Simple and straightforward API design
- **Status Enum**: Events have three states (BUSY, SWAPPABLE, SWAP_PENDING) to prevent conflicts

## Assumptions

- Users can only have one pending swap request per slot at a time
- When a swap is accepted, both slots are automatically set to BUSY status
- Time slots are assumed to be in the user's local timezone
- All date/time inputs are handled in ISO 8601 format

## Challenges Faced

- **Race Conditions**: Prevented by checking slot status before creating swap requests and using SWAP_PENDING status
- **State Management**: Ensured calendar updates after swap acceptance by implementing proper state refresh
- **Data Validation**: Added validation for date ranges and slot availability

## Future Enhancements

- WebSocket support for real-time notifications
- Email notifications for swap requests
- Calendar integration (Google Calendar, Outlook)
- Conflict detection (prevent overlapping events)
- User profiles and ratings
- Search and filter options in marketplace

## Testing

To run tests (if implemented):
```bash
cd backend
npm test
```

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment Summary

**Recommended Stack:**
- **Backend**: Render or Railway (free tier available)
- **Frontend**: Vercel or Netlify (free tier available)
- **Database**: MongoDB Atlas (free tier: 512MB)

**Quick Steps:**
1. Set up MongoDB Atlas (free cloud database)
2. Deploy backend to Render/Railway
3. Deploy frontend to Vercel/Netlify
4. Configure environment variables
5. Update CORS settings

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

## License

MIT License

