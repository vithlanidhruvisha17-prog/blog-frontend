import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ handleLogout }) => {
    const location = useLocation();

    // Active link check karne ke liye helper function
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* ========================================================================= */}
            {/* 1. LAPTOP VIEW                                                            */}
            {/* ========================================================================= */}
            <aside className="hidden md:flex w-64 bg-white h-screen border-r border-slate-200 fixed top-0 left-0 flex-col justify-between p-5 antialiased z-40 select-none">
                {/* Top: Logo and Navigation Links */}
                <div className="flex flex-col space-y-8">
                    {/* Brand Logo */}
                    <Link to="/" className="px-2 flex items-center space-x-2">
                        <span className="text-xl font-extrabold text-slate-950 tracking-tight">
                            Blog<span className="text-indigo-600">Hub</span>
                        </span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold border border-indigo-100">PRO</span>
                    </Link>

                    {/* Nav Items */}
                    <nav className="flex flex-col space-y-1.5">
                        {/* Dashboard / Home */}
                        <Link 
                            to="/" 
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                isActive('/') 
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span>Dashboard</span>
                        </Link>

                        {/* Write Blog */}
                        <Link 
                            to="/create-post" 
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                isActive('/create-post') 
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            <span>Write Blog</span>
                        </Link>

                        {/* My Workspace / Profile */}
                        <Link 
                            to="/profile" 
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                isActive('/profile') 
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>My Workspace</span>
                        </Link>
                    </nav>
                </div>

                {/* Bottom: User Action (Sign Out) */}
                <div className="pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all focus:outline-none group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.25 21h6a2.25 2.25 0 002.25-2.25V15M19.5 12l-3-3m3 3l-3 3m3-3H9" />
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ========================================================================= */}
            {/* 2. MOBILE VIEW (ONLY VISIBLE ON MOBILE AS BOTTOM NAV)                     */}
            {/* ========================================================================= */}
            <div className="flex md:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-slate-200 justify-around items-center px-2 z-40 select-none">
                <Link 
                    to="/" 
                    className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
                        isActive('/') ? 'text-indigo-600' : 'text-slate-500'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="text-[10px] font-bold mt-0.5">Home</span>
                </Link>

                <Link 
                    to="/create-post" 
                    className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
                        isActive('/create-post') ? 'text-indigo-600' : 'text-slate-500'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <span className="text-[10px] font-bold mt-0.5">Write</span>
                </Link>

                <Link 
                    to="/profile" 
                    className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
                        isActive('/profile') ? 'text-indigo-600' : 'text-slate-500'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-bold mt-0.5">Workspace</span>
                </Link>

                <button 
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center w-16 h-12 rounded-xl text-rose-500 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.25 21h6a2.25 2.25 0 002.25-2.25V15M19.5 12l-3-3m3 3l-3 3m3-3H9" />
                    </svg>
                    <span className="text-[10px] font-bold mt-0.5">Logout</span>
                </button>
            </div>
        </>
    );
};

export default Sidebar;