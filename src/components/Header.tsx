import { Link, useLocation } from 'react-router-dom';

export default function NavigationHeader() {
    const location = useLocation();

    const links = [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Login' },
        { to: '/projects', label: 'Projects' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="max-w-3xl mx-auto px-6 py-4 flex gap-6 text-blue-600 font-medium text-lg">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`hover:underline ${location.pathname === link.to ? 'underline font-bold' : ''
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
