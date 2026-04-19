import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getCurrentUser } from '@/lib/session';

// POST /api/upload — อัปโหลดรูปภาพ บันทึกใน /public/uploads/
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = user.id;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // ตรวจสอบ file type — รับเฉพาะรูปภาพ
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Only image files are allowed (jpg, png, webp, gif)' }, { status: 400 });
    }

    // จำกัดขนาด 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'File size must be under 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้างชื่อไฟล์ uniquely ด้วย timestamp + userId
    const ext = file.type.split('/')[1].replace('jpeg', 'jpg');
    const filename = `profile_${userId}_${Date.now()}.${ext}`;

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // บันทึกไฟล์
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // return URL ที่ browser เข้าถึงได้
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
