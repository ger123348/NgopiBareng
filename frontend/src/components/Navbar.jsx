import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [campusOpen, setCampusOpen] = useState(false);
    const location = useLocation();

    // Custom check for Campus active state (if campus_id param exists)
    const isCampusActive = location.search.includes('campus_id');

    const navLinkClass = ({ isActive }) =>
        clsx("transition font-medium", isActive && !isCampusActive ? "text-orange-600 font-bold" : "hover:text-orange-600 text-gray-700");


    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <Icon icon="lucide:coffee" className="text-orange-600 text-2xl" />
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                            NgopiBareng
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/" className={navLinkClass} end>Home</NavLink>

                        {/* Campus Dropdown */}
                        <div className="relative group">
                            <button
                                className={clsx(
                                    "flex items-center gap-1 font-medium transition",
                                    isCampusActive ? "text-orange-600 font-bold" : "text-gray-700 hover:text-orange-600"
                                )}
                                onMouseEnter={() => setCampusOpen(true)}
                            >
                                Campus <Icon icon="lucide:chevron-down" className="text-xs" />
                            </button>
                            <div
                                className="absolute left-0 mt-0 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible py-2"
                                onMouseLeave={() => setCampusOpen(false)}
                            >
                                <NavLink to="/cafes?campus_id=1" className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600">UNILA</NavLink>
                                <NavLink to="/cafes?campus_id=2" className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600">ITERA</NavLink>
                            </div>
                        </div>

                        <NavLink to="/cafes" className={navLinkClass} end>All Cafés</NavLink>

                        {user && (
                            <NavLink to="/submit-cafe" className={({ isActive }) => clsx("px-4 py-2 rounded-full transition flex items-center gap-2", isActive ? "bg-orange-700 text-white" : "bg-orange-600 text-white hover:bg-orange-700")}>
                                <Icon icon="lucide:plus" /> Submit Café
                            </NavLink>
                        )}

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 hover:text-orange-600">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                    {user.role === 'admin' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Admin</span>}
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible py-1">
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="block px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                                            <Icon icon="lucide:layout-dashboard" /> Dashboard
                                        </Link>
                                    )}
                                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2">
                                        <Icon icon="lucide:log-out" /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                                <NavLink to="/register" className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium">Register</NavLink>
                            </div>
                        )}
                    </div>

                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        <Icon icon="lucide:menu" className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4">
                    <NavLink to="/" onClick={() => setIsOpen(false)} className={navLinkClass}>Home</NavLink>
                    <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                        <p className="text-xs text-gray-400 uppercase font-bold">Campuses</p>
                        <NavLink to="/cafes?campus_id=1" onClick={() => setIsOpen(false)} className="block text-gray-600 hover:text-orange-600">UNILA</NavLink>
                        <NavLink to="/cafes?campus_id=2" onClick={() => setIsOpen(false)} className="block text-gray-600 hover:text-orange-600">ITERA</NavLink>
                    </div>
                    <NavLink to="/cafes" onClick={() => setIsOpen(false)} className={navLinkClass}>All Cafés</NavLink>
                    {user ? (
                        <>
                            {user.role === 'admin' && <NavLink to="/admin" onClick={() => setIsOpen(false)} className="text-orange-600 font-bold">Admin Dashboard</NavLink>}
                            <NavLink to="/submit-cafe" onClick={() => setIsOpen(false)} className={navLinkClass}>Submit Café</NavLink>
                            <button onClick={logout} className="text-left text-red-600 font-medium">Logout</button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 pt-2 border-t">
                            <NavLink to="/login" onClick={() => setIsOpen(false)} className="font-medium">Login</NavLink>
                            <NavLink to="/register" onClick={() => setIsOpen(false)} className="font-medium text-orange-600">Register</NavLink>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
