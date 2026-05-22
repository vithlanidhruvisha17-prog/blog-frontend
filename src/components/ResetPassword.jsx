import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams(); // URL se token nikalne ke liye
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords match nahi ho rahe hain! ❌");
            return;
        }

        try {
            setLoading(true);
            const { data } = await API.post(`/auth/reset-password/${token}`, { password });
            toast.success(data.message);
            navigate('/login'); // Success ke baad sidha login screen par redirection
        } catch (err) {
            toast.error(err.response?.data?.message || "Kuch galat hua. Fir se try karein!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Set New Password</h2>
                <p className="text-sm text-slate-500 text-center mb-6">Apna naya secure password select karein.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">New Password</label>
                        <input 
                            type="password" placeholder="••••••••" required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Confirm New Password</label>
                        <input 
                            type="password" placeholder="••••••••" required value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm transition-all">
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;