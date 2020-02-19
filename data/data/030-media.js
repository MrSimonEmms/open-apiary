/**
 * 030-media
 */

/* Node modules */
const path = require('path');

/* Third-party modules */

/* Files */

function getPath(file) {
  const envvar = process.env.UPLOAD_PATH;

  return path.join(envvar, file);
}

module.exports = [{
  id: 1,
  uuid: '42a40fab-adf9-47eb-a837-afcc330b157a',
  originalFilename: 'annie-spratt-8_WZU5xKFKk-unsplash.jpg',
  uploadedFilename: getPath('0001'),
  mimeType: 'image/jpeg',
  size: 2179253,
  userId: 1,
}, {
  id: 2,
  uuid: 'dfc1307c-0a91-4c5c-b9b1-0e29514d777f',
  originalFilename: 'bee-naturalles-fManUbiXzGI-unsplash.jpg',
  uploadedFilename: getPath('0002'),
  mimeType: 'image/jpeg',
  size: 1799115,
  userId: 1,
}, {
  id: 3,
  uuid: '040e254a-3141-4567-8d86-a41b4f7a5dad',
  originalFilename: 'beewell-zGIsyT6mqv4-unsplash.jpg',
  uploadedFilename: getPath('0003'),
  mimeType: 'image/jpeg',
  size: 1798436,
  userId: 1,
}];
