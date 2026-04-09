# SmartPersona

โปรเจกต์ Next.js สำหรับสร้างและจัดการ Resume อัจฉริยะ

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
# ===== Database Connection =====
# ต้องตรงกับค่าใน docker-compose-mysql-phpmyadmin.yaml
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=smartpersona_db

# ===== JWT Secret =====
# ใช้สำหรับเข้ารหัส Token — เปลี่ยนเป็นค่าสุ่มที่ยาวและซับซ้อนในงานจริง
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
# 1. Dump ข้อมูลปัจจุบันลงไฟล์ init.sql
npm run db:dump

# 2. Commit และ Push ไฟล์ init.sql ที่อัปเดต
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
