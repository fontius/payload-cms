import { buildConfig } from 'payload/config';
import path from 'path';
import { fileURLToPath } from 'url'; // Added for ESM __dirname
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import { webpackBundler } from '@payloadcms/bundler-webpack';

import Users from './collections/Users.js'; // Added .js extension
import Posts from './collections/Posts.js'; // Added .js extension

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [
    Users,
    Posts,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  // Whitelist your frontend URL to make requests from the browser
  cors: [process.env.FRONTEND_URL, process.env.PAYLOAD_PUBLIC_SERVER_URL]
    .filter(Boolean)
    .concat(['http://localhost:3001']), // Allow local Next.js dev
  csrf: [process.env.FRONTEND_URL, process.env.PAYLOAD_PUBLIC_SERVER_URL]
    .filter(Boolean)
    .concat(['http://localhost:3001']), // Allow local Next.js dev
});