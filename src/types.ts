export interface Seal {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  userAddress?: string;
  userCity?: string;
  userCountry?: string;
  userTaxId?: string;
  userName?: string;
  userLastName?: string;
}

export interface UserProfile {
  companyName?: string;
  taxId?: string;
  address?: string;
  city?: string;
  country?: string;
  userName?: string;
  userLastName?: string;
  photoURL?: string | null;
  iban?: string;
  defaultCurrency?: string;
  defaultIVA?: number;
  defaultIRPF?: number;
}

export type SealFormData = Omit<Seal, 'id'>;