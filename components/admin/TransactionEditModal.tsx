"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, DollarSign, Wallet, CreditCard, Hash } from "lucide-react";
import { updateTransaction } from "@/app/admin/actions/transactions";

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    status: string;
    paymentMethod: string;
    walletAddress: string;
    paymentProof: string;
}

interface TransactionEditModalProps {
    transaction: Transaction;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TransactionEditModal({ transaction, onClose, onSuccess }: TransactionEditModalProps) {
    const [formData, setFormData] = useState({
        amount: transaction.amount,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        walletAddress: transaction.walletAddress,
        paymentProof: transaction.paymentProof,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await updateTransaction(transaction._id, formData);

        if (result.success) {
            onSuccess();
            onClose();
        } else {
            setError(result.error || "Failed to update transaction");
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/[0.06] sticky top-0 bg-[#0a0a0a] z-10">
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-widest uppercase" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                                Edit Transaction
                            </h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                                {transaction.type} • {transaction._id.slice(-8)}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                <DollarSign className="w-3 h-3" />
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                <Hash className="w-3 h-3" />
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange("status", e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                <CreditCard className="w-3 h-3" />
                                Payment Method
                            </label>
                            <input
                                type="text"
                                value={formData.paymentMethod}
                                onChange={(e) => handleChange("paymentMethod", e.target.value)}
                                placeholder="e.g., USDT, BTC"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        {/* Wallet Address - for crypto transactions */}
                        {(transaction.type === "deposit" || transaction.type === "withdrawal") && (
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                    <Wallet className="w-3 h-3" />
                                    Wallet Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.walletAddress}
                                    onChange={(e) => handleChange("walletAddress", e.target.value)}
                                    placeholder="Wallet address"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                                />
                            </div>
                        )}

                        {/* Payment Proof URL */}
                        {transaction.type === "deposit" && (
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                    <Hash className="w-3 h-3" />
                                    Payment Proof URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.paymentProof}
                                    onChange={(e) => handleChange("paymentProof", e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? "Saving..." : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
