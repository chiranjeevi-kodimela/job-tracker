[README.md](https://github.com/user-attachments/files/33281446/README.md)
# Job Tracker

A full-stack web application for tracking job applications, companies and interviews in one place, with secure authentication, a dashboard, profile management and password reset.

## Overview

Job searching means juggling many companies, roles, statuses and interview dates. Job Tracker keeps all of that organised: add the companies you're targeting, log each application and its status, schedule interviews on a calendar, and see your progress on a dashboard.

## Features

- **Authentication:** register, log in, log out, with JWT-based sessions
- **Dashboard:** totals for applications, companies and interviews, status breakdown, upcoming interviews and recent applications
- **Companies:** add, edit and delete companies, with website and location
- **Applications:** add, edit, delete and view details for each application
  - Statuses: Applied, Assessment, Interview, Selected, Rejected
  - Search, status filter, sorting and pagination
  - Export the filtered list to CSV
- **Interviews:** schedule, edit and delete interviews linked to an application, with a monthly calendar view and a list of upcoming and past interviews
- **Profile management:** update your name and email
- **Password change:** change your password while logged in (requires the current password)
- **Password reset:** "Forgot password" email link that is time-limited and single-use
- **Responsive UI:** works on desktop and mobile, with a collapsible navigation menu

## Tech Stack

**Frontend**
- React 19
- Vite
- React Router
- Plain CSS (custom design system in `src/index.css`)

**Backend**
- Node.js and Express 5
- MySQL (`mysql2`)
- JSON Web Tokens (`jsonwebtoken`)
- `bcryptjs` for password hashing
- Nodemailer for password reset emails
- `cors`, `dotenv`

## Application Screenshots

> Add your screenshots to `docs/screenshots/` using the file names below.

| Screen | File name |
| --- | --- |
| Login page | `docs/screenshots/login.png` |
| Register page | `docs/screenshots/register.png` |
| Forgot password page | `docs/screenshots/forgot-password.png` |
| Reset password page | `docs/screenshots/reset-password.png` |
| Dashboard | `docs/screenshots/dashboard.png` |
| Applications list | `docs/screenshots/applications.png` |
| Application details | `docs/screenshots/application-details.png` |
| Companies | `docs/screenshots/companies.png` |
| Interviews calendar | `docs/screenshots/interviews-calendar.png` |
| Profile and change password | `docs/screenshots/profile.png` |

```md
![Login](docs/screenshots/login.png)
![Register](docs/screenshots/register.png)
![Forgot Password](docs/screenshots/forgot-password.png)
![Reset Password](docs/screenshots/reset-password.png)
![Dashboard](docs/screenshots/dashboard.png)
![Applications](docs/screenshots/applications.png)
![Application Details](docs/screenshots/application-details.png)
![Companies](docs/screenshots/companies.png)
![Interviews Calendar](docs/screenshots/interviews-calendar.png)
![Profile](docs/screenshots/profile.png)
```

Replace the block above with the image links once the files exist (they will then render on GitHub).

## Project Folder Structure

```
job-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                    # MySQL connection pool
│   ├── controllers/
│   │   ├── applicationController.js
│   │   ├── authController.js        # register, login, forgot/reset password
│   │   ├── companyController.js
│   │   ├── interviewController.js
│   │   └── userController.js        # profile + change password
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── mailer.js                # password reset emails
│   │   └── validators.js            # email + password validation
│   ├── app.js                       # Express app
│   ├── server.js                    # starts the server
│   ├── .env.example
│   └── package.json
├── database/
│   ├── schema.sql                   # full schema for fresh installs
│   └── migrations/
│       └── 001_password_resets.sql  # for existing databases
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, forms, calendar, pagination, etc.
│   │   ├── context/                 # authentication context
│   │   ├── pages/                   # Dashboard, Applications, Companies, ...
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── utils/                   # dates, CSV, validation, helpers
│   │   ├── App.jsx
│   │   ├── constants.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── docs/
│   └── screenshots/                 # add your screenshots here
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (comes with Node.js)
- [MySQL](https://www.mysql.com/) 8 or newer
- Git

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/chiranjeevi-kodimela/job-tracker.git
cd job-tracker
```

**2. Set up the database**

For a fresh install:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `job_tracker` database and all tables, including `password_resets`.

If you already have the database from an earlier version, run only the migration:

```bash
mysql -u root -p < database/migrations/001_password_resets.sql
```

**3. Set up the backend**

```bash
cd backend
npm install
cp .env.example .env
```

Then edit `.env` with your own values (see [Environment Variables](#environment-variables)).

**4. Set up the frontend**

```bash
cd ../frontend
npm install
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
| --- | --- | --- |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `job_tracker` |
| `PORT` | API port | `5000` |
| `JWT_SECRET` | Long random string used to sign tokens | `change-me` |
| `FRONTEND_URL` | Frontend origin, used for CORS and reset links | `http://localhost:5173` |
| `SMTP_HOST` | SMTP server (optional) | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (optional) | `587` |
| `SMTP_SECURE` | `true` for port 465 (optional) | `false` |
| `SMTP_USER` | SMTP username (optional) | `you@example.com` |
| `SMTP_PASS` | SMTP password or app password (optional) | `your_app_password` |
| `MAIL_FROM` | "From" address for emails (optional) | `Job Tracker <no-reply@example.com>` |

If `SMTP_HOST` is empty, the password reset link is printed in the backend console instead of being emailed. This is handy during development.

### Frontend (optional)

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

Never commit your `.env` file. It is already listed in `.gitignore`.

## Running the Frontend and Backend

Open two terminals.

**Backend**

```bash
cd backend
npm run dev      # development, auto-restarts with nodemon
# or
npm start        # production
```

The API runs at `http://localhost:5000`.

**Frontend**

```bash
cd frontend
npm run dev
```

The app runs at `http://localhost:5173`.

Other frontend scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## API Endpoints

Base URL: `http://localhost:5000/api`

All routes except those marked **Public** require the header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/auth/register` | Create an account | Public |
| POST | `/auth/login` | Log in and receive a JWT | Public |
| POST | `/auth/forgot-password` | Email a password reset link | Public |
| POST | `/auth/reset-password` | Set a new password using a reset token | Public |

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/users/me` | Get the current user |
| PUT | `/users/me` | Update name and email |
| PUT | `/users/me/password` | Change password (needs current password) |

### Companies

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/companies` | List your companies |
| POST | `/companies` | Create a company |
| GET | `/companies/:id` | Get one company |
| PUT | `/companies/:id` | Update a company |
| DELETE | `/companies/:id` | Delete a company (also deletes its applications and interviews) |

### Applications

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/applications` | List your applications |
| POST | `/applications` | Create an application |
| GET | `/applications/:id` | Get one application |
| PUT | `/applications/:id` | Update an application |
| DELETE | `/applications/:id` | Delete an application |

### Interviews

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/interviews` | List your interviews |
| POST | `/interviews` | Schedule an interview |
| GET | `/interviews/:id` | Get one interview |
| PUT | `/interviews/:id` | Update an interview |
| DELETE | `/interviews/:id` | Delete an interview |

### Example request

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}
```

## Security Features

- Passwords are hashed with bcrypt and never stored in plain text
- JWT authentication with a 1-day expiry; expired sessions log the user out in the UI
- Every query is scoped to the logged-in user, so users can only access their own data
- Parameterised SQL queries to prevent SQL injection
- Password reset tokens are random, stored only as SHA-256 hashes, expire after 1 hour and can be used once
- "Forgot password" gives the same response whether or not the email exists, so accounts can't be discovered
- Changing a password requires the current password
- Password rules enforced on both frontend and backend (8 to 72 characters)
- CORS restricted to the configured frontend origin
- Links from user-entered data are only rendered if they are `http` or `https`
- HTML in reset emails is escaped
- Secrets live in `.env`, which is excluded from version control

## Future Improvements

- Automated unit and integration tests
- Rate limiting on login and password reset endpoints
- Email verification on sign-up
- Store tokens in httpOnly cookies and add refresh tokens
- Interview reminders by email or notification
- Kanban board view for application statuses
- Resume and document attachments
- Server-side search and pagination
- Dark mode
- Docker setup and cloud deployment

## Author and Contact

**Chiranjeevi Kodimela**

- Email: [chirukodimela@email.com](mailto:chirukodimela@email.com)
- GitHub: [@chiranjeevi-kodimela](https://github.com/chiranjeevi-kodimela)
