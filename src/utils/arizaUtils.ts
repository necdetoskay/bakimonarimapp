// Arıza tipine göre ikon döndüren fonksiyon
export const getArizaIcon = (tip: string) => {
  switch (tip?.toLowerCase()) {
    case "su":
      return "💧";
    case "elektrik":
      return "⚡";
    case "ısıtma":
      return "🔥";
    case "kapı":
      return "🚪";
    case "asansör":
      return "🔼";
    default:
      return "🔧";
  }
};

// Durum badge'i için renk döndüren fonksiyon
export const getDurumBadgeVariant = (durum: string) => {
  switch(durum) {
    case "Talep Alındı": return "secondary";
    case "Randevu Planlandı": return "warning";
    case "Randevu Yeniden Planlandı": return "warning";
    case "Kısmı Çözüm": return "default";
    case "Çözüm": return "success";
    case "İptal Edildi": return "destructive";
    default: return "secondary";
  }
};

// Arıza toplam masrafını hesapla
export const hesaplaArizaMasrafi = (ariza: any): number => {
  if (!ariza.randevular || ariza.randevular.length === 0) return 0;
  
  let toplamMasraf = 0;
  
  ariza.randevular.forEach((randevu: any) => {
    if (randevu.kullanilanMalzemeler && randevu.kullanilanMalzemeler.length > 0) {
      randevu.kullanilanMalzemeler.forEach((malzeme: any) => {
        toplamMasraf += malzeme.miktar * (malzeme.fiyat || 0);
      });
    }
  });
  
  return toplamMasraf;
};

// Veri getirme fonksiyonu
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Veri çekerken bir hata oluştu");
  }
  return res.json();
}; 