import { z } from 'zod';

// User management schemas
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'الاسم طويل جداً'),
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .max(100, 'كلمة المرور طويلة جداً'),
  student_id: z
    .string()
    .min(1, 'رقم الطالب مطلوب')
    .regex(/^b\d{4}\.\d{6}$/, 'رقم الطالب غير صحيح'),
  phone: z
    .string()
    .optional(),
  major: z
    .string()
    .optional(),
  academic_year: z
    .string()
    .optional(),
  role: z
    .enum(['user', 'admin'])
    .default('user'),
});

export const updateUserSchema = createUserSchema.omit({ password: true }).extend({
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 6,
      'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    ),
});

// Event schemas
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'عنوان الحدث مطلوب')
    .max(255, 'العنوان طويل جداً'),
  description: z
    .string()
    .min(1, 'وصف الحدث مطلوب')
    .max(2000, 'الوصف طويل جداً'),
  date: z
    .string()
    .min(1, 'تاريخ الحدث مطلوب')
    .refine((val) => {
      const date = new Date(val);
      return date > new Date();
    }, 'التاريخ يجب أن يكون في المستقبل'),
  location: z
    .string()
    .min(1, 'مكان الحدث مطلوب')
    .max(255, 'المكان طويل جداً'),
  max_attendees: z
    .number()
    .min(1, 'عدد الحضور يجب أن يكون أكبر من 0')
    .max(10000, 'عدد الحضور كبير جداً')
    .optional(),
  status: z
    .enum(['draft', 'published', 'cancelled'])
    .default('draft'),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      'حجم الصورة يجب أن يكون أقل من 2MB'
    )
    .refine(
      (file) => !file || ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      'نوع الملف غير مدعوم'
    ),
});

// Banner schema
export const bannerSchema = z.object({
  title: z
    .string()
    .max(255, 'العنوان طويل جداً')
    .optional(),
  description: z
    .string()
    .max(1000, 'الوصف طويل جداً')
    .optional(),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      'حجم الصورة يجب أن يكون أقل من 2MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      'نوع الملف غير مدعوم (يُسمح بـ JPG, PNG فقط)'
    ),
  is_active: z
    .boolean()
    .default(true),
});

// Logo schema
export const logoSchema = z.object({
  name: z
    .string()
    .min(1, 'اسم الشعار مطلوب')
    .max(255, 'الاسم طويل جداً'),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      'حجم الصورة يجب أن يكون أقل من 2MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      'نوع الملف غير مدعوم (يُسمح بـ JPG, PNG فقط)'
    ),
  alt_text: z
    .string()
    .max(255, 'النص البديل طويل جداً')
    .optional(),
  position: z
    .enum(['header', 'footer', 'mobile'])
    .default('header'),
});

// FAQ schema
export const faqSchema = z.object({
  question: z
    .string()
    .min(1, 'السؤال مطلوب')
    .max(500, 'السؤال طويل جداً'),
  answer: z
    .string()
    .min(1, 'الإجابة مطلوبة')
    .max(2000, 'الإجابة طويلة جداً'),
  category: z
    .string()
    .min(1, 'الفئة مطلوبة')
    .max(50, 'اسم الفئة طويل جداً'),
  is_published: z
    .boolean()
    .default(true),
});

// Election schema
export const electionSchema = z.object({
  title: z
    .string()
    .min(1, 'عنوان الانتخابات مطلوب')
    .max(255, 'العنوان طويل جداً'),
  description: z
    .string()
    .min(1, 'وصف الانتخابات مطلوب')
    .max(2000, 'الوصف طويل جداً'),
  start_date: z
    .string()
    .min(1, 'تاريخ البداية مطلوب'),
  end_date: z
    .string()
    .min(1, 'تاريخ النهاية مطلوب'),
  status: z
    .enum(['draft', 'active', 'completed'])
    .default('draft'),
}).refine((data) => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  return end > start;
}, {
  message: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
  path: ['end_date'],
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
export type LogoInput = z.infer<typeof logoSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type ElectionInput = z.infer<typeof electionSchema>;