import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePost = () => {
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [media, setMedia] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState({ title: false, content: false }); // AI loading states
    const navigate = useNavigate();

    // AI Generation Handler
    const generateWithAI = async (type) => {
    const topicToUse = type === 'title' ? formData.title : formData.content;
    
    if (!topicToUse.trim()) {
        toast.info(`Please enter a small hint or topic in the ${type} field first!`);
        return;
    }

    setAiLoading(prev => ({ ...prev, [type]: true }));
    try {
        const response = await API.post('/ai/generate-blog', {
            topic: topicToUse,
            promptType: type
        });

        if (response.data && response.data.result) {
            let aiResult = response.data.result;

            // SAFE FIX: Agar data abhi bhi object form mein aa raha hai, toh use string mein badlein
            if (typeof aiResult === 'object') {
                aiResult = aiResult.text || aiResult.result || JSON.stringify(aiResult);
            }

            aiResult = aiResult.trim();

            if (type === 'title') {
                // Formatting clean-up: Faltu ke quotes, markdown aur naye lines ko remove karein
                let cleanTitle = aiResult
                    .split('\n')[0] 
                    .replace(/^["'*\s•\-\d.)]+|["'*\s]+$/g, '') 
                    .trim();

                setFormData(prev => ({ ...prev, title: cleanTitle.slice(0, 100) }));
                toast.success("AI suggested title integrated! 🪄");
            } else {
                setFormData(prev => ({ ...prev, content: aiResult }));
                toast.success("Blog content fully optimized by AI! ✨");
            }
        }
    } catch (err) {
        console.error(err);
        toast.error("AI node response failed. Try again.");
    } finally {
        setAiLoading(prev => ({ ...prev, [type]: false }));
    }
};

    // File change handler with local object URLs for premium preview
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + media.length > 5) {
            toast.warning("Maximum 5 files allowed node matrix!");
            return;
        }
        
        setMedia([...media, ...files]);

        // Generate previews
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type
        }));
        setMediaPreviews([...mediaPreviews, ...newPreviews]);
    };

    // Remove file staging index
    const removeFile = (index) => {
        const updatedMedia = media.filter((_, i) => i !== index);
        const updatedPreviews = mediaPreviews.filter((_, i) => i !== index);
        setMedia(updatedMedia);
        setMediaPreviews(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        const dataToSend = new FormData(); 
        dataToSend.append('title', formData.title); 
        dataToSend.append('content', formData.content); 
        
        media.forEach((file) => {
            dataToSend.append('files', file); 
        });

        try {
            await API.post('/posts/create', dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' } 
            });
            toast.success("Blog with multiple media posted! 🔥");
            navigate('/');
        } catch (err) {
            toast.error("Upload failed!");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="antialiased pb-16 min-h-screen relative bg-slate-50/60 px-4 pt-6 rounded-3xl overflow-hidden">
            
            {/* Subtle Aesthetic Tech Grid Line Matrix */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
            
            {/* Soft Ambient Visual Fluid Effects */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                
                {/* Page Header Area */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Create New Entry</h1>
                        <p className="text-xs text-slate-400 font-medium">Compose beautiful articles and anchor rich media streams into the community node network.</p>
                    </div>
                    <div className="inline-flex items-center space-x-1.5 bg-white/80 border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-wider shadow-sm self-start sm:self-center">
                        <span>Editor Mode: AI Hybrid</span>
                    </div>
                </div>

                {/* Main Premium Canvas Grid */}
                <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md">
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* 1. TITLE COMPONENT ROW */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center space-x-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Article Title</label>
                                    <button 
                                        type="button" 
                                        disabled={aiLoading.title}
                                        onClick={() => generateWithAI('title')}
                                        className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-indigo-200/40 transition-colors disabled:opacity-50"
                                    >
                                        {aiLoading.title ? "🔮 Generating..." : "✨ AI Title Magic"}
                                    </button>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{formData.title.length}/100</span>
                            </div>
                            <input 
                                className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold shadow-sm truncate-ellipsis"
                                type="text" 
                                maxLength={100}
                                placeholder="Write a keyword & hit 'AI Title Magic' or set your own header..." 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                required 
                            />
                        </div>
                        
                        {/* 2. BODY TEXT CONTENT ZONE */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center space-x-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Story Content</label>
                                    <button 
                                        type="button" 
                                        disabled={aiLoading.content}
                                        onClick={() => generateWithAI('content')}
                                        className="text-[10px] font-extrabold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-200/40 transition-colors disabled:opacity-50"
                                    >
                                        {aiLoading.content ? "🔮 Engine Drafting..." : "✨ Expand Story with AI"}
                                    </button>
                                </div>
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">{formData.content.trim() === '' ? 0 : formData.content.trim().split(/\s+/).length} words</span>
                            </div>
                            <textarea 
                                className="w-full bg-white border border-slate-200/80 rounded-xl p-4 h-80 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all shadow-sm leading-relaxed"
                                placeholder="Type a raw thought (e.g. 'Write a short guide on why CSS Grid is better than Flexbox') and click 'Expand Story with AI'..."
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})} 
                                required 
                            />
                        </div>

                        {/* 3. INTERACTIVE ATTACHMENT DROPZONE */}
                        <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Media Stream Asset Pipeline</label>
                            
                            <div className="relative group border border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-8 text-center bg-white/50 hover:bg-white transition-all duration-300 shadow-sm">
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*,video/*" 
                                    onChange={handleFileChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                
                                <div className="space-y-2 pointer-events-none">
                                    <div className="text-xl text-slate-400 group-hover:scale-110 transition-transform duration-200">📥</div>
                                    <div className="text-xs font-bold text-slate-700">Stage multimedia nodes from local network</div>
                                    <div className="text-[10px] text-slate-400 font-medium">Supports JPG, PNG or MP4 arrays (Max 5 total files)</div>
                                </div>
                            </div>

                            {/* HIGH-FIDELITY LIVE PREVIEW GRID BLOCK */}
                            {mediaPreviews.length > 0 && (
                                <div className="space-y-2 pt-1">
                                    <div className="flex items-center space-x-1.5 px-1">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Pipeline Queue Preview ({mediaPreviews.length}/5)</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                        {mediaPreviews.map((preview, idx) => (
                                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                                                {preview.type.includes('video') ? (
                                                    <video src={preview.url} className="w-full h-full object-cover" muted />
                                                ) : (
                                                    <img src={preview.url} alt="staged-preview" className="w-full h-full object-cover" />
                                                )}
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeFile(idx)}
                                                        className="bg-white/95 text-slate-900 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow active:scale-90 transition-transform hover:bg-red-500 hover:text-white"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="border-t border-slate-100 pt-3" />
                        
                        {/* 4. STREAM SUBMIT CONTROLS */}
                        <div className="flex items-center justify-end space-x-3">
                            <button 
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 hover:bg-white transition-all shadow-sm"
                            >
                                Abort Entry
                            </button>
                            
                            <button 
                                type="submit"
                                disabled={loading}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all duration-300 ${
                                    loading 
                                    ? 'bg-slate-300 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10 active:scale-[0.98]'
                                }`}
                            >
                                {loading ? "Streaming To Feed..." : "Publish Entry Node 🚀"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;