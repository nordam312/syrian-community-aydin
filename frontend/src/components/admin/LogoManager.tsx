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

const LogoManager: React.FC = () => {
	const [logos, setLogos] = useState<Logo[]>([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		alt_text: '',
		position: 'header' as 'header' | 'footer' | 'mobile',
	});
	const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();

	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

	useEffect(() => {
		fetchLogos();
	}, []);

	const fetchLogos = async () => {
		try {
			const response = await fetch(`${API_URL}/logos`);
			const data = await response.json();
			setLogos(data);
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

		try {
			const url = editingLogo
				? `${API_URL}/logos/${editingLogo.id}`
				: `${API_URL}/logos`;

			const method = editingLogo ? 'POST' : 'POST';

			const response = await fetch(url, {
				method,
				body: formDataToSend,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			if (response.ok) {
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
			const response = await fetch(`${API_URL}/logos/${logo.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({ is_active: !logo.is_active }),
			});

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Logo status updated',
				});
				fetchLogos();
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update logo status',
				variant: 'destructive',
			});
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this logo?')) return;

		try {
			const response = await fetch(`${API_URL}/logos/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Logo deleted successfully',
				});
				fetchLogos();
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete logo',
				variant: 'destructive',
			});
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			alt_text: '',
			position: 'header',
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
					className="bg-syria-green-600 hover:bg-syria-green-700"
				>
					<Upload className="w-4 h-4 mr-2" />
					أضافة شعار جديد
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{logos.map((logo) => (
					<Card
						key={logo.id}
						className={logo.is_active ? 'border-green-500' : ''}
					>
						<CardHeader>
							<CardTitle className="text-lg">{logo.name}</CardTitle>
							<CardDescription>
								Position: {logo.position} | {logo.width}x{logo.height}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<img
								src={`${API_URL}/storage/${logo.image_path}`}
								alt={logo.alt_text || logo.name}
								className="w-full h-32 object-contain rounded-md mb-4"
							/>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Switch
										checked={logo.is_active}
										onCheckedChange={() => handleToggleActive(logo)}
									/>
									<span className="text-sm">
										{logo.is_active ? 'Active' : 'Inactive'}
									</span>
								</div>
								<div className="flex space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => openEditDialog(logo)}
									>
										<Edit className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDelete(logo.id)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>
							{editingLogo ? 'Edit Logo' : 'Upload New Logo'}
						</DialogTitle>
						<DialogDescription>
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
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={uploading}>
								{uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
								{editingLogo ? 'Update' : 'Upload'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default LogoManager;
