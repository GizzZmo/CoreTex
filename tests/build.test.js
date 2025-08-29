// Test to verify build artifacts are generated correctly
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Build Artifacts', () => {
  beforeAll(() => {
    // Clean any existing build
    try {
      fs.rmSync('dist', { recursive: true, force: true });
    } catch (e) {
      // Ignore if dist doesn't exist
    }
    
    // Run build
    execSync('npm run build', { stdio: 'pipe' });
  });

  test('Build creates dist directory', () => {
    expect(fs.existsSync('dist')).toBe(true);
  });

  test('Build creates HTML entry point', () => {
    const htmlFile = path.join('dist', 'vite-index.html');
    expect(fs.existsSync(htmlFile)).toBe(true);
    
    const content = fs.readFileSync(htmlFile, 'utf8');
    expect(content).toContain('<div id="root">');
    expect(content).toContain('<script');
  });

  test('Build creates assets directory', () => {
    const assetsDir = path.join('dist', 'assets');
    expect(fs.existsSync(assetsDir)).toBe(true);
  });

  test('Build creates JavaScript bundles', () => {
    const assetsDir = path.join('dist', 'assets');
    const files = fs.readdirSync(assetsDir);
    
    const jsFiles = files.filter(file => file.endsWith('.js'));
    expect(jsFiles.length).toBeGreaterThan(0);
    
    // Check vendor bundle exists
    const vendorFiles = jsFiles.filter(file => file.includes('vendor'));
    expect(vendorFiles.length).toBe(1);
  });

  test('Build creates source maps', () => {
    const assetsDir = path.join('dist', 'assets');
    const files = fs.readdirSync(assetsDir);
    
    const mapFiles = files.filter(file => file.endsWith('.js.map'));
    expect(mapFiles.length).toBeGreaterThan(0);
  });

  test('Build creates CSS assets', () => {
    const assetsDir = path.join('dist', 'assets');
    const files = fs.readdirSync(assetsDir);
    
    const cssFiles = files.filter(file => file.endsWith('.css'));
    expect(cssFiles.length).toBeGreaterThan(0);
  });
});