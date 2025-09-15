import { useState, useEffect } from 'react';
import axios from 'axios';
import CsrfService from '@/hooks/Csrf';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import { API_URL } from '@/config';
import { STORAGE_URL } from '@/config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Banner {
  id: number;
  title: string;
  image: string;
  description?: string;
  is_active: boolean;
  order: number;
}

const BannerImageManager = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    is_active: false,
    order: 0,
  });
  const [showDialog, setShowDialog] = useState(false);

  const { toast } = useToast();
  // userToken removed - using sessions instead

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API_URL}/banners/all`, {
        withCredentials: true,
        headers: { Accept: 'application/json' },
      });
      setBanners(response.data);
    } catch (error) {
      toast({
        title: 'خطأ في تحميل الصور',
        description: 'فشل في تحميل صور البانر',
        variant: 'warning',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('is_active', formData.is_active ? '1' : '0');
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      // if (editingBanner) {
      // 	await axios.post(
      // 		`${API_URL}/banners/${editingBanner.id}`,
      // 		formDataToSend,
      // 		{
      // 			headers: {
      // 				Authorization: `Bearer ${userToken}`,
      // 				'Content-Type': 'multipart/form-data',
      // 			},
      // 		},
      // 	);
      // 	toast({ title: 'تم التحديث بنجاح', variant: 'success' });
      // } else {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(`${API_URL}/banners`, formDataToSend, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'multipart/form-data',
          },
        });
      });
      toast({ title: 'تم الإضافة بنجاح', variant: 'success' });
      resetForm();
      fetchBanners();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || '';
      console.log(errorMessage);

      toast({
        title: 'خطأ',
        description: 'فشل في حفظ الصورة',
        variant: 'warning',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.delete(`${API_URL}/banners/${id}`, {
          withCredentials: true,
          headers: { 
            'X-XSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
          },
        });
      });
      toast({ title: 'تم الحذف بنجاح', variant: 'success' });
      fetchBanners();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الصورة',
        variant: 'warning',
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
    // setEditingBanner(null);
    setShowDialog(false); // يغلق الديالوج عند الإلغاء
  };

  // to do: maybe do it in future
  // const handleEdit = (banner: Banner) => {
  // 	setEditingBanner(banner);
  // 	setFormData({
  // 		title: banner.title,
  // 		description: banner.description || '',
  // 		image: null,
  // 		is_active: banner.is_active,
  // 		order: banner.order,
  // 	});
  // 	setShowDialog(true);
  // };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(
          `${API_URL}/banners/${banner.id}`,
          {
            is_active: !banner.is_active,
          },
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
      });

      // تحديث حالة اللوجو محلياً لتجنب الحاجة لإعادة تحميل الكل
      setBanners((prevBanners) =>
        prevBanners.map((item) =>
          item.id === banner.id
            ? { ...item, is_active: !item.is_active }
            : item,
        ),
      );
      fetchBanners();

      toast({
        title: 'تم بنجاح',
        variant: 'success',
        description: 'تم تحديث حالة البانر',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">صور البانر الحالية</h3>
        <Button
          onClick={() => setShowDialog(true)}
          className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
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
                {/* <span className="text-xs text-gray-500">
									الترتيب: {banner.order}
								</span> */}
                <div className="flex space-x-2">
                  {/* <Button
										size="sm"
										variant="outline"
										onClick={() => handleEdit(banner)}
									>
										<Edit className="h-3 w-3" />
									</Button> */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setDeleteId(banner.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleToggleActive(banner)}
              >
                {/* الدائرة الصغيرة */}
                <span
                  className={`
											w-3 h-3 rounded-full border
											${
                        banner.is_active
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white border-gray-400'
                      }
											transition-colors duration-300
											`}
                ></span>
                {/* النص */}
                <span className="text-sm">
                  {banner.is_active ? 'مفعل' : 'غير مفعل'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editingBanner ? 'تعديل صورة البانر' : 'إضافة صورة بانر جديدة'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              {editingBanner
                ? 'قم بتحديث تفاصيل الصورة وإضافة صورة جديدة إذا أحببت.'
                : 'قم برفع صورة جديدة للبانر وتحديد التفاصيل.'}
            </DialogDescription>
          </DialogHeader>
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
            {/* <div>
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
								min={0}
							/>
						</div> */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
              <Label>تفعيل</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
              <Button
                className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
                type="submit"
              >
                حفظ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Dialog for Confirm deletion */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p>هل أنت متأكد من حذف هذه الصورة؟ لن تتمكن من استعادتها.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              إلغاء
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (!deleteId) return;
                try {
                  await CsrfService.withCsrf(async (csrfToken) => {
                    await axios.delete(`${API_URL}/banners/${deleteId}`, {
                      withCredentials: true,
                      headers: { 
                        'X-XSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                      },
                    });
                  });
                  toast({ title: 'تم الحذف بنجاح', variant: 'success' });
                  fetchBanners();
                } catch (error) {
                  toast({
                    title: 'خطأ',
                    description: 'فشل في حذف الصورة',
                    variant: 'warning',
                  });
                } finally {
                  setDeleteId(null);
                }
              }}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerImageManager;
