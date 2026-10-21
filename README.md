# Job Tracker

A full-stack job application management platform to organize companies, track application progress, schedule interviews, and monitor your job search from one dashboard.

**Live Demo:** [Job Tracker](https://job-tracker-eta-six-12.vercel.app)  
**Backend API:** [Job Tracker API](https://job-tracker-backend-0kpo.onrender.com)  
**Source Code:** [GitHub Repository](https://github.com/chiranjeevi-kodimela/job-tracker)

## Overview

Managing a job search involves tracking multiple companies, applications, interview schedules, and application statuses. Job Tracker brings these details together in one place, helping users organize their search and monitor their progress.

Users can register securely, manage companies and applications, schedule interviews using a calendar, export application data to CSV, and update their account details.

## Features

- **Authentication:** User registration, login, logout, and JWT-based authentication.
- **Dashboard:** Overview of applications, companies, interviews, application statuses, recent applications, and upcoming interviews.
- **Company Management:** Create, view, update, and delete companies, including their websites and locations.
- **Application Tracking:** Manage job applications and their details throughout the hiring process.
- **Application Statuses:** Applied, Assessment, Interview, Selected, and Rejected.
- **Search and Filtering:** Search applications, filter by status, sort results, and navigate paginated lists.
- **CSV Export:** Export filtered application data.
- **Interview Scheduling:** Schedule, edit, and delete interviews linked to applications.
- **Interview Calendar:** View interviews in a monthly calendar, with separate lists for upcoming and past interviews.
- **Profile Management:** Update account name and email.
- **Password Management:** Change passwords securely and reset forgotten passwords using time-limited, single-use links.
- **Responsive Design:** Interface designed for desktop and mobile screens.

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- JavaScript
- Custom CSS

### Backend
- Node.js
- Express 5
- MySQL
- `mysql2`
- JSON Web Tokens (`jsonwebtoken`)
- `bcryptjs`
- Nodemailer
- `cors`
- `dotenv`

### Database and Deployment
- MySQL hosted on Aiven
- Backend deployed on Render
- Frontend deployed on Vercel

## Project Structure

```text
job-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── interviewController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── mailer.js
│   │   └── validators.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── database/
│   ├── schema.sql
│   └── migrations/
│       └── 001_password_resets.sql
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── constants.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── docs/
│   └── screenshots/
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm
- [MySQL](https://www.mysql.com/) 8 or newer
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/chiranjeevi-kodimela/job-tracker.git
cd job-tracker
```

### 2. Set Up the Database

For a fresh local MySQL installation, run:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `job_tracker` database and the tables required by the application.

For an existing database that predates password-reset functionality, run the migration:

```bash
mysql -u root -p job_tracker < database/migrations/001_password_resets.sql
```

**Note:** If using a managed database such as Aiven, connect to the database provided by your service and execute the schema there. Adjust or omit the `CREATE DATABASE` and `USE` statements as appropriate for the database your provider supplies.

### 3. Configure the Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and configure your environment variables.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=job_tracker

JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

Use your own database credentials and a strong, unique JWT secret. Configure the SMTP variables if you want password-reset links delivered by email.

For a managed MySQL service, use the host, port, username, password, database name, and TLS configuration supplied by your provider.

### 4. Configure the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory if you need to override the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the Application

Start the backend in the first terminal:

```bash
cd backend
npm run dev
```

Start the frontend in the second terminal:

```bash
cd frontend
npm run dev
```

The local application will be available at:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

### Available Frontend Scripts

Run these commands from the `frontend` directory:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | HTTP port used by the backend |
| `DB_HOST` | MySQL server hostname |
| `DB_PORT` | MySQL server port |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret used to sign JWTs |
| `FRONTEND_URL` | Frontend origin used for CORS and password-reset links |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP server port |
| `SMTP_SECURE` | Whether to use implicit TLS, typically for port 465 |
| `SMTP_USER` | SMTP authentication username |
| `SMTP_PASS` | SMTP password or app password |
| `MAIL_FROM` | Sender address for outgoing emails |

SMTP variables are optional during development. When SMTP is not configured, the password-reset link is printed in the backend console instead of being emailed, if supported by the current configuration.

### Frontend

| Variable | Description | Local Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

Never commit `.env` files or expose database credentials, SMTP passwords, or JWT secrets in source control.

## API Documentation

The local API base URL is:

```text
http://localhost:5000/api
```

The production API base URL is:

```text
https://job-tracker-backend-0kpo.onrender.com/api
```

Protected endpoints require a valid JWT in the request header:

```http
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new account | Public |
| POST | `/auth/login` | Authenticate and receive a JWT | Public |
| POST | `/auth/forgot-password` | Request a password-reset link | Public |
| POST | `/auth/reset-password` | Reset a password using a token | Public |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Get the current user's profile |
| PUT | `/users/me` | Update the user's name and email |
| PUT | `/users/me/password` | Change the password |

### Companies

| Method | Endpoint | Description |
|---|---|---|
| GET | `/companies` | List companies |
| POST | `/companies` | Create a company |
| GET | `/companies/:id` | Get a company |
| PUT | `/companies/:id` | Update a company |
| DELETE | `/companies/:id` | Delete a company |

### Applications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/applications` | List applications |
| POST | `/applications` | Create an application |
| GET | `/applications/:id` | Get an application |
| PUT | `/applications/:id` | Update an application |
| DELETE | `/applications/:id` | Delete an application |

### Interviews

| Method | Endpoint | Description |
|---|---|---|
| GET | `/interviews` | List interviews |
| POST | `/interviews` | Schedule an interview |
| GET | `/interviews/:id` | Get an interview |
| PUT | `/interviews/:id` | Update an interview |
| DELETE | `/interviews/:id` | Delete an interview |

### Example Login Request

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

## Security

- Passwords are hashed using `bcryptjs`.
- JWT-based authentication protects private API endpoints.
- User-specific queries restrict access to each user's data.
- Parameterized SQL queries help prevent SQL injection.
- Password-reset tokens are stored as SHA-256 hashes, expire after one hour, and are single-use.
- Password-reset responses avoid revealing whether an email address is registered.
- Changing a password requires the current password.
- Password validation is enforced on the frontend and backend.
- CORS is restricted to the configured frontend origin.
- User-provided links are restricted to HTTP and HTTPS protocols.
- HTML in password-reset emails is escaped.
- Environment secrets are kept outside version control.

## Future Improvements

- Automated unit and integration tests
- Login and password-reset rate limiting
- Email verification during registration
- Secure HTTP-only cookies and refresh-token support
- Interview reminders and notifications
- Kanban board for application statuses
- Resume and document attachments
- Server-side search and pagination
- Dark mode
- Docker-based development and deployment

## Author

**Chiranjeevi Kodimela**

- GitHub: [@chiranjeevi-kodimela](https://github.com/chiranjeevi-kodimela)
- Email: [chirukodimela@email.com](mailto:chirukodimela@email.com)

---

If you find this project useful, consider giving the repository a star.
