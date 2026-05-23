import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const Auth = ({ initialMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [floatingEmojis, setFloatingEmojis] = useState([]);
    const navigate = useNavigate();

    // Forgot Password States
    const [isForgotMode, setIsForgotMode] = useState(false); 
    const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp' | 'password'
    const [forgotEmail, setForgotEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const emojiPool = ['🎸', '🎧', '💃', '🍔', '🌴', '📚', '🎨', '🍕', '✈️', '🍿', '💻', '🚀', '☕', '✍️', '🎭', '🚲', '🍩', '📸', '🎵', '🎨'];

    useEffect(() => {
        setIsLogin(initialMode === 'login');
    }, [initialMode]);

    useEffect(() => {
        const totalColumns = 20; 
        const emojisPerColumn = 3; 
        const generatedEmojis = [];
        let idCounter = 0;

        for (let col = 0; col < totalColumns; col++) {
            const baseLeft = (col / totalColumns) * 100;
            for (let row = 0; row < emojisPerColumn; row++) {
                const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
                const finalLeft = baseLeft + (Math.random() * 6 - 3); 
                const stratifiedDelay = (row * -12) - (Math.random() * 8); 
                const randomDuration = 22 + Math.random() * 8; 
                const randomSize = 24 + Math.random() * 12; 

                generatedEmojis.push({
                    id: idCounter++,
                    char: randomEmoji,
                    left: `${Math.max(0, Math.min(100, finalLeft))}%`,
                    delay: `${stratifiedDelay}s`,
                    duration: `${randomDuration}s`,
                    size: `${randomSize}px`
                });
            }
        }
        setFloatingEmojis(generatedEmojis);
    }, []);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            toast.info("Verifying Google account details... 🌐");
            
            const { data } = await API.post('/auth/google-login', { 
                token: credentialResponse.credential 
            });
            
            const tokenToSave = data.accessToken || data.token;
            localStorage.setItem('token', tokenToSave);
            
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('currentUser', data.user.username);
            }

            toast.success("Google Login Successful! 🚀");
            navigate('/profile');
        } catch (err) {
            toast.error(err.response?.data?.message || "Google Authentication Failed on Server!");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error("Google Authentication Failed. Initialization interrupted!");
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.post('/auth/login', loginData);
            const tokenToSave = data.accessToken || data.token;
            localStorage.setItem('token', tokenToSave); 

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user)); 
                localStorage.setItem('currentUser', data.user.username);
            }

            toast.success(`Welcome back! ✨`);
            navigate('/profile'); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid Details!");
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/auth/signup', signupData); 
            toast.success("Registration Successful! 🚀");
            window.history.pushState(null, '', '/login');
            setIsLogin(true); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Something went wrong!";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.warn("Please enter your registered email address first.");
            return;
        }

        setLoading(true);
        try {
            toast.info("Generating security code... 📲");
            const { data } = await API.post('/auth/forgot-password', { email: forgotEmail });
            toast.success(data.message || "OTP sent successfully! Check your inbox.");
            setForgotStep('otp'); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to initiate password recovery.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.length < 6) {
            toast.warn("Please type the complete 6-digit verification code.");
            return;
        }

        setLoading(true);
        try {
            toast.info("Verifying token... 🔄");
            const { data } = await API.post('/auth/verify-otp', { email: forgotEmail, otp: otpCode });
            toast.success(data.message || "Verification passed!");
            
            // --- FLUID 180 DEGREE FLIP TRIGGER ---
            setForgotStep('password'); 
            setIsForgotMode(false); 

        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid or expired OTP code.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Save Password
    const handleSaveNewPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.warn("Password must contain at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            toast.info("Updating workspace credentials... 🔒");
            const { data } = await API.post('/auth/reset-password', { email: forgotEmail, password: newPassword });
            toast.success(data.message || "Password updated! You can now log in.");
            
            // State completely reset to default login layout
            setIsForgotMode(false);
            setForgotStep('email');
            setForgotEmail('');
            setOtpCode('');
            setNewPassword('');
            setIsLogin(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to overwrite password.");
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = (toLogin) => {
        window.history.pushState(null, '', toLogin ? '/login' : '/signup');
        setIsLogin(toLogin);
        setIsForgotMode(false);
        setForgotStep('email');
    };

    const handleBackToSignIn = () => {
        setIsForgotMode(false); 
        setIsLogin(true); 
        setTimeout(() => {
            setForgotStep('email');
        }, 800); 
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-slate-50 flex items-center justify-center p-4 antialiased overflow-hidden select-none z-[99999]">
            
            <style>{`
                @keyframes gridFloatUpwards {
                    0% { top: 105vh; transform: rotate(0deg); }
                    100% { top: -15vh; transform: rotate(360deg); }
                }
                .canvas-emoji {
                    position: fixed !important;
                    user-select: none;
                    pointer-events: none !important;
                    animation-name: gridFloatUpwards;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    opacity: 0.28; 
                    z-index: 10;
                    will-change: top, transform;
                }
                .flip-card-container { 
                    perspective: 1200px; 
                    position: relative;
                    z-index: 100;
                }
                .flip-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                }
                .flipped-active { transform: rotateY(180deg); }
                
                .flip-card-front, .flip-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    top: 0;
                    left: 0;
                    z-index: 150;
                }
                .flip-card-back { transform: rotateY(180deg); }
                
                .clickable-element {
                    position: relative;
                    z-index: 200 !important;
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }
                .google-btn-wrapper iframe {
                    width: 100% !important;
                    margin: 0 auto !important;
                }
                .fade-in-layout {
                    animation: fadeInEffect 0.4s ease-out forwards;
                }
                @keyframes fadeInEffect {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {floatingEmojis.map((emoji) => (
                <span key={emoji.id} className="canvas-emoji" style={{ left: emoji.left, animationDelay: emoji.delay, animationDuration: emoji.duration, fontSize: emoji.size }}>
                    {emoji.char}
                </span>
            ))}

            <div className="flip-card-container w-full max-w-md h-[610px]">
                <div className={`flip-card-inner h-full w-full ${(!isLogin || isForgotMode) ? 'flipped-active' : ''}`}>
                    
                    {/* FRONT INTERFACE SIDE (Login & New Password Step) */}
                    <div className="flip-card-front bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xl flex flex-col justify-center h-full">
                        
                        {forgotStep === 'password' ? (
                            /* --- Setup New Password Form (Cleanly rendered on front after 180° flip) --- */
                            <div className="fade-in-layout">
                                <div className="text-center mb-5">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-3 font-bold text-xl">
                                        🔑
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Setup New Password</h2>
                                    <p className="text-sm text-slate-500 mt-1">Identity verified. Overwrite security access key</p>
                                </div>

                                <form onSubmit={handleSaveNewPassword} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">New Strong Password</label>
                                        <input 
                                            type="password" placeholder="••••••••" required value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1">Minimum 6 alpha-numeric characters required.</p>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm transition-all clickable-element">
                                        {loading ? 'Saving Changes...' : 'Update Password & Login'}
                                    </button>
                                </form>

                                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                                    <button type="button" onClick={handleBackToSignIn} className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors clickable-element">
                                        ← Cancel & Back to Sign In
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* --- Standard Login Workspace --- */
                            <div className="fade-in-layout">
                                <div className="text-center mb-5">
                                    <div className="inline-flex items-center space-x-1.5 mb-2">
                                        <span className="text-xl font-extrabold text-slate-950 tracking-tight">
                                            Blog<span className="text-indigo-600">Hub</span>
                                        </span>
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded font-bold border border-indigo-100">PRO</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
                                    <p className="text-sm text-slate-500 mt-1">Access your professional blogging workspace</p>
                                </div>
                                
                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
                                        <input 
                                            type="email" placeholder="name@company.com" required value={loginData.email}
                                            onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setForgotEmail(loginData.email); 
                                                    setIsForgotMode(true);
                                                    setForgotStep('email');
                                                }}
                                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none clickable-element"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <input 
                                            type="password" placeholder="••••••••" required value={loginData.password}
                                            onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm transition-all mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99] clickable-element'}`}>
                                        {loading ? "Verifying..." : "Sign In to Workspace"}
                                    </button>
                                </form>

                                <div className="mt-5">
                                    <div className="relative flex items-center justify-center my-4">
                                        <div className="absolute inset-0 w-full border-t border-slate-100"></div>
                                        <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Or continue with</span>
                                    </div>
                                    <div className="w-full flex justify-center google-btn-wrapper clickable-element">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            theme="outline" size="large" width="288px" text="continue_with" shape="circle"
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Don't have an enterprise account?{' '}
                                        <button type="button" onClick={() => toggleMode(false)} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors focus:outline-none clickable-element">
                                            Sign up here
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BACK INTERFACE SIDE (Signup & Recover Flow: Email & OTP)*/}
                    <div className="flip-card-back bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xl flex flex-col justify-center h-full">
                        
                        {isForgotMode ? (
                            /* --- Forgot Password Flow (Email or OTP steps) --- */
                            <div className="fade-in-layout">
                                <div className="text-center mb-5">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-3 font-bold text-xl">
                                        {forgotStep === 'email' ? '📧' : '🛡️'}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                        {forgotStep === 'email' ? 'Recover Password' : 'Enter Security Code'}
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {forgotStep === 'email' ? 'Provide your account email to receive a 6-digit code' : 
                                         'We have dispatched a temporary code to your address.'}
                                    </p>
                                </div>

                                {forgotStep === 'email' && (
                                    <form onSubmit={handleSendOTP} className="space-y-4 fade-in-layout">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Your Registered Email</label>
                                            <input 
                                                type="email" placeholder="you@example.com" required value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                            />
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all clickable-element">
                                            {loading ? 'Sending Code...' : 'Send Verification OTP'}
                                        </button>
                                    </form>
                                )}

                                {forgotStep === 'otp' && (
                                    <form onSubmit={handleVerifyOTP} className="space-y-4 fade-in-layout">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 text-center">6-Digit Verification OTP</label>
                                            <input 
                                                type="text" maxLength="6" placeholder="000000" required value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-[8px] text-indigo-600 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                            />
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all clickable-element">
                                            {loading ? 'Validating...' : 'Verify & Continue'}
                                        </button>
                                        <div className="text-center">
                                            <button type="button" onClick={() => setForgotStep('email')} className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline clickable-element">
                                                Change email address
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                                    <button type="button" onClick={handleBackToSignIn} className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors clickable-element">
                                        ← Back to Sign In
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* --- Normal Signup Form Panel --- */
                            <div className="fade-in-layout">
                                <div className="text-center mb-5">
                                    <div className="inline-flex items-center space-x-1.5 mb-2">
                                        <span className="text-xl font-extrabold text-slate-950 tracking-tight">
                                            Blog<span className="text-indigo-600">Hub</span>
                                        </span>
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded font-bold border border-indigo-100">PRO</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
                                    <p className="text-sm text-slate-500 mt-1">Create your secure intern account workspace</p>
                                </div>
                                
                                <form onSubmit={handleSignupSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Username</label>
                                        <input 
                                            type="text" placeholder="JohnDoe" required value={signupData.username}
                                            onChange={(e) => setSignupData({...signupData, username: e.target.value})} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
                                        <input 
                                            type="email" placeholder="mail@example.com" required value={signupData.email}
                                            onChange={(e) => setSignupData({...signupData, email: e.target.value})} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Password</label>
                                        <input 
                                            type="password" placeholder="••••••••" required value={signupData.password}
                                            onChange={(e) => setSignupData({...signupData, password: e.target.value})} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm transition-all mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99] clickable-element'}`}>
                                        {loading ? "Processing..." : "Create Account"}
                                    </button>
                                </form>
                                <div className="mt-5">
                                    <div className="relative flex items-center justify-center my-4">
                                        <div className="absolute inset-0 w-full border-t border-slate-100"></div>
                                        <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Or sign up with</span>
                                    </div>
                                    <div className="w-full flex justify-center google-btn-wrapper clickable-element">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            theme="outline" size="large" width="288px" text="signup_with" shape="circle"
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Already a member?{' '}
                                        <button type="button" onClick={() => toggleMode(true)} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors focus:outline-none clickable-element">
                                            Log in
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Auth;