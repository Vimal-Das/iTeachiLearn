# Project Setup Guide 🔨

Welcome! This guide will help you get the **iTeachiLearn** project running on your computer so you can start contributing.

## Recommended: AntiGravity (AI Coding Assistant)

If you are using AntiGravity, setting up is as easy as "vibing":

1. **Open the Project Folder**: Open the `math_platform` folder in your IDE where AntiGravity is active.
2. **"The Magic Prompt"**: Just say to AntiGravity:
   > "Help me set up the iTeachiLearn project. Install the dependencies and start the development server."
3. **Verify**: Once it's finished, you should see a link like `http://localhost:5173`. Click it to see the app!

---

## Manual Setup (Standard IDEs like VS Code)

If you prefer to do things manually or are using VS Code without an AI assistant:

### 1. Prerequisites
Make sure you have **Node.js** installed (Version 18 or higher is recommended).

### 2. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. Start the Development Server
Run this command to see the app in your browser:
```bash
npm run dev
```
The terminal will show you a URL (usually `http://localhost:5173`).

---

## Troubleshooting

- **npm command not found**: You need to install [Node.js](https://nodejs.org/).
- **Blank Page**: Check the terminal for errors. If you see "Module not found", try running `npm install` again.
- **Port already in use**: If `5173` is busy, the app will automatically try `5174`, `5175`, etc. Look at the terminal for the correct link!

---

## Next Steps
Once your project is running, check out [CONTRIBUTING.md](file:///c:/Users/tvish/./gemini/antigravity/scratch/math_platform/CONTRIBUTING.md) to learn how to add your own subjects and games!
