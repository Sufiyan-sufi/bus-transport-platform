# Feature Specification: Bus Transport MVP

**Feature Branch**: `001-bus-transport-mvp`  
**Created**: 2026-05-06  
**Status**: Draft  
**Input**: User description: "Write a detailed product specification for a Phase 1 bus transport website for UAE employee commute booking. The platform connects bus contractors in Dubai, Sharjah, and Abu Dhabi with employees searching for daily transport. Include employee search flow, bus detail pages, booking form, contractor signup, contractor dashboard, route creation, stop ordering, stop-to-stop pricing, schedules, and semi-manual payment confirmation at MVP stage. Exclude mobile app features and full automated seat locking for now."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Employee Search & Booking (Priority: P1)

As an employee commuting in the UAE, I want to search for available bus routes by origin and destination stops, view bus details, and submit a booking request so that I can secure my daily transport.

**Why this priority**: Core value proposition for the employee side of the platform. Without search and booking, the platform has no utility for the primary users.

**Independent Test**: Can be tested by performing a search with valid stop names, selecting a result, and completing the booking form. Verification is a successful "Booking Pending" state and record in the database.

**Acceptance Scenarios**:

1. **Given** a list of active routes, **When** an employee searches for a route from "Sharjah Rolla" to "Dubai Internet City", **Then** they see a list of buses matching that route with departure times and prices.
2. **Given** a selected bus route, **When** the employee fills the booking form (Name, Contact, Start Date) and submits, **Then** the system records the booking as "Pending Confirmation" and displays payment instructions.

---

### User Story 2 - Contractor Route & Pricing Management (Priority: P1)

As a bus contractor, I want to create and manage routes by adding stops in a specific order, setting stop-to-stop pricing, and defining schedules so that my services are discoverable by employees.

**Why this priority**: Essential for populating the platform with data. Without routes, employees have nothing to search for.

**Independent Test**: Can be tested by a contractor creating a new route, adding 3+ stops, defining prices between them, and saving. Verification is the route appearing in employee search results.

**Acceptance Scenarios**:

1. **Given** the contractor dashboard, **When** a contractor creates a route and adds stops (A, B, C), **Then** they can drag to reorder stops and the system validates the sequence.
2. **Given** a route with stops A, B, and C, **When** the contractor enters prices for pairs (A-B, B-C, A-C), **Then** the system persists these stop-to-stop prices.

---

### User Story 3 - Contractor Dashboard & Booking Management (Priority: P2)

As a contractor, I want to view a list of all pending and confirmed bookings and manually update their status after verifying payments so that I can manage my passengers.

**Why this priority**: Critical for the MVP "semi-manual" payment flow. This closes the loop between booking and actual transport.

**Independent Test**: Can be tested by finding a "Pending" booking in the dashboard and clicking "Confirm Payment". Verification is the booking status changing to "Confirmed" and reflecting in the passenger list.

**Acceptance Scenarios**:

1. **Given** multiple pending bookings, **When** the contractor views the dashboard, **Then** they see passenger names, routes, and "Pending" status.
2. **Given** a pending booking, **When** the contractor clicks "Confirm Payment", **Then** the booking status updates to "Confirmed".

---

### User Story 4 - Contractor Onboarding (Priority: P2)

As a bus service provider, I want to sign up for a contractor account so that I can start listing my routes on the platform.

**Why this priority**: Necessary for growing the contractor base.

**Independent Test**: Can be tested by completing the signup form with company details. Verification is a new contractor record and access to the dashboard.

**Acceptance Scenarios**:

1. **Given** the landing page, **When** a user clicks "Contractor Signup" and provides Company Name, Email, and Phone, **Then** an account is created and they are redirected to the dashboard.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow employees to search by "Pickup Stop" and "Drop-off Stop" with auto-complete from existing route stops.
- **FR-002**: System MUST display "Bus Detail" pages showing full stop sequence, timings, and contractor name.
- **FR-003**: System MUST require employees to create an account and log in before submitting a booking request.
- **FR-004**: System MUST allow contractors to define a list of stops and assign them to a route in a specific order.
- **FR-005**: System MUST allow contractors to set pricing for every possible pair of stops within a route.
- **FR-006**: System MUST support defining departure schedules (e.g., Daily 07:30 AM).
- **FR-007**: System MUST provide a Contractor Dashboard displaying a summary of total bookings and a detailed list of pending requests.
- **FR-008**: System MUST implement a manual status toggle for contractors to mark bookings as "Paid/Confirmed".
- **FR-009**: System MUST display system-wide payment instructions (platform bank details) to the employee upon booking submission.
- **FR-010**: System MUST prevent duplicate contractor signups using the same email address.
- **FR-011**: System MUST allow contractors to set a manual "Max Capacity" for each route; the system MUST stop accepting booking requests once the pending/confirmed total reaches this limit.

### Key Entities

- **Contractor**: Represents the bus company/provider (Name, Email, Phone, Company Details).
- **Route**: A sequence of stops (Name, ContractorID, Status).
- **Stop**: A specific location on a route (Name, Location, OrderIndex).
- **Pricing**: The cost between two stops on a route (FromStopID, ToStopID, Price).
- **Schedule**: Timing for a route (DepartureTime, Frequency).
- **Booking**: A request for a seat (PassengerName, Phone, RouteID, StartDate, Status).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Employees can find a relevant route and complete a booking request in under 4 steps.
- **SC-002**: Contractors can create a complete route with 5 stops and pricing in under 5 minutes.
- **SC-003**: The search results page loads in under 1.5 seconds for typical queries (Dubai/Sharjah).
- **SC-004**: 100% of booking requests are correctly associated with the selected route and contractor.
- **SC-005**: System handles up to 50 concurrent booking requests without data corruption or loss.

## Edge Cases

- **No Results Found**: If an employee searches for a pair of stops that doesn't exist in any route, the system should suggest the nearest available stops or prompt them to request a new route.
- **Overlapping Stops**: How to handle routes where a bus passes through the same stop name twice in different directions?
- **Schedule Changes**: If a contractor updates a schedule, existing "Pending" bookings should ideally be notified or the change should only apply to new bookings.

## Assumptions

- **Manual Verification**: We assume contractors will verify payments outside the system (e.g., bank app) and use the dashboard only for status tracking.
- **Static Pricing**: Stop-to-stop prices are assumed to be static and not dynamic (e.g., no surge pricing).
- **Standard Working Hours**: Schedules are primarily focused on morning/evening commute hours.
- **UAE Only**: Platform is strictly for Dubai, Sharjah, and Abu Dhabi regions for Phase 1.
