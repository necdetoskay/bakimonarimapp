// Türkçe tarih formatlama
export const formatTarih = (tarih: string | Date) => {
  if (!tarih) return "";
  const date = new Date(tarih);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Türkçe para birimi formatlama
export const formatPara = (tutar: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(tutar);
};

// Türkçe saat formatlama
export const formatSaat = (tarih: string | Date) => {
  if (!tarih) return "";
  const date = new Date(tarih);
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}; 