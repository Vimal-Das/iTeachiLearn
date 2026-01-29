# Contributing to iTeachiLearn 🚀

Welcome! iTeachiLearn is an open-source platform built by students, for students. We love contributions, especially from vibecoders!

Before you start, make sure you follow the [Setup Guide](file:///c:/Users/tvish/./gemini/antigravity/scratch/math_platform/SETUP.md) to get the project running on your machine.

## How to Contribute

You can add new subjects, grades, or chapters just by talking to your AI coding assistant.

### 1. Adding a New Subject

To add a new subject (like History or Geography):

1. Create a new file in `src/data/subjects/`.
2. Use this template:
   ```javascript
   export const mySubject = {
       id: 'my-subject',
       name: 'My Subject',
       icon: 'BookOpen', // Options: Calculator, Beaker, BookOpen
       grades: [
           { id: 'grade-1', name: 'Grade 1', chapters: [] },
           // add more grades here
       ]
   };
   ```
3. Register it in `src/data/subjects/index.js`.

### 2. Adding Chapters to an Existing Grade

Find the subject file (e.g., `maths.js`) and add a new chapter object to the `chapters` array of the appropriate grade:

```javascript
{
    id: 'my-new-chapter',
    name: 'Exciting New Topic',
    games: [
        {
            id: 'my-game',
            name: 'Fun Game Name',
            description: 'What you do in this game',
            path: '/games/my-game/index.html',
            totalLevels: 5
        }
    ]
}
```

### 3. Creating Games and Modules

- All game files should go into `/public/games/`.
- All interactive modules should go into `/public/modules/`.
- Use the templates in `/public/games/template/` to get started!

## Vibecoding Prompt Examples

Here are some example prompts you can use with your AI assistant to contribute:

### 🆕 Adding a Subject
> "Create a new subject for 'Geography'. Use the 'BookOpen' icon. Start it with Grade 6 and Grade 7."

### 📖 Adding a Chapter
> "In the Maths subject, add a new chapter for 'Algebraic Expressions' to Grade 6. Include a placeholder game called 'Expression Escape'."

### 🎮 Adding a Game
> "I've built a game in `public/games/fraction-fun/index.html`. Add it to the 'Fractions' chapter in Grade 3 Maths."
                                                                                                                                                                                                                                                                                                                    