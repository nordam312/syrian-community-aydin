
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <Layout>
      <div className="bg-syria-green-50 py-12">
        <div className="page-container">
          <h1 className="text-4xl font-bold text-syria-green-700 text-center mb-8">About Us</h1>
        </div>
      </div>
      
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <Card className="border-syria-green-100">
            <CardContent className="pt-6">
              <h2 className="section-subtitle mb-6 arabic">من نحن</h2>
              <div className="space-y-4 arabic text-right">
                <p className="text-gray-700">
                  نحن مجتمع من الطلاب والعائلات السورية المقيمين في مدينة أيدن التركية. تأسست مجموعتنا بهدف بناء جسور التواصل بين أفراد الجالية السورية وتقديم الدعم المتبادل.
                </p>
                <p className="text-gray-700">
                  نعمل على تنظيم الفعاليات والأنشطة الثقافية والاجتماعية والتعليمية التي تساهم في تعزيز الروابط بين أفراد المجتمع والحفاظ على الهوية الثقافية مع الاندماج الإيجابي في المجتمع المضيف.
                </p>
                <p className="text-gray-700">
                  يشرف على المجموعة فريق من المتطوعين الملتزمين بخدمة المجتمع وتلبية احتياجاته المختلفة.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-syria-green-100">
            <CardContent className="pt-6">
              <h2 className="section-subtitle mb-6 arabic">إلى ماذا نسعى</h2>
              <div className="space-y-4 arabic text-right">
                <p className="text-gray-700">
                  نسعى إلى بناء مجتمع سوري متماسك في أيدن، يدعم أفراده بعضهم البعض ويسهم في تقديم صورة إيجابية عن السوريين.
                </p>
                <p className="text-gray-700">
                  من أهدافنا الأساسية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>تقديم الدعم للطلاب الجدد والمساعدة في تسهيل اندماجهم في الحياة الجامعية والمجتمعية</li>
                  <li>تنظيم أنشطة ثقافية واجتماعية تعزز الروابط بين أفراد المجتمع</li>
                  <li>تقديم المشورة والمساعدة في المسائل التعليمية والحياتية</li>
                  <li>إنشاء منصة للتواصل وتبادل الخبرات والموارد</li>
                  <li>التعاون مع المؤسسات التركية المحلية والمنظمات المجتمعية الأخرى</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-syria-green-600 mb-4">Join Our Community</h3>
          <p className="max-w-2xl mx-auto text-gray-700 mb-6">
            Whether you are a student, a family, or an individual living in Aydın, we welcome you to join our community.
            Together, we can create a supportive network that enriches our lives and helps us thrive in our new home.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
