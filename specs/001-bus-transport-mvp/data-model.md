# Data Model: Bus Transport MVP

## Entities

### User
- `id`: String (UUID)
- `email`: String (Unique)
- `passwordHash`: String
- `role`: Enum (ADMIN, CONTRACTOR, EMPLOYEE)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### ContractorProfile
- `id`: String (UUID)
- `userId`: String (FK -> User.id)
- `companyName`: String
- `phone`: String
- `details`: String (Text)

### Route
- `id`: String (UUID)
- `name`: String (e.g., "Sharjah-Dubai E303")
- `contractorId`: String (FK -> ContractorProfile.id)
- `capacity`: Int (Max seats)
- `status`: Enum (ACTIVE, INACTIVE)
- `createdAt`: DateTime

### Stop
- `id`: String (UUID)
- `routeId`: String (FK -> Route.id)
- `name`: String
- `location`: String (Coordinates or address)
- `orderIndex`: Int (Position in route sequence)

### Pricing
- `id`: String (UUID)
- `routeId`: String (FK -> Route.id)
- `fromStopId`: String (FK -> Stop.id)
- `toStopId`: String (FK -> Stop.id)
- `amount`: Decimal

### Schedule
- `id`: String (UUID)
- `routeId`: String (FK -> Route.id)
- `departureTime`: String (e.g., "07:30")
- `frequency`: String (e.g., "Daily")

### Booking
- `id`: String (UUID)
- `employeeId`: String (FK -> User.id)
- `routeId`: String (FK -> Route.id)
- `fromStopId`: String (FK -> Stop.id)
- `toStopId`: String (FK -> Stop.id)
- `startDate`: DateTime
- `status`: Enum (PENDING, CONFIRMED, CANCELLED)
- `createdAt`: DateTime

## Relationships
- One **User** has one **ContractorProfile** (if role is CONTRACTOR).
- One **ContractorProfile** has many **Routes**.
- One **Route** has many **Stops**.
- One **Route** has many **Pricing** pairs.
- One **Route** has many **Schedules**.
- One **User** (EMPLOYEE) has many **Bookings**.
- One **Route** has many **Bookings**.
