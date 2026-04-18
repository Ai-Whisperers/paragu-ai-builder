const fetch = require('node-fetch');
const API_KEY = 'cfbe870f-edb8-436e-a372-f4b5fbd063cc';
const BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';

console.log('Testing Leonardo.Ai account access...');
fetch(`${BASE_URL}/account-info`, {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'authorization': `Bearer ${API_KEY}`
  }
})
.then(res => {
  console.log('Account status:', res.status);
  if (!res.ok) {
    return res.text().then(text => { throw new Error(`HTTP ${res.status}: ${text}`); });
  }
  return res.json();
})
.then(data => {
  console.log('Account info:', JSON.stringify(data, null, 2));
})
.catch(err => {
  console.error('Error:', err.message);
});
