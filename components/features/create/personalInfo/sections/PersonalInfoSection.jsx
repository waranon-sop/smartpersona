"use client";
import React, { memo } from "react";
import { User } from "lucide-react";
import Section from "@/components/ui/Section";
import { Input, Lbl } from "@/components/ui/FormElements";

const PersonalInfoSection = memo(({ data, updateData, uploadStatus, handleUpload, handleRemoveImage }) => {
  return (
    <Section icon={User} color="#6366f1" title="ข้อมูลส่วนตัว">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input 
          label="ชื่อ (ภาษาอังกฤษ)" 
          placeholder="e.g. Somchai" 
          value={data?.firstName || ""}
          onChange={(e) => updateData("personal", "firstName", e.target.value)} 
        />

        <Input 
          label="นามสกุล (ภาษาอังกฤษ)" 
          placeholder="e.g. Jaidee" 
          value={data?.lastName || ""}
          onChange={(e) => updateData("personal", "lastName", e.target.value)} 
        />

        <div className="md:col-span-2">
          <Input 
            label="ตำแหน่งงานที่ต้องการ / Job Title" 
            placeholder="e.g. Senior Software Engineer" 
            value={data?.jobTitle || ""}
            onChange={(e) => updateData("personal", "jobTitle", e.target.value)} 
          />
        </div>

        <Input 
          label="อีเมล" 
          type="email" 
          placeholder="name@email.com" 
          value={data?.email || ""}
          onChange={(e) => updateData("personal", "email", e.target.value)} 
        />

        <Input 
          label="เบอร์โทรศัพท์" 
          type="tel" 
          placeholder="09x-xxx-xxxx" 
          value={data?.phone || ""}
          onChange={(e) => updateData("personal", "phone", e.target.value)} 
        />

        <div className="md:col-span-2">
          <Input 
            label="ที่อยู่ / Location" 
            placeholder="e.g. Bangkok, Thailand" 
            value={data?.address || ""}
            onChange={(e) => updateData("personal", "address", e.target.value)} 
          />
        </div>

        <Input 
          label="สัญชาติ" 
          placeholder="e.g. Thai" 
          value={data?.nationality || ""}
          onChange={(e) => updateData("personal", "nationality", e.target.value)} 
        />

        <Input 
          label="วันเกิด (ไม่บังคับ)" 
          type="date" 
          value={data?.dateOfBirth || ""}
          onChange={(e) => updateData("personal", "dateOfBirth", e.target.value)} 
        />

        <Input 
          label="LinkedIn URL" 
          type="url" 
          placeholder="linkedin.com/in/..." 
          value={data?.linkedin || ""}
          onChange={(e) => updateData("personal", "linkedin", e.target.value)} 
        />

        <Input 
          label="GitHub URL" 
          type="url" 
          placeholder="github.com/..." 
          value={data?.github || ""}
          onChange={(e) => updateData("personal", "github", e.target.value)} 
        />

        <div className="md:col-span-2">
          <Input 
            label="Portfolio / Website" 
            type="url" 
            placeholder="https://yoursite.com" 
            value={data?.portfolio || ""}
            onChange={(e) => updateData("personal", "portfolio", e.target.value)} 
          />
        </div>

        {/* Profile picture */}
        <div className="md:col-span-2">
          <Lbl>รูปโปรไฟล์</Lbl>
          <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors flex-shrink-0">
              {data?.profilePic ? (
                <img src={data.profilePic} alt="Profile preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <User size={15} className="text-indigo-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-600">
                {uploadStatus === "uploading" ? "⏳ กำลังอัปโหลด..."
                  : (data?.profilePic || uploadStatus === "done") ? "✅ อัปโหลดสำเร็จ (คลิกเพื่อเปลี่ยนรูป)"
                  : uploadStatus === "error" ? "❌ อัปโหลดไม่สำเร็จ"
                  : "คลิกเพื่ออัปโหลดรูปโปรไฟล์"}
              </p>
              <p className="text-[10px] text-gray-400">PNG, JPG — สูงสุด 5 MB</p>
            </div>
            <input type="file" accept="image/*" className="hidden"
              disabled={uploadStatus === "uploading"} onChange={handleUpload} />
          </label>
          {data?.profilePic && (
            <button type="button" onClick={handleRemoveImage}
              className="mt-2 text-xs text-red-500 hover:text-red-600 font-bold flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              ลบรูปภาพ
            </button>
          )}
        </div>
      </div>
    </Section>
  );
});

PersonalInfoSection.displayName = "PersonalInfoSection";
export default PersonalInfoSection;
