# Development Guide

## Getting Started

### Environment Setup

1. **Node.js and npm**
   ```bash
   # Check versions
   node --version  # Should be 14+
   npm --version   # Should be 6+
   ```

2. **Clone and Setup**
   ```bash
   git clone https://github.com/GizzZmo/CoreTex.git
   cd CoreTex
   npm install
   ```

3. **Development Server**
   ```bash
   npm start  # Starts on http://localhost:3000
   ```

## Project Architecture

### Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS + Custom CSS
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App (implicit)
- **Language**: JavaScript (ES6+)
- **Type Checking**: PropTypes

### Folder Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx
│   ├── FaceRecognition.jsx
│   ├── AnomalyLog.jsx
│   └── LanguageSwitcher.jsx
├── utils/              # Utility functions
│   └── index.js
├── styles/             # Custom CSS
│   └── main.css
├── i18n.js            # Internationalization
├── App.jsx            # Root component
└── main.js            # Entry point

tests/                  # Test files
├── components/
└── utils/

docs/                   # Documentation
├── API.md
├── DEVELOPMENT.md
└── DEPLOYMENT.md
```

## Development Workflow

### 1. Creating New Components

```jsx
// Template for new components
import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ComponentName = memo(function ComponentName({ prop1, prop2 }) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
});

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### 2. Performance Guidelines

**Use React.memo for all components:**
```jsx
const Component = memo(function Component(props) {
  // Component logic
});
```

**Memoize callbacks and expensive calculations:**
```jsx
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);

const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

**Optimize state updates:**
```jsx
// Good: Functional updates
setItems(prev => [...prev, newItem]);

// Avoid: Direct mutations
items.push(newItem);
setItems(items);
```

### 3. Testing Guidelines

**Component Tests:**
```jsx
import { render, screen } from '@testing-library/react';
import ComponentName from '../ComponentName';

test('renders correctly', () => {
  render(<ComponentName prop1="test" />);
  expect(screen.getByText(/test/i)).toBeInTheDocument();
});
```

**Utility Tests:**
```jsx
import { utilityFunction } from '../utils';

test('utility function works correctly', () => {
  expect(utilityFunction('input')).toBe('expected');
});
```

**Run tests:**
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ci       # CI mode with coverage
```

### 4. Code Style Guidelines

**Naming Conventions:**
- Components: PascalCase (`Dashboard`, `FaceRecognition`)
- Functions: camelCase (`handleClick`, `formatUptime`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINT`)
- Files: PascalCase for components, camelCase for utilities

**Import Organization:**
```jsx
// 1. React imports
import React, { useState, useCallback } from 'react';

// 2. Third-party imports
import PropTypes from 'prop-types';

// 3. Local imports
import { formatUptime } from '../utils';
import './Component.css';
```

**JSDoc Comments:**
```jsx
/**
 * Formats uptime duration from minutes to human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatUptime = (minutes) => {
  // Implementation
};
```

## State Management

### Local State Guidelines

**Use useState for simple state:**
```jsx
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
```

**Use useReducer for complex state:**
```jsx
const initialState = { items: [], loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

### State Lifting Guidelines

**Lift state to the nearest common ancestor:**
```jsx
// Parent component manages shared state
function App() {
  const [anomalies, setAnomalies] = useState([]);
  
  return (
    <>
      <FaceRecognition onDetect={addAnomaly} />
      <AnomalyLog anomalies={anomalies} />
    </>
  );
}
```

## Error Handling

### Component Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### Async Error Handling

```jsx
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await api.getData();
    setData(data);
  } catch (err) {
    setError(err.message);
    console.error('API Error:', err);
  } finally {
    setLoading(false);
  }
};
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx serve -s build

# Use React DevTools Profiler
# Check for unnecessary re-renders
```

### Memory Management

```jsx
// Cleanup effects
useEffect(() => {
  const interval = setInterval(callback, 1000);
  
  return () => {
    clearInterval(interval);
  };
}, []);

// Cleanup camera streams
useEffect(() => {
  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };
}, []);
```

### Lazy Loading

```jsx
// Code splitting for large components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Debugging

### React DevTools

1. Install React DevTools browser extension
2. Use Profiler tab to identify performance issues
3. Use Components tab to inspect props and state

### Browser DevTools

```jsx
// Add debug logging
useEffect(() => {
  console.log('Component mounted with props:', props);
}, []);

// Use debugger statements
const handleClick = () => {
  debugger; // Pauses execution
  // Handle click logic
};
```

### Common Issues

**Infinite Re-renders:**
```jsx
// Problem: Missing dependency
useEffect(() => {
  fetchData();
}, []); // Missing fetchData dependency

// Solution: Add dependency or use useCallback
const fetchData = useCallback(async () => {
  // Fetch logic
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

**Memory Leaks:**
```jsx
// Problem: No cleanup
useEffect(() => {
  const interval = setInterval(callback, 1000);
}, []);

// Solution: Add cleanup
useEffect(() => {
  const interval = setInterval(callback, 1000);
  return () => clearInterval(interval);
}, []);
```

## Git Workflow

### Branch Naming

- `feature/component-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/component-cleanup` - Code refactoring

### Commit Messages

```
feat: add camera error handling
fix: resolve memory leak in FaceRecognition
docs: update API documentation
style: improve button hover effects
test: add utility function tests
refactor: extract common error handling
```

### Pre-commit Checklist

- [ ] All tests pass (`npm test`)
- [ ] No console errors in development
- [ ] Components are properly memoized
- [ ] PropTypes are defined
- [ ] Documentation is updated
- [ ] No unused imports or variables

## Deployment Preparation

### Production Build

```bash
npm run build
```

### Environment Variables

```bash
# .env.production
REACT_APP_API_URL=https://api.cortex.com
REACT_APP_ENVIRONMENT=production
```

### Performance Checklist

- [ ] Bundle size is optimized
- [ ] Images are compressed
- [ ] Unnecessary dependencies removed
- [ ] Console.log statements removed
- [ ] Error boundaries implemented
- [ ] Loading states implemented

## Contributing Guidelines

1. **Fork the repository**
2. **Create feature branch** from `main`
3. **Follow code style guidelines**
4. **Add tests for new functionality**
5. **Update documentation**
6. **Submit pull request**

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No regression issues

## Screenshots (if applicable)
[Add screenshots for UI changes]
```