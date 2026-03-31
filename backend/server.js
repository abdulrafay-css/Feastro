/**
 * Feastro API - Server Entry Point
 * Initializes MongoDB connection and starts Express server
 */

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('\n╔════════════════════════════════════════════╗');
      console.log('║   🍽️  FEASTRO API - MONGODB VERSION   ║');
      console.log('╚════════════════════════════════════════════╝\n');
      console.log(`📍 Environment:  ${ENV}`);
      console.log(`🚀 Server:       http://localhost:${PORT}`);
      console.log(`🔗 API:          http://localhost:${PORT}/api`);
      console.log(`💚 Health:       http://localhost:${PORT}/health`);
      console.log(`🗄️  Database:     MongoDB`);
      console.log('\n════════════════════════════════════════════\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ UNHANDLED REJECTION:', error.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', error.message);
  process.exit(1);
});

// Start the server
startServer();