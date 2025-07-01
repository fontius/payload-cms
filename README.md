# Payload CMS for Project "payload-web"

This repository contains the Payload CMS backend that serves as the content source for the `payload-web` Next.js frontend. It is configured for a multi-environment (staging, production) deployment on Coolify using a hosted MongoDB instance.

## Project Structure

- **`src/collections`**: Defines the content models (e.g., `Posts`, `Users`).
- **`src/payload.config.ts`**: The main configuration file for Payload CMS.
- **`src/server.ts`**: The Express server that runs Payload.
- **`Dockerfile`**: Defines the container for deployment on Coolify.
- **`.env.example`**: A template for environment variables.

---

## Local Development Setup

Follow these steps to run the CMS on your local machine.

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd payload-cms
```

### 2. Configure Environment Variables

Copy the example environment file to create your local configuration.

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the required values:
- `PAYLOAD_SECRET`: Generate a strong, random string. You can use `openssl rand -base64 32` in your terminal.
- `DATABASE_URI`: Your connection string for your local or hosted MongoDB instance.

### 3. Install Dependencies

**Important:** Before running `npm install`, it's highly recommended to clear any old cached data to prevent conflicts from previous attempts.

```bash
# Recommended: Clean the environment first
rm -rf node_modules package-lock.json
npm cache clean --force

# Install dependencies
npm install
```

### 4. Generate Payload Types

This command introspects your collections and generates a `payload-types.ts` file, providing full TypeScript support across your project.

```bash
npm run generate:types
```

### 5. Run the Development Server

Start the server. It will watch for file changes and automatically restart.

```bash
npm run dev
```

You can now access the Payload admin panel at http://localhost:3000/admin.

---

## A Note on Past Dependency Issues

This project previously encountered significant `npm install` errors (`ERESOLVE` and `ETARGET`). The root cause was a dependency conflict within the Payload ecosystem:

- **The Conflict**: Payload v3 requires **React 19**. However, some of its own internal dependencies (for the admin UI) still list **React 18** as a peer dependency.
- **The Solution**: This `package.json` has been updated to use the exact dependency set from the official `create-payload-app` starter template. It specifies a pre-release version of React 19 that is known to be compatible with all sub-dependencies, resolving the conflict without needing `npm overrides`.

If you encounter installation issues, the cleaning commands in Step 3 are the most effective solution.

## Deployment to Coolify

This project is ready for deployment on Coolify.

1.  Push your code to a GitHub/GitLab repository.
2.  In Coolify, create a new "Application" service and point it to your repository.
3.  Select **Dockerfile** as the build method.
4.  In the "Environment Variables" tab of your Coolify service, add all the variables from the `.env.example` file with your production/staging values.
5.  Deploy the service.