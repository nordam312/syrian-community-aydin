import React, { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Trash2, Edit } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';

interface Logo {
	id: number;
	name: string;
	image_path: string;
	alt_text: string;
	width: number;
	height: number;
	position: 'header' | 'footer' | 'mobile';
	is_active: boolean;
	created_at: string;
}
import { API_URL, STORAGE_URL } from '@/config';

const LogoManager: React.FC = () => {
	const [logos, setLogos] = useState<Logo[]>([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		alt_text: '',
		position: 'header' as 'header' | 'footer' | 'mobile',
		is_active: false,
	});
	const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		fetchLogos();
	}, []);

	const fetchLogos = async () => {
		try {
			const response = await axios.get(`${API_URL}/logos`);
			setLogos(response.data);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to fetch logos',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedFile && !editingLogo) {
			toast({
				title: 'Error',
				description: 'Please select an image',
				variant: 'destructive',
			});
			return;
		}

		setUploading(true);

		const formDataToSend = new FormData();
		if (selectedFile) {
			formDataToSend.append('image', selectedFile);
		}
		formDataToSend.append('name', formData.name);
		formDataToSend.append('alt_text', formData.alt_text);
		formDataToSend.append('position', formData.position);
		formDataToSend.append('is_active', formData.is_active ? '1' : '0');

		try {
			const url = editingLogo
				? `${API_URL}/logos/${editingLogo.id}`
				: `${API_URL}/logos`;

			const method = editingLogo ? 'PUT' : 'POST';
			const token = sessionStorage.getItem('userToken');
			const response = await axios({
				method,
				url,
				data: formDataToSend,
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response.status === 200 || response.status === 201) {
				toast({
					title: 'Success',
					description: editingLogo
						? 'Logo updated successfully'
						: 'Logo uploaded successfully',
				});
				fetchLogos();
				resetForm();
				setIsDialogOpen(false);
			} else {
				throw new Error('Upload failed');
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to upload logo',
				variant: 'destructive',
			});
		} finally {
			setUploading(false);
		}
	};

	const handleToggleActive = async (logo: Logo) => {
		try {
			const token = sessionStorage.getItem('userToken');

			if (!token) {
				toast({
					title: 'خطأ',
					description: 'يرجى تسجيل الدخول أولاً',
					variant: 'warning',
				});
				return;
			}

			await axios.post(
				`${API_URL}/logos/${logo.id}`,
				{
					is_active: !logo.is_active,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				},
			);

			// تحديث حالة اللوجو محلياً لتجنب الحاجة لإعادة تحميل الكل
			setLogos((prevLogos) =>
				prevLogos.map((item) =>
					item.id === logo.id ? { ...item, is_active: !item.is_active } : item,
				),
			);
			fetchLogos()

			toast({
				title: 'تم بنجاح',
				variant : 'success',
				description: 'تم تحديث حالة الشعار',
			});
		} catch (error) {
			console.error('Error updating logo status:', error);
			toast({
				title: 'خطأ',
				description: 'فشل تحديث حالة الشعار',
				variant: 'warning',
			});
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this logo?')) return;

		try {
			await axios.delete(`${API_URL}/logos/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			toast({
				title: '!تم',
				variant: 'success',
				description: 'تم حذف الشعار بنجاح',
			});
			fetchLogos();
		} catch (error) {
			toast({
				title: '!خطأ',
				description: 'خطأ عند الحذف',
				variant: 'warning',
			});
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			alt_text: '',
			position: 'header',
			is_active: false,
		});
		setSelectedFile(null);
		setEditingLogo(null);
	};

	const openEditDialog = (logo: Logo) => {
		setEditingLogo(logo);
		setFormData({
			name: logo.name,
			alt_text: logo.alt_text || '',
			position: logo.position,
			is_active: logo.is_active,
		});
		setIsDialogOpen(true);
	};

	const openAddDialog = () => {
		resetForm();
		setIsDialogOpen(true);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">أدارة الشعار</h2>
				<Button
					onClick={openAddDialog}
					className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
				>
					<Upload className="w-4 h-4 mr-2" />
					أضافة شعار جديد
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{logos.map((logo) => (
					<Card
						key={logo.id}
						className={`
						rounded-md
						transition-all duration-300 ease-in-out
						${
							logo.is_active
								? 'border-2 border-green-500 shadow-lg transform scale-105'
								: 'border border-gray-300 shadow-sm opacity-80 scale-100'
						}
					`}
					>
						<CardHeader>
							<CardTitle className="text-lg">{logo.name}</CardTitle>
							<CardDescription>
								Position: {logo.position} | {logo.width}x{logo.height}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<img
								src={`${STORAGE_URL}/${logo.image_path}`}
								alt={logo.alt_text || logo.name}
								className="w-full h-32 object-contain rounded-md mb-4"
							/>
							<div
								className="flex items-center gap-2 cursor-pointer"
								onClick={() => handleToggleActive(logo)}
							>
								{/* الدائرة الصغيرة */}
								<span
									className={`
											w-3 h-3 rounded-full border
											${logo.is_active ? 'bg-green-500 border-green-500' : 'bg-white border-gray-400'}
											transition-colors duration-300
											`}
								></span>
								{/* النص */}
								<span className="text-sm">
									{logo.is_active ? 'مفعل' : 'غير مفعل'}
								</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl">
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold">
							{editingLogo ? 'Edit Logo' : 'Upload New Logo'}
						</DialogTitle>
						<DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
							{editingLogo
								? 'Update the logo details and optionally upload a new image.'
								: 'Upload a new logo image and configure its settings.'}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>
						<div>
							<Label htmlFor="alt_text">Alt Text</Label>
							<Input
								id="alt_text"
								value={formData.alt_text}
								onChange={(e) =>
									setFormData({ ...formData, alt_text: e.target.value })
								}
							/>
						</div>
						<div>
							<Label htmlFor="position">Position</Label>
							<Select
								value={formData.position}
								onValueChange={(value) =>
									setFormData({
										...formData,
										position: value as 'header' | 'footer' | 'mobile',
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="header">Header</SelectItem>
									<SelectItem value="footer">Footer</SelectItem>
									<SelectItem value="mobile">Mobile</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor="image">Image</Label>
							<Input
								id="image"
								type="file"
								accept="image/*"
								onChange={handleFileSelect}
								required={!editingLogo}
							/>
						</div>
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={formData.is_active}
								onChange={(e) =>
									setFormData({ ...formData, is_active: e.target.checked })
								}
								id="is_active"
								className="w-4 h-4"
							/>
							<Label htmlFor="is_active">تفعيل</Label>
						</div>

						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
								type="submit"
								disabled={uploading}
							>
								{uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
								{editingLogo ? 'Update' : 'حفظ'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default LogoManager;
