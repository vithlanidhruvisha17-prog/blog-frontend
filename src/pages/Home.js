import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import DeleteConfirmModal from '../components/DeleteModal';

const Home = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [commentText, setCommentText] = useState("");

    // State For Delete Confirmation Modal
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const loggedInUserId = user._id || user.id;

    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedPost]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/posts?search=${search}`);
            setPosts(data);
        } catch (err) {
            toast.error("Blogs are not loaded!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPosts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleDeleteClick = (postId) => {
        setDeleteModal({ isOpen: true, postId });
    };

    const handleConfirmDelete = async () => {
        const targetId = deleteModal.postId;
        setDeleteModal({ isOpen: false, postId: null });

        try {
            await API.delete(`/posts/${targetId}`);
            toast.success("Your blog is deleted successfully 🗑️");
            fetchPosts();
            if (selectedPost?._id === targetId) setSelectedPost(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete is failed!");
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation(); 
        try {
            const { data } = await API.put(`/posts/${selectedPost._id}/like`);
            setSelectedPost({ ...selectedPost, likes: data });
            setPosts(posts.map(p => p._id === selectedPost._id ? { ...p, likes: data } : p));
        } catch (err) {
            toast.error("Like is not updated!");
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        try {
            const { data } = await API.post(`/posts/${selectedPost._id}/comment`, { text: commentText });
            setSelectedPost({ ...selectedPost, comments: data });
            setPosts(posts.map(p => p._id === selectedPost._id ? { ...p, comments: data } : p));
            setCommentText(""); 
        } catch (err) {
            toast.error("Comment not saved!");
        }
    };

    if (loading && posts.length === 0) {
        /* Spinner Loader layout laptop par fix kiya */
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-3 md:pl-64">
                <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Syncing feed modules...</p>
            </div>
        );
    }

    return (
        <div className="antialiased pb-24 md:pb-16 min-h-screen relative bg-slate-50/60 px-4 pt-4 rounded-3xl overflow-hidden">
            
            {/* ─── PREMIUM SYSTEM GRID LAYER (CHEXES) ─── */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
            
            {/* ─── AMBIENT BLUR MESH OBJECTS ─── */}
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-8 w-full px-2 md:px-0 md:pl-64 lg:pl-0">
                
                {/* 1. HYPER-MODERN GLASSMORPHIC ACTION HUB */}
                <div className="relative overflow-hidden rounded-3xl bg-white/80 border border-slate-200/80 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                                <span>Workspace Node Active</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                Editorial Hub <span className="text-indigo-600 font-medium">/</span> @{user.username || 'writer'}
                            </h1>
                            <p className="text-xs md:text-sm text-slate-500 max-w-xl font-medium leading-relaxed">
                                Create beautifully tailored insights, manage public directory metrics, and explore peer logs inside a unified dashboard matrix.
                            </p>
                        </div>

                        <div className="flex items-center">
                            <button 
                                onClick={() => navigate('/create-post')} 
                                className="w-full md:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-indigo-500/10 active:scale-[0.98]"
                            >
                                + Write New Entry
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-200/60 my-6" />

                    <div className="grid grid-cols-3 gap-4 md:max-w-2xl">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Logs</span>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-xl font-black text-slate-900">{posts.length}</span>
                                <span className="text-[10px] font-bold text-slate-400">items</span>
                            </div>
                        </div>
                        <div className="space-y-0.5 border-l border-slate-200 pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sync Status</span>
                            <div className="flex items-center space-x-1.5 mt-1">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Online</span>
                            </div>
                        </div>
                        <div className="space-y-0.5 border-l border-slate-200 pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stream Node</span>
                            <div className="flex items-center space-x-1.5 mt-1">
                                <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wide">Live Feed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SUBTLE FEED SEARCH COMPONENT BAR */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Publications</h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Explore real-time community records synced on node</p>
                    </div>
                    
                    <div className="w-full md:w-72 relative group">
                        <input
                            type="text"
                            placeholder="Search publications..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm"
                        />
                        <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs pointer-events-none group-focus-within:text-slate-600 transition-colors">🔍</span>
                    </div>
                </div>

                {/* 3. CONTENT FEED DISPLAY LAYER */}
                <div>
                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-white/80 rounded-3xl border border-slate-200/80 border-dashed backdrop-blur-md">
                            <span className="text-2xl">📁</span>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-3">No matching records found in local directory node.</p>
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full">
                            {posts.map(post => (
                                <div key={post._id} className="break-inside-avoid inline-block w-full transition-all duration-300">
                                    <PostCard 
                                        post={post}
                                        loggedInUserId={loggedInUserId}
                                        isProfilePage={false}
                                        onCardClick={setSelectedPost}
                                        onEdit={(id) => navigate(`/edit-post/${id}`)}
                                        onDelete={handleDeleteClick}
                                        className="bg-white/90 backdrop-blur-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* --- Post Details Modal Frame --- */}
            {selectedPost && (
                <PostModal 
                    post={selectedPost}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    loggedInUserId={loggedInUserId}
                    isProfilePage={false}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    onClose={() => setSelectedPost(null)}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={() => {
                        navigator.clipboard.writeText(window.location.origin + `/post/${selectedPost._id}`);
                        toast.info("Link copied to clipboard! 🔗");
                    }}
                />
            )}

            {/* --- GLOBAL BULLETPROOF PORTAL MODAL COMPONENT CALL --- */}
            <DeleteConfirmModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, postId: null })}
                onConfirm={handleConfirmDelete}
            />

        </div>
    );
};

export default Home;