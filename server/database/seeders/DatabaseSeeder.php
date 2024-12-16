<?php

namespace Database\Seeders;

use App\Models\Link;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => '12345678',
        ]);

        User::factory(100)->create();
        Link::factory(1000)->create();
    }
}
