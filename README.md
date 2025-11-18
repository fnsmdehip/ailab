# AI Lab Landing Page

This is a landing page concept for an AI Lab, featuring a WebGL-based dither effect hero section.

## Files

- `index.html`: Main structure.
- `style.css`: Styling and layout.
- `main.js`: Three.js scene and custom dither shader.

## How to Run

Because this project uses ES Modules (for Three.js), you need to serve it via a local web server. Opening the `index.html` file directly in your browser might result in CORS errors.

### Using Python (Pre-installed on macOS/Linux)

1. Open your terminal in this directory.
2. Run the following command:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser and go to `http://localhost:8000`.

### Using Node.js

If you have Node.js installed:
1. Install `serve`:
   ```bash
   npx serve .
   ```
2. Open the URL shown in the terminal.

