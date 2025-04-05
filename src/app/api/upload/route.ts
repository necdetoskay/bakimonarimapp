import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST: Resim yükleme
export async function POST(req: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    // formData'yı al
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: "Yüklenecek dosya bulunamadı." }),
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et (sadece jpg ve png)
    const fileType = file.type;
    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      return new NextResponse(
        JSON.stringify({ error: "Sadece JPG ve PNG formatları desteklenmektedir." }),
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new NextResponse(
        JSON.stringify({ error: "Dosya boyutu 5MB'dan büyük olamaz." }),
        { status: 400 }
      );
    }

    // uploads klasörünü kontrol et ve yoksa oluştur
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Benzersiz dosya adı oluştur
    const fileExtension = fileType === "image/jpeg" ? ".jpg" : ".png";
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Dosyayı ArrayBuffer'a çevir ve kaydet
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Resim URL'sini oluştur
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Resim yükleme sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
} 