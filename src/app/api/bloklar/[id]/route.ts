import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET: Bir blok getir
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    const id = params.id;

    // Bloku ve projeyi getir
    const blok = await db.blok.findUnique({
      where: {
        id: id,
      },
      include: {
        proje: {
          select: {
            id: true,
            ad: true,
          },
        },
      },
    });

    if (!blok) {
      return new NextResponse(
        JSON.stringify({ error: "Blok bulunamadı." }),
        { status: 404 }
      );
    }

    const response = NextResponse.json(blok, { status: 200 });
    
    // Cache süresini azaltarak daha hızlı güncellemeleri sağla
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    
    return response;
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// PUT: Blok güncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    const id = params.id;
    const body = await req.json();
    const { ad, ekbilgi } = body;

    // Validasyon
    if (!ad) {
      return new NextResponse(
        JSON.stringify({ error: "Blok adı gereklidir." }),
        { status: 400 }
      );
    }

    // Blokun var olup olmadığını kontrol et
    const existingBlok = await db.blok.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingBlok) {
      return new NextResponse(
        JSON.stringify({ error: "Blok bulunamadı." }),
        { status: 404 }
      );
    }

    // Bloku güncelle
    const updatedBlok = await db.blok.update({
      where: {
        id: id,
      },
      data: {
        ad,
        ekbilgi: ekbilgi,
      },
    });

    const response = NextResponse.json(updatedBlok, { status: 200 });
    
    // Cache süresini azaltarak daha hızlı güncellemeleri sağla
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    
    return response;
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
}

// DELETE: Blok sil
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Bu işlem için yetkiniz yok." }),
        { status: 401 }
      );
    }

    const id = params.id;

    // Blokun var olup olmadığını kontrol et
    const existingBlok = await db.blok.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingBlok) {
      return new NextResponse(
        JSON.stringify({ error: "Blok bulunamadı." }),
        { status: 404 }
      );
    }

    // Bloku sil
    await db.blok.delete({
      where: {
        id: id,
      },
    });

    const response = NextResponse.json(
      { message: "Blok başarıyla silindi." },
      { status: 200 }
    );
    
    // Cache süresini azaltarak daha hızlı güncellemeleri sağla
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    
    return response;
  } catch (error: any) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "İşlem sırasında bir hata oluştu." }),
      { status: 500 }
    );
  }
} 