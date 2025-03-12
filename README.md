# Fullstack Campaign Affiliate Platform

## 📋 Overview

This is a full-stack application for managing affiliate marketing campaigns and influencers. The platform allows brands to create campaigns, manage influencers, and track the performance of their affiliate marketing efforts.

### Key Features

- User authentication and authorization
- Campaign management (create, read, update, delete)
- Influencer profiles and management
- Campaign-influencer relationship tracking
- Responsive UI with modern design

## 🏗️ Project Structure

The project is organized into two main directories:

```
fullstack-campaign-affiliate/
├── backend/         # NestJS API server
├── frontend/        # React client application
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm

### Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/dansalahi/fullstack-campaign-affiliate.git
   cd fullstack-campaign-affiliate
   ```

2. Set up the backend:

   ```bash
   cd backend
   npm install
   cp .env.sample .env  # Then edit .env with your configuration
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

## 🏃‍♂️ Running the Application

### Backend

```bash
cd backend

# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Seed the database with sample data
npm run seed
```

### Frontend

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test
```

## 📱 Application Architecture

### Backend (NestJS)

The backend is built with NestJS, a progressive Node.js framework for building efficient and scalable server-side applications.

- **Authentication**: JWT-based authentication system
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API endpoints
- **Validation**: Request validation using class-validator
- **Testing**: Jest for unit and e2e tests
- **Logging**: Custom logger implementation

### Frontend (React)

The frontend is built with React, using modern patterns and libraries:

- **State Management**: React Query for server state, Context API for application state
- **Routing**: React Router for navigation
- **API Communication**: Axios for API requests
- **UI Components**: Custom components with TailwindCSS
- **Authentication**: JWT stored in localStorage with automatic token refresh

## 🔑 API Endpoints

The backend provides the following API endpoints:

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users

- `GET /users/profile` - Get current user profile

### Campaigns

- `GET /campaigns` - Get all campaigns
- `GET /campaigns/:id` - Get a specific campaign
- `POST /campaigns` - Create a new campaign
- `PATCH /campaigns/:id` - Update a campaign
- `DELETE /campaigns/:id` - Delete a campaign

### Influencers

- `GET /influencers` - Get all influencers
- `GET /influencers/:id` - Get a specific influencer
- `POST /influencers` - Create a new influencer
- `PATCH /influencers/:id` - Update an influencer
- `DELETE /influencers/:id` - Delete an influencer

### Campaign-Influencers

- `GET /campaign-influencers` - Get all campaign-influencer relationships
- `GET /campaign-influencers/:id` - Get a specific relationship
- `POST /campaign-influencers` - Create a new relationship
- `PATCH /campaign-influencers/:id` - Update a relationship
- `DELETE /campaign-influencers/:id` - Delete a relationship

## 🌱 Sample Data

The application comes with a seeding script that populates the database with sample data:

### Users

- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`

### Campaigns

- Summer Ebay affiliates
- Winter Amazon affiliates

### Influencers

- Michael Ryhe (1M followers)
- Sophie Martin (750K followers)
- Li Wei (2.5M followers)

## 🛠️ Development Notes

- The backend uses MongoDB with Mongoose for data persistence
- JWT is used for authentication across both frontend and backend
- All API endpoints (except auth) require authentication
- The frontend includes protected routes that require authentication
- The application includes comprehensive error handling

## 🧩 Common Issues and Solutions

### Test Errors

When running e2e tests, you may see HTTP error logs (401, 404, 409) in the console. These are expected and are part of testing error handling in the API. The tests are successful if they all pass despite these error logs.

### MongoDB Connection

If you encounter MongoDB connection issues, ensure:

- MongoDB is running on your system
- The connection string in `.env` is correct
- Network access is allowed to the MongoDB instance

### JWT Authentication

If you experience authentication issues:

- Check that the JWT_SECRET in the backend `.env` file is set
- Ensure the frontend is sending the JWT token in the Authorization header
- Verify that the token has not expired

## 📝 License

This project is [MIT licensed](LICENSE).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
