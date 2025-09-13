import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CsrfService from '@/hooks/Csrf';
import { API_URL, STORAGE_URL } from '@/config';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Vote, Crown, Users, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Election {
  id: number;
  name: string;
  description: string;
  status: string;
  image: string | null;
  start_date: string;
  end_date: string;
  candidates_count: number;
}

interface Candidate {
  id: number;
  display_name: string;
  position: string;
  bio: string;
  platform: string;
  image: string | null;
  votes_count?: number;
}

interface VoteRequest {
  candidate_id: number;
}

export default function ElectionsPage() {
  const { toast } = useToast();
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);

  // جلب الانتخابات النشطة
  const fetchActiveElections = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Election[]>(`${API_URL}/elections`, {
        withCredentials: true,
        headers: { Accept: 'application/json' },
      });
      const activeElections = response.data.filter(
        (election) => election.status === 'active'
      );
      setActiveElections(activeElections);

      if (activeElections.length > 0) {
        setSelectedElection(activeElections[0]);
      }
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast({
        title: 'خطأ في تحميل الانتخابات',
        description: 'حدث خطأ أثناء جلب بيانات الانتخابات',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // جلب المرشحين للانتخاب المحدد
  const fetchCandidates = useCallback(async (electionId: number) => {
    try {
      setIsLoadingCandidates(true);

      const response = await axios.get<Candidate[]>(
        `${API_URL}/elections/${electionId}/candidates`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: 'خطأ في تحميل المرشحين',
        description: 'حدث خطأ أثناء جلب بيانات المرشحين',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCandidates(false);
    }
  }, [toast]);

  // التصويت لمرشح
  const handleVote = async () => {
    if (!selectedCandidate || !selectedElection) return;

    try {
      setIsSubmitting(true);

      const voteData: VoteRequest = {
        candidate_id: selectedCandidate
      };

      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(
          `${API_URL}/elections/${selectedElection.id}/vote`,
          voteData,
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      });

      // رسائل عشوائية جميلة ومعبرة للتصويت
      const voteMessages = [
        { title: 'صوتك وصل! 🗳️', subtitle: 'شكراً لمشاركتك في صنع القرار' },
        { title: 'تم تسجيل صوتك بنجاح! ✅', subtitle: 'كل صوت يُحدث فرقاً' },
        { title: 'صوتك أمانة.. وقد أديتها! 🌟', subtitle: 'فخورون بمشاركتك الديمقراطية' },
        { title: 'شكراً لمساهمتك! 🎯', subtitle: 'معاً نبني مستقبل مجتمعنا' },
        { title: 'صوتك يعني الكثير! 💚', subtitle: 'أنت جزء من التغيير الإيجابي' }
      ];

      const randomVoteMessage = voteMessages[Math.floor(Math.random() * voteMessages.length)];

      // الحصول على اسم المرشح
      const votedCandidate = candidates.find(c => c.id === selectedCandidate);

      toast({
        description: (
          <div className="text-center">
            <span className="text-syria-green-600 font-bold animate-pulse"
              style={{
                textShadow: '0 0 10px rgba(72, 187, 120, 0.5), 0 0 20px rgba(72, 187, 120, 0.3)',
                display: 'inline-block'
              }}>
              {randomVoteMessage.title}
            </span>
            <br />
            <span className="text-gray-600 text-sm">{randomVoteMessage.subtitle}</span>
          </div>
        ),
        duration: 4000,
        className: 'bg-white',
      });

      fetchCandidates(selectedElection.id);
      setSelectedCandidate(null);

    } catch (error) {
      console.error('Error voting:', error);
      const errorMessage = error.response?.data?.error || 'حدث خطأ أثناء التصويت';

      // رسالة خاصة للطلاب غير السوريين
      if (error.response?.status === 403) {
        toast({
          description: (
            <div className="text-center">
              <div className="mb-2">
                <div className="bg-red-100 rounded-full p-3 inline-block">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <span className="text-red-600 font-bold text-lg block mb-2">
                عذراً، لا يمكنك التصويت
              </span>
              <span className="text-gray-700 text-sm block">
                {errorMessage}
              </span>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  للاستفسار، يرجى التواصل مع إدارة المجتمع السوري
                </p>
              </div>
            </div>
          ),
          duration: 6000,
          className: 'bg-white border-2 border-red-200',
        });
      } else {
        toast({
          title: 'خطأ في التصويت',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchActiveElections();
  }, [fetchActiveElections]);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection.id);
    }
  }, [selectedElection, fetchCandidates]);

  const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes_count || 0), 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} الساعة ${hours}:${minutes}`;
  };

  const toggleCandidateExpansion = (candidateId: number) => {
    if (expandedCandidate === candidateId) {
      setExpandedCandidate(null);
    } else {
      setExpandedCandidate(candidateId);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-page-enter min-h-screen bg-gray-50">
          <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-4xl font-bold mb-4">الانتخابات النشطة</h1>
              <p className="text-xl">جاري تحميل بيانات الانتخابات...</p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (activeElections.length === 0) {
    return (
      <Layout>
        <div className="animate-page-enter min-h-screen bg-gray-50">
          <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-4xl font-bold mb-4">الانتخابات النشطة</h1>
              <p className="text-xl">شارك في صنع القرار واختر من يمثلك</p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <Crown className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              لا توجد انتخابات نشطة حالياً
            </h2>
            <p className="text-gray-500">
              لا توجد أي انتخابات جارية في الوقت الحالي. يرجى التحقق لاحقاً.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-page-enter min-h-screen bg-gray-50">
        {/* الهيدر */}
        <div className="bg-gradient-to-r from-syria-green-400 to-syria-green-500 py-16 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">
              <Vote className="inline-block ml-2 h-8 w-8" />
              الانتخابات النشطة
            </h1>
            <p className="text-xl">
              شارك في صنع القرار واختر من يمثلك في مجتمعنا السوري في أيدن
            </p>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* اختيار الانتخاب */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-syria-green-700 mb-4 text-right">
              اختر الانتخاب للمشاركة:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeElections.map((election) => (
                <Card
                  key={election.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border-syria-green-200 shadow-sm",
                    selectedElection?.id === election.id
                      ? 'ring-2 ring-syria-green-500 border-syria-green-300 bg-syria-green-50'
                      : 'hover:shadow-md'
                  )}
                  onClick={() => setSelectedElection(election)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-syria-green-800 mb-2 text-right">
                      {election.name}
                    </h3>
                    <p className="text-sm text-syria-green-600 mb-3 line-clamp-2 text-right">
                      {election.description}
                    </p>
                    <div className="flex items-center text-xs text-syria-green-500 justify-end">
                      <Calendar className="h-3 w-3 ml-1" />
                      <span>ينتهي في: {formatDate(election.end_date)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedElection && (
            <>
              {/* تفاصيل الانتخاب المحدد */}
              <Card className="mb-8 border-syria-green-200 bg-gradient-to-br from-syria-green-50 to-syria-green-100">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="text-right">
                      <h2 className="text-2xl font-bold text-syria-green-800 mb-2">
                        {selectedElection.name}
                      </h2>
                      <p className="text-syria-green-600 mb-2">
                        {selectedElection.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-syria-green-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 ml-1" />
                          يبدأ: {formatDate(selectedElection.start_date)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 ml-1" />
                          ينتهي: {formatDate(selectedElection.end_date)}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 ml-1" />
                          {selectedElection.candidates_count} مرشح
                        </span>
                      </div>
                    </div>
                    {selectedElection.image && (
                      <img
                        src={`${STORAGE_URL}/${selectedElection.image}`}
                        alt={selectedElection.name}
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* مؤشر التقدم */}
              {isSubmitting && (
                <Card className="mb-6 border-syria-green-200 bg-syria-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-syria-green-700 font-medium">جاري معالجة تصويتك...</span>
                      <Loader2 className="h-4 w-4 text-syria-green-600 animate-spin" />
                    </div>
                    <Progress value={100} className="h-2 bg-syria-green-200">
                      <div className="h-full bg-syria-green-500 transition-all duration-1000 ease-in-out animate-pulse"></div>
                    </Progress>
                  </CardContent>
                </Card>
              )}

              {/* قائمة المرشحين */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-syria-green-700 mb-6 text-right">
                  المرشحين
                </h2>

                {isLoadingCandidates ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="border-syria-green-200">
                        <CardContent className="p-6">
                          <Skeleton className="h-48 w-full rounded-lg mb-4" />
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3 mb-4" />
                          <Skeleton className="h-10 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : candidates.length === 0 ? (
                  <Card className="text-center border-syria-green-200 bg-syria-green-50">
                    <CardContent className="py-12">
                      <Users className="mx-auto h-12 w-12 text-syria-green-400 mb-4" />
                      <p className="text-syria-green-600">لا يوجد مرشحين في هذه الانتخابات بعد</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                      {candidates.map((candidate) => (
                        <Card
                          key={candidate.id}
                          className={cn(
                            "relative overflow-hidden transition-all duration-300 h-full flex flex-col border-syria-green-200 shadow-sm",
                            selectedCandidate === candidate.id
                              ? 'ring-2 ring-syria-green-500 shadow-lg border-syria-green-300'
                              : 'hover:shadow-md'
                          )}
                        >
                          {selectedCandidate === candidate.id && (
                            <CheckCircle className="absolute top-3 right-3 h-6 w-6 text-syria-green-600 z-10" />
                          )}

                          <div className="relative h-64 overflow-hidden">
                            {candidate.image ? (
                              <img
                                src={`${STORAGE_URL}/${candidate.image}`}
                                alt={candidate.display_name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-syria-green-100 to-syria-green-200 flex items-center justify-center">
                                <Users className="h-20 w-20 text-syria-green-400" />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <h3 className="font-semibold text-white text-xl text-right">
                                {candidate.display_name}
                              </h3>
                              <p className="text-syria-green-200 text-sm mt-1 text-right">
                                {candidate.position}
                              </p>
                            </div>
                          </div>

                          <CardContent className="p-5 flex-grow flex flex-col">
                            <div className="mb-4">
                              <h4 className="font-medium text-syria-green-700 mb-2 text-right">نبذة عن المرشح:</h4>
                              <p className="text-sm text-gray-600 leading-relaxed text-right">
                                {candidate.bio}
                              </p>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-medium text-syria-green-700 mb-2 text-right">المنصة الانتخابية:</h4>
                              <p className="text-sm text-gray-600 leading-relaxed text-right">
                                {candidate.platform}
                              </p>
                            </div>

                            {candidate.votes_count !== undefined && totalVotes > 0 && (
                              <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>النسبة المئوية</span>
                                  <span className="font-semibold text-syria-green-700">
                                    {((candidate.votes_count / totalVotes) * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <Progress
                                  value={(candidate.votes_count / totalVotes) * 100}
                                  className="h-2 bg-gray-200"
                                />
                                <div className="text-xs text-center text-gray-500">
                                  {candidate.votes_count} صوت
                                </div>
                              </div>
                            )}

                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCandidate(candidate.id);
                              }}
                              className={cn(
                                "mt-4 w-full",
                                selectedCandidate === candidate.id
                                  ? "bg-syria-green-600 hover:bg-syria-green-700"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              )}
                            >
                              {selectedCandidate === candidate.id ? (
                                <>
                                  <CheckCircle className="ml-2 h-5 w-5" />
                                  مختار
                                </>
                              ) : (
                                "اختر هذا المرشح"
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {totalVotes > 0 && (
                      <Card className="mb-6 border-syria-green-200 bg-syria-green-50">
                        <CardContent className="p-4 text-center">
                          <p className="text-lg text-syria-green-700">
                            إجمالي الأصوات: <span className="font-bold">{totalVotes}</span>
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <div className="text-center">
                      {/* رسالة تحذيرية قبل التصويت */}
                      {selectedCandidate && !isSubmitting && (
                        <div className="mb-6 mx-auto max-w-md animate-fade-in">
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start space-x-3 space-x-reverse">
                              <div className="flex-shrink-0">
                                <div className="bg-amber-100 rounded-full p-2">
                                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1 text-right">
                                <h3 className="text-sm font-bold text-amber-800 mb-1">
                                  ⚠️ ملاحظة مهمة قبل التصويت
                                </h3>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                  <span className="font-semibold">التصويت نهائي ولا يمكن التراجع عنه!</span>
                                  <br />
                                  تأكد من اختيارك جيداً، فبمجرد تأكيد التصويت لن تتمكن من تغيير قرارك أو التصويت مرة أخرى في هذه الانتخابات.
                                </p>
                                <div className="mt-2 pt-2 border-t border-amber-200">
                                  <p className="text-xs text-amber-600 font-medium">
                                    💡 نصيحة: راجع برنامج المرشح ورؤيته قبل اتخاذ القرار النهائي
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        size="lg"
                        onClick={handleVote}
                        disabled={!selectedCandidate || isSubmitting}
                        className="bg-gradient-to-r from-syria-green-500 to-syria-green-600 hover:from-syria-green-600 hover:to-syria-green-700 text-white shadow-md px-8 py-4 text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                            جاري التصويت...
                          </>
                        ) : (
                          <>
                            <Vote className="ml-2 h-5 w-5" />
                            تأكيد التصويت
                          </>
                        )}
                      </Button>

                      {selectedCandidate && (
                        <p className="text-sm text-syria-green-600 mt-3">
                          لقد اخترت التصويت لـ{' '}
                          <span className="font-semibold">
                            {candidates.find(c => c.id === selectedCandidate)?.display_name}
                          </span>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}