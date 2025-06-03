import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import List from './pages/project/List';
import Header from './components/Header'

export default function App() {
    return (
        <Router>
            <Header />
            <main className="pt-28 w-full min-h-screen items-center justify-center px-6">
                <div className="w-full ">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/projects" element={<List />} />
                    </Routes>
                </div>
            </main>
        </Router>
    );
}
