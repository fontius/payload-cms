import { buildConfig } from 'payload/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import { viteBundler } from '@payloadcms/bundler-vite';

// Collections
import Users from './collections/Users.js';
import Posts from './collections/Posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A helper function to create a clean array of allowed origins
const generateAllowedOrigins = () => {
  const allowed = [
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.FRONTEND_URL,
  ];

  // For local development, always allow the default ports
  if (process.env.NODE_ENV !== 'production') {
    allowed.push('http://localhost:3000'); // CMS itself
    allowed.push('http://localhost:3001'); // Common Next.js port
  }

  return allowed.filter(Boolean) as string[]; // Filter out undefined values
};

const allowedOrigins = generateAllowedOrigins();

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
  },
  editor: slateEditor({}),
  collections: [Users, Posts],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  // Whitelist allowed origins for requests from browser
  cors: allowedOrigins,
  csrf: allowedOrigins,
});