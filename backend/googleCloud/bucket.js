import storage from './storage.js';

const bucketName = 'revvedup-bucket';
const bucket = storage.bucket(bucketName);

export const createBucket = async () => {
  try {
    await bucket.create();
    console.log(`Bucket ${bucketName} created.`);
  } catch (err) {
    if (err.code === 409) {
      console.log(`Bucket ${bucketName} already exists.`);
    } else {
      console.error('ERROR:', err);
    }
  }
};

export default bucket;
