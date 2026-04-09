"use client";

import toast from "react-hot-toast";

export default function DownloadButton({ className, children, message = "Report generation started! \n\n(This is a mock functionality for the startup template)" }) {
  return (
    <button 
      className={className}
      onClick={() => toast.success(message, { style: { whiteSpace: 'pre-line' } })}
    >
      {children}
    </button>
  );
}
