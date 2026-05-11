# API Contracts: Bus Transport MVP

## Authentication
- `POST /api/auth/signup`: Create a new User (Employee or Contractor)
- `POST /api/auth/login`: Authenticate User

## Employee Flows
- `GET /api/routes/search?from={stopId}&to={stopId}`: Search for routes matching stops
- `GET /api/routes/{id}`: Get route details including stops, schedule, and pricing
- `POST /api/bookings`: Submit a new booking request
- `GET /api/bookings`: List current user's bookings

## Contractor Flows
- `POST /api/contractor/routes`: Create a new route
- `PUT /api/contractor/routes/{id}`: Update route details/status
- `GET /api/contractor/bookings`: List bookings for all routes owned by contractor
- `PATCH /api/contractor/bookings/{id}/status`: Confirm/Cancel booking

## System Configuration
- `GET /api/config/payment-instructions`: Retrieve global bank details for payment
