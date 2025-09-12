import { z } from 'zod';

// Regular expression for student ID format
const studentIdRegex = /^b\d{4}\.\d{6}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .max(100, 'كلمة المرور طويلة جداً'),
});

export const registerSchema = z.object({
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
    .max(100, 'كلمة المرور طويلة جداً')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'
    ),
  confirmPassword: z
    .string()
    .min(1, 'تأكيد كلمة المرور مطلوب'),
  student_id: z
    .string()
    .min(1, 'رقم الطالب مطلوب')
    .regex(studentIdRegex, 'رقم الطالب غير صحيح (مثال: b2021.123456)'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+90|0)?[0-9]{10}$/.test(val),
      'رقم الهاتف غير صحيح'
    ),
  major: z
    .string()
    .optional(),
  academic_year: z
    .string()
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .max(100, 'كلمة المرور طويلة جداً')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'
    ),
  confirmPassword: z
    .string()
    .min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

export const updateEmailSchema = z.object({
  currentEmail: z
    .string()
    .min(1, 'البريد الإلكتروني الحالي مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  newEmail: z
    .string()
    .min(1, 'البريد الإلكتروني الجديد مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
}).refine((data) => data.currentEmail !== data.newEmail, {
  message: 'البريد الإلكتروني الجديد يجب أن يكون مختلفاً عن الحالي',
  path: ['newEmail'],
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;