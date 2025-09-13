<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TestUsersSeeder extends Seeder
{
    public function run()
    {
        $firstNames = [
            'أحمد', 'محمد', 'علي', 'حسن', 'خالد',
            'عمر', 'سامي', 'وليد', 'ياسر', 'طارق',
            'فاطمة', 'عائشة', 'زينب', 'مريم', 'سارة',
            'نور', 'هدى', 'رنا', 'لينا', 'دانا'
        ];

        $lastNames = [
            'الأحمد', 'الحسن', 'الخطيب', 'العلي', 'الشامي',
            'المصري', 'الحلبي', 'الدمشقي', 'الحموي', 'اللاذقاني'
        ];

        $majors = [
            'هندسة البرمجيات',
            'هندسة الحاسوب',
            'الطب البشري',
            'طب الأسنان',
            'الصيدلة',
            'إدارة الأعمال',
            'المحاسبة',
            'الحقوق',
            'الهندسة المدنية',
            'الهندسة المعمارية'
        ];

        $academicYears = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة'];

        $users = [];

        for ($i = 1; $i <= 20; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $year = rand(2020, 2024);
            $number = str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT);

            $users[] = [
                'name' => $firstName . ' ' . $lastName,
                'email' => 'test' . $i . '@student.aydin.edu.tr',
                'password' => Hash::make('password123'),
                'student_id' => 'B' . $year . '.' . $number,
                'phone' => '05' . rand(300000000, 599999999),
                'major' => $majors[array_rand($majors)],
                'academic_year' => $academicYears[array_rand($academicYears)],
                'role' => 'user',
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now()->subDays(rand(1, 365)),
                'updated_at' => Carbon::now()
            ];
        }

        // إضافة المستخدمين إلى قاعدة البيانات
        foreach ($users as $user) {
            // التحقق من عدم وجود المستخدم مسبقاً
            if (!User::where('email', $user['email'])->exists()) {
                User::create($user);
                echo "تم إضافة المستخدم: " . $user['name'] . " - " . $user['student_id'] . "\n";
            }
        }

        echo "\n✅ تم إضافة 20 مستخدم تجريبي بنجاح!\n";
        echo "كلمة المرور لجميع المستخدمين: password123\n";
        echo "البريد الإلكتروني: test1@student.aydin.edu.tr إلى test20@student.aydin.edu.tr\n";
    }
}