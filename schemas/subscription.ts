import { z } from "zod";

export const BILLING_CYCLES = ["Mensal", "Anual"] as const;

export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const DEFAULT_CATEGORIES = [
  "Entretenimento",
  "Ferramentas IA",
  "Ferramentas Dev",
  "Design",
  "Produtividade",
  "Nuvem",
  "Música",
  "Outros",
] as const;

export const newSubscriptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(50, "O nome não pode ter mais de 50 caracteres."),

  price: z
    .number()
    .positive("O valor deve ser maior que zero (R$ 0,00).")
    .max(99999, "O valor informado é muito alto."),

  billing: z.enum(BILLING_CYCLES),

  category: z
    .string()
    .trim()
    .min(2, "A categoria deve ter pelo menos 2 caracteres.")
    .max(40, "A categoria não pode ter mais de 40 caracteres."),

  plan: z
    .string()
    .trim()
    .max(50, "O nome do plano não pode ter mais de 50 caracteres.")
    .optional()
    .or(z.literal("")),

  paymentMethod: z
    .string()
    .trim()
    .max(50, "O método de pagamento não pode ter mais de 50 caracteres.")
    .optional()
    .or(z.literal("")),

  renewalDate: z.string().trim().optional(),

  iconKey: z.string().optional(),
  color: z.string().optional(),
});

export type NewSubscriptionFormData = z.infer<typeof newSubscriptionSchema>;

export type FormValidationErrors = Partial<
  Record<keyof NewSubscriptionFormData, string>
>;
