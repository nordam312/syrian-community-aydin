<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Faq;

class FAQSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'كيف يمكنني الانضمام إلى المجتمع السوري في أيدن؟',
                'answer' => 'يمكنك الانضمام إلى المجتمع عن طريق التسجيل في الموقع وحضور الفعاليات والأنشطة التي ننظمها. تواصل معنا عبر صفحة التواصل للحصول على مزيد من المعلومات.',
                'category' => 'general',
                'order' => 1
            ],
            [
                'question' => 'ما هي الخدمات التي يقدمها المجتمع؟',
                'answer' => 'نقدم العديد من الخدمات including الدعم التعليمي، المساعدة في الإجراءات القانونية، الأنشطة الاجتماعية، الفعاليات الثقافية، والدعم النفسي والاجتماعي.',
                'category' => 'services',
                'order' => 2
            ],
            // ... إضافة المزيد من الأسئلة
        ];

        foreach ($faqs as $faq) {
            FAQ::create($faq);
        }
    }
}
