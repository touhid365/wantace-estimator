// backend/src/app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import configRoutes from './routes/config.js';
import estimateRoutes from './routes/estimate.js';
import adminRoutes from './routes/admin.js';
import { seedDatabase } from './seed/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/config', configRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// MongoDB connection - UPDATED for Mongoose v6+
const connectDB = async () => {
  try {
    // REMOVED deprecated options: useNewUrlParser and useUnifiedTopology
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wantace');
    console.log('✅ Connected to MongoDB');
    
    // Check if database has data
    const configCount = await mongoose.model('Config').countDocuments();
    if (configCount === 0) {
      await seedDatabase();
      console.log('✅ Database seeded with initial data');
    }
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

export default app;