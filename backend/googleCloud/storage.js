import { Storage } from '@google-cloud/storage';
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: './googleCloud/googlecreds.json',
});

export default storage;

