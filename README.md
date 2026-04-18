# SmartPersona

โปรเจกต์ Next.js สำหรับสร้างและจัดการ Resume อัจฉริยะ

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** MySQL (รันผ่าน Docker)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Validation:** Zod
- **Drag & Drop:** @dnd-kit

---

## 🚀 การติดตั้งสำหรับผู้ Clone (First-Time Setup)

ทำตามขั้นตอนเหล่านี้ตามลำดับเพื่อให้โปรเจกต์ทำงานได้บนเครื่องของคุณ

### ขั้นที่ 1 — ติดตั้ง Dependencies

```bash
npm install
```

### ขั้นที่ 2 — สร้างไฟล์ `.env.local`

> ⚠️ ไฟล์นี้ **ไม่ได้อยู่ใน Git** (ถูก ignore ไว้) ต้องสร้างเองทุกครั้งที่ clone โปรเจกต์ใหม่

สร้างไฟล์ชื่อ `.env.local` ที่ **root ของโปรเจกต์** แล้วใส่เนื้อหาดังนี้:

```env
# คัดลอกเนื้อหาจาก .env.example มาใส่ใน .env.local แล้วปรับแก้ตามต้องการ

# ===== Database Connection =====
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=smartpersona_db

# ===== JWT Secret =====
JWT_SECRET=your-secret-key-here
```

**คำอธิบายแต่ละตัวแปร:**

| ตัวแปร | ค่า Default | คำอธิบาย |
|---|---|---|
| `DB_HOST` | `localhost` | host ของ MySQL (ใช้ Docker จะเป็น localhost เสมอ) |
| `DB_USER` | `root` | ชื่อ user ของ MySQL |
| `DB_PASSWORD` | `root` | รหัสผ่าน MySQL (กำหนดไว้ใน docker-compose) |
| `DB_NAME` | `smartpersona_db` | ชื่อ Database ที่ใช้ |
| `JWT_SECRET` | `your-secret-key-here` | Key สำหรับเข้ารหัส JWT Token (ห้ามเปิดเผย!) |

> 💡 **Tip สำหรับงานจริง**: เปลี่ยน `JWT_SECRET` เป็น string สุ่มยาวๆ เช่น `openssl rand -base64 32`

### ขั้นที่ 3 — เปิด Docker Desktop แล้วรัน Database

ตรวจสอบว่า **Docker Desktop เปิดอยู่และทำงานแล้ว** จากนั้นรัน:

```bash
docker compose -f docker-compose-mysql-phpmyadmin.yaml up -d
```

- **MySQL**: `localhost:3306`
- **phpMyAdmin**: [http://localhost:8080](http://localhost:8080) (User: `root` / Password: `root`)

### ขั้นที่ 4 — รัน Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

---

## 🗄️ การจัดการฐานข้อมูล (Database Management)

### อัปเดตข้อมูลเมื่ออยู่บนเครื่องอื่น

ถ้าเพื่อนในทีม push ข้อมูล Database ใหม่มาใน Git แล้วคุณต้องการซิงค์ข้อมูล:

```bash
# 1. Pull โค้ดล่าสุดก่อน (รวมไฟล์ init.sql ที่อัปเดต)
git pull

# 2. หยุด Container เดิม
docker compose -f docker-compose-mysql-phpmyadmin.yaml down

# 3. ลบโฟลเดอร์ mysql-data (ข้อมูลเก่าจะถูกลบ)
#    Windows PowerShell:
Remove-Item -Recurse -Force mysql-data
#    Mac/Linux:
# rm -rf mysql-data

# 4. รัน Container ใหม่ — จะโหลดข้อมูลจาก init.sql อัตโนมัติ
docker compose -f docker-compose-mysql-phpmyadmin.yaml up -d
```

### บันทึกข้อมูลปัจจุบันลง Git (สำหรับคนที่แก้ข้อมูล)

ถ้าคุณเพิ่ม/ลบ/แก้ไขข้อมูลใน Database และต้องการให้คนอื่นได้รับการเปลี่ยนแปลงด้วย:

```bash
# 1. เคลียร์ข้อมูลรูปภาพ Base64 ออกก่อน (เพื่อให้ไฟล์ Dump ไม่ใหญ่เกินไป)
node clear_base64.js

# 2. Dump ข้อมูลปัจจุบันลงไฟล์ init.sql
npm run db:dump

# 3. Commit และ Push ไฟล์ init.sql ที่อัปเดต
git add init.sql
git commit -m "chore: update database dump"
git push
```

### รีเซ็ตฐานข้อมูล (เริ่มใหม่จาก init.sql)

```bash
# หยุด → ลบ → รันใหม่
docker compose -f docker-compose-mysql-phpmyadmin.yaml down
Remove-Item -Recurse -Force mysql-data   # Windows
docker compose -f docker-compose-mysql-phpmyadmin.yaml up -d
```

---

## 🔧 สคริปต์ตัวช่วย (Utility Scripts)

ในโปรเจกต์นี้มีไฟล์สคริปต์ `.js` สำหรับช่วยจัดการฐานข้อมูล ดังนี้:

- `node clear_base64.js` : ลบข้อมูลรูปภาพที่เป็น base64 ออกจากฐานข้อมูล (ควรทำก่อน dump เพื่อลดขนาดไฟล์)
- `node migrate_db.js` : ใช้สำหรับรันคำสั่ง Migration หรืออัปเดต Index โครงสร้างตาราง (เช่น `db-indexes.sql`)
- `node check_db.js` : ใช้ตรวจสอบสถานะการเชื่อมต่อของ Database
- `npm run db:dump` : (เรียกใช้ `dump_db.js`) ส่งออกข้อมูล Database ทั้งหมดไปที่ `init.sql`

---

## 📁 โครงสร้างไฟล์สำคัญ

```
smartpersona/
├── .env.local          ← ❌ ไม่อยู่ใน Git — ต้องสร้างเอง (ดูขั้นที่ 2)
├── init.sql            ← ✅ อยู่ใน Git — ข้อมูล Database เริ่มต้น
├── mysql-data/         ← ❌ ไม่อยู่ใน Git — ข้อมูล Database จริงบนเครื่อง
└── docker-compose-mysql-phpmyadmin.yaml  ← ✅ Config Docker
```

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
