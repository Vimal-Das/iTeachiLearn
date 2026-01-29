import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import GradeSelector from './components/GradeSelector'
import ChapterList from './components/ChapterList'
import GameView from './components/GameView'
import ModuleView from './components/ModuleView'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<GradeSelector />} />
                    <Route path="subject/:subjectId/grade/:gradeId" element={<ChapterList />} />
                    <Route path="play/:gameId" element={<GameView />} />
                    <Route path="learn/:moduleId" element={<ModuleView />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
