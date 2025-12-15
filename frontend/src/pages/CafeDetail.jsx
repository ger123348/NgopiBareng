import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

export default function CafeDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [cafe, setCafe] = useState(null);
    const [loading, setLoading] = useState(true);

    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        fetchCafe();
    }, [id]);

    const fetchCafe = async () => {
        try {
            const { data } = await api.get(`/cafes/${id}`);
            setCafe(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/reviews', { ...reviewForm, cafe_id: id });
            setReviewForm({ rating: 5, comment: '' });
            fetchCafe();
            alert("Review submitted!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Delete this review?')) return;
        try { await api.delete(`/reviews/admin/${reviewId}`); fetchCafe(); } catch (error) { alert("Failed to delete"); }
    };

    const handleUserDeleteReview = async (reviewId) => {
        if (!confirm('Delete your review?')) return;
        try { await api.delete(`/reviews/${reviewId}`); fetchCafe(); } catch (error) { alert("Failed to delete"); }
    };

    if (loading) return <div>Loading...</div>;
    if (!cafe) return <div>Cafe not found</div>;

    const images = cafe.images || [];

    return (
        <div className="space-y-12">
            {/* Header / Gallery */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-video rounded-3xl overflow-hidden shadow-lg bg-gray-100 relative group">
                        {images[activeImage] && (
                            <img src={`http://localhost:8000${images[activeImage].image_path}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                        )}
                        <span className={clsx("absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow",
                            cafe.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                        )}>
                            {cafe.status === 'approved' ? 'Verified' : 'Pending Verification'}
                        </span>
                    </div>
                    {/* Thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {images.map((img, idx) => (
                            <button key={idx} onClick={() => setActiveImage(idx)} className={clsx("w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition", activeImage === idx ? "border-orange-600 ring-2 ring-orange-200" : "border-transparent opacity-70 hover:opacity-100")}>
                                <img src={`http://localhost:8000${img.image_path}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{cafe.name}</h1>
                        <div className="flex items-center gap-2 text-gray-500 text-lg">
                            <Icon icon="lucide:map-pin" className="text-orange-600" />
                            {cafe.address}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 uppercase font-bold tracking-wider">Rating</span>
                            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                <Icon icon="lucide:star" className="text-yellow-400 fill-current" />
                                {Number(cafe.rating).toFixed(1)} <span className="text-sm font-normal text-gray-400">({cafe.reviews.length} reviews)</span>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-gray-200"></div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 uppercase font-bold tracking-wider">Price</span>
                            <span className={clsx("text-lg font-bold capitalize",
                                cafe.price_category === 'murah' ? 'text-green-600' :
                                    cafe.price_category === 'sedang' ? 'text-yellow-600' : 'text-red-600'
                            )}>
                                {cafe.price_category}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t">
                        <h3 className="font-bold text-gray-900">Facilities</h3>
                        <div className="flex flex-wrap gap-2">
                            {cafe.facilities?.map(fac => (
                                <span key={fac} className="px-4 py-2 bg-orange-50 text-orange-800 rounded-lg text-sm font-medium flex items-center gap-2">
                                    <Icon icon="lucide:check" className="w-4 h-4" /> {fac}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg">{cafe.description}</p>
                </div>
            </div>

            {/* Menu Section */}
            <section className="bg-white rounded-3xl border p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <Icon icon="lucide:utensils" className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold">Menu & Pricing</h2>
                </div>

                {(!cafe.menu_items || cafe.menu_items.length === 0) ? (
                    <div className="text-center py-12 text-gray-500 italic bg-gray-50 rounded-2xl">Menu not available yet.</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                        {cafe.menu_items.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-4 border-b border-dashed border-gray-200 last:border-0 hover:bg-orange-50/50 transition px-4 rounded-lg">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded">{item.category || 'Item'}</span>
                                </div>
                                <span className="font-bold text-gray-700 text-lg">
                                    Rp {Number(item.price).toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Reviews Section */}
            <section className="max-w-4xl mx-auto pt-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
                    <div className="flex justify-center items-center gap-4">
                        <div className="text-5xl font-extrabold text-gray-900">{Number(cafe.rating).toFixed(1)}</div>
                        <div className="flex flex-col items-start">
                            <div className="flex text-yellow-400 text-xl gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Icon key={i} icon="lucide:star" className={i < Math.round(cafe.rating) ? "fill-current" : "text-gray-200"} />
                                ))}
                            </div>
                            <span className="text-gray-500 font-medium">{cafe.reviews.length} Verified Reviews</span>
                        </div>
                    </div>
                </div>

                {/* Review Form */}
                {user && (
                    <div className="bg-white border rounded-2xl p-6 shadow-sm mb-12 transform hover:-translate-y-1 transition duration-300">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Icon icon="lucide:message-square-plus" /> Write a Review
                        </h4>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1 bg-gray-50 px-3 rounded-lg border">
                                    <span className="text-sm font-bold text-gray-500 uppercase">Rating:</span>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button type="button" key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="focus:outline-none p-1 transform hover:scale-110 transition">
                                            <Icon icon="lucide:star" className={clsx("text-xl", star <= reviewForm.rating ? "text-yellow-400 fill-current" : "text-gray-300")} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-orange-200 outline-none transition" placeholder="Share your experience..." required rows="3"></textarea>
                            <div className="flex justify-end">
                                <button type="submit" disabled={submitting} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition disabled:opacity-50 shadow-lg">
                                    {submitting ? 'Posting...' : 'Post Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-6">
                    {cafe.reviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border flex gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {review.user?.name?.[0]}
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h5 className="font-bold text-gray-900">{review.user?.name}</h5>
                                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex text-yellow-400 text-sm">
                                        {[...Array(5)].map((_, i) => <Icon key={i} icon="lucide:star" className={i < review.rating ? "fill-current" : "text-gray-200"} />)}
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                <div className="mt-4 flex gap-4">
                                    {user && user.id === review.user_id && <button onClick={() => handleUserDeleteReview(review.id)} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider">Delete</button>}
                                    {user && user.role === 'admin' && <button onClick={() => handleDeleteReview(review.id)} className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded hover:bg-red-100 uppercase tracking-wider">Admin Delete</button>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
