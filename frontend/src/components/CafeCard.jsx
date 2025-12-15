import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

export default function CafeCard({ cafe }) {
    const mainImage = cafe.images && cafe.images.length > 0
        ? `http://localhost:8000${cafe.images[0].image_path}`
        : 'https://via.placeholder.com/400x300?text=No+Image';

    const priceColors = {
        murah: 'bg-green-100 text-green-700',
        sedang: 'bg-yellow-100 text-yellow-700',
        mahal: 'bg-red-100 text-red-700',
    };

    return (
        <Link to={`/cafes/${cafe.id}`} className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border hover:border-orange-200">
            <div className="relative aspect-[4/3]">
                <img src={mainImage} alt={cafe.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                    <Icon icon="lucide:star" className="text-yellow-400 fill-current" />
                    {Number(cafe.rating).toFixed(1)}
                </div>
            </div>
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg line-clamp-1">{cafe.name}</h3>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span className={clsx("px-2 py-0.5 rounded text-xs font-medium uppercase", priceColors[cafe.price_category])}>
                        {cafe.price_category}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon icon="lucide:map-pin" className="w-3 h-3" /> {cafe.address.split(' ').slice(0, 3).join(' ')}...
                    </span>
                </div>

                <div className="pt-2 flex gap-3 text-gray-400">
                    {cafe.facilities && cafe.facilities.slice(0, 4).map((fac, i) => (
                        <div key={i} title={fac} className="bg-gray-50 p-1.5 rounded-full">
                            {fac === 'WiFi' && <Icon icon="lucide:wifi" />}
                            {fac === 'AC' && <Icon icon="lucide:snowflake" />}
                            {fac === 'Power outlet' && <Icon icon="lucide:plug" />}
                            {(fac !== 'WiFi' && fac !== 'AC' && fac !== 'Power outlet') && <Icon icon="lucide:check" />}
                        </div>
                    ))}
                    {cafe.facilities && cafe.facilities.length > 4 && (
                        <span className="text-xs self-center">+{cafe.facilities.length - 4}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
