import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CsrfService from '@/hooks/Csrf';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Award,
  User,
  X,
  Save,
  Crown,
  Vote,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { API_URL, STORAGE_URL } from '@/config';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return (
    <>
      {`${year}/${month}/${day}`} <br /> الساعة : {hours}:{minutes}
    </>
  );
}

type Candidate = {
  id: number;
  display_name: string;
  bio: string;
  platform: string;
  position: string;
  created_at: string;
  updated_at: string;
  image: File | null;
};

type CandidateForm = {
  display_name: string;
  bio: string;
  position: string;
  student_id: string;
  platform?: string;
  image: File | null;
};

type ElectionForm = {
  id?: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  candidates_count: number;
  status: string;
  image: File | null;
};

const ElectionManager = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [newElectionForm, setNewElectionForm] = useState<ElectionForm>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    candidates_count: 0,
    status: 'pending',
    image: null,
  });

  const [getElections, setGetElections] = useState<ElectionForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [formType, setFormType] = useState<
    'candidate' | 'showCandidate' | 'campaign' | null
  >(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null,
  );
  const [editingElection, setEditingElection] = useState<ElectionForm | null>(
    null,
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [candidateDeleteModalOpen, setCandidateDeleteModalOpen] = useState(false);
  const [electionIdToDelete, setElectionIdToDelete] = useState<number | null>(null);
  const [candidateIdToDelete, setCandidateIdToDelete] = useState<number | null>(null);
  const [candidateForm, setCandidateForm] = useState<CandidateForm>({
    display_name: '',
    bio: '',
    position: '',
    student_id: '',
    platform: '',
    image: null,
  });
  const [getCandidatess, setGetCandidates] = useState<Candidate[]>([]);

  const GetElections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/elections`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });
      setGetElections(response.data || []);
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في جلب بيانات الحملات الاتخابية';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast({
        title: 'خطأ في جلب البيانات',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);


  useEffect(() => {
    GetElections();
  }, [GetElections]);

  // Elections handle functions
  const handleAddElection = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newElectionForm.name);
      formData.append('description', newElectionForm.description);
      formData.append('start_date', newElectionForm.start_date);
      formData.append('end_date', newElectionForm.end_date);
      formData.append('status', newElectionForm.status);
      if (newElectionForm.image) formData.append('image', newElectionForm.image);

      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(`${API_URL}/elections/create`, formData, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'multipart/form-data',
          },
        });
      });
      toast({ title: 'تم اضافة الحملة بنجاح', variant: 'default' });
      GetElections();
      setFormType(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة الحملة';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateElection = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append('name', newElectionForm.name);
      formData.append('description', newElectionForm.description);
      formData.append('start_date', newElectionForm.start_date);
      formData.append('end_date', newElectionForm.end_date);
      formData.append('status', newElectionForm.status);
      if (newElectionForm.image) formData.append('image', newElectionForm.image);

      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(`${API_URL}/elections/${id}/update`, formData, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'multipart/form-data',
          },
        });
      });
      toast({ title: 'تم تعديل الحملة بنجاح', variant: 'default' });
      GetElections();
      setFormType(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تعديل الحملة';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCampaignFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value } = e.target;

    if (type === 'file' && 'files' in e.target) {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setNewElectionForm({ ...newElectionForm, [name]: files[0] });
      }
    } else {
      setNewElectionForm({ ...newElectionForm, [name]: value });
    }
  };

  // Candidates handle functions
  const handleAddCandidate = async () => {
    try {
      const formData = new FormData();
      formData.append('display_name', candidateForm.display_name);
      formData.append('bio', candidateForm.bio);
      formData.append('platform', candidateForm.platform || '');
      formData.append('position', candidateForm.position);
      formData.append('student_id', candidateForm.student_id);

      if (candidateForm.image) formData.append('image', candidateForm.image);

      const electionId = localStorage.getItem('electionId');
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(
          `${API_URL}/elections/${electionId}/candidates`,
          formData,
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      });
      toast({ title: 'تم اضافة مرشح بنجاح', variant: 'default' });
      setFormType(null);
      getCandidates();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة المرشح';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCandidate = async () => {
    if (!editingCandidate) return;

    try {
      const formData = new FormData();
      formData.append('display_name', candidateForm.display_name);
      formData.append('position', candidateForm.position);
      formData.append('bio', candidateForm.bio);
      formData.append('platform', candidateForm.platform || '');

      if (candidateForm.image) formData.append('image', candidateForm.image);

      const response = await CsrfService.withCsrf(async (csrfToken) => {
        return await axios.post(
          `${API_URL}/elections/candidates/${editingCandidate.id}/update`,
          formData,
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      });

      toast({
        title: 'تم تحديث المرشح بنجاح',
        variant: 'default',
        description: response.data.message
      });

      setFormType(null);
      getCandidates();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التحديث';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCandidate = async () => {
    if (!candidateIdToDelete) return;

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.delete(
          `${API_URL}/elections/candidates/${candidateIdToDelete}`,
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              Accept: 'application/json',
            },
          }
        );
      });

      toast({
        title: 'تم حذف المرشح بنجاح',
        variant: 'default'
      });

      getCandidates();
      setCandidateDeleteModalOpen(false);
      setCandidateIdToDelete(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء الحذف';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const getCandidates = async () => {
    const electionId = localStorage.getItem('electionId');
    if (!electionId) return;

    try {
      setCandidatesLoading(true);
      const response = await axios.get(
        `${API_URL}/elections/${electionId}/candidates`,
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
          },
        },
      );
      setGetCandidates(response.data || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ في جلب المرشحين';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleCandidateFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value } = e.target;

    if (type === 'file' && 'files' in e.target) {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setCandidateForm({ ...candidateForm, [name]: files[0] });
      }
    } else {
      setCandidateForm({ ...candidateForm, [name]: value });
    }
  };

const openEditAddFormCampaign = (campaign: ElectionForm | null) => {
  if (campaign) {
    setEditingElection(campaign);
    
    // تحويل التواريخ من تنسيق API إلى تنسيق datetime-local
    const startDate = campaign.start_date ? new Date(campaign.start_date) : new Date();
    const endDate = campaign.end_date ? new Date(campaign.end_date) : new Date();
    
    // تنسيق التاريخ للعرض في حقل datetime-local
    const formatDateForInput = (date: Date) => {
      return date.toISOString().slice(0, 16);
    };
    
    setNewElectionForm({
      name: campaign.name,
      description: campaign.description,
      start_date: formatDateForInput(startDate),
      end_date: formatDateForInput(endDate),
      candidates_count: campaign.candidates_count,
      status: campaign.status,
      image: null,
    });
  } else {
    setEditingElection(null);
    setNewElectionForm({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      candidates_count: 0,
      status: 'pending',
      image: null,
    });
  }
  setFormType('campaign');
};

  const openEditFormCandidate = (candidate: Candidate | null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setCandidateForm({
        display_name: candidate.display_name,
        student_id: '',
        bio: candidate.bio,
        position: candidate.position,
        platform: candidate.platform,
        image: null,
      });
    } else {
      setEditingCandidate(null);
      setCandidateForm({
        display_name: '',
        student_id: '',
        bio: '',
        position: '',
        platform: '',
        image: null,
      });
    }
    setFormType('candidate');
  };

  const openAddFormCandidate = (id: number) => {
    localStorage.setItem('electionId', id.toString());
    setEditingCandidate(null);
    setCandidateForm({
      display_name: '',
      student_id: '',
      bio: '',
      position: '',
      platform: '',
      image: null,
    });
    setFormType('candidate');
  };

  const openCandidatePart = (id: number) => {
    localStorage.setItem('electionId', id.toString());
    getCandidates();
    setFormType('showCandidate');
  };

  const resetForm = () => {
    setFormType(null);
    setEditingCandidate(null);
    setEditingElection(null);
  };

  const openDeleteModal = (id: number) => {
    setElectionIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const openCandidateDeleteModal = (id: number) => {
    setCandidateIdToDelete(id);
    setCandidateDeleteModalOpen(true);
  };

  const handleElectionDelete = async () => {
    if (!electionIdToDelete) return;
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.delete(`${API_URL}/elections/${electionIdToDelete}`, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            Accept: 'application/json',
          },
        });
      });
      toast({
        title: 'تم الحذف بنجاح',
        variant: 'default',
        description: 'تم حذف الحملة الانتخابية بنجاح',
      });
      closeDeleteModal();
      GetElections();
    } catch (error: unknown) {
      let errorMsg = 'حدث خطأ في حذف الحملة الانتخابية';
      if (axios.isAxiosError(error))
        errorMsg = error.response?.data?.message || error.message;
      else if (error instanceof Error) errorMsg = error.message;
      toast({
        title: 'خطأ في الحذف',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const closeDeleteModal = () => {
    setElectionIdToDelete(null);
    setDeleteModalOpen(false);
  };

  const closeCandidateDeleteModal = () => {
    setCandidateIdToDelete(null);
    setCandidateDeleteModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-green-600"></div>
          <div className="animate-ping absolute top-0 left-0 h-12 w-12 rounded-full border border-syria-green-400 opacity-75"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-syria-green-700">جاري تحميل بيانات الانتخابات...</p>
          <p className="text-sm text-gray-600">يرجى الانتظار قليلاً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="border-l-4 border-l-syria-green-600 bg-gradient-to-r from-syria-green-100/30 via-syria-green-200/20 to-background shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-syria-green-700">
            <Crown className="mr-2 h-6 w-6 text-syria-green-600" />
            إدارة الانتخابات الرئاسية
          </CardTitle>
          <CardDescription className="text-syria-green-600">
            إدارة المرشحين للانتخابات الرئاسية للمجتمع السوري في أيدن
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="text-center bg-syria-green-100 rounded-lg p-4">
                <div className="text-3xl font-bold text-syria-green-600">
                  {getElections.length}
                </div>
                <div className="text-sm text-syria-green-700 font-medium">
                  إجمالي الحملات
                </div>
              </div>
            </div>
            <Button
              onClick={() => openEditAddFormCampaign(null)}
              className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              إضافة حملة انتخابية جديدة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* الحملات */}
      <Card className="shadow-lg ">
        <CardHeader className="bg-gradient-to-r from-syria-green-50 to-transparent">
          <CardTitle className="flex items-center text-syria-green-600">
            <Vote className="mr-2 h-5 w-5" />
            الحملات الانتخابية
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getElections.length === 0 ? (
            <div className="text-center py-12">
              <Award className="mx-auto h-16 w-16 text-syria-green-500 mb-6" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                لا يوجد حملات انتخابية الان
              </h3>
              <p className="text-muted-foreground mb-6">
                ابدأ بإضافة أول حملة انتخابية للحالية
              </p>
              <Button
                onClick={() => openEditAddFormCampaign(null)}
                className="bg-syria-green-500 text-white hover:bg-syria-green-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                إضافة أول حملة
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getElections.map((election) => (
                <Card
                  key={election.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-syria-green-400 flex flex-col h-full"
                >
                  <div
                    className="relative cursor-pointer flex-grow"
                    onClick={() => openCandidatePart(election.id!)}
                  >
                    {election.image ? (
                      <img
                        src={`${STORAGE_URL}/${election.image}`}
                        alt={election.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-syria-green-100/30 to-syria-green-50 flex items-center justify-center">
                        <User className="h-16 w-16 text-syria-green-400/70" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-syria-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        {election.status}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-2 text-foreground">
                      {election.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                      {election.description}
                    </p>

                    <div className="text-xs text-syria-green-600 mb-2 font-medium">
                      يبدأ في: {formatDate(election.start_date)}
                    </div>
                    <div className="text-xs text-syria-green-600 mb-4 font-medium">
                      ينتهي في: {formatDate(election.end_date)}
                    </div>
                    <div className="text-xs text-syria-green-600 mb-4 font-medium">
                      عدد المرشحين: {election.candidates_count}
                    </div>

                    {/* أزرار متراصة في صفين */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddFormCandidate(election.id!);
                        }}
                        variant="outline"
                        className="text-syria-green-600 border-syria-green-500 hover:bg-syria-green-500 hover:text-white"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        إضافة مرشح
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCandidatePart(election.id!);
                        }}
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <User className="h-3 w-3 mr-1" />
                        عرض المرشحين
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditAddFormCampaign(election);
                        }}
                        variant="outline"
                        className="text-syria-green-600 border-syria-green-500 hover:bg-syria-green-500 hover:text-white col-span-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(election.id!);
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50 col-span-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* المرشحين */}
      {formType === 'showCandidate' && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-syria-green-50 to-transparent">
            <CardTitle className="flex items-center text-syria-green-600">
              <Vote className="mr-2 h-5 w-5" />
              عرض المرشحين
            </CardTitle>
          </CardHeader>
          <CardContent>
            {candidatesLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center animate-fade-in">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-syria-green-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-muted-foreground font-medium">
                    جاري تحميل بيانات المرشحين...
                  </p>
                </div>
              </div>
            ) : getCandidatess.length === 0 ? (
              <div className="text-center py-12">
                <User className="mx-auto h-16 w-16 text-syria-green-500 mb-6" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  لا يوجد مرشحين في هذه الحملة
                </h3>
                <p className="text-muted-foreground mb-6">
                  ابدأ بإضافة أول مرشح لهذه الحملة
                </p>
                <Button
                  onClick={() => {
                    const electionId = localStorage.getItem('electionId');
                    if (electionId) {
                      openAddFormCandidate(parseInt(electionId));
                    }
                  }}
                  className="bg-syria-green-500 text-white hover:bg-syria-green-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة أول مرشح
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCandidatess.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-syria-green-400"
                  >
                    <div className="relative">
                      {candidate.image ? (
                        <img
                          src={`${STORAGE_URL}/${candidate.image}`}
                          alt={candidate.display_name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-syria-green-100/30 to-syria-green-50 flex items-center justify-center">
                          <User className="h-16 w-16 text-syria-green-400/70" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="bg-syria-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          {candidate.position === 'president'
                            ? 'رئيس'
                            : candidate.position}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-foreground">
                        {candidate.display_name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                        :نبذة عن المرشح
                        <br />
                        {candidate.bio}
                      </p>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                        :برنامج المرشح أو خطته الانتخابية <br />
                        {candidate.platform}
                      </p>

                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditFormCandidate(candidate);
                          }}
                          variant="outline"
                          className="text-syria-green-600 border-syria-green-500 hover:bg-syria-green-500 hover:text-white"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCandidateDeleteModal(candidate.id);
                          }}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* نموذج الإضافة والتعديل */}
      {formType === 'campaign' && (
        <Card className="shadow-lg border-l-4 border-l-syria-green-600">
          <CardHeader>
            <CardTitle className="text-syria-green-700">
              {editingElection
                ? 'تعديل الحملة الانتخابية'
                : 'اضافة حملة انتخابية جديدة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">اسم الحملة</Label>
                <Input
                  id="name"
                  name="name"
                  value={newElectionForm.name}
                  onChange={handleCampaignFormChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">وصف الحملة الاتخابية</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newElectionForm.description}
                  onChange={handleCampaignFormChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="start_date">تاريخ بداية الحملة</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  value={newElectionForm.start_date}
                  onChange={handleCampaignFormChange}
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">تاريخ انتهاء الحملة</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  value={newElectionForm.end_date}
                  onChange={handleCampaignFormChange}
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">حالة الحملة الانتخابية</Label>
                <select
                  id="status"
                  name="status"
                  onChange={handleCampaignFormChange}
                  value={newElectionForm.status}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="pending">pending</option>
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                </select>
              </div>
              <div>
                <Label htmlFor="image">صورة للحملة</Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleCampaignFormChange}
                />
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button
                  type="button"
                  onClick={() => {
                    if (editingElection && editingElection.id) {
                      handleUpdateElection(editingElection.id);
                    } else {
                      handleAddElection();
                    }
                  }}
                  className="bg-syria-green-500 text-white hover:bg-syria-green-600 flex-1"
                >
                  <Save className="mr-1 h-4 w-4" />
                  {editingElection
                    ? 'حفظ التعديلات'
                    : 'إضافة الحملة الانتخابية'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  <X className="mr-1 h-4 w-4" />
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* نموذج الإضافة والتعديل */}
      {formType === 'candidate' && (
        <Card className="shadow-lg border-l-4 border-l-syria-green-600">
          <CardHeader>
            <CardTitle className="text-syria-green-700">
              {editingCandidate ? 'تعديل مرشح' : 'إضافة مرشح جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {/* 🔹 الاسم المستعار */}
              <div>
                <Label htmlFor="display_name">اسم المرشح (أو المستعار)</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  value={candidateForm.display_name}
                  onChange={handleCandidateFormChange}
                  required
                />
              </div>

              {/* 🔹 رقم الطالب */}
              {editingCandidate ? (
                ''
              ) : (
                <div>
                  <Label htmlFor="student_id">رقم الطالب</Label>
                  <Input
                    id="student_id"
                    name="student_id"
                    value={candidateForm.student_id}
                    onChange={handleCandidateFormChange}
                    required
                  />
                </div>
              )}

              {/* 🔹 المنصب */}
              <div>
                <Label htmlFor="position">المنصب</Label>
                <select
                  id="position"
                  name="position"
                  value={candidateForm.position}
                  onChange={handleCandidateFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">-- اختر المنصب --</option>
                  <option value="president">رئيس</option>
                  <option value="vice">نائب</option>
                  <option value="member">عضو</option>
                </select>
              </div>

              {/* 🔹 النبذة */}
              <div>
                <Label htmlFor="bio">نبذة عن المرشح</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={candidateForm.bio}
                  onChange={handleCandidateFormChange}
                />
              </div>

              {/* 🔹 البرنامج الانتخابي */}
              <div>
                <Label htmlFor="platform">البرنامج الانتخابي</Label>
                <Textarea
                  id="platform"
                  name="platform"
                  value={candidateForm.platform || ''}
                  onChange={handleCandidateFormChange}
                />
              </div>

              {/* 🔹 صورة (اختيارية إذا حابب تخزنها) */}
              <div>
                <Label htmlFor="image">صورة المرشح</Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleCandidateFormChange}
                />
              </div>

              {/* 🔹 الأزرار */}
              <div className="flex space-x-2 space-x-reverse">
                <Button
                  type="button"
                  className="bg-syria-green-500 text-white hover:bg-syria-green-600 flex-1"
                  onClick={() => {
                    if (editingCandidate) {
                      handleUpdateCandidate();
                    } else {
                      handleAddCandidate();
                    }
                  }}
                >
                  <Save className="mr-1 h-4 w-4" />
                  {editingCandidate ? 'حفظ التعديلات' : 'إضافة المرشح'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  <X className="mr-1 h-4 w-4" />
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* نافذة حذف الحملة */}
      <Dialog
        open={deleteModalOpen}
        onOpenChange={(open) => !open && setDeleteModalOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-destructive">
              تأكيد الحذف
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-sm">
            هل أنت متأكد من حذف هذه الحملة الانتخابية؟ لن تتمكن من استعادتها.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={closeDeleteModal}>
              إلغاء
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleElectionDelete}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة حذف المرشح */}
      <Dialog
        open={candidateDeleteModalOpen}
        onOpenChange={(open) => !open && setCandidateDeleteModalOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-destructive">
              تأكيد حذف المرشح
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-sm">
            هل أنت متأكد من حذف هذا المرشح؟ لن تتمكن من استعادته.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={closeCandidateDeleteModal}>
              إلغاء
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteCandidate}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ElectionManager;