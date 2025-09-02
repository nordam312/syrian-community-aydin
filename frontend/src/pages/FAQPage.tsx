import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Send, MessageCircle, HelpCircle, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  student_id: string;
  major: string;
}

interface UserQuestion {
  id: number;
  user_id: number;
  question: string;
  answer?: string;
  status: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [allFaqs, setAllFaqs] = useState<FAQItem[]>([]);
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [questionSearch, setQuestionSearch] = useState('');

  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // جلب الأسئلة الشائعة
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/faqs`);
        setAllFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        toast({
          title: 'خطأ في تحميل الأسئلة',
          description: 'حدث خطأ أثناء جلب البيانات',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // جلب أسئلة المستخدمين
  const fetchUserQuestions = useCallback(async () => {
    try {
      setLoadingQuestions(true);
      const response = await axios.get(`${API_URL}/user-questions`);
      setUserQuestions(response.data);
    } catch (error) {
      console.error('Error fetching user questions:', error);
      toast({
        title: 'خطأ في جلب الأسئلة',
        description: 'حدث خطأ أثناء تحميل أسئلة المستخدمين',
        variant: 'destructive',
      });
    } finally {
      setLoadingQuestions(false);
    }
  }, [toast]);

  // جلب أسئلة المستخدمين عند تحميل الصفحة
  useEffect(() => {
    fetchUserQuestions();
  }, [fetchUserQuestions]);

  const categories = [
    { id: 'all', name: 'جميع الفئات' },
    { id: 'general', name: 'عام' },
    { id: 'services', name: 'خدمات' },
    { id: 'fees', name: 'رسوم' },
    { id: 'volunteering', name: 'تطوع' }
  ];

  // تصفية الأسئلة الشائعة
  const filteredFaqs = allFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // تصفية أسئلة المستخدمين
  const filteredUserQuestions = userQuestions.filter(question =>
    question.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
    (question.answer && question.answer.toLowerCase().includes(questionSearch.toLowerCase()))
  );

  // حساب Pagination يدوياً
  const totalPages = Math.ceil(filteredUserQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = filteredUserQuestions.slice(startIndex, endIndex);

  // تغيير الصفحة
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // إرسال سؤال جديد
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    if (!isAuthenticated) {
      toast({
        title: 'يجب تسجيل الدخول',
        description: 'يجب تسجيل الدخول لإرسال الأسئلة',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/user-questions`, {
        question: newQuestion,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // إعادة جلب الأسئلة من الخادم
      await fetchUserQuestions();
      setCurrentPage(1); // العودة للصفحة الأولى بعد إضافة سؤال جديد

      toast({
        title: 'تم إرسال سؤالك',
        description: 'شكراً لك، سيتم الرد على سؤالك في أقرب وقت ممكن.',
      });

      setNewQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء إرسال سؤالك',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));//6
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);//10

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={currentPage === i
            ? "bg-syria-green-500 text-white"
            : "border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50"
          }
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* الهيدر */}
        <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <HelpCircle className="mx-auto h-12 w-12 mb-4" />
            <h1 className="text-4xl font-bold mb-4">الأسئلة الشائعة</h1>
            <p className="text-xl">جد إجابات لأسئلتك أو اطرح سؤالك الخاص</p>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* شريط البحث والتصفية */}
          <Card className="mb-8 border-syria-green-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ابحث في الأسئلة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 text-right border-syria-green-200 focus:border-syria-green-400"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-syria-green-200 rounded-md bg-white text-syria-green-700 focus:border-syria-green-400 focus:ring-syria-green-400"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* الأسئلة الشائعة */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-syria-green-700 mb-6 text-right">
              الأسئلة الشائعة
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-syria-green-500" />
              </div>
            ) : filteredFaqs.length === 0 ? (
              <Card className="border-syria-green-200 bg-syria-green-50">
                <CardContent className="py-8 text-center">
                  <HelpCircle className="mx-auto h-12 w-12 text-syria-green-400 mb-4" />
                  <p className="text-syria-green-600">لا توجد أسئلة تطابق بحثك</p>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id.toString()} className="border-syria-green-200 rounded-lg bg-white shadow-sm">
                    <AccordionTrigger className="px-6 py-4 hover:bg-syria-green-50 hover:no-underline text-right">
                      <span className="flex-1 text-right font-medium text-syria-green-700">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed text-right">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* أسئلة المستخدمين */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-syria-green-700 text-right">
                أسئلة المجتمع
              </h2>
              <span className="text-sm text-syria-green-600">
                {filteredUserQuestions.length} سؤال
              </span>
            </div>

            {/* شريط البحث في أسئلة المجتمع */}
            <div className="relative mb-6">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="ابحث في أسئلة المجتمع..."
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                className="pr-10 text-right border-syria-green-200 focus:border-syria-green-400"
              />
            </div>

            {loadingQuestions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-syria-green-500" />
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentQuestions.map((question) => (
                    <Card key={question.id} className="border-syria-green-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            {/* معلومات المستخدم */}
                            {question.user && (
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-syria-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-syria-green-600">
                                    {question.user.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{question.user.name}</p>
                                  <p className="text-xs text-gray-500">{question.user.major}</p>
                                </div>
                              </div>
                            )}

                            {/* السؤال */}
                            <div className="bg-syria-green-50 p-4 rounded-lg mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageCircle className="h-5 w-5 text-syria-green-600" />
                                <span className="text-sm font-medium text-syria-green-700">السؤال:</span>
                              </div>
                              <h3 className="font-medium text-syria-green-800 text-right text-lg">
                                {question.question}
                              </h3>
                            </div>

                            {/* الجواب إذا موجود */}
                            {question.answer && (
                              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <HelpCircle className="h-5 w-5 text-green-600" />
                                  <span className="text-sm font-medium text-green-700">الإجابة:</span>
                                </div>
                                <p className="text-gray-800 text-right leading-relaxed">
                                  {question.answer}
                                </p>
                              </div>
                            )}

                            {/* التاريخ والحالة */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                              <p className="text-sm text-gray-500">
                                {new Date(question.created_at).toLocaleDateString('ar-EG', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>

                              {question.status === 'pending' && (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
                                  ⏳ قيد المراجعة
                                </span>
                              )}
                              {question.status === 'answered' && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                                  ✅ تم الرد
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* التقسيم إلى صفحات */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50"
                    >
                      <ChevronLeft className="h-4 w-4 ml-1" />
                      السابق
                    </Button>

                    <div className="flex items-center gap-1">
                      {renderPaginationButtons()}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-syria-green-200 text-syria-green-700 hover:bg-syria-green-50"
                    >
                      التالي
                      <ChevronRight className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* إضافة سؤال جديد */}
          {!isAuthenticated ? (
            <Card className="border-syria-green-200">
              <CardContent className="p-6 text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-syria-green-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">تسجيل الدخول مطلوب</h3>
                <p className="text-gray-600 mb-4">يجب تسجيل الدخول لإرسال الأسئلة</p>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-syria-green-500 hover:bg-syria-green-600 text-white"
                >
                  تسجيل الدخول
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-syria-green-200">
              <CardHeader>
                <CardTitle className="text-syria-green-700 text-right flex items-center">
                  <MessageCircle className="ml-2 h-5 w-5" />
                  اطرح سؤالك
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuestion}>
                  <Textarea
                    placeholder="اكتب سؤالك هنا..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="mb-4 min-h-32 text-right border-syria-green-200 focus:border-syria-green-400"
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newQuestion.trim()}
                    className="bg-gradient-to-r from-syria-green-500 to-syria-green-600 hover:from-syria-green-600 hover:to-syria-green-700 text-white w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="ml-2 h-4 w-4" />
                        إرسال السؤال
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;