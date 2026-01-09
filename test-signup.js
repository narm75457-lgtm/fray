// Test signup endpoint
const testSignup = async () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testName = 'Test User';

  try {
    console.log('Testing signup with:', { email: testEmail, name: testName });
    
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, name: testName }),
    });

    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Response data:', data);

    if (res.ok) {
      console.log('✅ Signup successful!');
      
      // Test with same email (should also succeed)
      console.log('\nTesting signup with same email...');
      const res2 = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, name: testName }),
      });
      
      console.log('Response status:', res2.status);
      const data2 = await res2.json();
      console.log('Response data:', data2);
      
      if (res2.ok) {
        console.log('✅ Login with existing user successful!');
      } else {
        console.log('❌ Login with existing user failed');
      }
    } else {
      console.log('❌ Signup failed');
    }
  } catch (error) {
    console.error('Error testing signup:', error);
  }
};

testSignup();
