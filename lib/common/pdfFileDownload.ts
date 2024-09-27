import axios from 'axios';
import fs from 'fs';

// Function to download and save the PDF
export async function downloadPDF(url: string, path: string) {
  try {
    // Get the response from the URL
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });

    // Create a write stream to save the file
    const writer = fs.createWriteStream(path);

    // Pipe the response data to the file
    response.data.pipe(writer);

    // Return a promise that resolves when the file is successfully written
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading the PDF: ${error}`);
  }
};