import Layout from '@/components/layout/Layout';
import GpaCalculator from '@/components/gpa/GpaCalculator';

const GpaCalculatorPage = () => {
  return (
    <Layout>
      <div className="animate-page-enter">
        {/* الهيدر */}
        <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-12 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-2">
              حاسبة المعدل التراكمي (GPA)
            </h1>
            <p className="text-lg max-w-2xl mx-auto">
              احسب معدلك التراكمي بناءً على نظام الدرجات في الجامعات التركية.
              أدخل موادك، الساعات المعتمدة، والدرجات بسهولة.
            </p>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* حاسبة المعدل */}
          <GpaCalculator />

          {/* شرح طريقة الاستخدام */}
          <div className="mt-12 bg-syria-green-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-syria-green-700 mb-6 text-right">
              كيفية استخدام الحاسبة
            </h2>

            <div className="space-y-4 text-gray-700 text-right">
              <p>
                تستخدم هذه الحاسبة نظام الدرجات القياسي في الجامعات التركية
                لحساب معدلك التراكمي على مقياس 4.0.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-syria-green-600 mb-3 text-right">
                    وضع الدرجات الحرفية
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-right pr-4">
                    <li>أدخل اسم المادة (اختياري)</li>
                    <li>اختر عدد الساعات المعتمدة للمادة</li>
                    <li>اختر درجتك الحرفية (AA, BA, BB, إلخ)</li>
                    <li>أضف المزيد من المواد حسب الحاجة</li>
                    <li>انقر على "حساب المعدل" لرؤية النتيجة</li>
                  </ol>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-syria-green-600 mb-3 text-right">
                    وضع الدرجات الرقمية
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-right pr-4">
                    <li>أدخل اسم المادة (اختياري)</li>
                    <li>اختر عدد الساعات المعتمدة للمادة</li>
                    <li>أدخل درجتك الرقمية (0-100)</li>
                    <li>أضف المزيد من المواد حسب الحاجة</li>
                    <li>انقر على "حساب المعدل" لرؤية النتيجة</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* جدول الدرجات */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-syria-green-600 mb-4 text-right">
                نظام التحويل المعتمد
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-syria-green-100">
                    <tr>
                      <th className="px-4 py-2 text-syria-green-700">الدرجة الحرفية</th>
                      <th className="px-4 py-2 text-syria-green-700">المعدل</th>
                      <th className="px-4 py-2 text-syria-green-700">الدرجة الرقمية</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">AA</td>
                      <td className="px-4 py-2">4.0</td>
                      <td className="px-4 py-2">90-100</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">BA</td>
                      <td className="px-4 py-2">3.5</td>
                      <td className="px-4 py-2">85-89</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">BB</td>
                      <td className="px-4 py-2">3.0</td>
                      <td className="px-4 py-2">80-84</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">CB</td>
                      <td className="px-4 py-2">2.5</td>
                      <td className="px-4 py-2">75-79</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">CC</td>
                      <td className="px-4 py-2">2.0</td>
                      <td className="px-4 py-2">70-74</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">DC</td>
                      <td className="px-4 py-2">1.5</td>
                      <td className="px-4 py-2">65-69</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">DD</td>
                      <td className="px-4 py-2">1.0</td>
                      <td className="px-4 py-2">60-64</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">FF</td>
                      <td className="px-4 py-2">0.0</td>
                      <td className="px-4 py-2">0-59</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GpaCalculatorPage;