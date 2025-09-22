# SQLite CRUD Web Application

A comprehensive full-stack web application for managing SQLite database records with advanced filtering, sorting, and relationship management capabilities.

## 🚀 Overview

This application provides a modern web interface for performing CRUD (Create, Read, Update, Delete) operations on SQLite databases. It features a sophisticated dashboard with advanced filtering, sorting, parent-child relationship management, and session-based authentication.

## ✨ Key Features

### 🔐 Authentication & Security
- **Session-based login system** with automatic session expiration
- **Secure authentication** with Express.js backend
- **Session validation** with automatic redirect on expiration

### 📊 Database Management
- **Dynamic table discovery** - automatically detects all SQLite tables
- **Real-time CRUD operations** - Create, Read, Update, Delete records
- **Column-aware interface** - dynamically adapts to table structure
- **Foreign key relationships** - supports parent-child table relationships

### 🔍 Advanced Filtering & Search
- **Global search** - search across all fields in a table
- **Column-specific filters** - filter individual columns independently
- **Real-time filtering** - instant results as you type
- **Combined filtering** - use multiple filters simultaneously

### 📈 Sorting & Organization
- **Multi-level sorting** - sort by any column (ascending/descending)
- **Visual sort indicators** - clear UI showing current sort state
- **Persistent sort state** - maintains sort order during operations

### 🔗 Relationship Management
- **Parent-child selection** - select parent records to filter child tables
- **Automatic FK mapping** - new child records automatically link to selected parent
- **Visual relationship indicators** - clear UI showing selected relationships

### 🎨 Modern UI/UX
- **Responsive design** - works on desktop and mobile devices
- **Modern component library** - built with Radix UI and Tailwind CSS
- **Intuitive interface** - clean, professional design
- **Real-time notifications** - user feedback for all operations

## 🏗️ Architecture

### Backend Services

#### 1. Main API Server (FastAPI - Port 8010)
- **Framework**: FastAPI with Python
- **Database**: SQLite with aiosqlite
- **Features**: RESTful API, CORS enabled, automatic documentation

#### 2. Authentication Server (Express.js - Port 5000)
- **Framework**: Express.js with Node.js
- **Features**: Session management, login validation, session persistence

### Frontend Application (Next.js - Port 3000)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **TypeScript**: Full type safety

## 📁 Project Structure

```
SQL-CRUD-/
├── backend/                    # FastAPI main server
│   ├── api_routes/            # API endpoint definitions
│   │   ├── child.py          # Child table relationships
│   │   ├── columns.py        # Column metadata
│   │   ├── items.py          # CRUD operations
│   │   ├── list_column.py    # List column configurations
│   │   └── tables.py         # Table management
│   ├── controllers/           # Business logic
│   ├── data/                 # SQLite database files
│   ├── models.py             # Pydantic models
│   ├── database.py           # Database connection
│   ├── main.py               # FastAPI application
│   └── requirements.txt      # Python dependencies
├── backend-login/             # Express.js auth server
│   ├── server.js             # Authentication server
│   └── package.json          # Node.js dependencies
├── frontend/                  # Next.js application
│   ├── app/                  # App router structure
│   │   ├── components/       # Reusable UI components
│   │   ├── dashboard/        # Main dashboard page
│   │   ├── config.js         # API configuration
│   │   └── page.tsx          # Login page
│   ├── lib/                  # Utility functions
│   └── package.json          # Frontend dependencies
└── README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SQL-CRUD-
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The API server will start on `http://localhost:8010`

### 3. Authentication Server Setup (Express.js)
```bash
cd backend-login
npm install
node server.js
```
The auth server will start on `http://localhost:5000`

### 4. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3000`

## 🚀 Usage

### 1. Access the Application
Open your browser and navigate to `http://localhost:3000`

### 2. Login
- **Email**: `test@example.com`
- **Password**: `password123`

### 3. Database Management
1. **Select a table** from the sidebar
2. **View records** in the main table view
3. **Add new records** using the "追加" button
4. **Edit records** using the "更新" button
5. **Delete records** using the "削除" button

### 4. Advanced Features
- **Global Search**: Use the search box to filter across all fields
- **Column Filters**: Use individual column filters for precise filtering
- **Sorting**: Click column headers to sort data
- **Relationships**: Toggle the switch to enable parent-child selection mode

## 🔧 Configuration

### API Endpoints
The application uses the following API endpoints:

#### Main API (Port 8010)
- `GET /tables/` - Get all tables
- `GET /columns/{table_name}` - Get table columns
- `GET /items/{table_name}` - Get table records
- `POST /items/{table_name}` - Create new record
- `PUT /items/{table_name}/{id}` - Update record
- `DELETE /items/{table_name}/{id}` - Delete record
- `GET /child/` - Get child relationships
- `GET /list_column/` - Get list column configurations

#### Auth API (Port 5000)
- `POST /login` - User authentication
- `GET /isLoggedIn` - Check login status
- `GET /check-session` - Validate session

### Environment Configuration
Update `frontend/app/config.js` to modify API endpoints:
```javascript
export const SERVER_URL = "http://localhost:8010/"
export const LOGIN_SERVER_URL = "http://localhost:5000/"
```

## 🗄️ Database Schema

The application works with any SQLite database. It automatically:
- Discovers all tables (excluding system tables)
- Detects column types and constraints
- Manages foreign key relationships
- Handles primary key auto-increment

### Sample Database Structure
```sql
-- Example tables that work well with this application
CREATE TABLE users (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES users(ID)
);
```

## 🔒 Security Features

- **Session-based authentication** with configurable expiration
- **CORS protection** with configurable origins
- **Input validation** using Pydantic models
- **SQL injection protection** through parameterized queries
- **Automatic session cleanup** on expiration

## 🎨 UI Components

The application includes custom UI components:
- **Button** - Styled button with variants
- **Dialog** - Modal dialogs for forms
- **Input** - Form input fields
- **SwitchToggle** - Toggle switches
- **Notification** - Toast notifications

## 🚀 Development

### Running in Development Mode
```bash
# Terminal 1 - Backend API
cd backend && python main.py

# Terminal 2 - Auth Server
cd backend-login && node server.js

# Terminal 3 - Frontend
cd frontend && npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
npm start

# Backend (using uvicorn)
cd backend
uvicorn main:app --host 0.0.0.0 --port 8010
```

## 📝 API Documentation

When the FastAPI server is running, visit:
- **Swagger UI**: `http://localhost:8010/docs`
- **ReDoc**: `http://localhost:8010/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the console logs for error messages
- Ensure all services are running on correct ports
- Verify database file permissions

## 🔄 Recent Updates

- **v1.0.0**: Initial release with full CRUD functionality
- **v1.1.0**: Added advanced filtering and sorting
- **v1.2.0**: Implemented parent-child relationships
- **v1.3.0**: Enhanced UI with modern components
- **v1.4.0**: Added session management and security features

---

**Built with ❤️ using FastAPI, Next.js, and SQLite**