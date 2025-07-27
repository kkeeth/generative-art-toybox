# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a generative art toybox repository focused on creating creative coding projects using p5.js. The repository contains daily art experiments, studies of other artists' work, completed art pieces, and basic learning examples.

## Development Commands

This is a purely frontend project with no build system or package.json. All projects run directly in the browser by opening their respective `index.html` files.

**To work on a project:**
1. Navigate to any project directory
2. Open `index.html` in a web browser to view the art
3. Edit `app.js` to modify the generative art code
4. Refresh the browser to see changes

**Common keyboard shortcuts in p5.js sketches:**
- `s` key: Save animated GIF (5 seconds)
- `c` key: Save current canvas as JPEG image

## Project Structure

### Main Directories

- **`DAILY/`** - Daily art experiments organized by year/month/date (e.g., `2025/07/0718/`)
- **`WORKS/`** - Completed art projects and exhibition pieces
- **`STUDIES/`** - Studies and recreations of other artists' techniques
- **`basics/`** - Learning examples and basic p5.js demonstrations
- **`p5-template/`** - Template for creating new projects
- **`free_playground/`** - Experimental workspace

### Standard Project Structure

Each art project typically contains:
- `index.html` - Main HTML file that loads p5.js and the sketch
- `app.js` - Main p5.js sketch code
- `style.css` - Styling (usually minimal)
- `p5.min.js` - Local copy of p5.js library
- `colorPalette.js` - Predefined color schemes (when used)

## Code Architecture

### p5.js Framework

All projects use p5.js, a JavaScript creative coding library. Key patterns:

**Standard p5.js Structure:**
```javascript
function setup() {
  // Canvas creation and one-time initialization
  createCanvas(width, height);
}

function draw() {
  // Animation loop (60fps by default)
  background(255);
}

function keyPressed() {
  // Handle keyboard input for saving/interaction
  if (key === 's') saveGif();
  if (key === 'c') saveCanvas();
}
```

**Canvas Sizing Convention:**
Most projects use responsive sizing:
```javascript
W = min(windowWidth, windowHeight) - 50
createCanvas(W, W);
```

### Color Palette System

Projects often use `colorPalette.js` which contains named color schemes inspired by famous artists (Hokusai, Van Gogh, Monet, etc.). Each palette has:
- `name`: String identifier
- `colors`: Array of hex color codes

**Usage Pattern:**
```javascript
let palette = random(colorPalette);
fill(random(palette.colors));
```

### Common Generative Art Patterns

1. **Particle Systems** - Arrays of objects with position, velocity, and behavior
2. **Noise-based Movement** - Using Perlin noise for organic motion
3. **Geometric Transformations** - Rotation, scaling, and translation for patterns
4. **Interactive Elements** - Mouse/keyboard input affecting the art
5. **Animation Loops** - Time-based changes using `millis()` or `frameCount`

### Saving Functionality

Standard save functions across projects:
- `saveGif()` - Exports 5-second animated GIF with timestamp
- `saveCanvas()` - Exports current frame as JPEG with timestamp
- Filenames use format: `mySketch-{timestamp}`

## Working with the Codebase

### Creating New Art Projects

1. Copy the `p5-template/` directory
2. Rename to your project name
3. Modify `app.js` for your specific art concept
4. Include `colorPalette.js` if using predefined colors

### Debugging and Development

- Use browser developer tools for debugging
- Common issues: canvas sizing, color format compatibility, animation performance
- Test interactivity (mouse/keyboard events) during development

### File Organization

- Daily experiments go in `DAILY/YYYY/MM/DDDD/`
- Completed works go in `WORKS/project-name/`
- Studies of other artists go in `STUDIES/artist-name/`
- Keep each project self-contained with its own p5.js copy

This repository focuses on creative expression through code rather than traditional software development, so conventional testing, linting, and build processes are not applicable.