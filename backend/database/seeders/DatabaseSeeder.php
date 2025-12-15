<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Campus;
use App\Models\Cafe;
use App\Models\CafeImage;
use App\Models\CafeMenuItem; // Added import
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Campuses
        $unila = Campus::create([
            'name' => 'Universitas Lampung (UNILA)',
            'slug' => 'unila',
            'image' => '/assets/images/campuses/unila.jpg'
        ]);

        $itera = Campus::create([
            'name' => 'Institut Teknologi Sumatera (ITERA)',
            'slug' => 'itera',
            'image' => '/assets/images/campuses/itera.jpg'
        ]);

        // Users
        User::create([
            'name' => 'Admin Ngopi',
            'email' => 'admin@ngopibareng.id',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        $users = [];
        $users[] = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'user'
        ]);

        $users[] = User::create([
            'name' => 'Siti Aminah',
            'email' => 'siti@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'user'
        ]);

        $cafeNames = [
            'Kopi Janji Jiwa',
            'Excelso',
            'Starbucks',
            'Kopi Kenangan',
            'El\'s Coffee',
            'Dr Coffee',
            'Warung Kopi Asiang',
            'Kopi Oey',
            'Yellow Truck',
            'Djournal Coffee',
            'Anomali Coffee',
            'Tanamera',
            'Giyanti',
            'Filosofi Kopi',
            'Klinik Kopi'
        ];

        // Create 10 cafes for UNILA
        $this->createCafes($unila, $users, array_slice($cafeNames, 0, 10));

        // Create 10 cafes for ITERA
        $this->createCafes($itera, $users, array_slice($cafeNames, 5, 10)); // Reuse some names or mixed
    }

    private function createCafes($campus, $users, $names)
    {
        $facilitiesList = ['WiFi', 'AC', 'Power outlet', 'Outdoor area', 'Smoking area'];
        $prices = ['murah', 'sedang', 'mahal'];

        foreach ($names as $index => $name) {
            $owner = $users[array_rand($users)];

            $cafe = Cafe::create([
                'user_id' => $owner->id,
                'name' => $name . ' ' . $campus->slug, // Differentiate
                'description' => 'Tempat ngopi asik buat mahasiswa ' . $campus->name . '. Nyaman buat nugas dan nongkrong.',
                'address' => 'Jalan ' . $campus->slug . ' No. ' . ($index + 1),
                'price_category' => $prices[array_rand($prices)],
                'facilities' => array_rand(array_flip($facilitiesList), 3),
                'rating' => 0,
                'status' => 'approved',
            ]);

            $cafe->campuses()->attach($campus->id);

            // Images
            for ($i = 1; $i <= 3; $i++) {
                CafeImage::create([
                    'cafe_id' => $cafe->id,
                    'image_path' => '/storage/cafes/cafe' . $i . '.jpg', // Using same images for simplicity
                ]);
            }

            // Seed Menu Items
            $menuItems = [
                ['name' => 'Kopi Susu Gula Aren', 'price' => 18000, 'category' => 'Drink'],
                ['name' => 'Cappuccino', 'price' => 22000, 'category' => 'Drink'],
                ['name' => 'Nasi Goreng Spesial', 'price' => 25000, 'category' => 'Food'],
                ['name' => 'French Fries', 'price' => 15000, 'category' => 'Snack'],
                ['name' => 'Roti Bakar', 'price' => 12000, 'category' => 'Snack'],
            ];

            foreach ($menuItems as $item) {
                CafeMenuItem::create(array_merge($item, ['cafe_id' => $cafe->id]));
            }

            // Reviews
            foreach ($users as $user) {
                if (rand(0, 1)) {
                    $rating = rand(3, 5);
                    Review::create([
                        'user_id' => $user->id,
                        'cafe_id' => $cafe->id,
                        'rating' => $rating,
                        'comment' => 'Kopi mantap, suasana enak!',
                    ]);
                }
            }

            // Update rating
            $avg = $cafe->reviews()->avg('rating');
            $cafe->update(['rating' => $avg ?: 0]);
        }
    }
}
