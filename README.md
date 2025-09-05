# CORTEX - Anomaly Detection System

A cyberpunk-inspired facial recognition and anomaly detection application built with React. The system provides real-time monitoring, face recognition capabilities, and comprehensive anomaly logging with a futuristic user interface.

## 🚀 Features

- **Real-time Face Recognition**: Advanced facial detection and recognition using webcam feed
- **Anomaly Detection**: Comprehensive anomaly logging and monitoring system
- **Multi-language Support**: Norwegian and English language support
- **Cyberpunk UI**: Futuristic dark theme with neon accents
- **Performance Optimized**: React.memo, useCallback, and useMemo for optimal performance
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Robust error handling with user-friendly messages
- **Real-time Dashboard**: Live statistics and system monitoring

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Modern web browser with camera access
- Camera/webcam for face recognition features

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GizzZmo/CoreTex.git
   cd CoreTex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000` in your web browser

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
```

## 📁 Project Structure

```
CoreTex/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx    # System statistics dashboard
│   │   ├── FaceRecognition.jsx # Camera and face detection
│   │   ├── AnomalyLog.jsx   # Anomaly display and logging
│   │   └── LanguageSwitcher.jsx # Language selection
│   ├── utils/               # Utility functions
│   │   └── index.js         # Helper functions and validation
│   ├── styles/              # CSS styles
│   ├── i18n.js             # Internationalization
│   ├── App.jsx             # Main application component
│   └── main.js             # Application entry point
├── tests/                   # Test files
├── public/                  # Static assets
├── index.html              # Standalone cyberpunk implementation
└── package.json            # Dependencies and scripts
```

## 🎯 Component Overview

### Dashboard
Displays real-time system statistics including:
- Anomaly count with color-coded status
- System uptime with smart formatting
- User count
- Last report timestamp

### FaceRecognition
Handles camera operations and face detection:
- Camera initialization with error handling
- Real-time video feed display
- Face detection simulation (ready for face-api.js integration)
- Retry functionality for camera errors

### AnomalyLog
Manages anomaly display and logging:
- Sortable anomaly list (newest first)
- Color-coded anomaly types
- Scrollable interface with max height
- Empty state handling

### LanguageSwitcher
Provides multi-language support:
- Norwegian and English languages
- Persistent language preference (localStorage)
- Accessible form controls

## 🔧 Configuration

### Camera Settings
Camera constraints can be configured in `src/utils/index.js`:
```javascript
export const validateCameraConstraints = (constraints = {}) => {
  return {
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: "user",
      ...constraints.video
    }
  };
};
```

### Language Configuration
Add new languages in `src/i18n.js`:
```javascript
export const translations = {
  no: { /* Norwegian translations */ },
  en: { /* English translations */ },
  // Add new languages here
};
```

## 🚀 Performance Optimizations

The application includes several performance optimizations:

- **React.memo**: All components use memo to prevent unnecessary re-renders
- **useCallback**: Event handlers are memoized to prevent child re-renders
- **useMemo**: Expensive calculations are memoized
- **Efficient State Updates**: State updates are batched and optimized
- **Memory Management**: Proper cleanup of camera streams and intervals

## 🛡️ Error Handling

Comprehensive error handling includes:
- Camera access errors with user-friendly messages
- Network error handling
- Graceful fallbacks for missing features
- Detailed error logging for development

## 🎨 Styling

The application uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Cyberpunk theme with neon effects
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Optimized for low-light environments

## 🔐 Security Considerations

- Camera access requires user permission
- No data is transmitted without explicit user action
- Local storage is used only for preferences
- Input validation on all user inputs

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Docker (if configured)
```bash
docker build -t cortex .
docker run -p 3000:3000 cortex
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Add tests for new functionality
- Use TypeScript-style JSDoc comments
- Follow the existing code style
- Update documentation for new features

## 🧪 Testing Strategy

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **Utility Tests**: Helper function validation
- **Accessibility Tests**: ARIA compliance
- **Performance Tests**: Memory and render optimization

## 📈 Performance Monitoring

Monitor application performance with:
- React DevTools Profiler
- Browser Performance tab
- Memory usage monitoring
- Network request optimization

## 🐛 Troubleshooting

### Common Issues

**Camera not working:**
- Check browser permissions
- Ensure HTTPS (required for camera access)
- Verify camera is not in use by another application

**Tests failing:**
- Run `npm install` to ensure dependencies are up to date
- Clear Jest cache: `npx jest --clearCache`

**Performance issues:**
- Check React DevTools Profiler
- Verify memo usage on components
- Monitor state update frequency

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Face-api.js for facial recognition capabilities
- Tailwind CSS for styling framework
- React ecosystem for robust development tools
- Cyberpunk aesthetic inspiration

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the component documentation

---

**Made with ❤️ for the future of security monitoring**