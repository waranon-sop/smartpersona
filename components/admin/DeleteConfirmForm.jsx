"use client";

import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmForm({ action, itemName = "this item", children }) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold">Confirm Deletion</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{itemName}</span>?
            <br />
            <span className="text-sm text-red-500 mt-2 block italic">This action cannot be undone.</span>
          </p>

          <footer className="flex gap-3 justify-end">
            <button
              onClick={() => setIsConfirming(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-200"
            >
              Cancel
            </button>
            <form action={action}>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold shadow-sm flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Forever
              </button>
            </form>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => setIsConfirming(true)}>
      {children}
    </div>
  );
}
