import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CsrfService from '@/hooks/Csrf';
import { API_URL } from '@/config';
import { useToast } from '../ui/use-toast';
import { TabsContent } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  MessageCircle, CheckCircle, XCircle, Loader2,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

import { Button } from '../ui/button';


type UserQuestion = {
  id: number;
  question: string;
  answer?: string;
  status: 'pending' | 'answered' | 'rejected';
  likes: number;
  dislikes: number;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
};

const QuestionManager = () => {
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<UserQuestion | null>(null);
  const [answerText, setAnswerText] = useState('');
  const { toast } = useToast();


  const fetchUserQuestions = useCallback(async () => {
    try {
      setLoadingQuestions(true);
      const response = await axios.get(`${API_URL}/admin/user-questions`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });
      setUserQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'خطأ في جلب الأسئلة',
        description: error.response?.data?.message || 'حدث خطأ أثناء جلب الأسئلة',
        variant: 'destructive',
      });
    } finally {
      setLoadingQuestions(false);
    }
  }, [toast]);

  // أضف هذه الدالة للرد على السؤال
  const handleAnswerQuestion = async (questionId: number, answer: string, isPublic: boolean = true) => {
    try {
      const response = await CsrfService.withCsrf(async (csrfToken) => {
        return await axios.post(
          `${API_URL}/admin/user-questions/${questionId}/answer`,
          {
            answer,
            is_public: isPublic,
          },
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );
      });

      // تحديث القائمة
      setUserQuestions(prev =>
        prev.map(q => q.id === questionId ? response.data : q)
      );

      setSelectedQuestion(null);
      setAnswerText('');

      toast({
        title: 'تم الرد على السؤال',
        description: 'تم إرسال الرد بنجاح',
      });
    } catch (error) {
      console.error('Error answering question:', error);
      toast({
        title: 'خطأ في الرد على السؤال',
        description: error.response?.data?.message || 'حدث خطأ أثناء الرد',
        variant: 'destructive',
      });
    }
  };
  const handleDeleteQuestion = async (id: number) => {
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.delete(`${API_URL}/admin/user-questions/${id}`, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            Accept: 'application/json',
          }
        });
      });

      // تحديث القائمة بعد الحذف
      setUserQuestions(prev => prev.filter(q => q.id !== id));

      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف السؤال بنجاح',
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: 'خطأ في حذف السؤال',
        description: error.response?.data?.message || 'حدث خطأ أثناء الحذف',
        variant: 'destructive',
      });
    }
  }
  // أضف هذا الـ useEffect لجلب الأسئلة عند فتح التبويب
  useEffect(() => {
      fetchUserQuestions();
    
  }, [fetchUserQuestions]);

  return(
    <>
      <TabsContent value="questions" className="space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              إدارة الأسئلة
            </CardTitle>
            <CardDescription>
              استقبال الأسئلة والرد عليها من أعضاء المجتمع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingQuestions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-syria-green-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {userQuestions.map((question) => (
                    <Card key={question.id} className="border-syria-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-syria-green-700 mb-2">
                              {question.question}
                            </h3>
                            {question.user && (
                              <p className="text-sm text-gray-600 mb-2">
                                :من <br/>{question.user.name} ({question.user.email})
                              </p>
                            )}
                            {question.answer && (
                              <div className="bg-syria-green-50 p-3 rounded-lg mt-2">
                                <p className="text-sm font-medium text-syria-green-700">
                                  الإجابة:
                                </p>
                                <p className="text-gray-700">{question.answer}</p>
                              </div>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(question.created_at).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {question.status === 'pending' && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                قيد المراجعة
                              </span>
                            )}
                            {question.status === 'answered' && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                تم الرد
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <ThumbsUp className="h-4 w-4" />
                              {question.likes}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <ThumbsDown className="h-4 w-4" />
                              {question.dislikes}
                            </div>
                          </div>

                          {question.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedQuestion(question);
                                  setAnswerText('');
                                }}
                                className="bg-syria-green-500 hover:bg-syria-green-600"
                              >
                                <CheckCircle className="h-4 w-4 ml-1" />
                                الرد
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={()=>{handleDeleteQuestion(question.id)}}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 ml-1" />
                                رفض
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* // أضف modal للرد على الأسئلة */}
      <Dialog open={!!selectedQuestion} onOpenChange={(open) => !open && setSelectedQuestion(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle>الرد على السؤال</DialogTitle>
            <DialogDescription>
              اكتب ردك على سؤال العضو
            </DialogDescription>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-syria-green-700">السؤال:</p>
                <p className="text-gray-700">{selectedQuestion.question}</p>
              </div>

              <div>
                <Label htmlFor="answer">الإجابة</Label>
                <Textarea
                  id="answer"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="اكتب إجابتك هنا..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  defaultChecked={true}
                  className="rounded border-gray-300 text-syria-green-600 focus:ring-syria-green-500"
                />
                <Label htmlFor="isPublic" className="text-sm">
                  جعل السؤال والإجابة عامة للجميع
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedQuestion(null)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => handleAnswerQuestion(selectedQuestion.id, answerText, true)}
                  disabled={!answerText.trim()}
                  className="bg-syria-green-500 hover:bg-syria-green-600"
                >
                  <CheckCircle className="h-4 w-4 ml-1" />
                  إرسال الرد
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )

}
export default QuestionManager