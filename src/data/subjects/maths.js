export const maths = {
    id: 'maths',
    name: 'Maths',
    icon: 'Calculator',
    grades: [
        {
            id: 'grade-1',
            name: 'Grade 1',
            chapters: [
                {
                    id: 'g1-ch1',
                    name: 'Number Sense & Addition',
                    games: [
                        {
                            id: 'g1-addition-dash',
                            name: 'Addition Dash',
                            description: 'Race against time to solve addition problems!',
                            thumbnail: '/games/thumbnails/addition-dash.png',
                            path: '/games/g1-addition-dash/index.html',
                            totalLevels: 10,
                        },
                        {
                            id: 'g1-subtraction-sprint',
                            name: 'Subtraction Sprint',
                            description: 'Quickly solve subtraction problems!',
                            thumbnail: '/games/thumbnails/subtraction-sprint.png',
                            path: '/games/g1-subtraction-sprint/index.html',
                            totalLevels: 10,
                        }
                    ],
                    modules: [
                        {
                            id: 'g1-understanding-addition',
                            name: 'Understanding Addition',
                            description: 'Learn how addition works with interactive visuals.',
                            thumbnail: '/modules/thumbnails/understanding-addition.png',
                            path: '/modules/g1-understanding-addition/index.html',
                            totalSteps: 5,
                        }
                    ]
                }
            ]
        },
        {
            id: 'grade-2',
            name: 'Grade 2',
            chapters: []
        },
        {
            id: 'grade-3',
            name: 'Grade 3',
            chapters: [
                {
                    id: 'g3-ch1',
                    name: 'Multiplication & Division',
                    games: [
                        {
                            id: 'g3-multiplication-master',
                            name: 'Multiplication Master',
                            description: 'Blast off with multiplication skills!',
                            thumbnail: '/games/thumbnails/multiplication-master.png',
                            path: '/games/g3-multiplication-master/index.html',
                            totalLevels: 10,
                        }
                    ]
                }
            ]
        },
        {
            id: 'grade-4',
            name: 'Grade 4',
            chapters: []
        },
        {
            id: 'grade-5',
            name: 'Grade 5',
            chapters: []
        },
        {
            id: 'grade-6',
            name: 'Grade 6',
            chapters: [
                {
                    id: 'g6-ch1',
                    name: 'Measurement & Data',
                    games: [
                        {
                            id: 'g6-metric-converter',
                            name: 'Metric Converter',
                            path: '/games/g6-metric-converter/index.html',
                            totalLevels: 10,
                        },
                        {
                            id: 'g6-area-architect',
                            name: 'Area Architect',
                            description: 'Design structures with Area & Perimeter!',
                            thumbnail: '/games/thumbnails/area-architect.png',
                            path: '/games/g6-area-architect/index.html',
                            totalLevels: 10,
                        }
                    ]
                },
                {
                    id: 'g6-ch2',
                    name: 'Ratios & Proportions',
                    modules: [
                        {
                            id: 'g6-ratio-lab',
                            name: 'Ratio Lab',
                            description: 'Explore the world of comparisons in the Ratio Lab!',
                            thumbnail: '/modules/thumbnails/ratio-lab.png',
                            path: '/modules/g6-ratio-lab/index.html',
                            totalSteps: 4,
                        }
                    ],
                    games: []
                }
            ]
        },
        ...Array.from({ length: 4 }, (_, i) => ({
            id: `grade-${i + 7}`,
            name: `Grade ${i + 7}`,
            chapters: []
        }))
    ]
};
