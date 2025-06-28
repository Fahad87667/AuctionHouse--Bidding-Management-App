# DotNetProject

A modern Auction Platform built with a .NET (C#) backend and a React frontend.

## 🚀 Project Overview
- **Backend:** ASP.NET Core Web API (C#)
- **Frontend:** React (JavaScript)
- **Database:** MySql
- **Features:**
  - User registration, login, and role-based access (Admin/User)
  - Create, edit, and delete auctions (Admin)
  - Place bids and view bid history (User)
  - Secure image upload and local storage
  - Responsive, modern UI

## 📸 Screenshots

### Home / Auction List
![Auction List](frontend/public/images/home.png)

### Auction Detail & Bidding
![Auction Detail](frontend/public/images/Detail.png)

### Admin Dashboard
![Admin Dashboard](frontend/public/images/panel.png)

### User Bid History
![User Bids](frontend/public/images/bids.png)

## 📁 Folder Structure
```
DotNetProject/
  backend/    # .NET backend (API, models, DB, controllers)
  frontend/   # React frontend (UI, components, context)
  README.md   # This file
  Web.config  # IIS/ASP.NET config
```

## ⚙️ Setup Instructions

### 1. Backend (.NET)
```bash
cd backend
# Restore dependencies
 dotnet restore
# Run the API server
 dotnet run
# (Optional) Apply DB migrations
 dotnet ef database update
```

### 2. Frontend (React)
```bash
cd frontend
# Install dependencies
 npm install
# Start the React app
 npm start
```

- The backend runs on `http://localhost:5100` by default.
- The frontend runs on `http://localhost:3000` by default.

## 📝 Usage
- Register as a user or login as admin (`admin@auction.com` by default)
- Admins can create, edit, and delete auctions (image required)
- Users can view auctions, place bids, and see their bid history
- All images are stored locally in the backend's `wwwroot/images/` folder

## 💡 Notes
- Make sure both backend and frontend are running for full functionality
- Update connection strings and secrets in `backend/appsettings.json` as needed
- For development, use sample images in `frontend/public/images/` and `backend/wwwroot/images/`

## 📚 More Info
- For detailed technical notes (in Hinglish), see `NOTES.md`

---

Happy Bidding! 