import React from 'react';

const PostCard = ({ post, loggedInUserId, isProfilePage, onCardClick, onEdit, onDelete }) => {
    return (
        <div onClick={() => onCardClick(post)}>
            <div className="group bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full relative cursor-pointer hover:-translate-y-1 transition-all duration-300">            
                
                {/* 📸 Media Section */}
                {post.media && post.media.length > 0 && (
                    <div className="w-full h-52 overflow-hidden bg-gray-100 flex items-center justify-center">
                        {post.media[0].resourceType === 'video' ? (
                            <video src={post.media[0].url} className="w-full h-full object-cover" muted />
                        ) : (
                            <img src={post.media[0].url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                    </div>
                )}

                {/* ⚙️ Edit/Delete Controls */}
                {(isProfilePage || loggedInUserId === post.author?._id || loggedInUserId === post.author?.id) && (
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onEdit(post._id); 
                            }} 
                            className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors shadow-md focus:outline-none"
                        >
                            ✏️
                        </button>
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onDelete(post._id); 
                            }} 
                            className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-md focus:outline-none"
                        >
                            🗑️
                        </button>
                    </div>
                )}

                {/* Content Body */}
                <div className="p-8 flex-grow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">{post.title}</h2>
                    <p className="text-gray-600 line-clamp-4">{post.content}</p>
                </div>

                {/* Footer Metrics */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between z-10">
                    {isProfilePage ? (
                        <div className="flex space-x-4 text-sm font-bold text-gray-500">
                            <span className="flex items-center">❤️ {post.likes?.length || 0} Likes</span>
                            <span className="flex items-center">💬 {post.comments?.length || 0} Comments</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {post.author?.username?.[0] || 'A'}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{post.author?.username || "Anonymous"}</span>
                        </div>
                    )}
                    <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

            </div>
        </div>
    );
};

export default PostCard;