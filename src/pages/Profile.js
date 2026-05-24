/* profil.js - Fixed JavaScript Managed Dense Packing */
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import DeleteConfirmModal from '../components/DeleteModal'; 

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [selectedPost, setSelectedPost] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [commentText, setCommentText] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const loggedInUserId = user?.id || user?._id;

    // --- DENSE PACKING REFS ---
    const containerRef = useRef(null);
    const postRefs = useRef({}); 

    // ─── 🚀 FIXED JS-DRIVEN PACKING 🚀 ───
    useLayoutEffect(() => {
        const applyDensePacking = () => {
            const container = containerRef.current;
            if (!container || userPosts.length === 0) return;

            // 1. Filter out any null refs to prevent "reading style of null"
            const cardWrappers = Object.values(postRefs.current).filter(el => el !== null);
            
            // 2. Only proceed if all posts have been rendered to the DOM
            if (cardWrappers.length < userPosts.length) return;

            if (window.innerWidth < 768) {
                // Mobile: Reset styles
                cardWrappers.forEach(wrap => {
                    if (wrap) wrap.style.cssText = "";
                });
                container.style.height = 'auto';
                return;
            }

            // Desktop logic
            const gap = 24; 
            const cols = window.innerWidth >= 1024 ? 3 : 2; 
            const containerWidth = container.offsetWidth;
            const colWidth = (containerWidth - (gap * (cols - 1))) / cols;
            const colHeights = new Array(cols).fill(0);

            cardWrappers.forEach((wrapper) => {
                // Safety check inside loop
                if (!wrapper) return;

                const minHeightCol = Math.min(...colHeights);
                const colIndex = colHeights.indexOf(minHeightCol);

                wrapper.style.position = 'absolute';
                wrapper.style.width = `${colWidth}px`;
                wrapper.style.left = `${colIndex * (colWidth + gap)}px`;
                wrapper.style.top = `${colHeights[colIndex]}px`;
                wrapper.style.display = 'inline-block';

                colHeights[colIndex] += wrapper.offsetHeight + gap;
            });

            container.style.position = 'relative';
            container.style.height = `${Math.max(...colHeights)}px`;
        };

        // Use requestAnimationFrame to ensure the DOM is painted before measuring
        let rafId;
        const triggerPacking = () => {
            rafId = requestAnimationFrame(applyDensePacking);
        };

        triggerPacking();

        window.addEventListener('resize', triggerPacking);
        return () => {
            window.removeEventListener('resize', triggerPacking);
            cancelAnimationFrame(rafId);
        };
    }, [userPosts, loading]); 

    // --- DATA FETCHING ---
    const fetchProfileAndPosts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const profileRes = await API.get('/auth/profile');
            setUser(profileRes.data);

            const postsRes = await API.get('/posts/my-posts'); 
            setUserPosts(postsRes.data);
            // Clear refs when data changes to prevent stale pointer issues
            postRefs.current = {}; 
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Data could not be loaded!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileAndPosts();
    }, [navigate]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedPost]);

    // --- EVENT HANDLERS ---
    const handleDeleteClick = (postId) => {
        setPostToDelete(postId);
        setTimeout(() => setIsDeleteModalOpen(true), 50);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;
        try {
            await API.delete(`/posts/${postToDelete}`);
            toast.success("Blog deleted successfully 🗑️");
            fetchProfileAndPosts(); 
            if (selectedPost?._id === postToDelete) setSelectedPost(null); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setIsDeleteModalOpen(false);
            setPostToDelete(null);
        }
    };

    const handleLike = async (e) => {
        if (e) e.stopPropagation(); 
        try {
            const { data } = await API.put(`/posts/${selectedPost._id}/like`);
            setSelectedPost({ ...selectedPost, likes: data });
            setUserPosts(userPosts.map(p => p._id === selectedPost._id ? { ...p, likes: data } : p));
        } catch (err) {
            toast.error("Failed to update like");
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        try {
            const { data } = await API.post(`/posts/${selectedPost._id}/comment`, { text: commentText });
            setSelectedPost({ ...selectedPost, comments: data });
            setUserPosts(userPosts.map(p => p._id === selectedPost._id ? { ...p, comments: data } : p));
            setCommentText(""); 
        } catch (err) {
            toast.error("Comment failed to save");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
                <div className="w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Syncing user directory...</p>
            </div>
        );
    }

    const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

    return (
        <div className="antialiased pb-16 min-h-screen relative bg-slate-50/60 px-4 pt-4 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10 space-y-8">
                
                {/* 1. USER IDENTITY CONSOLE */}
                <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                        <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-md border border-slate-800 uppercase tracking-tight shrink-0">
                            {firstLetter}
                        </div>
                        <div className="space-y-1 pt-1">
                            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-700 uppercase tracking-wide">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                <span>Verified Node Operator</span>
                            </div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">@{user?.username || "writer"}</h2>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">
                                Identity Block: <span className="text-slate-600 font-mono text-[11px]">{user?.email}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8 bg-slate-50/60 border border-slate-200/60 p-4 rounded-2xl w-full md:w-auto justify-around">
                        <div className="space-y-0.5 text-center sm:text-left">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Total Logs</span>
                            <div className="text-lg font-black text-slate-800">{userPosts.length} <span className="text-[10px] font-bold text-slate-400">items</span></div>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <button onClick={handleLogout} className="bg-white hover:bg-rose-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm">
                            De-sync Session 🚪
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-2">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Personal Repository</h3>
                        <p className="text-xs text-slate-400 font-medium">Manage your published media nodes.</p>
                    </div>
                </div>

                {/* 3. DYNAMIC CONTENT LAYER */}
                <div>
                    {userPosts.length === 0 ? (
                        <div className="text-center py-20 bg-white/80 rounded-3xl border border-slate-200/80 border-dashed">
                            <span className="text-2xl">📁</span>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-3">No matching records found.</p>
                        </div>
                    ) : (
                        <div ref={containerRef} className="w-full relative min-h-[400px]">
                            {userPosts.map(post => (
                                <div 
                                    key={post._id} 
                                    ref={el => { if(el) postRefs.current[post._id] = el; }} 
                                    className="opacity-100 transition-all duration-300 ease-out"
                                >
                                    <PostCard 
                                        post={post}
                                        loggedInUserId={loggedInUserId}
                                        isProfilePage={true} 
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

            {/* Modals */}
            {selectedPost && (
                <PostModal 
                    post={selectedPost}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    loggedInUserId={loggedInUserId}
                    isProfilePage={true} 
                    commentText={commentText}
                    setCommentText={setCommentText}
                    onClose={() => setSelectedPost(null)}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={() => {
                        navigator.clipboard.writeText(window.location.origin + `/post/${selectedPost._id}`);
                        toast.info("Link copied! 🔗");
                    }}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteConfirmModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default Profile;