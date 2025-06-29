// Quick test script to verify Loops API connection
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testLoopsConnection() {
  console.log('Testing Loops API connection...');
  
  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    console.error('LOOPS_API_KEY not found in environment variables');
    return;
  }
  
  try {
    // Test creating a contact directly with Loops API
    console.log('Testing contact creation...');
    const response = await axios.post(
      'https://app.loops.so/api/v1/contacts/create',
      {
        email: 'test@ridematchstlucia.com',
        firstName: 'Test',
        lastName: 'User',
        userRole: 'renter'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('Contact creation response status:', response.status);
    console.log('Contact creation response data:', response.data);
    
    if (response.status === 200) {
      console.log('✅ Loops API connection successful!');
      console.log('✅ Email service is ready to use');
    } else {
      console.log('❌ Unexpected response status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Loops API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLoopsConnection();