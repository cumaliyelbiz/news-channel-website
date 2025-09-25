import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const destination = (formData.get("destination") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    // Dosya içeriğini oku
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adını güvenli hale getir
    const originalFilename = file.name
    const fileExtension = path.extname(originalFilename)
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}${fileExtension}`

    // Hedef klasörü belirle
    const uploadDir = path.join(process.cwd(), "public", destination)

    // Klasör yoksa oluştur
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Dosya yolunu oluştur
    const filePath = path.join(uploadDir, fileName)

    // Dosyayı kaydet
    await writeFile(filePath, buffer)


    // Dosya URL'sini oluştur
    const fileUrl = `/${destination}/${fileName}`

    return NextResponse.json({
      success: true,
      filePath: fileUrl,
      originalName: originalFilename,
    })
  } catch (error) {
    console.error("Dosya yükleme hatası:", error)
    return NextResponse.json({ error: "Dosya yüklenemedi" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

