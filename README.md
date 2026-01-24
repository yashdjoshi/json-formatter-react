# JSON Formatter React

A modern, interactive JSON formatter built with React, TypeScript, and Vite. Features collapsible JSON trees, syntax highlighting, and easy section copying.

🌐 **Live Demo:** [http://json-formatter-app-1768764297.s3-website-us-east-1.amazonaws.com](http://json-formatter-app-1768764297.s3-website-us-east-1.amazonaws.com)

## Features

- **Interactive JSON Tree**: Collapsible objects and arrays with chevron toggles
- **Copy Sections**: Hover over any object/array to copy just that section
- **Syntax Highlighting**: Color-coded JSON with depth-based bracket colors
- **Format & Minify**: Toggle between formatted and minified JSON
- **Error Detection**: Real-time validation with line/column error indicators
- **Dark Mode**: System-aware theme with manual toggle
- **Responsive**: Works on desktop and mobile

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast builds and HMR
- **Zustand** for state management
- **Tailwind CSS** + **shadcn/ui** for styling
- **Lucide React** for icons

## AWS S3 Deployment

This app is deployed to AWS S3 as a static website. Here's how to deploy:

### Prerequisites
- AWS CLI installed and configured with credentials
- S3 bucket created and configured for static website hosting

### Deploy to S3

```bash
# Build the production app
npm run build

# Upload to S3 (replace with your bucket name)
aws s3 sync dist/ s3://json-formatter-app-1768764297 --delete

# Configure bucket for static website hosting (first time only)
aws s3 website s3://json-formatter-app-1768764297 \
  --index-document index.html \
  --error-document index.html
```

### Bucket Configuration

The S3 bucket needs to be publicly readable. Here's the bucket policy used:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::json-formatter-app-1768764297/*"
    }
  ]
}
```

### Access the Deployed App

Once deployed, the app is available at:
- **S3 Website URL**: http://json-formatter-app-1768764297.s3-website-us-east-1.amazonaws.com

---

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
