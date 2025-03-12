# Interview PR Application

A React application with JWT authentication and protected routes.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Authentication

The application uses JWT authentication stored in localStorage. Authentication status is checked on route changes and API requests.

## Routes

### Public Routes

- `/auth/sign-in` - Login page
- `/auth/sign-up` - Registration page

### Protected Routes

- `/affiliate/*` - All affiliate routes (requires authentication)

## API Requests

- JWT token is automatically added to API requests
- 401 Unauthorized responses trigger automatic logout and redirect to login page

## Features

- Protected routes with authentication check
- Real-time search functionality for influencers
- User information display in navbar
- Automatic handling of expired tokens
- Campaigns table with search and pagination

## Development

Built with:

- React + TypeScript
- Tanstack Query
- React Router
- Axios for API requests
- TailwindCSS
