import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL, STORAGE_URL } from '@/config';
import CsrfService from '@/hooks/Csrf';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { Users, UserPlus, Edit, Trash2, Search, Upload, Shield, UserCheck, Instagram, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Member {
  id: number;
  user_id: number;
  student_id: string;
  name: string;
  role: string;
  department?: string;
  major?: string;
  year?: string;
  instagram?: string;
  image?: string;
  is_leader: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

const MembersManager = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    student_id: '',
    role: '',
    department: '',
    instagram: '',
    is_leader: false,
    is_active: true,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch members
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/members`, {
        withCredentials: true,
        headers: { Accept: 'application/json' },
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);

      let errorMessage = 'فشل في جلب بيانات الأعضاء';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 401) {
          errorMessage = 'غير مصرح لك بالوصول لهذه الصفحة';
        } else if (error.response?.status === 500) {
          errorMessage = 'خطأ في الخادم، حاول مرة أخرى لاحقاً';
        }
      }

      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'warning',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle add member
  const handleAddMember = async () => {
    if (!formData.student_id || !formData.role) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'warning',
      });
      return;
    }

    setSubmitting(true);

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        const submitData = new FormData();
        submitData.append('student_id', formData.student_id);
        submitData.append('role', formData.role);
        if (formData.department) submitData.append('department', formData.department);
        if (formData.instagram) submitData.append('instagram', formData.instagram);
        submitData.append('is_leader', formData.is_leader ? '1' : '0');
        submitData.append('is_active', formData.is_active ? '1' : '0');
        submitData.append('display_order', formData.display_order.toString());
        if (imageFile) submitData.append('image', imageFile);

        const response = await axios.post(`${API_URL}/admin/members`, submitData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
            'X-XSRF-TOKEN': csrfToken,
          },
        });
        return response.data;
      });

      toast({
        title: 'نجح',
        description: 'تم إضافة العضو بنجاح',
        variant: 'info',

      });
      setIsAddModalOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);

      let errorMessage = 'فشل في إضافة العضو';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          // Handle validation errors
          const errors = error.response.data.errors;
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } else if (error.response?.status === 404) {
          errorMessage = 'رقم الطالب غير موجود في النظام';
        } else if (error.response?.status === 409) {
          errorMessage = 'هذا الطالب عضو بالفعل';
        }
      }

      toast({
        title: 'خطأ',
        description: errorMessage as string,
        variant: 'warning',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit member
  const handleEditMember = async () => {
    if (!selectedMember) return;

    setSubmitting(true);

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        const submitData = new FormData();
        submitData.append('role', formData.role);
        if (formData.department) submitData.append('department', formData.department);
        if (formData.instagram) submitData.append('instagram', formData.instagram);
        submitData.append('is_leader', formData.is_leader ? '1' : '0');
        submitData.append('is_active', formData.is_active ? '1' : '0');
        submitData.append('display_order', formData.display_order.toString());
        if (imageFile) submitData.append('image', imageFile);
        submitData.append('_method', 'PUT');

        const response = await axios.post(`${API_URL}/admin/members/${selectedMember.id}`, submitData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
            'X-XSRF-TOKEN': csrfToken,
          },
        });
        return response.data;
      });

      toast({
        title: 'نجح',
        description: 'تم تحديث بيانات العضو بنجاح',
        variant: 'info',
      });
      setIsEditModalOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error updating member:', error);

      let errorMessage = 'فشل في تحديث بيانات العضو';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          // Handle validation errors
          const errors = error.response.data.errors;
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }

      toast({
        title: 'خطأ',
        description: errorMessage as string,
        variant: 'warning',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete member
  const handleDeleteMember = async () => {
    if (!selectedMember) return;

    try {
      await CsrfService.withCsrf(async (csrfToken) => {
        const response = await axios.delete(`${API_URL}/admin/members/${selectedMember.id}`, {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': csrfToken,
          },
        });
        return response.data;
      });

      toast({
        title: 'نجح',
        description: 'تم حذف العضو بنجاح',
        variant: 'info',
      });
      setIsDeleteModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);

      let errorMessage = 'فشل في حذف العضو';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }

      toast({
        title: 'خطأ',
        description: errorMessage as string,
        variant: 'info',
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      student_id: '',
      role: '',
      department: '',
      instagram: '',
      is_leader: false,
      is_active: true,
      display_order: 0,
    });
    setImageFile(null);
    setImagePreview('');
    setSelectedMember(null);
  };

  // Open edit modal
  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      student_id: member.student_id,
      role: member.role,
      department: member.department || '',
      instagram: member.instagram || '',
      is_leader: member.is_leader,
      is_active: member.is_active,
      display_order: member.display_order,
    });
    setImagePreview(member.image ? (member.image.startsWith('http') ? member.image : `${STORAGE_URL}/${member.image}`) : '');
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments
  const departments = ['all', ...new Set(members.map(m => m.department).filter(Boolean))];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إدارة الأعضاء
            </CardTitle>
            <CardDescription>إدارة أعضاء الجالية وفريق العمل</CardDescription>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-syria-green-500 text-white hover:bg-syria-green-600">
                <UserPlus className="h-4 w-4" />
                إضافة عضو جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle>إضافة عضو جديد</DialogTitle>
                <DialogDescription>
                  أدخل رقم الطالب ومعلومات العضوية
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="student_id">رقم الطالب *</Label>
                  <Input
                    id="student_id"
                    value={formData.student_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                    placeholder="أدخل رقم الطالب..."
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">المنصب/الدور *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="مثال: رئيس الجالية، مسؤول الفعاليات..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="مثال: الإدارة، الفعاليات، الإعلام..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="instagram">حساب الإنستغرام</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="@username"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="display_order">ترتيب العرض</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">صورة العضو</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_leader"
                      checked={formData.is_leader}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_leader: checked }))}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200"
                    />
                    <Label htmlFor="is_leader" className={`flex items-center gap-1 cursor-pointer ${formData.is_leader ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      <Shield className={`h-4 w-4 ${formData.is_leader ? 'text-blue-600' : 'text-gray-400'}`} />
                      عضو في الإدارة
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
                    />
                    <Label htmlFor="is_active" className={`flex items-center gap-1 cursor-pointer ${formData.is_active ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                      <UserCheck className={`h-4 w-4 ${formData.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                      عضو نشط
                    </Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }} disabled={submitting}>
                  إلغاء
                </Button>
                <Button className='bg-syria-green-500 text-white hover:bg-syria-green-600' onClick={handleAddMember} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    'إضافة العضو'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ابحث بالاسم أو المنصب أو رقم الطالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="جميع الأقسام" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {departments.slice(1).map(dept => (
                <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Members Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-right">الصورة</th>
                  <th className="p-2 text-right">الاسم</th>
                  <th className="p-2 text-right">رقم الطالب</th>
                  <th className="p-2 text-right">المنصب</th>
                  <th className="p-2 text-right">القسم</th>
                  <th className="p-2 text-center">الحالة</th>
                  <th className="p-2 text-center">الإدارة</th>
                  <th className="p-2 text-center">الترتيب</th>
                  <th className="p-2 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                        {member.image ? (
                          <img
                            src={member.image.startsWith('http') ? member.image : `${STORAGE_URL}/${member.image}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-gray-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2">{member.name}</td>
                    <td className="p-2">{member.student_id}</td>
                    <td className="p-2">{member.role}</td>
                    <td className="p-2">{member.department || '-'}</td>
                    <td className="p-2 text-center">
                      {member.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          <UserCheck className="h-3 w-3" />
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                          غير نشط
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {member.is_leader && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                          <Shield className="h-3 w-3" />
                          إدارة
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-center">{member.display_order}</td>
                    <td className="p-2">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openEditModal(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => openDeleteModal(member)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد نتائج
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات العضو</DialogTitle>
            <DialogDescription>
              تعديل معلومات العضو {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>الاسم</Label>
              <Input value={selectedMember?.name || ''} disabled />
            </div>

            <div className="grid gap-2">
              <Label>رقم الطالب</Label>
              <Input value={selectedMember?.student_id || ''} disabled />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_role">المنصب/الدور *</Label>
              <Input
                id="edit_role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_department">القسم</Label>
              <Input
                id="edit_department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_instagram">حساب الإنستغرام</Label>
              <Input
                id="edit_instagram"
                value={formData.instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="@username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_display_order">ترتيب العرض</Label>
              <Input
                id="edit_display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_image">صورة العضو</Label>
              <Input
                id="edit_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(selectedMember?.image ?
                        (selectedMember.image.startsWith('http') ? selectedMember.image : `${STORAGE_URL}/${selectedMember.image}`)
                        : '');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="edit_is_leader"
                  checked={formData.is_leader}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_leader: checked }))}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200"
                />
                <Label htmlFor="edit_is_leader" className={`flex items-center gap-1 cursor-pointer ${formData.is_leader ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                  <Shield className={`h-4 w-4 ${formData.is_leader ? 'text-blue-600' : 'text-gray-400'}`} />
                  عضو في الإدارة
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="edit_is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
                />
                <Label htmlFor="edit_is_active" className={`flex items-center gap-1 cursor-pointer ${formData.is_active ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  <UserCheck className={`h-4 w-4 ${formData.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                  عضو نشط
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              resetForm();
            }} disabled={submitting}>
              إلغاء
            </Button>
            <Button className='bg-syria-green-500 text-white hover:bg-syria-green-600' onClick={handleEditMember} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className='sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف العضو {selectedMember?.name}؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteModalOpen(false)}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction style={{backgroundColor: 'red'}} onClick={handleDeleteMember}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MembersManager;