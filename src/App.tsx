import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import List from './pages/project/List';

export default function App() {
  return (
    <Router>
      <div className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col justify items-center">
        <nav className="mb-8 flex gap-4 text-blue-600 font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/projects" className="hover:underline">Projects</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<List />} />
        </Routes>
      </div>
    </Router>
  );
}
