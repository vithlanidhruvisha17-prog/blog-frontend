import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

const EditPost = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`); 
                setFormData({ title: data.title, content: data.content });
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Blog not loaded!");
                navigate('/');
            }
        };
        fetchPost();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await API.put(`/posts/${id}`, formData);
            toast.success("Blog is updated! ✨");
            navigate('/');
        } catch (err) {
            toast.error("Update fail, try again!");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Syncing document node...</p>
            </div>
        );
    }

    return (
        <div className="antialiased pb-16 min-h-screen relative bg-slate-50/60 px-4 pt-6 rounded-3xl overflow-hidden">
            
            {/* Subtle Aesthetic Tech Grid Line Matrix */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
            
            {/* Soft Ambient Visual Fluid Effects */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                
                {/* Refined Modular Workspace Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Modify Publication</h1>
                        <p className="text-xs text-slate-400 font-medium">Re-align article data streams and patch local content logs smoothly inside the node.</p>
                    </div>
                    <div className="inline-flex items-center bg-white/80 border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-wider shadow-sm self-start sm:self-center">
                        🛠️ Patch Mode
                    </div>
                </div>

                {/* Main Premium Canvas Component Layer */}
                <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md">
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* 1. EDITABLE ARTICLE TITLE COMPONENT */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Update Header Title</label>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {formData.title.length}/100
                                </span>
                            </div>
                            <input 
                                className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold shadow-sm"
                                type="text" 
                                maxLength={100}
                                placeholder="Edit title payload..." 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                required 
                            />
                        </div>
                        
                        {/* 2. EDITABLE CONTENT BODY AREA */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Story Structure Markdown</label>
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                                    {formData.content.trim() === '' ? 0 : formData.content.trim().split(/\s+/).length} words
                                </span>
                            </div>
                            <textarea 
                                className="w-full bg-white border border-slate-200/80 rounded-xl p-4 h-80 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all shadow-sm leading-relaxed"
                                placeholder="Revamp story nodes or log modules..."
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})} 
                                required 
                            />
                        </div>

                        {/* Separation Accent Line */}
                        <div className="border-t border-slate-100 pt-3" />
                        
                        {/* 3. INTERACTIVE CONTROL FOOTER ACTIONS */}
                        <div className="flex items-center justify-end space-x-3">
                            <button 
                                type="button"
                                onClick={() => navigate('/')}
                                disabled={updating}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 hover:bg-white transition-all shadow-sm disabled:opacity-50"
                            >
                                Discard Alterations
                            </button>
                            
                            <button 
                                type="submit" 
                                disabled={updating}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all duration-300 ${
                                    updating 
                                    ? 'bg-slate-300 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10 active:scale-[0.98]'
                                }`}
                            >
                                {updating ? "Patching Node..." : "Save Modifications ✨"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPost;