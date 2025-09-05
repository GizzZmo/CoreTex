# Component API Documentation

## Dashboard Component

### Overview
The Dashboard component displays real-time system statistics and key metrics for monitoring the anomaly detection system.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `anomalies` | `number` | Yes | - | Total count of detected anomalies |
| `uptime` | `number` | Yes | - | System uptime in minutes |
| `users` | `number` | Yes | - | Number of registered users |
| `lastReport` | `string` | No | `null` | Timestamp of the last generated report |

### Features

- **Smart Time Formatting**: Automatically formats uptime from minutes to human-readable format (minutes, hours, days)
- **Color-coded Status**: Anomaly count changes color based on status (green for 0, red for >0)
- **Timestamp Handling**: Safely formats timestamps with error handling
- **Performance Optimized**: Uses React.memo to prevent unnecessary re-renders

### Usage Example

```jsx
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Dashboard
      anomalies={5}
      uptime={1440} // 24 hours
      users={42}
      lastReport="2025-06-28T20:15:00.000Z"
    />
  );
}
```

### Time Formatting Examples

| Input (minutes) | Output |
|----------------|---------|
| 30 | "30 min" |
| 90 | "1t 30m" |
| 1440 | "1d 0t 0m" |
| 1500 | "1d 1t 0m" |

---

## FaceRecognition Component

### Overview
Handles webcam feed, camera initialization, and face detection functionality with comprehensive error handling.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onDetect` | `function` | Yes | Callback function called when anomaly is detected |
| `tolerance` | `number` | Yes | Detection tolerance level (0.0 - 1.0) |
| `knownFaces` | `string[]` | Yes | Array of known face identifiers |

### Features

- **Camera Management**: Automatic camera initialization with error handling
- **Error Recovery**: Retry functionality for camera failures
- **Multiple Error Types**: Handles various camera access errors with user-friendly messages
- **Performance Optimized**: Efficient stream management and cleanup
- **Visual Feedback**: Status indicators and loading states

### Usage Example

```jsx
import FaceRecognition from './components/FaceRecognition';

function App() {
  const handleDetection = (anomaly) => {
    console.log('Anomaly detected:', anomaly);
  };

  return (
    <FaceRecognition
      onDetect={handleDetection}
      tolerance={0.7}
      knownFaces={['John', 'Jane', 'Bob']}
    />
  );
}
```

### Camera Error Types

| Error Type | User Message | Description |
|------------|--------------|-------------|
| `NotFoundError` | "Ingen kamera funnet" | No camera devices available |
| `NotAllowedError` | "Kameratilgang nektet" | User denied camera permission |
| `NotReadableError` | "Kamera er i bruk av annen app" | Camera busy/hardware error |
| `OverconstrainedError` | "Kamerainnstillinger ikke støttet" | Constraints not supported |

### Detection Callback Format

```javascript
// onDetect callback receives:
{
  description: string,  // Human-readable description
  type: string         // Anomaly type ('System', 'Security', etc.)
}
```

---

## AnomalyLog Component

### Overview
Displays and manages a list of detected anomalies with sorting, filtering, and visual organization.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `anomalies` | `Anomaly[]` | Yes | Array of anomaly objects to display |

### Anomaly Object Structure

```typescript
interface Anomaly {
  time: string;        // ISO timestamp
  description: string; // Human-readable description
  type: string;       // Anomaly category
}
```

### Features

- **Automatic Sorting**: Displays newest anomalies first
- **Color-coded Types**: Different colors for different anomaly types
- **Scrollable Interface**: Max height with overflow scroll
- **Empty State**: Friendly message when no anomalies exist
- **Performance Optimized**: Individual memo components for list items

### Usage Example

```jsx
import AnomalyLog from './components/AnomalyLog';

const anomalies = [
  {
    time: '2025-06-28T20:15:00.000Z',
    description: 'Unauthorized access attempt',
    type: 'Security'
  },
  {
    time: '2025-06-28T20:10:00.000Z',
    description: 'System performance warning',
    type: 'System'
  }
];

function App() {
  return <AnomalyLog anomalies={anomalies} />;
}
```

### Anomaly Type Colors

| Type | Color Class | Visual |
|------|-------------|---------|
| 'sikkerhet', 'security' | `text-red-400` | 🔴 Red |
| 'system' | `text-blue-400` | 🔵 Blue |
| 'advarsel', 'warning' | `text-yellow-400` | 🟡 Yellow |
| 'info', 'information' | `text-green-400` | 🟢 Green |
| Default | `text-gray-400` | ⚪ Gray |

---

## LanguageSwitcher Component

### Overview
Provides language selection functionality with persistent preferences.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentLanguage` | `'no' \| 'en'` | Yes | Currently selected language |
| `onChange` | `function` | Yes | Callback when language changes |

### Features

- **Persistent Storage**: Saves language preference to localStorage
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance Optimized**: Only triggers onChange when value actually changes
- **Visual Enhancement**: Focus states and transitions

### Usage Example

```jsx
import LanguageSwitcher from './components/LanguageSwitcher';
import { useState } from 'react';

function App() {
  const [language, setLanguage] = useState('no');

  return (
    <LanguageSwitcher
      currentLanguage={language}
      onChange={setLanguage}
    />
  );
}
```

### Supported Languages

| Code | Language | Display Name |
|------|----------|--------------|
| `no` | Norwegian | Norsk |
| `en` | English | English |

---

## Utility Functions

### formatUptime(minutes)

Formats time duration in minutes to human-readable format.

```javascript
formatUptime(30)    // "30 min"
formatUptime(90)    // "1t 30m"
formatUptime(1440)  // "1d 0t 0m"
```

### formatTimestamp(timestamp, locale)

Formats timestamp with error handling.

```javascript
formatTimestamp('2025-06-28T20:15:00.000Z')  // "28.6.2025, 20:15:00"
formatTimestamp(null)                         // "Ingen"
formatTimestamp('invalid')                    // "invalid"
```

### getAnomalyTypeColor(type)

Returns appropriate CSS color class for anomaly type.

```javascript
getAnomalyTypeColor('security')  // "text-red-400"
getAnomalyTypeColor('system')    // "text-blue-400"
getAnomalyTypeColor('warning')   // "text-yellow-400"
```

### generateAnomalyId()

Generates unique ID for anomaly objects.

```javascript
generateAnomalyId()  // "1640995200000-abc123def"
```

### validateCameraConstraints(constraints)

Validates and normalizes camera constraints.

```javascript
validateCameraConstraints({
  video: { width: { ideal: 1920 } }
})
// Returns: { video: { width: { ideal: 1920 }, height: { ideal: 480 }, facingMode: "user" } }
```

### getCameraErrorMessage(error)

Returns user-friendly camera error messages.

```javascript
getCameraErrorMessage({ name: 'NotAllowedError' })  // "Kameratilgang nektet"
```