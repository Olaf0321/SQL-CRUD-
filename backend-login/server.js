const express = require('express');
const session = require('express-session');
const app = express();
const port = 5000;
const cors = require('cors');

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // allow frontend origin
    credentials: true, // allow cookies to be sent
}));

// Set up the server to accept JSON data from the frontend
app.use(express.json());

// Session configuration
app.use(session({
    secret: 'your-secret-key', // Change this to a random secret
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30000000000000 } // Session expires in 60 seconds (1 minute)
}));

// Dummy user credentials (replace with actual secure storage later)
const user = {
    email: "test@example.com",
    password: "password123"
};

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the credentials match
    if (user.email == email && user.password == password) {
        // Set session for the user
        req.session.email = email;
        return res.status(200).send({ message: 'ログイン成功' });
    } else {
        return res.status(401).send({ message: 'ユーザー名またはパスワードが無効です' });
    }
});

// Route to check if the user is logged in
app.get('/isLoggedIn', (req, res) => {
    if (req.session.email) {
        return res.status(200).send({ message: `Logged in as ${req.session.email}` });
    } else {
        return res.status(401).send({ message: 'Not logged in' });
    }
});

app.get('/check-session', (req, res) => {
    if (req.session.email) {
        res.json({ email: true });
    } else {
        res.status(401).json({ email: false });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
