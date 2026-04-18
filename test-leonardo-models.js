const API_KEY = process.env.LEONARDO_API_KEY || 'cfbe870f-edb8-436e-a372-f4b5fbd063cc';
const BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';

console.log('Fetching models list...');
fetch(`${BASE_URL}/models`, {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'authorization': `Bearer ${API_KEY}`
  }
})
.then(res => {
  console.log('Status:', res.status);
  if (!res.ok) {
    return res.text().then(text => { throw new Error(`HTTP ${res.status}: ${text}`); });
  }
  return res.json();
})
.then(data => {
  console.log('Success! Models count:', Array.isArray(data) ? data.length : (data.models ? data.models.length : 'unknown'));
  if (data.models && Array.isArray(data.models)) {
    console.log('First 10 models:');
    data.models.slice(0, 10).forEach((model, index) => {
      console.log(`  ${index+1}. ID: ${model.id}, Name: ${model.name}, Type: ${model.type}`);
    });
  } else if (Array.isArray(data)) {
    console.log('First 10 models (direct array):');
    data.slice(0, 10).forEach((model, index) => {
      console.log(`  ${index+1}. ID: ${model.id || 'N/A'}, Name: ${model.name || 'N/A'}`);
    });
  } else {
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500));
  }
})
.catch(err => {
  console.error('Error:', err.message);
});