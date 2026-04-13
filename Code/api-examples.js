// Frontend Integration Examples

// 1. Register User
function registerUser() {
  const data = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '1234567890'
  };

  fetch('http://127.0.0.1:5500/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Register response:', data);
  })
  .catch(error => console.error('Register error:', error));
}

// 2. Login User
function loginUser() {
  const data = {
    email: 'john@example.com',
    password: 'password123'
  };

  fetch('http://127.0.0.1:5500/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      console.log('Login successful, token saved');
    }
  })
  .catch(error => console.error('Login error:', error));
}

// 3. Get User Profile
function getUserProfile(userId) {
  fetch('http://127.0.0.1:5500/api/auth/profile/' + userId)
  .then(response => response.json())
  .then(data => {
    console.log('User profile:', data.user);
  })
  .catch(error => console.error('Profile error:', error));
}

// 4. Get All Initiatives
function getInitiatives() {
  fetch('http://127.0.0.1:5500/api/initiatives')
  .then(response => response.json())
  .then(data => {
    console.log('All initiatives:', data.data);
  })
  .catch(error => console.error('Error:', error));
}

// 5. Create Initiative (requires token)
function createInitiative() {
  const token = localStorage.getItem('authToken');
  const data = {
    title: 'New Initiative',
    description: 'Initiative description',
    image_url: 'http://example.com/image.jpg',
    status: 'active'
  };

  fetch('http://127.0.0.1:5500/api/initiatives', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Initiative created:', data);
  })
  .catch(error => console.error('Error:', error));
}

// 6. Get All Events
function getEvents() {
  fetch('http://127.0.0.1:5500/api/events')
  .then(response => response.json())
  .then(data => {
    console.log('All events:', data.data);
  })
  .catch(error => console.error('Error:', error));
}

// 7. Create Event (requires token)
function createEvent() {
  const token = localStorage.getItem('authToken');
  const data = {
    title: 'New Event',
    description: 'Event description',
    event_date: '2026-05-15 10:00:00',
    location: 'City Hall',
    image_url: 'http://example.com/event.jpg'
  };

  fetch('http://127.0.0.1:5500/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Event created:', data);
  })
  .catch(error => console.error('Error:', error));
}

// 8. Submit Contact Form
function submitContactForm() {
  const data = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    subject: 'Query about initiatives',
    message: 'I have a question about the initiatives'
  };

  fetch('http://127.0.0.1:5500/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Contact message sent:', data);
  })
  .catch(error => console.error('Error:', error));
}

// Add these functions to your js/main.js file and call them from your HTML forms
