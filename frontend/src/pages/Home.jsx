import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Home() {
    const [campuses, setCampuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/campuses').then(res => {
            setCampuses(res.data);
            setLoading(false);
        }).catch(err => setLoading(false));
    }, []);

    return (
        <div className="space-y-16">
            {/* Hero */}
            <section className="text-center space-y-6 py-20 bg-orange-50 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Icon icon="lucide:coffee" className="w-96 h-96 absolute -top-20 -left-20 text-orange-300" />
                    <Icon icon="lucide:map-pin" className="w-64 h-64 absolute -bottom-10 -right-10 text-orange-300" />
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 relative z-10">
                    Find Your Perfect <br />
                    <span className="text-orange-600">Study Spot</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto relative z-10">
                    Discover the best cafés near UNILA & ITERA tailored for students. From WiFi speed to cheap coffee, we've got you covered.
                </p>
                <div className="flex justify-center gap-4 relative z-10">
                    <Link to="/cafes" className="px-8 py-4 bg-orange-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-orange-700 transition transform hover:-translate-y-1">
                        Browse All Cafés
                    </Link>
                </div>
            </section>

            {/* Campuses */}
            <section>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Select Your Campus</h2>
                    <p className="text-gray-600">Find hanging out spots near your college.</p>
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {campuses.map(campus => (
                            <Link key={campus.id} to={`/cafes?campus_id=${campus.id}`} className="group relative rounded-2xl overflow-hidden shadow-lg aspect-video">
                                {campus.image && (
                                    <img src={`http://localhost:8000${campus.image}`} alt={campus.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                )}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-center justify-center">
                                    <h3 className="text-3xl font-bold text-white text-center px-4">{campus.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
