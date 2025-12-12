import * as z from 'zod'

// Login schema
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
})
export type TLoginSchema = z.infer<typeof LoginSchema>

// Check if the user is 18 years old or older
const eighteenYearsAgo = new Date()
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)

// Register schema
export const RegisterFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required.')
    .max(50, 'First name must be no longer than 50 characters.')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes.'
    ),
  lastName: z
    .string()
    .min(1, 'Last name is required.')
    .max(50, 'Last name must be no longer than 50 characters.')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes.'
    ),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long.')
    .max(24, 'Username must be no longer than 24 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  birthday: z
    .date({
      error: 'Your date of birth is required.',
    })
    .max(eighteenYearsAgo, { message: 'You must be at least 18 years old to use Synapse.' }),
  gender: z.enum([ 'MALE', 'FEMALE' ], {
    message: 'Please select a gender.',
  }),
})
export type TRegisterFormSchema = z.infer<typeof RegisterFormSchema>

// Verify code schema
export const VerifyEmailSchema = z.object({
  code: z.string().min(6, { message: 'Your code must be 6 digits.' }),
})
export type TVerifyEmailSchema = z.infer<typeof VerifyEmailSchema>

// Change password schema
export const ChangePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required."),
  new_password: z.string().min(8, "New password must be at least 8 characters."),
  confirm_password: z.string()
}).refine(data => data.new_password === data.confirm_password, {
  message: "New passwords don't match",
  path: [ "confirmPassword" ],
});

export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;


// Reset password schema
export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, "The reset code must be 6 digits."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: [ "confirmPassword" ],
});
export type TResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
