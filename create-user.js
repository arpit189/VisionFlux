const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/imaginify');

// User Schema
const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  planId: {
    type: Number,
    default: 1,
  },
  creditBalance: {
    type: Number,
    default: 10,
  },
});

const User = mongoose.model('User', UserSchema);

// Create a test user
async function createTestUser() {
  try {
    const testUser = new User({
      clerkId: 'test_user_id', // Replace with your actual Clerk user ID
      email: 'test@example.com', // Replace with your email
      username: 'testuser', // Replace with your username
      photo: 'https://example.com/photo.jpg', // Replace with your photo URL
      firstName: 'Test',
      lastName: 'User',
      planId: 1,
      creditBalance: 10,
    });

    await testUser.save();
    console.log('Test user created successfully!');
    console.log('User ID:', testUser._id);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestUser(); 