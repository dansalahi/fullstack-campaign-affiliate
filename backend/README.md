# Fullstack Campaign Affiliate - Backend

## 🌟 Overview

This is the backend service for the Fullstack Campaign Affiliate platform, built with NestJS. The application manages campaigns, influencers, and the relationships between them for affiliate marketing campaigns.

The backend provides a RESTful API that handles:

- User authentication and authorization
- Campaign management
- Influencer profiles
- Campaign-influencer relationships
- Data persistence with MongoDB

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/dansalahi/fullstack-campaign-affiliate.git

# Navigate to the backend directory
cd fullstack-campaign-affiliate/backend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root of the backend directory with the following variables:

```
# Database
MONGODB_URI=mongodb://localhost:27017/campaign-affiliate

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d

# Server
PORT=3000
```

## 🏃‍♂️ Running the Application

```bash
# Development mode
npm run start

# Watch mode (recommended for development)
npm run start:dev

# Production mode
npm run start:prod
```

## 🌱 Database Seeding

The application includes a seeding script to populate your database with initial data for testing and development:

```bash
# Run the database seeder
npm run seed
```

This will create:

- Default admin user
- Sample campaigns
- Sample influencers
- Sample campaign-influencer relationships

## 🧪 Testing

The application includes comprehensive unit tests and end-to-end (e2e) tests:

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

### Understanding Test Output

When running e2e tests, you may see HTTP error logs (401, 404, 409) in the console. These are expected and are part of testing error handling in the API. The tests are successful if they all pass despite these error logs.

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                 # Authentication module
│   ├── campaigns/            # Campaigns module
│   ├── campaign-influencers/ # Campaign-influencer relationships module
│   ├── database/             # Database configuration
│   ├── influencers/          # Influencers module
│   ├── logger/               # Custom logger implementation
│   ├── users/                # Users module
│   ├── app.controller.ts     # Main app controller
│   ├── app.module.ts         # Main app module
│   ├── app.service.ts        # Main app service
│   ├── main.ts               # Application entry point
│   └── seed.ts               # Database seeding script
├── test/                     # End-to-end tests
└── ... configuration files
```

## 🔑 API Endpoints

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

## 🧩 Models

### User

- email: string
- password: string (hashed)
- role: enum (admin, user)

### Campaign

- name: string
- type: string
- brandUrl: string
- countries: string[]
- startDate: Date
- endDate: Date
- discountValue: number
- couponsAvailable: number

### Influencer

- name: string
- country: string
- followers: number
- status: string
- baseCost: number
- avatar: string

### CampaignInfluencer

- campaignId: ObjectId
- influencerId: ObjectId
- cost: number
- assignedCoupons: number
- status: string

## 🛠️ Development Notes

- The application uses MongoDB with Mongoose for data persistence
- JWT is used for authentication
- All API endpoints (except auth) require authentication
- The application includes custom logging middleware
- Tests are implemented using Jest

## 📝 License

This project is [MIT licensed](LICENSE).
