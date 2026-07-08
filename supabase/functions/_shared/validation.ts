// Validation serveur — port de validateForm() du plugin WordPress.

export interface ClientInput {
  member_marital1?: string; // Monsieur / Madame
  member_lastname?: string;
  member_firstname?: string;
  member_email?: string;
  member_dob?: string; // jj.mm.aaaa
  member_phone?: string; // 9 chiffres sans le 0
  member_address?: string;
  member_npa?: string;
  member_city?: string;
  conditions_fitness?: boolean | string;
}

const LABELS: Record<string, string> = {
  member_lastname: "Nom",
  member_firstname: "Prénom",
  member_email: "Email",
  member_dob: "Date de naissance",
  member_phone: "Téléphone",
  member_marital1: "Civilité",
  member_address: "Adresse",
  member_npa: "NPA",
  member_city: "Ville",
  conditions_fitness: "Conditions de GreenFit",
};

const REQUIRED = [
  "member_lastname",
  "member_firstname",
  "member_email",
  "member_marital1",
  "member_dob",
  "member_phone",
  "member_address",
  "member_npa",
  "member_city",
  "conditions_fitness",
] as const;

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// 9 chiffres (mobile suisse sans le 0 initial), ex 79 123 45 67
function isPhone(v: string): boolean {
  const digits = v.replace(/\D/g, "");
  return digits.length === 9 && digits[0] !== "0";
}

function isDob(v: string): boolean {
  const m = v.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return false;
  const [, dd, mm, yyyy] = m;
  const d = new Date(`${yyyy}-${mm}-${dd}`);
  return !Number.isNaN(d.getTime());
}

export function validateClient(input: ClientInput): {
  success: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const empty: string[] = [];

  for (const field of REQUIRED) {
    const value = input[field];
    if (value === undefined || value === null || value === "" || value === false) {
      empty.push(LABELS[field]);
    }
  }

  if (empty.length === 1) {
    errors.push(`Le champ ${empty[0]} est obligatoire`);
  } else if (empty.length > 1) {
    errors.push(`Les champs ${empty.join(", ")} sont obligatoires`);
  }

  if (input.member_email && !isEmail(input.member_email)) {
    errors.push("Le format de l'email n'est pas valide");
  }
  if (input.member_phone && !isPhone(input.member_phone)) {
    errors.push("Le numéro de téléphone doit contenir 9 chiffres (sans le 0)");
  }
  if (input.member_dob && !isDob(input.member_dob)) {
    errors.push("Le format de la date doit être jj.mm.aaaa");
  }

  return { success: errors.length === 0, errors };
}

// jj.mm.aaaa -> aaaammjj (pour le SOAP)
export function dobToYmd(dob: string): string {
  const m = dob.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  return `${yyyy}${mm}${dd}`;
}
