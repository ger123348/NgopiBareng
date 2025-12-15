import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(form.name, form.email, form.password, form.password_confirmation);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8">Register</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        value={form.password_confirmation}
                        onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition">
                    Register
                </button>
            </form>
            <p className="text-center mt-6 text-gray-600">
                Already have an account? <Link to="/login" className="text-orange-600 font-bold hover:underline">Login</Link>
            </p>
        </div>
    );
}
