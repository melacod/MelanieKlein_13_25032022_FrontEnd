import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from "./layout/Header"
import Home from "./pages/Home"

const AppRouter = () => {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </Router>
    )
}

export default AppRouter