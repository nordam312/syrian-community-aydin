import { API_URL } from '@/config';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CsrfService from '@/hooks/Csrf';
import { sanitizeInput, sanitizeHTML } from '@/utils/sanitize';
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
import { Plus, Edit, Trash2, Loader2, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
import { HelpCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Linkify } from '@/utils/linkify';

interface FAQItem {
  id?: number;
  question: string;
  answer: string;
  order: number;
  category: string;
  created_at?: string;
  updated_at?: string;
}

const FAQManager = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [filteredFaqItems, setFilteredFaqItems] = useState<FAQItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // قائمة التصنيفات الثابتة
  const categories = [
    { id: 'all', name: 'جميع الفئات' },
    { id: 'general', name: 'عام' },
    { id: 'services', name: 'خدمات' },
    { id: 'fees', name: 'رسوم' },
    { id: 'volunteering', name: 'تطوع' },
  ];

  const getFAQItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/faqs`, {
        withCredentials: true,
        headers: { Accept: 'application/json' },
      });
      setFaqItems(response.data);
      setFilteredFaqItems(response.data);
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
      toast({
        title: 'خطأ في جلب البيانات',
        description: 'فشل في جلب الأسئلة الشائعة',
        variant: 'warning',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreateFAQ = useCallback(async (faqData: Omit<FAQItem, 'id'>) => {
    setUpdateLoading(true);
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(`${API_URL}/faqs`, faqData, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      });
      await getFAQItems();
      toast({
        title: 'تم الإضافة بنجاح',
        description: 'تم إضافة السؤال الشائع بنجاح',
        variant: 'success',
      });
      setIsDialogOpen(false);
      setEditingItem(null); // إعادة تعيين حالة التحرير
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'حدث خطأ غير متوقع';
      toast({
        title: 'خطأ في الإضافة',
        description: errorMessage,
        variant: 'warning',
      });
    } finally {
      setUpdateLoading(false);
    }
  }, [toast, getFAQItems]);

  const handleUpdateFAQ = useCallback(async (id: number, faqData: Partial<FAQItem>) => {
    setUpdateLoading(true);
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.post(`${API_URL}/faqs/${id}`, faqData, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      });
      await getFAQItems();
      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث السؤال الشائع بنجاح',
        variant: 'success',
      });
      setIsDialogOpen(false);
      setEditingItem(null);
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
  }, [toast, getFAQItems]);

  const handleDeleteFAQ = useCallback(async (id: number) => {
    setUpdateLoading(true);
    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.delete(`${API_URL}/faqs/${id}`, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            Accept: 'application/json',
          },
        });
      });
      await getFAQItems();
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف السؤال الشائع بنجاح',
        variant: 'success',
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'حدث خطأ غير متوقع';
      toast({
        title: 'خطأ في الحذف',
        description: errorMessage,
        variant: 'warning',
      });
    } finally {
      setUpdateLoading(false);
    }
  }, [toast, getFAQItems]);

  const handleMoveItem = useCallback(async (id: number, direction: 'up' | 'down') => {
    const itemIndex = faqItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && itemIndex === 0) ||
      (direction === 'down' && itemIndex === faqItems.length - 1)
    ) {
      return;
    }

    const newItems = [...faqItems];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;

    // Swap the orders
    [newItems[itemIndex].order, newItems[targetIndex].order] =
      [newItems[targetIndex].order, newItems[itemIndex].order];

    // Swap the items in the array
    [newItems[itemIndex], newItems[targetIndex]] =
      [newItems[targetIndex], newItems[itemIndex]];

    setFaqItems(newItems);

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        await axios.put(`${API_URL}/faqs/${id}/order`, {
          order: newItems[itemIndex].order,
          direction
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      });
    } catch (error) {
      console.error('Error updating order:', error);
      // Revert on error
      getFAQItems();
    }
  }, [faqItems, getFAQItems]);

  // تصفية الأسئلة حسب التصنيف
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFaqItems(faqItems);
    } else {
      // البحث عن اسم التصنيف المناسب بناءً على ID
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.id || selectedCategory;
      setFilteredFaqItems(faqItems.filter(item => item.category === categoryName));
    }
  }, [selectedCategory, faqItems]);

  useEffect(() => {
    getFAQItems();
  }, [getFAQItems]);

  const openEditDialog = (item: FAQItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem({
      question: '',
      answer: '',
      order: faqItems.length > 0 ? Math.max(...faqItems.map(item => item.order)) + 1 : 0,
      category: 'عام'
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-syria-green-600"></div>
          <div className="animate-ping absolute top-0 left-0 h-12 w-12 rounded-full border border-syria-green-400 opacity-75"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-syria-green-700">جاري تحميل الأسئلة الشائعة...</p>
          <p className="text-sm text-gray-600">يرجى الانتظار قليلاً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-page-enter">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الأسئلة الشائعة</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-syria-green-500 text-white hover:bg-syria-green-600"
              onClick={openCreateDialog}
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة سؤال جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem?.id ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
              </DialogTitle>
              <DialogDescription>
                {editingItem?.id
                  ? 'قم بتعديل السؤال والإجابة ثم اضغط على حفظ'
                  : 'أضف سؤالاً جديداً إلى قائمة الأسئلة الشائعة'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="question">السؤال</Label>
                <Input
                  id="question"
                  placeholder="أدخل السؤال..."
                  value={editingItem?.question || ''}
                  onChange={(e) =>
                    setEditingItem(prev =>
                      prev ? { ...prev, question: sanitizeInput(e.target.value) } : {
                        question: sanitizeInput(e.target.value),
                        answer: '',
                        order: 0,
                        category: 'general'
                      }
                    )
                  }
                  dir="auto"
                  style={{ unicodeBidi: 'plaintext' }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="answer">الإجابة</Label>
                <Textarea
                  id="answer"
                  rows={5}
                  placeholder="أدخل الإجابة..."
                  value={editingItem?.answer || ''}
                  onChange={(e) =>
                    setEditingItem(prev =>
                      prev ? { ...prev, answer: sanitizeInput(e.target.value) } : {
                        question: '',
                        answer: sanitizeInput(e.target.value),
                        order: 0,
                        category: 'general'
                      }
                    )
                  }
                  dir="auto"
                  style={{ unicodeBidi: 'plaintext' }}
                />
              </div>
              <div className="grid gap-2 ">
                <Label htmlFor="category">التصنيف</Label>
                <Select
                  
                  value={editingItem?.category || 'general'}
                  onValueChange={(value) =>
                    setEditingItem(prev =>
                      prev ? { ...prev, category: value } : {
                        question: '',
                        answer: '',
                        order: 0,
                        category: value
                      }
                    )
                  }
                >
                  <SelectTrigger className='bg-white'>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">عام</SelectItem>
                    <SelectItem value="services">خدمات</SelectItem>
                    <SelectItem value="fees">رسوم</SelectItem>
                    <SelectItem value="volunteering">تطوع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <Button
                className="bg-syria-green-500 text-white hover:bg-syria-green-600"
                onClick={() => {
                  if (editingItem) {
                    if (editingItem.id) {
                      // تحديث سؤال موجود
                      handleUpdateFAQ(editingItem.id, editingItem);
                    } else {
                      // إضافة سؤال جديد
                      handleCreateFAQ(editingItem);
                    }
                  }
                }}
                disabled={updateLoading || !editingItem?.question || !editingItem?.answer}
              >
                {updateLoading && <Loader2 className="animate-spin ml-2 h-4 w-4" />}
                {editingItem?.id ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* فلترة حسب التصنيف */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5" />
            <Label htmlFor="category-filter">تصفية حسب التصنيف:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              ({filteredFaqItems.length} من أصل {faqItems.length} سؤال)
            </span>
          </div>
        </CardContent>
      </Card>

      {filteredFaqItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {selectedCategory === 'all'
                  ? 'لا توجد أسئلة شائعة حتى الآن'
                  : `لا توجد أسئلة في تصنيف "${categories.find(cat => cat.id === selectedCategory)?.name || selectedCategory}"`
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ابدأ بإضافة أول سؤال بالضغط على زر "إضافة سؤال جديد"
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFaqItems.map((item, index) => (
            <Card key={item.id} className="animate-page-enter">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-syria-green-100 text-syria-green-800 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-lg" dir="auto" style={{ unicodeBidi: 'plaintext' }}>{sanitizeInput(item.question)}</h3>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-line" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                      <Linkify text={sanitizeInput(item.answer)} />
                    </p>
                  </div>
                  <div className="flex flex-col ml-4 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveItem(item.id!, 'up')}
                      disabled={index === 0 || updateLoading}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveItem(item.id!, 'down')}
                      disabled={index === filteredFaqItems.length - 1 || updateLoading}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(item)}
                      disabled={updateLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteFAQ(item.id!)}
                      disabled={updateLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQManager;