# Math Problems Practice Website

A web application for practicing math problems by uploading photos of problems and organizing them for study sessions.

## Features

- **Photo Upload**: Upload photos of math problems from your textbooks, worksheets, or handwritten notes
- **Drag & Drop**: Easy drag-and-drop interface for uploading multiple images
- **Problem Organization**: View all uploaded problems in a clean, organized grid
- **Practice Mode**: Start practice sessions with your uploaded problems
- **Navigation**: Browse through problems with next/previous controls
- **Random Problems**: Get random problems for varied practice
- **Local Storage**: Your problems are saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Upload Problems**: 
   - Click "Browse Files" or drag and drop image files into the upload area
   - Supported formats: JPG, PNG, GIF, and other image formats
   - Multiple files can be uploaded at once

2. **View Problems**: 
   - All uploaded problems appear in the "Your Math Problems" section
   - Click "View Full Size" to see problems in detail
   - Use "Remove" to delete problems you no longer need

3. **Practice**: 
   - Click "Start Practice Session" to begin studying
   - Use "Random Problem" for varied practice
   - Navigate between problems using Next/Previous buttons

## Getting Started

Simply open `index.html` in your web browser. No installation or server setup required for basic use.

For development or hosting:

```bash
# Serve locally using Python
python3 -m http.server 8080

# Or using Node.js
npx http-server

# Then open http://localhost:8080
```

## File Structure

- `index.html` - Main HTML page
- `styles.css` - CSS styling and responsive design
- `script.js` - JavaScript functionality and app logic

## Browser Compatibility

Works in all modern browsers that support:
- FileReader API
- localStorage
- ES6 features

## Privacy

All uploaded images are stored locally in your browser using localStorage. No data is sent to external servers.