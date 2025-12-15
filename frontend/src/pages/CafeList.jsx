import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CafeCard from '../components/CafeCard';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

export default function CafeList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cafes, setCafes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [campus, setCampus] = useState(null);

    // Filters state
    const [filters, setFilters] = useState({
        price_category: searchParams.get('price_category') || '',
        rating: searchParams.get('rating') || '',
        sort: searchParams.get('sort') || 'latest',
        facilities: [], // Multi select
    });

    const campusId = searchParams.get('campus_id');
    const [campusName, setCampusName] = useState(null);

    useEffect(() => {
        if (campusId) {
            api.get('/campuses').then(res => {
                const c = res.data.find(c => c.id == campusId);
                setCampusName(c ? c.name : 'Campus');
            });
        } else {
            setCampusName(null);
        }
    }, [campusId]);

    useEffect(() => {
        fetchCafes();
    }, [searchParams, filters]); // Re-fetch when params change

    const fetchCafes = async () => {
        setLoading(true);
        try {
            const params = {
                campus_id: campusId,
                price_category: filters.price_category,
                rating: filters.rating,
                sort: filters.sort,
                // facilities: filters.facilities.join(','),
            };
            // Clean empty
            Object.keys(params).forEach(key => !params[key] && delete params[key]);

            if (filters.facilities.length > 0) {
                params.facilities = filters.facilities.join(',');
            }

            const { data } = await api.get('/cafes', { params });
            setCafes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleFacility = (fac) => {
        setFilters(prev => {
            const exists = prev.facilities.includes(fac);
            const newFacs = exists
                ? prev.facilities.filter(f => f !== fac)
                : [...prev.facilities, fac];
            return { ...prev, facilities: newFacs };
        });
    };

    const facilitiesList = ['WiFi', 'AC', 'Power outlet', 'Outdoor area', 'Smoking area'];

    return (
        <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="md:col-span-1 space-y-8 bg-white p-6 rounded-xl border h-fit sticky top-24">
                <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Icon icon="lucide:filter" /> Filters
                    </h3>

                    {/* Price */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-2 text-sm text-gray-500">Price Category</h4>
                        <div className="flex flex-wrap gap-2">
                            {['murah', 'sedang', 'mahal'].map(p => (
                                <button key={p}
                                    onClick={() => handleFilterChange('price_category', filters.price_category === p ? '' : p)}
                                    className={clsx(
                                        "px-3 py-1 rounded-full text-sm border transition uppercase",
                                        filters.price_category === p ? "bg-orange-600 text-white border-orange-600" : "hover:bg-gray-50 text-gray-600"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Facilities */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-2 text-sm text-gray-500">Facilities</h4>
                        <div className="space-y-2">
                            {facilitiesList.map(fac => (
                                <label key={fac} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox"
                                        checked={filters.facilities.includes(fac)}
                                        onChange={() => toggleFacility(fac)}
                                        className="rounded text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-gray-700 text-sm">{fac}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-2 text-sm text-gray-500">Minimum Rating</h4>
                        <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange('rating', e.target.value)}
                            className="w-full border rounded-lg p-2 text-sm"
                        >
                            <option value="">Any Rating</option>
                            <option value="3">3+ Stars</option>
                            <option value="4">4+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <h4 className="font-medium mb-2 text-sm text-gray-500">Sort By</h4>
                        <select
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="w-full border rounded-lg p-2 text-sm"
                        >
                            <option value="latest">Newest</option>
                            <option value="rating">Highest Rating</option>
                            <option value="nearest">Nearest (Dummy)</option>
                        </select>
                    </div>
                </div>
            </aside>

            {/* Content */}
            <div className="md:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">
                        {campusId ? `Cafés near ${campusName || '...'}` : 'All Cafés'}
                    </h2>
                    <span className="text-gray-500 text-sm">{cafes.length} results found</span>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {cafes.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2">
                                <Icon icon="lucide:coffee" className="mx-auto text-4xl text-gray-400 mb-2" />
                                <p className="text-gray-500">No cafés found matching your filters.</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cafes.map(cafe => (
                                    <CafeCard key={cafe.id} cafe={cafe} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
