"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MapPin, Edit, Trash2, Building2, Upload, X, Image as ImageIcon, Eye, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Proje = {
  id: string;
  ad: string;
  adres: string;
  konum: string | null;
  image: string | null;
  ekbilgi: string | null;
  createdAt: string;
  updatedAt: string;
};

// Fetch fonksiyonu tanımlama
const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = new Error('Veri çekerken bir hata oluştu');
    throw error;
  }
  
  return res.json();
};

// Yer tutucu resim değeri
const placeholderImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";

const ProjectCard = ({ proje, handleOpenEditProject, deleteProje, blokSayisi }: { proje: Proje; handleOpenEditProject: (proje: Proje) => void; deleteProje: (proje: Proje) => void; blokSayisi: number }) => {
  return (
    <Link href={`/dashboard/projeler/${proje.id}`} className="group block">
      <div 
        className="h-72 w-full overflow-hidden rounded-xl shadow-md transition-all duration-200 hover:shadow-lg relative"
      >
        {/* Resim Alanı - Sabit yükseklik ve genişlik */}
        <div className="absolute inset-0 h-full w-full">
          {proje.image && proje.image.trim() !== "" ? (
            <div className="h-40 w-full overflow-hidden">
              <img 
                src={proje.image} 
                alt={proje.ad}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-40 w-full relative bg-slate-100">
              <img 
                src={placeholderImage} 
                alt="Varsayılan proje resmi"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-200/30">
                <Building2 className="h-20 w-20 text-slate-400" />
              </div>
            </div>
          )}
        
          {/* Karartma Katmanı - Sadece resim üzerinde */}
          <div className="absolute inset-0 h-40 bg-gradient-to-t from-black/75 via-black/40 to-transparent"></div>
        </div>
        
        {/* İçerik - Altta sabit konumlu */}
        <div className="relative pt-40 h-full flex flex-col justify-between p-4">
          <div>
            {/* Proje Adı ve İşlem Butonları - Yan Yana */}
            <div className="flex items-center justify-between mb-1 px-3 py-1 rounded-md">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-700" />
                <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{proje.ad}</h3>
              </div>
              
              {/* İşlem Butonları - Adın Yanına Taşındı */}
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-90 hover:opacity-100 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary rounded-md transform transition-all duration-200 hover:scale-110 hover:shadow-md h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenEditProject(proje);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-90 hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 rounded-md transform transition-all duration-200 hover:scale-110 hover:shadow-md h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteProje(proje);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-slate-700 mb-2 line-clamp-1">{proje.adres}</p>
            <div className="flex items-center gap-1 mb-3">
              <div className="bg-primary/80 text-white rounded-md px-2 py-1 text-xs font-medium">
                {blokSayisi} Blok
              </div>
            </div>
            {proje.ekbilgi && (
              <p className="text-sm text-slate-600 line-clamp-2 mb-2">{proje.ekbilgi}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ProjelerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // useSWR hook'u ile veri çekme
  const { data: projeler, error, isLoading: isLoadingProjeler } = useSWR<Proje[]>(
    status === "authenticated" ? '/api/projeler' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000 // 10 saniye içinde tekrar sorgu yapılmasını engeller
    }
  );
  
  const isLoading = status === "loading" || isLoadingProjeler;
  
  // Projelerin blok sayılarını tutacak state
  const [blokSayilari, setBlokSayilari] = useState<Record<string, number>>({});
  
  // Projelerin blok sayılarını çek
  useEffect(() => {
    if (projeler && projeler.length > 0) {
      const fetchBlokSayilari = async () => {
        const yeniBlokSayilari: Record<string, number> = {};
        
        for (const proje of projeler) {
          try {
            const response = await fetch(`/api/bloklar?projeId=${proje.id}`);
            if (response.ok) {
              const data = await response.json();
              yeniBlokSayilari[proje.id] = data.length;
            } else {
              yeniBlokSayilari[proje.id] = 0;
            }
          } catch (error) {
            console.error(`Blok sayısı alınırken hata: ${proje.id}`, error);
            yeniBlokSayilari[proje.id] = 0;
          }
        }
        
        setBlokSayilari(yeniBlokSayilari);
      };
      
      fetchBlokSayilari();
    }
  }, [projeler]);
  
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProje, setSelectedProje] = useState<Proje | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tabView, setTabView] = useState("grid");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state
  const [newProject, setNewProject] = useState({ ad: "", adres: "", ekbilgi: "" });
  const [editProject, setEditProject] = useState<Proje | null>(null);
  
  // Input refs
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Form modalları açıldığında veya kapandığında önizlemeyi temizle
  useEffect(() => {
    if (!isAddingProject) {
      // Ekleme formu kapandığında temizle
      setNewProject({ ad: "", adres: "", ekbilgi: "" });
      if (addFileInputRef.current) addFileInputRef.current.value = "";
    }
    
    if (!isEditing) {
      // Düzenleme formu kapandığında temizle
      setEditProject(null);
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    }
    
    if (!isAddingProject && !isEditing) {
      // Her iki form da kapalıysa seçili projeyi temizle
      setSelectedProje(null);
    }
  }, [isAddingProject, isEditing]);
  
  // Düzenleme modalı açıldığında file input'u sıfırla
  useEffect(() => {
    if (isEditing && editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  }, [isEditing]);
  
  // Ekleme modalı açıldığında file input'u sıfırla
  useEffect(() => {
    if (isAddingProject && addFileInputRef.current) {
      addFileInputRef.current.value = "";
    }
  }, [isAddingProject]);
  
  // Resim yükleme fonksiyonu
  const handleImageUpload = async (file: File): Promise<string> => {
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Resim yüklenirken bir hata oluştu");
      }
      
      setUploadingImage(false);
      return data.url;
    } catch (error: any) {
      setUploadingImage(false);
      throw new Error(error.message || "Resim yüklenirken bir hata oluştu");
    }
  };
  
  // Dosya seçildiğinde çalışacak fonksiyon
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Dosya tipi kontrolü
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast({
        title: "Hata",
        description: "Sadece JPG ve PNG dosyaları yüklenebilir",
        variant: "destructive",
      });
      return;
    }
    
    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan küçük olmalıdır",
        variant: "destructive",
      });
      return;
    }
    
    // Önizleme için URL oluştur
    const previewUrl = URL.createObjectURL(file);
    
    // Eğer selectedProje null ise yeni bir obje oluştur
    if (!selectedProje) {
      setSelectedProje({ 
        id: "", 
        ad: "", 
        adres: "", 
        konum: null, 
        image: previewUrl, 
        ekbilgi: null, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      });
    } else {
      // Var olan selectedProje'yi güncelle
      setSelectedProje({ ...selectedProje, image: previewUrl });
    }
    
    try {
      // Resmi yükle
      const imageUrl = await handleImageUpload(file);
      
      // selectedProje state'ini güncelle
      if (!selectedProje) {
        setSelectedProje({ 
          id: "", 
          ad: "", 
          adres: "", 
          konum: null, 
          image: imageUrl, 
          ekbilgi: null, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        });
      } else {
        setSelectedProje({ ...selectedProje, image: imageUrl });
      }
      
      toast({
        title: "Başarılı",
        description: "Resim başarıyla yüklendi",
      });
    } catch (error: any) {
      console.error("Resim yükleme hatası:", error);
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Resmi kaldır - Eski fonksiyon, siliniyor
  const handleRemoveImage = () => {
    setSelectedProje(null);
    if (addFileInputRef.current) addFileInputRef.current.value = "";
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };
  
  // Düzenleme formunda resmi sil
  const handleRemoveEditImage = () => {
    if (editProject) {
      setEditProject({...editProject, image: null});
    }
    if (selectedProje) {
      setSelectedProje({...selectedProje, image: null});
    }
    
    toast({
      title: "Bilgi",
      description: "Proje resmi kaldırıldı. Kaydetmek için 'Güncelle' butonuna tıklayın.",
    });
  };
  
  // Yeni ekleme formunda resmi sil
  const handleRemoveAddImage = () => {
    if (selectedProje) {
      setSelectedProje({...selectedProje, image: null});
    }
    
    toast({
      title: "Bilgi",
      description: "Resim kaldırıldı.",
    });
  };
  
  // Yeni proje ekle
  const handleAddProject = async () => {
    if (!newProject.ad || !newProject.adres) {
      toast({
        title: "Hata",
        description: "Proje adı ve adresi zorunludur.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/projeler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProject,
          image: selectedProje?.image
        }),
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Proje başarıyla eklendi.",
        });
        
        // SWR cache'ini yenile
        mutate('/api/projeler');
        
        setNewProject({ ad: "", adres: "", ekbilgi: "" });
        setIsAddingProject(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.message || "Proje eklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Proje eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  // Proje düzenle
  const handleEditProject = async () => {
    if (!editProject?.ad || !editProject?.adres) {
      toast({
        title: "Hata",
        description: "Proje adı ve adresi zorunludur.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Gönderilecek veriyi hazırla - Bu kısım kritik
      // selectedProje varsa onun image değerini, yoksa editProject'in image değerini kullan
      // her ikisi de nullsa, API'ye null gönder (resim silme durumu)
      const imageValue = selectedProje?.image !== undefined 
                          ? selectedProje.image 
                          : editProject.image;
      
      const response = await fetch(`/api/projeler/${editProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editProject,
          image: imageValue
        }),
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Proje başarıyla güncellendi.",
        });
        
        // SWR cache'ini yenile
        mutate('/api/projeler');
        
        setEditProject(null);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.message || "Proje güncellenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Proje güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  // Proje sil
  const handleDeleteProject = async () => {
    if (!selectedProje) return;
    
    try {
      const response = await fetch(`/api/projeler/${selectedProje.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // SWR cache'ini güncelle
        mutate('/api/projeler');
        
        // Modal'ı kapat
        setIsAddingProject(false);
        
        toast({
          title: "Başarılı",
          description: "Proje başarıyla silindi",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.message || "Proje silinirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Proje silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };
  
  // Düzenleme modal'ını aç
  const handleOpenEditProject = (proje: Proje) => {
    // Mevcut proje bilgilerini derin kopyalama yaparak ayarla
    const projeKopyasi = JSON.parse(JSON.stringify(proje));
    setSelectedProje(projeKopyasi);
    setEditProject(projeKopyasi);
    setIsEditing(true);
  };
  
  // Silme modal'ını aç
  const deleteProje = (proje: Proje) => {
    setSelectedProje(proje);
    setIsDeleteDialogOpen(true);
  };
  
  // Form değerlerini temizle
  const resetForm = () => {
    setSelectedProje(null);
    setEditProject(null);
    setIsEditing(false);
    if (addFileInputRef.current) addFileInputRef.current.value = "";
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };
  
  // Proje arama için state
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrelenmiş projeler
  const filteredProjects = projeler ? projeler.filter(
    proje => proje.ad.toLowerCase().includes(searchQuery.toLowerCase()) ||
             proje.adres.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (proje.ekbilgi && proje.ekbilgi.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Yükleniyor...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bir hata oluştu</h2>
          <p>Projeler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projeler</h1>
        <Button onClick={() => setIsAddingProject(true)}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Proje Ekle
        </Button>
      </div>
      
      {/* Arama Alanı */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
            placeholder="Proje ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-lg font-medium mt-4">Yükleniyor...</h2>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-lg text-red-500">Veri yüklenirken bir hata oluştu.</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Proje bulunamadı</h2>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Arama kriterinize uygun proje bulunamadı." : "Henüz proje eklemediğiniz görünüyor."}
          </p>
          <Button onClick={() => setIsAddingProject(true)}>
            <Plus className="mr-2 h-4 w-4" /> Proje Ekle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proje) => (
            <ProjectCard 
              key={proje.id} 
              proje={proje} 
              handleOpenEditProject={handleOpenEditProject} 
              deleteProje={deleteProje}
              blokSayisi={blokSayilari[proje.id] || 0}
            />
          ))}
        </div>
      )}
      
      <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yeni Proje Ekle</DialogTitle>
            <DialogDescription>Proje bilgilerini doldurun.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Resim Seçimi & Önizleme */}
            <div className="grid gap-2">
              <Label>Proje Resmi</Label>
              <div className="flex flex-col items-center gap-3">
                {selectedProje?.image ? (
                  <div className="relative w-full">
                    <img 
                      src={selectedProje.image} 
                      alt="Proje Resmi" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full w-8 h-8 bg-black/50 hover:bg-red-600/90"
                      onClick={() => {
                        if (selectedProje) {
                          setSelectedProje({...selectedProje, image: null});
                        }
                        
                        toast({
                          title: "Bilgi",
                          description: "Resim kaldırıldı.",
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label 
                    htmlFor="dropzone-file-add" 
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center w-full h-48 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">Resim yüklemek için tıklayın ya da sürükleyin</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max. 5MB)</p>
                    </div>
                    <input
                      id="dropzone-file-add"
                      ref={addFileInputRef}
                      type="file"
                      accept="image/jpeg, image/png"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
                
                <div className="flex justify-center gap-2 w-full">
                  {selectedProje?.image && (
                    <Button 
                      variant="outline" 
                      onClick={() => addFileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full"
                    >
                      {uploadingImage ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Yükleniyor...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>Resim Değiştir</span>
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="projectName">Proje Adı *</Label>
              <Input
                id="projectName"
                value={newProject.ad}
                onChange={(e) => setNewProject({ ...newProject, ad: e.target.value })}
                placeholder="Proje adını girin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectAddress">Adres *</Label>
              <Input
                id="projectAddress"
                value={newProject.adres}
                onChange={(e) => setNewProject({ ...newProject, adres: e.target.value })}
                placeholder="Proje adresini girin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectDescription">Açıklama</Label>
              <Textarea
                id="projectDescription"
                value={newProject.ekbilgi || ""}
                onChange={(e) => setNewProject({ ...newProject, ekbilgi: e.target.value })}
                placeholder="Proje açıklaması girin (opsiyonel)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingProject(false)}>
              İptal
            </Button>
            <Button onClick={handleAddProject}>Ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Proje Düzenle</DialogTitle>
            <DialogDescription>Proje bilgilerini güncelleyin.</DialogDescription>
          </DialogHeader>
          {editProject && (
            <div className="grid gap-4 py-4">
              {/* Resim Seçimi & Önizleme */}
              <div className="grid gap-2">
                <Label>Proje Resmi</Label>
                <div className="flex flex-col items-center gap-3">
                  {selectedProje?.image || editProject.image ? (
                    <div className="relative w-full">
                      <img 
                        src={selectedProje?.image || editProject.image || ""} 
                        alt="Proje Resmi" 
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full w-8 h-8 bg-black/50 hover:bg-red-600/90"
                        onClick={() => {
                          // Resmi sil
                          if (editProject) {
                            setEditProject({...editProject, image: null});
                          }
                          if (selectedProje) {
                            setSelectedProje({...selectedProje, image: null});
                          }
                          
                          toast({
                            title: "Bilgi",
                            description: "Proje resmi kaldırıldı. Kaydetmek için 'Güncelle' butonuna tıklayın.",
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label 
                      htmlFor="dropzone-file-edit" 
                      className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center w-full h-48 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 text-center">Resim yüklemek için tıklayın ya da sürükleyin</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max. 5MB)</p>
                      </div>
                      <input
                        id="dropzone-file-edit"
                        ref={editFileInputRef}
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                  
                  <div className="flex justify-center gap-2 w-full">
                    {(selectedProje?.image || editProject.image) && (
                      <Button 
                        variant="outline" 
                        onClick={() => editFileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full"
                      >
                        {uploadingImage ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span>Yükleniyor...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Resim Değiştir</span>
                          </div>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="editProjectName">Proje Adı *</Label>
                <Input
                  id="editProjectName"
                  value={editProject.ad}
                  onChange={(e) => setEditProject({ ...editProject, ad: e.target.value })}
                  placeholder="Proje adını girin"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editProjectAddress">Adres *</Label>
                <Input
                  id="editProjectAddress"
                  value={editProject.adres}
                  onChange={(e) => setEditProject({ ...editProject, adres: e.target.value })}
                  placeholder="Proje adresini girin"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editProjectDescription">Açıklama</Label>
                <Textarea
                  id="editProjectDescription"
                  value={editProject.ekbilgi || ""}
                  onChange={(e) => setEditProject({ ...editProject, ekbilgi: e.target.value })}
                  placeholder="Proje açıklaması girin (opsiyonel)"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              İptal
            </Button>
            <Button onClick={handleEditProject}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Proje Silme Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proje Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Projeyi silmek istediğinize emin misiniz?
              Proje silindiğinde, projeye bağlı tüm bloklar ve daireler de silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-500 hover:bg-red-600">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 