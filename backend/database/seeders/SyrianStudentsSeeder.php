<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SyrianStudent;
use Illuminate\Support\Facades\DB;

class SyrianStudentsSeeder extends Seeder
{
    public function run()
    {
        echo "\n========================================\n";
        echo "📋 استيراد قائمة الطلاب السوريين\n";
        echo "========================================\n\n";

        // مسح البيانات القديمة
        DB::table('syrian_students')->truncate();

        // مسار ملف CSV
        $csvFile = storage_path('syrian_students.csv');

        if (file_exists($csvFile)) {
            echo "✅ تم العثور على ملف CSV\n";
            echo "📂 المسار: {$csvFile}\n\n";

            $file = fopen($csvFile, 'r');

            // قراءة السطر الأول للتحقق من الترميز
            $firstLine = fgets($file);
            rewind($file);

            // تحديد إذا كان الملف يحتوي على BOM
            $bom = substr($firstLine, 0, 3);
            if ($bom === chr(0xEF) . chr(0xBB) . chr(0xBF)) {
                // تخطي BOM
                fseek($file, 3);
            }

            // تخطي السطر الأول (العناوين)
            fgetcsv($file);

            $count = 0;
            $errors = 0;

            echo "⏳ جاري الاستيراد...\n\n";

            while (($data = fgetcsv($file)) !== FALSE) {
                if (!empty($data[0])) {
                    try {
                        $studentId = trim($data[0]);
                        $name = isset($data[1]) ? trim($data[1]) : null;

                        // تحويل رقم الطالب إلى الصيغة الصحيحة (B كبيرة)
                        $studentId = str_replace('b', 'B', $studentId);

                        SyrianStudent::create([
                            'student_id' => $studentId,
                            'name' => $name,
                            'is_active' => true
                        ]);

                        $count++;

                        // عرض تقدم كل 100 طالب
                        if ($count % 100 == 0) {
                            echo "   ✓ تم استيراد {$count} طالب...\n";
                        }
                    } catch (\Exception $e) {
                        $errors++;
                        echo "   ⚠️ خطأ في السطر: " . implode(',', $data) . "\n";
                    }
                }
            }

            fclose($file);

            echo "\n========================================\n";
            echo "✅ اكتمل الاستيراد!\n";
            echo "📊 الإحصائيات:\n";
            echo "   • تم استيراد: {$count} طالب\n";
            if ($errors > 0) {
                echo "   • أخطاء: {$errors} سطر\n";
            }
            echo "========================================\n";

        } else {
            echo "⚠️ لم يتم العثور على ملف CSV\n\n";
            echo "📌 تعليمات الاستخدام:\n";
            echo "========================================\n";
            echo "1. قم بتصدير ملف Excel إلى CSV\n";
            echo "2. تأكد أن الملف يحتوي على عمودين:\n";
            echo "   - العمود الأول: رقم الطالب\n";
            echo "   - العمود الثاني: اسم الطالب\n";
            echo "3. احفظ الملف باسم: syrian_students.csv\n";
            echo "4. ضع الملف في المسار:\n";
            echo "   backend/storage/syrian_students.csv\n";
            echo "========================================\n\n";

            // إضافة بيانات تجريبية
            echo "📝 إضافة بيانات تجريبية للاختبار...\n";

            $testStudents = [
                ['B2021.123456', 'أحمد محمد'],
                ['B2020.234567', 'فاطمة أحمد'],
                ['B2022.345678', 'محمد علي'],
                ['B2021.456789', 'زينب حسن'],
                ['B2020.567890', 'علي أحمد']
            ];

            foreach ($testStudents as $student) {
                SyrianStudent::create([
                    'student_id' => $student[0],
                    'name' => $student[1],
                    'is_active' => true
                ]);
            }

            echo "✅ تم إضافة " . count($testStudents) . " طالب تجريبي\n";
        }
    }
}