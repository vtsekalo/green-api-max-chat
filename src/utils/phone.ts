export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function validatePhone(phone: string): string | null {
  const normalized = normalizePhone(phone);

  if (!normalized) {
    return "Введите номер телефона.";
  }

  if (normalized.length < 7) {
    return "Номер телефона слишком короткий.";
  }

  if (normalized.length > 15) {
    return "Номер телефона слишком длинный.";
  }

  return null;
}

export function phoneToChatId(phone: string): string {
  const error = validatePhone(phone);

  if (error) {
    throw new Error(error);
  }

  return `${normalizePhone(phone)}@c.us`;
}