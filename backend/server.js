const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.set('trust proxy', true); 

app.use(helmet()); 
app.use(bodyParser.json());
//app.use(cors()); 

app.use(cors({
  origin: ["http://localhost:3000", "https://atten-tracker.netlify.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use(limiter);

connectDB().catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);  
});

app.use('/faculty', facultyRoutes);  
app.use('/students', studentRoutes);  


app.use(errorHandler);

process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  process.exit();
});

app.listen(port, () => console.log(`Server running on port ${port}`));
