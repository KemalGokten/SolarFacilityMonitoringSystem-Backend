# Solar Facility Monitoring System

**[Demo Link](https://solarfacilitymonitoringsystem.netlify.app/)**

## Architecture

### High-Level Overview

The Solar Facility Monitoring System is a full-stack application designed for managing and monitoring solar facilities. It includes a backend API built with Node.js, Apollo Server, Express, and MongoDB, and a frontend developed with React. This system allows users to register, log in, manage facilities, and upload performance data via a web interface.

### Frontend (React)

- **UI Components**:
  - **Material UI**: Provides pre-designed React components to enhance UI consistency and aesthetics.
  - **Form Handling**: **React Hook Form** is used for managing form state and validation.
  - **Data Visualization**: Utilizes Material UI's LineChart for creating interactive and responsive charts and graphs.

### Backend (Node.js with Apollo GraphQL and Express)

- **GraphQL API**: **Apollo Server** is used to create a flexible and robust GraphQL API.
- **Data Parsing**: **CSV file parsing** and validation to handle and integrate data from CSV uploads.
- **Authentication**: **JWT-based authentication** to secure user interactions and manage sessions.

### Database (MongoDB)

- **Collections**:
  - **Users**: Stores user information including credentials and profile details.
  - **Facilities**: Contains details about solar facilities, their specifications, and associated performance data.
  - **Facility Performance**: Records timestamps, active power, and energy data for each facility.


## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup and Installation](#setup-and-installation)
  - [Backend](#backend-setup)
  - [Frontend](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Backend](#running-the-backend)
  - [Frontend](#running-the-frontend)
- [API Endpoints](#api-endpoints)
- [GraphQL Schema](#graphql-schema)
- [File Upload](#file-upload)
- [Contributing](#contributing)

## Features

- User registration, login, and authentication.
- Facility management: create, update, delete.
- Performance data handling with CSV file uploads.
- User-friendly web interface for interacting with the backend.

## Technologies

- **Backend**:
  - Node.js
  - Express
  - Apollo Server (GraphQL)
  - MongoDB
  - Mongoose
  - JWT (JSON Web Tokens)
  - Nodemailer
  - Multer
  - CSV-Parser
- **Frontend**:
  - React
  - React Hook Form
  - Material-UI
  - React Router

## Setup and Installation

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/KemalGokten/SolarFacilityMonitoringSystem-Backend
   cd SolarFacilityMonitoringSystem-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the TypeScript code**

   ```bash
   npm run build
   ```

4. **Create a `.env` file in the backend root directory with the following variables**:

   ```env
   PORT=4000
   ORIGIN=http://localhost:3000
   MONGODB_URI=mongodb://127.0.0.1:27017/solar_facility_monitoring_system
   SECRET_KEY=your_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

  - **EMAIL_USER**: This should be the email address used to send password reset emails. For example, `your_email@example.com`.
   - **EMAIL_PASS**: This is the password for the email account specified in `EMAIL_USER`. If you are using a service like Gmail, you might need to generate an app password or use OAuth2 authentication.

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/KemalGokten/SolarFacilityMonitoringSystem-Frontend
   cd SolarFacilityMonitoringSystem-Frontend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Create a `.env` file in the backend root directory with the following variables**:

   ```env
   REACT_APP_API_URL=http://localhost:4000
   ```
## Running the Application

### Running the Backend

1. **Start the backend application**

   ```bash
   npm run dev
   ```

2. **Build for production (optional)**

   ```bash
   npm run build
   ```

### Running the Frontend

1. **Start the frontend application**

   ```bash
   npm start
   ```

2. **Build for production (optional)**

   ```bash
   npm run build
   ```

#### Open your browser and navigate to http://localhost:3000 to see your application.

## API Endpoints

### GraphQL

- **Base URL**: `http://localhost:4000/graphql`

- **Query Examples**:
  - Fetch a user by ID:
    ```graphql
    query {
      user(id: "user_id") {
        id
        username
        email
      }
    }
    ```

  - Verify token:
    ```graphql
    query {
      verifyToken {
        id
        username
        email
      }
    }
    ```

- **Mutation Examples**:
  - Register a new user:
    ```graphql
    mutation {
      regUser(username: "new_user", email: "user@example.com", password: "password") {
        id
        username
        email
      }
    }
    ```

  - Create a facility:
    ```graphql
    mutation {
      createFacility(name: "Facility Name", nominalPower: 100, userId: "user_id") {
        id
        name
        nominalPower
      }
    }
    ```

## GraphQL Schema

### User Schema

```graphql
type User {
    id: String!
    username: String!
    email: String!
}

type AuthPayload {
    user: User!
    token: String!
}

type Query {
    user(id: String!): User!
    verifyToken: User!
}

type Mutation {
    regUser(username: String!, email: String!, password: String!): User!
    loginUser(email: String!, password: String!): AuthPayload!
    updateUser(id: String!, username: String, email: String, password: String): User!
    forgotPassword(email: String!): Boolean
    resetPassword(token: String!, newPassword: String!): Boolean
    deleteUser(id: String!): deleteResponse!
}

type deleteResponse {
    success: Boolean!
    message: String!
    id: String!
}
```

### Facility Schema

```graphql
type Facility {
    id: String!
    name: String!
    nominalPower: Int!
    userId: String!
    facilityPerformance: FacilityPerformance
}

type FacilityPerformance {
    timestamps: [String!]!
    active_power_kWs: [Float!]!
    energy_kWhs: [Float!]!
}

type Query {
    facilities(userId: String!): facilitiesInfoResponse!
    facility(id: String!): Facility!
}

type Mutation {
    createFacility(name: String!, nominalPower: Int!, userId: String!): Facility!
    updateFacility(id: String!, name: String, nominalPower: Int): Facility!
    deleteFacility(id: String!): deleteResponse!
}

type facilitiesInfoResponse {
    success: Boolean!
    total: Int!
    facilities: [Facility!]!
}

type deleteResponse {
    success: Boolean!
    message: String!
    id: String!
}
```

## File Upload

### Endpoint

- **POST /uploads/readCSVFile**

  - **Request**: Requires a file with the key `csvFile` and a `facilityId` in the request body.
  - **Response**: Success or error message based on the upload and data processing.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code adheres to the project's coding standards and passes all tests.
