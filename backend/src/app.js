import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import configRoutes from './routes/config.js';
import estimateRoutes from './routes/estimate.js';
import adminRoutes from './routes/admin.js';
import { seedDatabase } from './seed/seedData.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://infoofficialapp_db_user:cx5Hv6oouZ6d1CGw@cluster0.bddvjtm.mongodb.net/wantace_db?retryWrites=true&w=majority';

// ✅ FIXED CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://wantace-estimator.vercel.app',
  'https://wantace-estimator-zeta.vercel.app',  // ✅ Your actual Vercel URL
  'https://wantace-estimator-txka.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://wantace-estimator-git-main.vercel.app',
  'https://wantace-estimator.vercel.app'
];

console.log('🔗 CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      // For development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/config', configRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const dbState = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][mongoose.connection.readyState] || 'Unknown';
  
  // Get database name from connection
  const dbName = mongoose.connection.db ? mongoose.connection.db.databaseName : 'Not connected';
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: dbStatus,
    mongodb_state: dbState,
    database_name: dbName,
    server: 'Running',
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Wantace Estimator API',
    version: '1.0.0',
    database: MONGODB_URI ? 'Configured' : 'Not Configured',
    endpoints: {
      config: '/api/config',
      estimate: '/api/estimate',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('📡 Connecting to MongoDB...');
    console.log(`🔗 Database: ${MONGODB_URI.split('/').pop().split('?')[0]}`);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    // Check if database has data
    const Config = mongoose.model('Config');
    const configCount = await Config.countDocuments();
    
    if (configCount === 0) {
      console.log('🌱 Seeding database with initial data...');
      await seedDatabase();
      console.log('✅ Database seeded successfully!');
    } else {
      console.log(`📊 Found ${configCount} configurations in database`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Server starting without database connection');
    return false;
  }
};

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💾 Database: ${dbConnected ? 'Connected ✅' : 'Disconnected ❌'}`);
  });
};

// Export app for testing
export default app;

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
