import { API_URL } from '@/config';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { TabsContent } from '../ui/tabs';
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
import { ImagePlus, Loader2 } from 'lucide-react';
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
  const [contentItems, setContentItems] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { toast } = useToast();
  const userToken = localStorage.getItem('userToken');

  const GetContentItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/content`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setContentItems(response.data);
    } catch (error) {
      console.error('Error fetching content items:', error);
      toast({
        title: 'خطأ في جلب البيانات',
        description: 'فشل في جلب محتوى الصفحة',
        variant: 'warning',
      });
    } finally {
      setLoading(false);
    }
  }, [userToken, toast]);

  const handleUpdateContentItems = useCallback(
    async (updatedData: Partial<ContentItem>) => {
      setUpdateLoading(true);
      try {
        await axios.put(`${API_URL}/content`, updatedData, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        await GetContentItems();
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث محتوى الصفحة بنجاح',
          variant: 'success',
        });
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || 'حدث خطأ غير متوقع';

        toast({
          title: 'خطأ في التحديث',
          description: errorMessage,
          variant: 'warning',
        });
      } finally {
        setUpdateLoading(false);
      }
    },
    [userToken, toast, GetContentItems],
  );

  useEffect(() => {
    GetContentItems();
  }, [GetContentItems]);

  if (loading || !contentItems) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-green-600"></div>
          <div className="animate-ping absolute top-0 left-0 h-12 w-12 rounded-full border border-syria-green-400 opacity-75"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-syria-green-700">جاري تحميل بيانات المحتوى...</p>
          <p className="text-sm text-gray-600">يرجى الانتظار قليلاً</p>
        </div>
      </div>
    );
  }

  return (
    <TabsContent value="content" className="space-y-6 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الصفحة الرئيسية */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>محتوى الصفحة الرئيسية</CardTitle>
            <CardDescription>
              تعديل النصوص والرسائل في الصفحة الرئيسية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان الصفحة الرئيسية</Label>
              <Input
                placeholder="أدخل عنوان الصفحة..."
                value={contentItems.home_title || ''}
                onChange={(e) =>
                  setContentItems((prev) =>
                    prev ? { ...prev, home_title: e.target.value } : null,
                  )
                }
              />
            </div>
            <div>
              <Label>وصف الصفحة الرئيسية</Label>
              <Textarea
                rows={4}
                placeholder="أدخل وصف الصفحة..."
                value={contentItems.home_description || ''}
                onChange={(e) =>
                  setContentItems((prev) =>
                    prev ? { ...prev, home_description: e.target.value } : null,
                  )
                }
              />
            </div>
            <Button
              className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() =>
                handleUpdateContentItems({
                  home_title: contentItems.home_title,
                  home_description: contentItems.home_description,
                })
              }
              disabled={updateLoading}
            >
              {updateLoading && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* صفحة من نحن */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>محتوى صفحة من نحن</CardTitle>
            <CardDescription>تعديل معلومات المجتمع وأهدافه</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان الصفحة</Label>
              <Input
                placeholder="أدخل عنوان الصفحة..."
                value={contentItems.about_title || ''}
                onChange={(e) =>
                  setContentItems((prev) =>
                    prev ? { ...prev, about_title: e.target.value } : null,
                  )
                }
              />
            </div>
            <div>
              <Label>محتوى الصفحة</Label>
              <Textarea
                rows={6}
                placeholder="أدخل محتوى الصفحة..."
                value={contentItems.about_content || ''}
                onChange={(e) =>
                  setContentItems((prev) =>
                    prev ? { ...prev, about_content: e.target.value } : null,
                  )
                }
              />
            </div>
            <Button
              className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() =>
                handleUpdateContentItems({
                  about_title: contentItems.about_title,
                  about_content: contentItems.about_content,
                })
              }
              disabled={updateLoading}
            >
              {updateLoading && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* معلومات التواصل */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>معلومات التواصل</CardTitle>
          <CardDescription>تحديث البريد، الهاتف، والعنوان</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input
              placeholder="أدخل البريد الإلكتروني..."
              value={contentItems.contact_email || ''}
              onChange={(e) =>
                setContentItems((prev) =>
                  prev ? { ...prev, contact_email: e.target.value } : null,
                )
              }
            />
          </div>
          <div>
            <Label>رقم الهاتف</Label>
            <Input
              placeholder="أدخل رقم الهاتف..."
              value={contentItems.contact_phone || ''}
              onChange={(e) =>
                setContentItems((prev) =>
                  prev ? { ...prev, contact_phone: e.target.value } : null,
                )
              }
            />
          </div>
          <div>
            <Label>العنوان</Label>
            <Textarea
              rows={3}
              placeholder="أدخل العنوان..."
              value={contentItems.contact_address || ''}
              onChange={(e) =>
                setContentItems((prev) =>
                  prev ? { ...prev, contact_address: e.target.value } : null,
                )
              }
            />
          </div>
          <Button
            className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() =>
              handleUpdateContentItems({
                contact_email: contentItems.contact_email,
                contact_phone: contentItems.contact_phone,
                contact_address: contentItems.contact_address,
              })
            }
            disabled={updateLoading}
          >
            {updateLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            حفظ التغييرات
          </Button>
        </CardContent>
      </Card>

      {/* وسائل التواصل الاجتماعي */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
          <CardDescription>
            تحديث روابط الفيسبوك، إنستغرام، وتليجرام
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>فيسبوك</Label>
            <Input
              placeholder="أدخل رابط فيسبوك..."
              value={contentItems.social_facebook || ''}
              onChange={(e) =>
                setContentItems((prev) =>
                  prev ? { ...prev, social_facebook: e.target.value } : null,
                )
              }
            />
          </div>
          <div>
            <Label>إنستغرام</Label>
            <Input
              placeholder="أدخل رابط إنستغرام..."
              value={contentItems.social_instagram || ''}
              onChange={(e) =>
                setContentItems((prev) =>
                  prev ? { ...prev, social_instagram: e.target.value } : null,
                )
              }
            />
          </div>
          <div>
            <Label>تليجرام</Label>
            <Input
              placeholder="أدخل رابط تليجرام..."
              value={contentItems.social_telegram || ''}
              onChange={(e) =>
                setContentItems((prev) =>
                  prev ? { ...prev, social_telegram: e.target.value } : null,
                )
              }
            />
          </div>
          <Button
            className="bg-syria-green-500 text-white hover:bg-syria-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() =>
              handleUpdateContentItems({
                social_facebook: contentItems.social_facebook,
                social_instagram: contentItems.social_instagram,
                social_telegram: contentItems.social_telegram,
              })
            }
            disabled={updateLoading}
          >
            {updateLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            حفظ التغييرات
          </Button>
        </CardContent>
      </Card>

      {/* Banner Images Management */}
      <Card className="animate-fade-in">
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

      {/* Logo Images Management */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImagePlus className="mr-2 h-5 w-5" />
            إدارة صور الشعار
          </CardTitle>
          <CardDescription>
            تعديل وتحديث الصور التي تظهر في الشعار الصفحة الرئيسية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogoManager />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ContentManager;
