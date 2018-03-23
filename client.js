const { AIRTABLE_API_KEY, AIRTABLE_ID } = process.env;

const client = require('axios').create({
  baseURL:  `https://api.airtable.com/v0/${AIRTABLE_ID}/`,
  headers: {
    Authorization: 'Bearer ' + AIRTABLE_API_KEY,
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

export async function get(url, params) {
  const result = await client.get(url, { params });
  return result.data;
}

export async function post(url, body, params) {
  const result = await client.post(url, body, { params });
  return result;
}

export async function put(url, body, params) {
  const result = await client.put(url, body, { params });
  return result;
}