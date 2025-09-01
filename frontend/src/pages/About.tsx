import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Heart, BookOpen, GraduationCap, Globe, Mail } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="animate-fade-in bg-gray-50 min-h-screen">
        {/* الهيرو */}
        <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              مجتمع متماسك من الطلاب والعائلات السورية في أيدن، نعمل معًا لبناء مستقبل أفضل
            </p>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
            <Card className="border-syria-green-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-syria-green-100 p-3 rounded-full">
                    <Users className="h-8 w-8 text-syria-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-syria-green-700">من نحن</h2>
                </div>

                <div className="space-y-4 text-right">
                  <p className="text-gray-700 leading-relaxed">
                    نحن مجتمع من الطلاب والعائلات السورية المقيمين في مدينة أيدن التركية.
                    تأسست مجموعتنا بهدف بناء جسور التواصل بين أفراد الجالية السورية وتقديم الدعم المتبادل.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    نعمل على تنظيم الفعاليات والأنشطة الثقافية والاجتماعية والتعليمية التي
                    تساهم في تعزيز الروابط بين أفراد المجتمع والحفاظ على الهوية الثقافية
                    مع الاندماج الإيجابي في المجتمع المضيف.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    يشرف على المجموعة فريق من المتطوعين الملتزمين بخدمة المجتمع وتلبية احتياجاته المختلفة.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-syria-green-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-syria-green-100 p-3 rounded-full">
                    <Target className="h-8 w-8 text-syria-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-syria-green-700">إلى ماذا نسعى</h2>
                </div>

                <div className="space-y-4 text-right">
                  <p className="text-gray-700 leading-relaxed">
                    نسعى إلى بناء مجتمع سوري متماسك في أيدن، يدعم أفراده بعضهم البعض
                    ويسهم في تقديم صورة إيجابية عن السوريين.
                  </p>

                  <p className="text-syria-green-700 font-semibold pt-2">من أهدافنا الأساسية:</p>

                  <ul className="space-y-3 text-gray-700 list-none pr-5">
                    <li className="flex gap-3 items-start">
                      <GraduationCap className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>تقديم الدعم للطلاب الجدد والمساعدة في تسهيل اندماجهم في الحياة الجامعية والمجتمعية</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <Heart className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>تنظيم أنشطة ثقافية واجتماعية تعزز الروابط بين أفراد المجتمع</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <BookOpen className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>تقديم المشورة والمساعدة في المسائل التعليمية والحياتية</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <Globe className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span >إنشاء منصة للتواصل وتبادل الخبرات والموارد</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <Users className="h-5 w-5 text-syria-green-600 mt-1 flex-shrink-0" />
                      <span>التعاون مع المؤسسات التركية المحلية والمنظمات المجتمعية الأخرى</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ميزات المجتمع */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center border-syria-green-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="bg-syria-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-syria-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-syria-green-700 mb-2">مجتمع متماسك</h3>
                <p className="text-gray-600">نعمل على توحيد الجالية السورية في أيدن</p>
              </CardContent>
            </Card>

            <Card className="text-center border-syria-green-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="bg-syria-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-syria-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-syria-green-700 mb-2">دعم الطلاب</h3>
                <p className="text-gray-600">نساعد الطلاب الجدد على الاندماج الأكاديمي والاجتماعي</p>
              </CardContent>
            </Card>

            <Card className="text-center border-syria-green-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="bg-syria-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-syria-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-syria-green-700 mb-2">أنشطة مجتمعية</h3>
                <p className="text-gray-600">ننظم فعاليات ثقافية وترفيهية وتعليمية</p>
              </CardContent>
            </Card>
          </div>

          {/* قسم دعوة للانضمام
          <Card className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 text-center border-0 shadow-md">
            <CardContent className="py-10 px-6">
              <h2 className="text-3xl font-bold text-white mb-4">انضم إلى مجتمعنا</h2>
              <p className="text-white text-lg mb-6 max-w-2xl mx-auto">
                سواء كنت طالباً أو عائلة مقيمة في أيدن، نحن هنا لندعمك ونساعدك على الاندماج في المجتمع
              </p>
              <button className="bg-white text-syria-green-600 font-semibold px-8 py-3 rounded-lg hover:bg-syria-green-50 transition-colors flex items-center justify-center mx-auto">
                <Mail className="ml-2 h-5 w-5" />
                تواصل معنا
              </button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </Layout>
  );
};

export default About;