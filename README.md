The `index.html` file is a comprehensive HTML document for the "CORTEX Anomaly Detection" application. Here's an explanation of its structure and functionality:

### General Overview:
- **Purpose**: This file is the main interface for a cyberpunk-inspired anomaly detection application. It utilizes AI and facial recognition technologies.
- **Key Features**:
  - Real-time video feed with face and anomaly detection.
  - User interaction through buttons and settings.
  - Integration with AI models and Google API for advanced functionality.

---

### File Details:

#### **1. Metadata and Styling**:
- **HTML Metadata**:
  - Language: Norwegian (`lang="no"`).
  - Title: "CORTEX Anomaly Detector | Cyberpunk Ansiktsgjenkjenning".
  - Description and Keywords: Highlight features like facial recognition, real-time AI, and biometrics.
- **Styling**:
  - Uses `Tailwind CSS` and a custom font (`Share Tech Mono`).
  - Custom CSS defines a "cyberpunk" theme with neon colors, shadows, and animations.
  - Includes classes like `.cyber-button` and `.cyber-border` for futuristic UI elements.

---

#### **2. Layout**:
- **Main Container**:
  - A responsive, flexbox-based layout with a "cyber-border" effect.
- **Video Section**:
  - Displays real-time video feed (`<video>` tag).
  - An overlay (`<canvas>`) is used for drawing detections.
- **Control Panel**:
  - Buttons for face registration, database export/import, behavior analysis, and anomaly reporting.
  - File input for importing a database in `.json` format.
- **Sidebar**:
  - Sections for:
    - API key input.
    - Settings (e.g., recognition tolerance slider).
    - Known individuals list.
    - System log.
    - Chat assistant for user interaction.

---

#### **3. Modals**:
- Multiple modals provide additional functionality:
  - **Register New Individual**: Input a name for a new face.
  - **Analysis Report**: Displays anomaly analysis.
  - **Behavior Analysis**: Submits behavior data for advanced AI analysis.
  - **Generate Phantom Image**: AI generates an image based on a textual description.

---

#### **4. Scripts and Functionality**:
- **Libraries Used**:
  - `face-api.js`: AI-based face detection and recognition.
  - Built-in Gemini API for advanced generative AI tasks.
- **Functional Highlights**:
  - `initialize()`: Loads AI models and starts the webcam.
  - `detectFacesLoop()`: Continuously detects faces in the video feed and highlights anomalies.
  - **Event Handlers**:
    - API key saving and toggling advanced features.
    - Behavior analysis and anomaly explanation using AI.
    - Exporting and importing face data.
    - Running "Gabriel" and "Rafael" protocols for database integrity and movement analysis.
- **State Management**:
  - Keeps track of known and unknown faces.
  - Logs system activities and errors for the user.

---

#### **5. Loading Screen**:
- Initial "AI-core initialization" screen with a spinner and status messages.

#### **6. Accessibility**:
- Buttons and inputs are disabled/enabled based on conditions (e.g., API key availability).

#### **Notable Visual and Functional Enhancements**:
- Cyberpunk aesthetics with a neon palette.
- Smooth animations and hover effects on buttons.
- Detailed error handling and user feedback through logs.

### Summary:
This file serves as the front-end for a complex anomaly detection and facial recognition system, combining AI APIs with a visually engaging user interface. It’s designed for real-time interaction, with modular features like behavior analysis, data handling, and API integration.
