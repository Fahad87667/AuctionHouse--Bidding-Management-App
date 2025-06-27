# Auction House

A modern full-stack online auction platform built with ASP.NET Core Web API (backend) and React (frontend).

## Features
- User registration and login (JWT authentication)
- Role-based access (Admin/User)
- Create, edit, and delete auction items (Admin)
- Place bids on auction items (User)
- View live and past auctions
- Responsive, modern UI with React-Bootstrap

## Getting Started

### Backend (ASP.NET Core)
1. Navigate to `eshop-api/`.
2. Configure your database connection in `appsettings.json`.
3. Run migrations and start the API:
   ```sh
   dotnet ef database update
   dotnet run
   ```

### Frontend (React)
1. Navigate to `eshop-frontend/`.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

### Environment Variables
- Place any sensitive or environment-specific variables in a `.env` file (see `.gitignore`).

### Git Ignore
- Build artifacts, logs, database files, and environment files are excluded from version control. See `.gitignore` for details.

---

For any issues or contributions, please open an issue or pull request. 