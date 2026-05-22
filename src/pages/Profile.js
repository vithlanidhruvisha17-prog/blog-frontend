import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom'; 
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

    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedPost]);

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
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Data load nahi ho paya!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileAndPosts();
    }, [navigate]);

    const handleDeleteClick = (postId) => {
        setPostToDelete(postId);
        setTimeout(() => {
            setIsDeleteModalOpen(true);
        }, 50);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;
        try {
            await API.delete(`/posts/${postToDelete}`);
            toast.success("Your blog is deleted successfully 🗑️");
            fetchProfileAndPosts(); 
            if (selectedPost?._id === postToDelete) setSelectedPost(null); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete is fail!ed");
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
            toast.error("Like is updated!");
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
            toast.error("Comment is saved!");
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
            
            {/* ─── PREMIUM SYSTEM GRID LAYER ─── */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
            
            {/* ─── AMBIENT BLUR MESH OBJECTS ─── */}
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-8">
                
                {/* 1. TOP PREMIUM USER IDENTITY CONSOLE */}
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
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                @{user?.username || "writer"}
                            </h2>
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
                        <div className="space-y-1">
                            <button 
                                onClick={handleLogout} 
                                className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
                            >
                                De-sync Session 🚪
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. SUBTLE PROFILE FEED BAR */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-2">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Personal Repository</h3>
                        <p className="text-xs text-slate-400 font-medium">Manage and review your published media nodes staged inside the system network.</p>
                    </div>
                </div>

                {/* 3. DYNAMIC CONTENT CARD LOOP LAYER */}
<div>
    {userPosts.length === 0 ? (
        <div className="text-center py-20 bg-white/80 rounded-3xl border border-slate-200/80 border-dashed backdrop-blur-md">
            <span className="text-2xl">📁</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-3">No matching records found in local directory node.</p>
        </div>
    ) : (
        /* YAHAN GRID HATA KAR COLUMNS LAGAYA HAI TAAKI POSTS UPAR KHISAK JAYEIN */
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full">
            {userPosts.map(post => (
                /* break-inside-avoid lagane se card beech me se break nahi hoga */
                <div key={post._id} className="break-inside-avoid inline-block w-full transition-all duration-300">
                    <PostCard 
                        post={post}
                        loggedInUserId={loggedInUserId}
                        isProfilePage={true} // 🔥 FIX: Ise TRUE kiya taaki Edit/Delete buttons visible ho sakein!
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

            {/* --- Post Details Modal Structural Component --- */}
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

            {/* --- Custom UI Portal Delete Confirmation Modal --- */}
            {isDeleteModalOpen && (
                <DeleteConfirmModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setPostToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default Profile;