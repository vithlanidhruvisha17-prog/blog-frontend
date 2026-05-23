import React from 'react';
import { createPortal } from 'react-dom';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 min-h-screen w-screen z-[999999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md left-0 top-0 right-0 bottom-0">
            <div className="bg-white border border-slate-200/80 w-full max-w-sm p-6 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.2)] flex flex-col items-center text-center space-y-4 transform scale-100 transition-transform duration-200">
                
                {/* Red Circle with Dustbin/Trash Symbol */}
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
                    <span className="text-lg">🗑️</span>
                </div>

                {/* Ultra-Clean One-Line Text Only */}
                <p className="text-xs text-slate-700 font-bold px-2 tracking-tight">
                    Do you really want to delete this blog?
                </p>

                {/* Symmetrical Control Buttons */}
                <div className="flex items-center justify-center space-x-2.5 w-full pt-2">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Abort
                    </button>
                    <button 
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors"
                    >
                        Confirm Delete 
                    </button>
                </div>
            </div>
        </div>,
        document.body 
    );
};

export default DeleteConfirmModal;