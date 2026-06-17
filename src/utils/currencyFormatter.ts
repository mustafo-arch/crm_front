/**
 * Zarbdor CRM uchun pul summalarini chiroyli formatlash utiliti.
 * @param amount format qilinishi kerak bo'lgan raqam yoki satr
 * @param suffix qo'shimcha birlik ('so'm' yoki 'UZS'), standart holatda 'so'm'
 * @returns formatlangan satr (masalan: "1 200 000 so'm")
 */
export const formatCurrency = (
  amount: number | string | undefined | null,
  suffix: 'so\'m' | 'UZS' = 'so\'m'
): string => {
  if (amount === undefined || amount === null) {
    return `0 ${suffix}`;
  }

  // Agar string ko'rinishida kelsa, raqamga o'giramiz
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Agar noto'g'ri qiymat bo'lsa (NaN), xavfsizlik uchun 0 qaytaramiz
  if (isNaN(numericAmount)) {
    return `0 ${suffix}`;
  }

  // Intl.NumberFormat o'rniga uz-UZ yoki ru-RU probellar bilan chiroyli ajratib beradi
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);

  return `${formatted} ${suffix}`;
};