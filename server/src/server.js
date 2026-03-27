const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

// Connect to MongoDB
connectDB();

app.listen(env.PORT, () => {
  console.log(`Pulse City Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
