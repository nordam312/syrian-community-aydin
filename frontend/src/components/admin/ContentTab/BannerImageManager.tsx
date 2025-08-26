import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit, Plus, ImagePlus, Eye } from 'lucide-react';
import { API_URL } from '@/config';
import { STORAGE_URL } from '@/config';

interface Banner {
	id: number;
	title: string;
	image: string;
	description?: string;
	is_active: boolean;
	order: number;
}

const BannerImageManager = () => {
	const [banners, setBanners] = useState<Banner[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		image: null as File | null,
		is_active: true,
		order: 0,
	});
	const { toast } = useToast();
	const userToken = sessionStorage.getItem('userToken');

	useEffect(() => {
		fetchBanners();
	}, []);

	const fetchBanners = async () => {
		try {
			const response = await axios.get(`${API_URL}/banners`);
			setBanners(response.data);
		} catch (error) {
			toast({
				title: 'خطأ في تحميل الصور',
				description: 'فشل في تحميل صور البانر',
				variant: 'destructive',
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formDataToSend = new FormData();
		formDataToSend.append('title', formData.title);
		formDataToSend.append('description', formData.description);
		formDataToSend.append('is_active', formData.is_active ? '1' : '0');
		formDataToSend.append('order', formData.order.toString());
		if (formData.image) {
			formDataToSend.append('image', formData.image);
		}

		try {
			if (editingBanner) {
				await axios.post(
					`${API_URL}/banners/${editingBanner.id}`,
					formDataToSend,
					{
						headers: {
							Authorization: `Bearer ${userToken}`,
							'Content-Type': 'multipart/form-data',
						},
					},
				);
				toast({ title: 'تم التحديث بنجاح', variant: 'success' });
			} else {
				await axios.post(`${API_URL}/banners`, formDataToSend, {
					headers: {
						Authorization: `Bearer ${userToken}`,
						'Content-Type': 'multipart/form-data',
					},
				});
				toast({ title: 'تم الإضافة بنجاح', variant: 'success' });
			}
			resetForm();
			fetchBanners();
		} catch (error) {
			const errorMessage = error.response.data.message;
			console.log(errorMessage);

			toast({
				title: 'خطأ',
				description: 'فشل في حفظ الصورة',
				variant: 'destructive',
			});
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

		try {
			await axios.delete(`${API_URL}/banners/${id}`, {
				headers: { Authorization: `Bearer ${userToken}` },
			});
			toast({ title: 'تم الحذف بنجاح', variant: 'success' });
			fetchBanners();
		} catch (error) {
			toast({
				title: 'خطأ',
				description: 'فشل في حذف الصورة',
				variant: 'destructive',
			});
		}
	};

	const resetForm = () => {
		setFormData({
			title: '',
			description: '',
			image: null,
			is_active: true,
			order: 0,
		});
		setEditingBanner(null);
		setShowForm(false);
	};

	const handleEdit = (banner: Banner) => {
		setEditingBanner(banner);
		setFormData({
			title: banner.title,
			description: banner.description || '',
			image: null,
			is_active: banner.is_active,
			order: banner.order,
		});
		setShowForm(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">صور البانر الحالية</h3>
				<Button
					onClick={() => setShowForm(true)}
					className="bg-syria-green-600 hover:bg-syria-green-700"
				>
					<Plus className="mr-2 h-4 w-4" />
					إضافة صورة جديدة
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{banners.map((banner) => (
					<Card key={banner.id} className="overflow-hidden">
						<div className="aspect-video relative">
							<img
								src={`${STORAGE_URL}/${banner.image}`}
								alt={banner.title}
								className="w-full h-full object-cover"
							/>
							{!banner.is_active && (
								<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
									<span className="text-white text-sm">غير مفعل</span>
								</div>
							)}
						</div>
						<CardContent className="p-4">
							<h4 className="font-semibold text-sm mb-1">{banner.title}</h4>
							{banner.description && (
								<p className="text-sm text-gray-600 mb-2">
									{banner.description}
								</p>
							)}
							<div className="flex justify-between items-center">
								<span className="text-xs text-gray-500">
									الترتيب: {banner.order}
								</span>
								<div className="flex space-x-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => handleEdit(banner)}
									>
										<Edit className="h-3 w-3" />
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="text-red-600"
										onClick={() => handleDelete(banner.id)}
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{showForm && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">
							{editingBanner ? 'تعديل صورة البانر' : 'إضافة صورة جديدة'}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label>العنوان</Label>
								<Input
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
								/>
							</div>
							<div>
								<Label>الوصف</Label>
								<Textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={3}
								/>
							</div>
							<div>
								<Label>الصورة</Label>
								<Input
									type="file"
									accept="image/*"
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											setFormData({ ...formData, image: e.target.files[0] });
										}
									}}
									required={!editingBanner}
								/>
							</div>
							<div>
								<Label>الترتيب</Label>
								<Input
									type="number"
									value={formData.order}
									onChange={(e) =>
										setFormData({
											...formData,
											order: parseInt(e.target.value) || 0,
										})
									}
									min="0"
								/>
							</div>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={formData.is_active}
									onChange={(e) =>
										setFormData({ ...formData, is_active: e.target.checked })
									}
								/>
								<Label>مفعل</Label>
							</div>
							<div className="flex gap-2 justify-end">
								<Button type="button" variant="outline" onClick={resetForm}>
									إلغاء
								</Button>
								<Button
									type="submit"
									className="bg-syria-green-600 hover:bg-syria-green-700"
								>
									حفظ
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default BannerImageManager;
