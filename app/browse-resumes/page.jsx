"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/navbar/page";
import styles from "./browse.module.css";

export default function BrowsePublicResumes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("กรุณาใส่คำค้นหา");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/resume/search-public?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data.results || []);
        setSearched(true);
        if (data.results.length === 0) {
          toast("ไม่พบผลลัพธ์ที่ตรงกับการค้นหา");
        }
      } else {
        toast.error("เกิดข้อผิดพลาดในการค้นหา");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>ค้นหา Resume ของคนอื่น</h1>
          <p>ค้นหา Resume ด้วยชื่อหรือทักษะ</p>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อ-นามสกุล หรือ ทักษะ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button
              type="submit"
              disabled={loading}
              className={styles.searchButton}
            >
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </div>
        </form>

        {searched && (
          <div className={styles.results}>
            {results.length === 0 ? (
              <div className={styles.noResults}>
                <p>ไม่พบ Resume ที่ตรงกับการค้นหา</p>
              </div>
            ) : (
              <>
                <p className={styles.resultCount}>พบ {results.length} รายการ</p>
                <div className={styles.resultsList}>
                  {results.map((resume) => (
                    <div key={resume.resumeId} className={styles.resultCard}>
                      <div className={styles.resultHeader}>
                        <div>
                          <h3 className={styles.resultName}>
                            {resume.firstName} {resume.lastName}
                          </h3>
                          <p className={styles.resultEmail}>{resume.email}</p>
                        </div>
                        <span className={styles.templateBadge}>
                          {resume.template}
                        </span>
                      </div>

                      {resume.skills && (
                        <div className={styles.resultSkills}>
                          <strong>ทักษะ:</strong>
                          <p>{resume.skills}</p>
                        </div>
                      )}

                      <div className={styles.resultFooter}>
                        <small>
                          {new Date(resume.createdAt).toLocaleDateString("th-TH")}
                        </small>
                        <Link
                          href={`/resume/${resume.resumeId}`}
                          className={styles.viewButton}
                        >
                          ดู Resume
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
