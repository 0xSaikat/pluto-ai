require('dotenv').config();
const app = require('./app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Step 1 — Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Step 2 — Create all tables from models
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synced');

    // Step 3 — Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/`);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
}

startServer();