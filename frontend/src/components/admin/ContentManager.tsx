import { API_URL } from '@/config';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ImagePlus } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import BannerImageManager from './ContentTab/BannerImageManager';
import LogoManager from './ContentTab/LogoManager';

interface ContentItem {
	id: number;
	home_title: string;
	home_description: string;
	about_title: string;
	about_content: string;
	contact_email: string;
	contact_phone: string;
	contact_address: string;
	social_facebook: string;
	social_instagram: string;
	social_telegram: string;
	created_at: string;
	updated_at: string;
}

const ContentManager = () => {
	const [contentItems, setContentItems] = useState<ContentItem>(null);
	const { toast } = useToast();
	const userToken = sessionStorage.getItem('userToken');
	const GetContentItems = useCallback(async () => {
		try {
			const response = await axios.get(`${API_URL}/content`, {
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			});
			setContentItems(response.data);
		} catch (error) {
			console.error('Error fetching content items:', error);
		}
	}, []);

	const handleUpdateContentItems = useCallback(
		async (updatedData: Partial<ContentItem>) => {
			if (contentItems?.home_description === undefined) {
				console.log('ما تم تعديل الوصف، ما رح يتغير في DB');
			} else {
				console.log('تم تعديل الوصف:', contentItems.home_description);
			}

			try {
				const response = await axios.put(`${API_URL}/content`, updatedData, {
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				});
				GetContentItems();
				toast({
					title: 'تم التحديث بنجاح',
					description: 'تم تحديث محتوى الصفحة بنجاح',
					variant: 'success',
				});
			} catch (error) {
				console.error('Error updating content items:', error);
				toast({
					title: 'خطأ في التحديث',
					description: 'فشل في تحديث محتوى الصفحة',
					variant: 'destructive',
				});
			}
		},
		[contentItems, userToken, toast, GetContentItems],
	);

	useEffect(() => {
		GetContentItems();
	}, [GetContentItems]);

	const handleSave = () => {
		toast({
			title: 'تم الحفظ بنجاح',
			description: 'تم حفظ جميع التغييرات',
			variant: 'success',
		});
	};

	return (
		<>
			{/* Content Tab */}
			<TabsContent value="content" className="space-y-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle>محتوى الصفحة الرئيسية</CardTitle>
							<CardDescription>
								تعديل النصوص والرسائل في الصفحة الرئيسية
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<Label>عنوان الصفحة الرئيسية</Label>
									<Input
										placeholder={
											contentItems?.home_title || 'أدخل عنوان الصفحة...'
										}
										className="placeholder:text-gray-400"
										onChange={(e) =>
											setContentItems((prev) =>
												prev ? { ...prev, home_title: e.target.value } : null,
											)
										}
									/>
								</div>
								<div>
									<Label>أدخل وصف الصفحة الرئيسية</Label>
									<Textarea
										placeholder={
											contentItems?.home_description || 'أدخل وصف الصفحة...'
										}
										rows={4}
										className="placeholder:text-gray-400"
										onChange={(e) =>
											setContentItems((prev) =>
												prev
													? { ...prev, home_description: e.target.value }
													: null,
											)
										}
									/>
								</div>
								{/* 
                                كنت عم واجه مشكلة بالوصف انه اذا مسحت كلشي وحطيته فاضي وارسلت رح يقبله ك سترنيج فاضي وهي مشكلة لانو رح تتغير القيم لسترينج فاضي
                                اخترعنا طريقة جديدة للارسال عدلنا القيمة مباشرة بحيث فقط عند الارسال تتعدل لكن بال والجهة مارح يتغير لانو ماعدلناها بالستايت 
                                
                                */}
								<Button
									onClick={() => {
										const dataToUpdate: Partial<ContentItem> = {
											home_title:
												contentItems?.home_title &&
												contentItems.home_title.trim() !== ''
													? contentItems.home_title
													: undefined, // إذا فارغ، نرسل undefined
											home_description:
												contentItems?.home_description &&
												contentItems.home_description.trim() !== ''
													? contentItems.home_description
													: undefined, // إذا فارغ، نرسل undefined
										};

										// إذا ما في أي شيء للتحديث، نرجع بدون إرسال
										if (
											dataToUpdate.home_title === undefined &&
											dataToUpdate.home_description === undefined
										) {
											toast({
												title: 'لا توجد تغييرات',
												description: 'لم يتم إدخال أي محتوى لتحديثه',
												variant: 'warning',
											});
											return;
										}

										handleUpdateContentItems(dataToUpdate);
									}}
								>
									حفظ التغييرات
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>محتوى صفحة من نحن</CardTitle>
							<CardDescription>تعديل معلومات المجتمع وأهدافه</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<Label>عنوان الصفحة</Label>
									<Input placeholder="أدخل عنوان الصفحة..." />
								</div>
								<div>
									<Label>محتوى الصفحة</Label>
									<Textarea placeholder="أدخل محتوى الصفحة..." rows={6} />
								</div>
								<Button onClick={handleSave}>حفظ التغييرات</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Banner Images Management */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<ImagePlus className="mr-2 h-5 w-5" />
							إدارة صور البانر
						</CardTitle>
						<CardDescription>
							تعديل وتحديث الصور التي تظهر في البانر الرئيسي
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BannerImageManager />
					</CardContent>
				</Card>

				{/* logo Images Management */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<ImagePlus className="mr-2 h-5 w-5" />
							إدارة صور الشعار
						</CardTitle>
						<CardDescription>
							تعديل وتحديث الصور التي تظهر في الشعار الصفحة الرئيسية الرئيسي
						</CardDescription>
					</CardHeader>
					<CardContent>
						<LogoManager />
					</CardContent>
				</Card>
			</TabsContent>
		</>
	);
};
export default ContentManager;
