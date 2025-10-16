import { z } from "zod";

export const REPORT_REASONS = [
  "Harassment",
  "Spam",
  "Misinformation",
  "Hate Speech",
  "Impersonation",
  "Copyright Infringement",
  "Other",
] as const;

export const ReportSchema = z.object({
  reason: z.enum(REPORT_REASONS, {
    required_error:
      "You must select a reason for the report.",
  }),
  details: z
    .string()
    .max(500, "Details cannot exceed 500 characters.")
    .optional(),
});

export type TReportSchema = z.infer<typeof ReportSchema>;
