"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";

// Standard input styles used across the app
export const INPUT_CLASSES = "w-full border border-gray-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";

/**
 * Label for form fields
 */
export const Lbl = ({ children }) => (
  <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wide">
    {children}
  </label>
);

/**
 * Standard input field with label
 */
export const Input = ({ label, className = "", ...props }) => (
  <div>
    {label && <Lbl>{label}</Lbl>}
    <input 
      className={`${INPUT_CLASSES} ${className}`} 
      {...props} 
    />
  </div>
);

/**
 * Standard textarea with label
 */
export const Textarea = ({ label, className = "", ...props }) => (
  <div>
    {label && <Lbl>{label}</Lbl>}
    <textarea 
      className={`${INPUT_CLASSES} ${className}`} 
      {...props} 
    />
  </div>
);

/**
 * Button to remove an item from a list
 */
export const RemoveBtn = ({ onClick }) => (
  <button 
    type="button" 
    onClick={onClick}
    className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
  >
    <Trash2 size={13} />
  </button>
);

/**
 * Button to add an item to a list
 */
export const AddBtn = ({ onClick, label, color = "#6366f1" }) => (
  <button 
    type="button" 
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed rounded-xl text-sm font-bold transition-all"
    style={{ borderColor: `${color}40`, color }}
  >
    <Plus size={14} />
    {label}
  </button>
);
