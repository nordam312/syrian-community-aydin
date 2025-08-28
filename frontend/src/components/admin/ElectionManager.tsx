import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
import { API_URL } from '@/config';

function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // we add 1 because months are zero-indexed starting from 0
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
	name: string;
	bio: string;
	image_url?: string;
	position: string;
	created_at: string;
	updated_at: string;
};

type CandidateForm = {
	display_name: string;
	bio: string;
	position: string;
	student_id: string;
	platform?: string;
	image: File | null;
};
type NewElectionForm = {
	id?: number;
	name: string;
	description: string;
	start_date: string;
	end_date: string;
	candidates_count: number;
	status: string;
};

const ElectionManager = () => {
	const { toast } = useToast();
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [newElectionForm, setNewElectionForm] = useState<NewElectionForm>(null);
	const [getElections, setGetElections] = useState<NewElectionForm[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [formType, setFormType] = useState<
		'candidate' | 'showCandidate' | 'campaign' | null
	>(null);
	const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
		null,
	);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(
		null,
	);
	const [candidateForm, setCandidateForm] = useState<CandidateForm>({
		display_name: '',
		bio: '',
		position: '',
		student_id: '',
		platform: '',
		image: null,
	});
	const [getCandidatess, setGetCandidates] = useState<Candidate[]>([]);
	const userToken = sessionStorage.getItem('userToken');

	const GetElections = useCallback(async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/elections`, {
				headers: {
					Accept: 'application/json',
				},
			});
			setGetElections(response.data || []);
		} catch (error: unknown) {
			const errorMsg = 'حدث خطأ في جلب بيانات الحملات الاتخابية';
			// if (axios.isAxiosError(error)) {
			// 	errorMsg = error.response?.data?.message || error.message;
			// } else if (error instanceof Error) {
			// 	errorMsg = error.message;
			// }
			toast({
				title: 'خطأ في جلب البيانات',
				description: errorMsg,
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	}, [userToken, toast]);

	const fetchCandidates = useCallback(async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/elections/candidates`, {
				headers: {
					Authorization: `Bearer ${userToken}`,
					Accept: 'application/json',
				},
			});
			setCandidates(response.data.data || []);
		} catch (error: unknown) {
			let errorMsg = 'حدث خطأ في جلب بيانات المرشحين';
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
	}, [userToken, toast]);

	useEffect(() => {
		if (userToken) {
			fetchCandidates();
			GetElections();
		}
	}, [fetchCandidates, userToken]);

	const handleAddElection = async () => {
		await axios.post(`${API_URL}/elections/create`, newElectionForm, {
			headers: {
				Authorization: `Bearer ${userToken}`,
				'Content-Type': 'multipart/form-data',
			},
		});
		toast({ title: 'تم اضافة الحملة بنجاح', variant: 'success' });
	};

	const handleAddCandidate = async () => {
		const electionId = localStorage.getItem('electionId');
		await axios.post(
			`${API_URL}/elections/${electionId}/candidates`,
			candidateForm,
			{
				headers: {
					Authorization: `Bearer ${userToken}`,
					'Content-Type': 'multipart/form-data',
				},
			},
		);
		toast({ title: 'تم اضافة مرشح بنجاح', variant: 'success' });
	};

	const getCandidates = async () => {
		const electionId = localStorage.getItem('electionId');
		try {
			const response = await axios.get(`${API_URL}/elections/${electionId}/candidates`, {
				headers: {
					Authorization: `Bearer ${userToken}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			setGetCandidates(response.data || []);
			toast({ title: 'تم عرض المرشحين بنجاح', variant: 'success' });
		} catch (error) {
			console.error('Error fetching candidates:', error);
		}
	};

	const openAddFormCampaign = () => {
		setFormType('campaign');
		setShowForm(true);
	};

	const openAddFormCandidate = (id) => {
		localStorage.setItem('electionId', id);
		setFormType('candidate');
		setShowForm(true);
	};
	const openCandidatePart = (id) => {
		localStorage.setItem('electionId', id);
		getCandidates();
		setFormType('showCandidate');
		setShowForm(true);
	};

	const resetForm = () => {
		setEditingCandidate(null);
		setShowForm(false);
	};
	const openEditForm = (candidate: Candidate) => {
		setCandidateForm({
			display_name: candidate.name,
			student_id: '',
			platform: '',
			bio: candidate.bio,
			position: candidate.position,
			image: null,
		});
		setEditingCandidate(candidate);
		setShowForm(true);
	};

	const handleCandidateFormChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setCandidateForm({ ...candidateForm, [e.target.name]: e.target.value });
	};

	const handleCampaignFormChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setNewElectionForm({ ...newElectionForm, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setCandidateForm({ ...candidateForm, image: e.target.files[0] });
		}
	};

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	try {
	// 		const formData = new FormData();
	// 		formData.append('name', candidateForm.name);
	// 		formData.append('bio', candidateForm.bio);
	// 		formData.append('position', candidateForm.position);
	// 		if (candidateForm.image) formData.append('image', candidateForm.image);

	// 		if (editingCandidate) {
	// 			await axios.post(
	// 				`${API_URL}/elections/candidates/${editingCandidate.id}`,
	// 				formData,
	// 				{
	// 					headers: {
	// 						Authorization: `Bearer ${userToken}`,
	// 						'Content-Type': 'multipart/form-data',
	// 					},
	// 				},
	// 			);
	// 			toast({
	// 				title: 'تم التحديث بنجاح',
	// 				description: 'تم تحديث بيانات المرشح بنجاح',
	// 			});
	// 		} else {
	// 			await axios.post(`${API_URL}/elections/candidates`, formData, {
	// 				headers: {
	// 					Authorization: `Bearer ${userToken}`,
	// 					'Content-Type': 'multipart/form-data',
	// 				},
	// 			});
	// 			toast({
	// 				title: 'تم الإضافة بنجاح',
	// 				description: 'تم إضافة المرشح الجديد بنجاح',
	// 			});
	// 		}

	// 		resetForm();
	// 		fetchCandidates();
	// 	} catch (error: unknown) {
	// 		let errorMsg = 'حدث خطأ في العملية';
	// 		if (axios.isAxiosError(error))
	// 			errorMsg = error.response?.data?.message || error.message;
	// 		else if (error instanceof Error) errorMsg = error.message;
	// 		toast({
	// 			title: 'خطأ في العملية',
	// 			description: errorMsg,
	// 			variant: 'destructive',
	// 		});
	// 	}
	// };

	const openDeleteModal = (candidate: Candidate) => {
		setCandidateToDelete(candidate);
		setDeleteModalOpen(true);
	};
	const closeDeleteModal = () => {
		setCandidateToDelete(null);
		setDeleteModalOpen(false);
	};

	const handleDelete = async () => {
		if (!candidateToDelete) return;
		try {
			await axios.delete(
				`${API_URL}/elections/candidates/${candidateToDelete.id}`,
				{
					headers: { Authorization: `Bearer ${userToken}` },
				},
			);
			toast({ title: 'تم الحذف بنجاح', description: 'تم حذف المرشح بنجاح' });
			closeDeleteModal();
			fetchCandidates();
		} catch (error: unknown) {
			let errorMsg = 'حدث خطأ في حذف المرشح';
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

	// const formatDate = (dateStr: string) => {
	// 	const date = new Date(dateStr);
	// 	return date.toLocaleDateString('ar-SA', {
	// 		year: 'numeric',
	// 		month: 'long',
	// 		day: 'numeric',
	// 	});
	// };

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-center animate-fade-in">
					<div className="animate-spin rounded-full h-10 w-10 border-3 border-syria-green-500 border-t-transparent mx-auto mb-4"></div>
					<p className="text-muted-foreground font-medium">
						جاري تحميل بيانات الانتخابات...
					</p>
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
									{candidates.length}
								</div>
								<div className="text-sm text-syria-green-700 font-medium">
									إجمالي المرشحين
								</div>
							</div>
							<div className="text-center bg-syria-green-50 rounded-lg p-4">
								<div className="text-3xl font-bold text-syria-green-500">
									{candidates.filter((c) => c.position === 'president').length}
								</div>
								<div className="text-sm text-syria-green-600 font-medium">
									مرشحين للرئاسة
								</div>
							</div>
						</div>
						<Button
							onClick={openAddFormCampaign}
							className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
						>
							<Plus className="mr-2 h-4 w-4" />
							إضافة حملة انتخابية جديدة
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* المرشحين */}
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
								onClick={openAddFormCandidate}
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
									onClick={() => openCandidatePart(election.id)}
									key={election.id}
									className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-syria-green-400"
								>
									<div className="relative">
										{/* {election.image_url ? (
											<img
												src={election.image_url}
												alt={election.name}
												className="w-full h-48 object-cover"
											/>
										) : (
											<div className="w-full h-48 bg-gradient-to-br from-syria-green-100/30 to-syria-green-50 flex items-center justify-center">
												<User className="h-16 w-16 text-syria-green-400/70" />
											</div>
										)} */}
										<img
											src={'/samir.jpg'}
											alt={election.name}
											className="w-full h-48 object-cover"
										/>
										<div className="absolute top-2 right-2">
											<span className="bg-syria-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
												{/* {election.position === 'president'
													? 'رئيس'
													: election.position} */}
												{election.status}
											</span>
										</div>
									</div>
									<CardContent className="p-5">
										<h3 className="font-bold text-lg mb-2 text-foreground">
											{election.name}
										</h3>
										<p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
											{election.description}
										</p>

										<div className="text-xs text-syria-green-600 mb-4 font-medium">
											يبدأ في: {formatDate(election.start_date)}
										</div>
										<div className="text-xs text-syria-green-600 mb-4 font-medium">
											ينتهي في: {formatDate(election.end_date)}
										</div>
										<div className="text-xs text-syria-green-600 mb-4 font-medium">
											عدد المرشحين {election.candidates_count}
										</div>
										<div className="flex space-x-2 space-x-reverse">
											<Button
												type="button"
												size="sm"
												variant="outline"
												className="text-syria-green-600 border-syria-green-500 hover:bg-syria-green-500 hover:text-white"
												onClick={(e) => {e.stopPropagation(); openAddFormCandidate(election.id)}}
											>
												<Plus className="h-3 w-3 mr-1" />
												اضافة مرشحين
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="text-syria-green-600 border-syria-green-500 hover:bg-syria-green-500 hover:text-white"
											>
												<Edit className="h-3 w-3 mr-1" />
												تعديل
											</Button>
											<Button
												size="sm"
												variant="outline"
												// onClick={() => openDeleteModal(candidate)}
												className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
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

			{/* نموذج الإضافة والتعديل */}
			{formType === 'campaign' && (
				<Card className="shadow-lg border-l-4 border-l-syria-green-600">
					<CardHeader>
						<CardTitle className="text-syria-green-700">
							اضافة حملة انتخابية جديدة
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="space-y-4">
							<div>
								<Label htmlFor="name">اسم الحملة</Label>
								<Input
									id="name"
									name="name"
									// value={newElectionForm.name}
									onChange={handleCampaignFormChange}
									required
								/>
							</div>

							<div>
								<Label htmlFor="bio">وصف الحملة الاتخابية</Label>
								<Textarea
									id="description"
									name="description"
									// value={newElectionForm.description}
									onChange={handleCampaignFormChange}
									required
								/>
							</div>
							<div>
								<Label htmlFor="image">تاريخ بداية الحملة</Label>
								<Input
									name="start_date"
									onChange={handleCampaignFormChange}
									type="datetime-local"
									required
								/>
							</div>
							<div>
								<Label htmlFor="image">تاريخ انتهاء الحملة</Label>
								<Input
									name="end_date"
									onChange={handleCampaignFormChange}
									type="datetime-local"
									required
								/>
							</div>
							{/* <div>
								<Label htmlFor="status">حالة الحملة الانتخابية</Label>
								<select
									id="status"
									name="status"
									// value={newElectionForm.status}
									onChange={handleAddElection}
									className="w-full border border-gray-300 rounded px-3 py-2"
								>
									<option value="pending">pendin / قيد الانتظار</option>
									<option value="active">active / مفعلة</option>
								</select>
							</div> */}
							<div>
								<Label htmlFor="image">صورة للحملة</Label>
								<Input
									type="file"
									id="image"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</div>

							<div className="flex space-x-2 space-x-reverse">
								<Button
									type="button"
									onClick={handleAddElection}
									className="bg-syria-green-500 text-white hover:bg-syria-green-600 flex-1"
								>
									<Save className="mr-1 h-4 w-4" />
									إضافة الحملة الانتخابية
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
							<div>
								<Label htmlFor="student_number">رقم الطالب</Label>
								<Input
									id="student_id"
									name="student_id"
									value={candidateForm.student_id}
									onChange={handleCandidateFormChange}
									required
								/>
							</div>

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
									value={candidateForm.platform}
									onChange={handleCandidateFormChange}
								/>
							</div>

							{/* 🔹 صورة (اختيارية إذا حابب تخزنها) */}
							<div>
								<Label htmlFor="image">صورة المرشح</Label>
								<Input
									type="file"
									id="image"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</div>

							{/* 🔹 الأزرار */}
							<div className="flex space-x-2 space-x-reverse">
								<Button
									type="button"
									className="bg-syria-green-500 text-white hover:bg-syria-green-600 flex-1"
									onClick={handleAddCandidate}
								>
									<Save className="mr-1 h-4 w-4" />
									{editingCandidate ? 'حفظ التعديلات' : 'إضافة المرشح'}
								</Button>
								<Button
									type="button"
									variant="outline"
									// onClick={resetForm}
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

			{formType === 'showCandidate' && (
				<Card className="shadow-lg">
					<CardHeader className="bg-gradient-to-r from-syria-green-50 to-transparent">
						<CardTitle className="flex items-center text-syria-green-600">
							<Vote className="mr-2 h-5 w-5" />
							عرض المرشحين
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
									onClick={openAddFormCandidate}
									className="bg-syria-green-500 text-white hover:bg-syria-green-600"
								>
									<Plus className="mr-2 h-4 w-4" />
									إضافة أول حملة
								</Button>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{getCandidatess.map((candidate) => (
									<Card
										// onClick={() => openCandidatePart(candidate.id)}
										key={candidate.id}
										className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-syria-green-400"
									>
										<div className="relative">
											{/* {election.image_url ? (
											<img
												src={election.image_url}
												alt={election.name}
												className="w-full h-48 object-cover"
											/>
										) : (
											<div className="w-full h-48 bg-gradient-to-br from-syria-green-100/30 to-syria-green-50 flex items-center justify-center">
												<User className="h-16 w-16 text-syria-green-400/70" />
											</div>
										)} */}
											<img
												src={'/samir.jpg'}
												alt={candidate.name}
												className="w-full h-48 object-cover"
											/>
											<div className="absolute top-2 right-2">
												<span className="bg-syria-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
													{/* {election.position === 'president'
													? 'رئيس'
													: election.position} */}
													{/* {candidate.status} */}
												</span>
											</div>
										</div>
										<CardContent className="p-5">
											<h3 className="font-bold text-lg mb-2 text-foreground">
												{candidate.name}
											</h3>
											<p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
												{candidate.bio}
											</p>

											{/* <div className="text-xs text-syria-green-600 mb-4 font-medium">
												يبدأ في: {formatDate(candidate.start_date)}
											</div>
											<div className="text-xs text-syria-green-600 mb-4 font-medium">
												ينتهي في: {formatDate(election.end_date)}
											</div>
											<div className="text-xs text-syria-green-600 mb-4 font-medium">
												عدد المرشحين {election.candidates_count}
											</div> */}
											{/* <div className="flex space-x-2 space-x-reverse">
												<Button
													type="button"
													size="sm"
													variant="outline"
													className="text-syria-green-600 border-syria-green-500 hover:bg-syria-green-500 hover:text-white"
													onClick={() => openAddFormCandidate(candidate.id)}
												>
													<Plus className="h-3 w-3 mr-1" />
													اضافة مرشحين
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="text-syria-green-600 border-syria-green-500 hover:bg-syria-green-500 hover:text-white"
												>
													<Edit className="h-3 w-3 mr-1" />
													تعديل
												</Button>
												<Button
													size="sm"
													variant="outline"
													// onClick={() => openDeleteModal(candidate)}
													className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											</div> */}
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* نافذة حذف المرشح */}
			{deleteModalOpen && candidateToDelete && (
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
					<Card className="max-w-md w-full p-6 border-l-4 border-l-destructive">
						<CardHeader>
							<CardTitle className="text-destructive">تأكيد الحذف</CardTitle>
							<CardDescription>
								هل أنت متأكد من حذف المرشح {candidateToDelete.name}؟
							</CardDescription>
						</CardHeader>
						<CardContent className="flex space-x-2 space-x-reverse mt-4">
							<Button
								onClick={handleDelete}
								className="flex-1 bg-destructive text-white hover:bg-destructive/90"
							>
								حذف
							</Button>
							<Button
								onClick={closeDeleteModal}
								variant="outline"
								className="flex-1"
							>
								إلغاء
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};

// 'pending', 'active', 'completed'
export default ElectionManager;
