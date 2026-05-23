import React from 'react';
import ReactDOM from 'react-dom';

const PostModal = ({ 
    post, 
    currentIndex, 
    setCurrentIndex, 
    loggedInUserId, 
    isProfilePage, 
    commentText, 
    setCommentText, 
    onClose, 
    onLike, 
    onComment, 
    onShare 
}) => {
    const authorName = post.author?.username || post.username || "Dhruvi";
    const initialLetter = authorName.charAt(0).toUpperCase();

    // Check custom media availability
    const hasMedia = post.media && post.media.length > 0;

    const isLikedByMe = post.likes?.some(like => {
        if (!like) return false;
        const likeId = typeof like === 'string' ? like : (like._id || like.id);
        return likeId === loggedInUserId;
    });

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 antialiased left-0 top-0 w-screen h-screen">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Modal Body */}
            {/* max-w-5xl ki jagah text-only me layout ko compact rakhne ke liye conditionally max-w-2xl kiya h */}
            <div className={`bg-white w-full ${hasMedia ? 'max-w-5xl' : 'max-w-2xl'} h-[85vh] max-h-[800px] rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col md:flex-row relative border border-slate-100`}>
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 w-8 h-8 rounded-lg flex items-center justify-center z-20 transition-all border border-slate-200/60 text-sm"
                >
                    ✕
                </button>

                {/* Left Side: Media Gallery*/}
                {hasMedia && (
                    <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center relative group select-none">
                        {post.media[currentIndex].resourceType === 'video' ? (
                            <video src={post.media[currentIndex].url} controls className="max-w-full max-h-full object-contain" />
                        ) : (
                            <img src={post.media[currentIndex].url} alt={`Media ${currentIndex}`} className="max-w-full max-h-full object-contain" />
                        )}

                        {post.media.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? post.media.length - 1 : prev - 1)); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/70 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all text-lg"
                                >
                                    &larr;
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === post.media.length - 1 ? 0 : prev + 1)); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/70 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all text-lg"
                                >
                                    &rarr;
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-slate-900/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    {post.media.map((_, idx) => (
                                        <span key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-indigo-500 w-3' : 'bg-slate-500'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Right Side: Content Shell (Conditionally updates width based on media presence) */}
                <div className={`w-full ${hasMedia ? 'md:w-1/2 border-l' : 'md:w-full'} p-6 overflow-y-auto flex flex-col justify-between bg-white border-slate-100`}>
                    <div className="flex flex-col h-full overflow-y-auto pr-1 custom-scrollbar">
                        {/* Author Info */}
                        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-slate-100">
                            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold tracking-wide">
                                {initialLetter}
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-slate-900">{authorName}</p>
                                <p className="text-xs text-slate-400 font-medium">{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Text Content */}
                        <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug tracking-tight">{post.title}</h2>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-6 font-normal">{post.content}</p>

                        {/* Collapsible Info Lists for Profile Dashboard */}
                        {isProfilePage && (
                            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                                <div>
                                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <span>Approvals</span>
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full font-bold">{post.likes?.length || 0}</span>
                                    </h4>
                                    <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                                        {post.likes && post.likes.length > 0 ? (
                                            post.likes.map((like, idx) => {
                                                const likeId = typeof like === 'string' ? like : (like._id || like.id);
                                                const likerName = like.username || (likeId === loggedInUserId ? "You" : authorName);
                                                return (
                                                    <p key={idx} className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm truncate">
                                                        @{likerName}
                                                    </p>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-slate-400 italic font-normal">No engagement yet</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <span>Contributors</span>
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full font-bold">{post.comments?.length || 0}</span>
                                    </h4>
                                    <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                                        {post.comments && post.comments.length > 0 ? (
                                            post.comments.map((comm, idx) => {
                                                const commenterName = comm.username || comm.userId?.username || comm.user?.username || authorName;
                                                return (
                                                    <p key={idx} className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm truncate">
                                                        @{commenterName}
                                                    </p>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-slate-400 italic font-normal">No activity yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Discussion Thread</span>
                        </div>

                        {/* Discussion List Box */}
                        <div className="flex-1 min-h-[150px] max-h-[220px] overflow-y-auto mb-4 pr-1 space-y-2.5 custom-scrollbar">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((c, i) => {
                                    const commentUser = c.username || c.user?.username || c.userId?.username || authorName || "Anonymous";
                                    return (
                                        <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200/40 hover:bg-slate-100/50 transition-colors">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-indigo-600">@{commentUser}</span>
                                            </div>
                                            <p className="text-xs text-slate-700 font-normal leading-relaxed">{c.text || c.content}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex items-center justify-center border border-dashed border-slate-200 rounded-xl p-4">
                                    <p className="text-xs text-slate-400 italic">No community remarks found. Start the conversation below.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-slate-100 mt-auto bg-white">
                        <div className="flex items-center space-x-5 mb-4 text-slate-600">
                            <button onClick={onLike} className="flex items-center space-x-1.5 group focus:outline-none text-xs font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill={isLikedByMe ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-5 h-5 transition-transform group-hover:scale-110 ${isLikedByMe ? "text-rose-500" : "text-slate-400 group-hover:text-rose-500"}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                                <span className={isLikedByMe ? "text-rose-600" : "text-slate-600"}>{post.likes?.length || 0}</span>
                            </button>
                            
                            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641l-.318 1.235c-.077.299.198.566.49.48l1.39-.41a1.688 1.688 0 011.07.1c1.353.626 2.87.974 4.501.974z" />
                                </svg>
                                <span>{post.comments?.length || 0}</span>
                            </div>

                            <button onClick={onShare} className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                            <input 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add your constructive insights..." 
                                className="flex-1 bg-transparent py-2 px-3 text-xs text-slate-800 placeholder-slate-400 outline-none"
                            />
                            <button 
                                onClick={onComment}
                                disabled={!commentText.trim()}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-sm"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default PostModal;