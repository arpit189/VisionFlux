const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
}

loadEnvFile();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URL:', process.env.MONGODB_URL ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test successful!');
    
    // Clean up
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup successful!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 This looks like an authentication issue. Check your username/password.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 This looks like a network issue. Check if the MongoDB server is running.');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.log('\n💡 This looks like a timeout issue. Check your network connection and firewall settings.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('Connection closed.');
  }
}

testConnection(); 