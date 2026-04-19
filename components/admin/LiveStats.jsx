"use client";

import React, { useState, useEffect } from 'react';
import { Users, FileText, Star, Zap } from 'lucide-react';

export default function LiveStats({ initialStats }) {
  const [stats, setStats] = useState(initialStats);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const POLL_INTERVAL = 30000;

    const fetchStats = async () => {
      if (document.hidden) return;
      try {
        setIsUpdating(true);
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats(prev => ({
            ...prev,
            totalUsers: data.totalUsers,
            totalResumes: data.totalResumes,
            topTemplate: data.topTemplate,
            resumesToday: data.resumesToday
          }));
        }
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        setTimeout(() => setIsUpdating(false), 800);
      }
    };

    const interval = setInterval(fetchStats, POLL_INTERVAL);

    const handleVisibilityChange = () => {
      if (!document.hidden) fetchStats();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const statsConfig = [
    { name: 'ผู้ใช้ทั้งหมด', value: stats.totalUsers?.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'เรซูเม่ทั้งหมด', value: stats.totalResumes?.toLocaleString(), icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'ดีไซน์ยอดนิยม', value: stats.topTemplate, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'สร้างเพิ่มวันนี้', value: stats.resumesToday?.toLocaleString(), icon: Zap, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {isUpdating && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-[pulse_1s_infinite]"></div>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
                <span className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{isUpdating ? 'กำลังเชื่อมโยง' : 'ออนไลน์'}</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 transition-all">
                {stat.value}
              </p>
              <h3 className="text-slate-500 text-sm font-medium mt-1">{stat.name}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
