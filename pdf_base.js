const fs = require('fs');
const axios = require('axios');

function pdfToBase64(pdfPath) {
  const pdfBytes = fs.readFileSync(pdfPath, { encoding: 'base64' });
  return pdfBytes;
}

async function sendPdfToRestServer(pdfPath, title, author, description, token) {
  // Convert PDF to Base64
  const base64Pdf = pdfToBase64(pdfPath);

  // Define the API endpoint
  const apiUrl = 'http://localhost:3000/ebooks';

  // Define the JSON payload
  const payload = {
    title: title,
    author: author,
    description: description,
    pdf: base64Pdf,
  };

  // Define the headers with the authentication token
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    // Make the POST request
    const response = await axios.post(apiUrl, payload, { headers });

    // Check the response status
    if (response.status === 200 || response.status === 201) {
      console.log('PDF uploaded successfully.');
    } else {
      console.error(`Error uploading PDF: ${response.status}, ${response.data}`);
    }
  } catch (error) {
    console.error(`Error uploading PDF: ${error.message}`);
  }
}

// Example usage
const pdfPath = process.argv[2];
const title = process.argv[3];
const author = process.argv[4];
const description = `${process.argv[4]} - ${process.argv[3]}`;
const token = process.argv[5];

sendPdfToRestServer(pdfPath, title, author, description, token);
