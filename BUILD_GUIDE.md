# Build & Deployment Guide

## Development

To start the development server:

```bash
npm install
npm run dev
```

This will start Vite's development server on `http://localhost:3000` with hot module replacement.

## Building for Production

To build the application for production:

```bash
npm run build
```

This creates optimized production files in the `dist/` directory:
- `vite-index.html` - Main HTML entry point
- `assets/` - Optimized JavaScript, CSS, and source maps
- Vendor libraries are separated into their own chunk for better caching

## Preview Built Application

To preview the production build locally:

```bash
npm run preview
```

This serves the built files on `http://localhost:4173`.

## CI/CD Pipeline

The project includes a GitHub Actions CI/CD pipeline that:

1. **Tests** - Runs on Node.js 18.x and 20.x
2. **Linting** - Checks for linting setup (currently skipped as no linter configured)
3. **Build** - Creates production artifacts and uploads them to GitHub Actions
4. **Artifacts** - Build artifacts are stored for 30 days and can be downloaded from the Actions tab

### Pipeline Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Build Artifacts

The pipeline creates and uploads:
- Complete `dist/` folder with all production assets
- Build summary with file sizes and generated files

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:clean` - Clean build directory and rebuild
- `npm run preview` - Preview production build
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ci` - Run tests with coverage for CI

## Technology Stack

- **Build Tool**: Vite 7.x
- **Framework**: React 18.x
- **Testing**: Jest with React Testing Library
- **CI/CD**: GitHub Actions
- **Package Manager**: npm