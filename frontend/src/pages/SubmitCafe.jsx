import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function SubmitCafe() {
    const navigate = useNavigate();
    const [campuses, setCampuses] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get('/campuses').then(res => setCampuses(res.data));
    }, []);

    const [form, setForm] = useState({
        name: '',
        description: '',
        address: '',
        price_category: 'sedang',
        campus_ids: [],
        facilities: [],
    });

    const [files, setFiles] = useState([]);

    const toggleFacility = (fac) => {
        setForm(prev => {
            const has = prev.facilities.includes(fac);
            const newF = has ? prev.facilities.filter(f => f !== fac) : [...prev.facilities, fac];
            return { ...prev, facilities: newF };
        });
    };

    const toggleCampus = (id) => {
        setForm(prev => {
            const has = prev.campus_ids.includes(id);
            const newC = has ? prev.campus_ids.filter(c => c !== id) : [...prev.campus_ids, id];
            return { ...prev, campus_ids: newC };
        });
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length < 3) {
            alert("Please upload at least 3 images.");
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('address', form.address);
        formData.append('price_category', form.price_category);

        form.campus_ids.forEach((id, i) => formData.append(`campus_ids[${i}]`, id));
        form.facilities.forEach((fac, i) => formData.append(`facilities[${i}]`, fac));
        files.forEach((file) => formData.append('images[]', file));

        try {
            await api.post('/cafes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Cafe submitted successfully! Waiting for admin approval.");
            navigate('/cafes');
        } catch (error) {
            console.error(error);
            alert("Submission failed: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Icon icon="lucide:plus-circle" className="text-orange-600" />
                Submit New Café
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Café Name</label>
                    <input type="text" className="w-full border rounded-lg p-3" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea className="w-full border rounded-lg p-3 h-32" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input type="text" className="w-full border rounded-lg p-3" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Campuses</label>
                        <div className="space-y-2 border p-3 rounded-lg">
                            {campuses.map(c => (
                                <label key={c.id} className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.campus_ids.includes(c.id)} onChange={() => toggleCampus(c.id)} />
                                    <span>{c.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Price Category</label>
                        <select className="w-full border rounded-lg p-3 bg-white" value={form.price_category} onChange={e => setForm({ ...form, price_category: e.target.value })}>
                            <option value="murah">Murah (Cheap)</option>
                            <option value="sedang">Sedang (Moderate)</option>
                            <option value="mahal">Mahal (Expensive)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Facilities</label>
                    <div className="flex flex-wrap gap-4">
                        {['WiFi', 'AC', 'Power outlet', 'Outdoor area', 'Smoking area'].map(fac => (
                            <label key={fac} className="flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="checkbox" checked={form.facilities.includes(fac)} onChange={() => toggleFacility(fac)} />
                                <span>{fac}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Images (Min 3)</label>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full border rounded-lg p-3" required />
                    <p className="text-sm text-gray-500 mt-1">Select at least 3 images.</p>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Cafe'}
                </button>
            </form>
        </div>
    );
}
