"use client";

import { ArrowLeft, CheckCircle, Clock, XCircle, Wallet, ArrowDown, ArrowUp, TrendingUp, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

interface TransactionDetails {
    id: string;
    type: 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'transfer';
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'failed';
    date: Date;
    walletAddress?: string;
    paymentMethod?: string;
    paymentProof?: string;
    planId?: string;
}

interface TransactionDetailsClientProps {
    transaction: TransactionDetails;
    currency: string;
}

const formatCurrency = (amount: number, currency: string) => {
    return `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'approved':
            return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Completed' };
        case 'pending':
            return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pending' };
        case 'rejected':
            return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rejected' };
        case 'failed':
            return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Failed' };
        default:
            return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: status };
    }
};

const getTypeConfig = (type: string) => {
    switch (type) {
        case 'deposit':
            return { icon: ArrowDown, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Deposit' };
        case 'withdrawal':
            return { icon: ArrowUp, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Withdrawal' };
        case 'investment':
            return { icon: Wallet, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Investment' };
        case 'profit':
            return { icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Profit' };
        case 'transfer':
            return { icon: ArrowRight, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Transfer' };
        default:
            return { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-500/10', label: type };
    }
};

export default function TransactionDetailsClient({ transaction, currency }: TransactionDetailsClientProps) {
    const statusConfig = getStatusConfig(transaction.status);
    const typeConfig = getTypeConfig(transaction.type);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Header */}
            <div className="border-b border-white/[0.08] bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <Link
                        href="/dashboard/transactions"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Transactions
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        Transaction Details
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* Main Transaction Card */}
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
                    {/* Header with Type and Status */}
                    <div className="p-6 border-b border-white/[0.08]">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl ${typeConfig.bg} flex items-center justify-center`}>
                                    <TypeIcon className={`w-6 h-6 ${typeConfig.color}`} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{typeConfig.label}</h2>
                                    <p className="text-sm text-white/50 mt-1">ID: {transaction.id}</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">{statusConfig.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Amount and Date */}
                    <div className="p-6">
                        <div className="flex items-baseline justify-between mb-6">
                            <div>
                                <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Amount</p>
                                <p className={`text-3xl sm:text-4xl font-bold ${transaction.type === 'deposit' || transaction.type === 'profit' ? 'text-green-400' : 'text-white'}`}>
                                    {transaction.type === 'deposit' || transaction.type === 'profit' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-base text-white font-medium">{formatDate(transaction.date)}</p>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest border-b border-white/[0.08] pb-2">Transaction Information</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Transaction Type</p>
                                    <p className="text-sm font-medium text-white capitalize">{transaction.type}</p>
                                </div>
                                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-medium capitalize text-white">{transaction.status}</p>
                                </div>
                            </div>

                            {/* Type-specific fields */}
                            {transaction.paymentMethod && (
                                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Payment Method</p>
                                    <p className="text-sm font-medium text-white">{transaction.paymentMethod}</p>
                                </div>
                            )}

                            {transaction.walletAddress && (
                                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Wallet Address</p>
                                    <p className="text-sm font-mono text-white break-all">{transaction.walletAddress}</p>
                                </div>
                            )}

                            {transaction.planId && (
                                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Plan ID</p>
                                    <p className="text-sm font-mono text-white">{transaction.planId}</p>
                                </div>
                            )}

                            {transaction.paymentProof && (
                                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Payment Proof</p>
                                    <a
                                        href={transaction.paymentProof}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-cyan-400 hover:text-cyan-300 underline"
                                    >
                                        View Payment Proof
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Type-specific information cards */}
                {transaction.type === 'deposit' && (
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Deposit Information</h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Your deposit has been {transaction.status === 'approved' ? 'successfully processed and added to your account balance.' : transaction.status === 'pending' ? 'submitted and is being processed. Funds will be available once approved.' : transaction.status === 'rejected' ? 'rejected. Please contact support for more information.' : 'failed. Please try again or contact support.'}
                        </p>
                    </div>
                )}

                {transaction.type === 'withdrawal' && (
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Withdrawal Information</h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Your withdrawal request has been {transaction.status === 'approved' ? 'successfully processed and funds have been sent to your wallet.' : transaction.status === 'pending' ? 'submitted and is being processed. Funds will be sent once approved.' : transaction.status === 'rejected' ? 'rejected. Please contact support for more information.' : 'failed. Please try again or contact support.'}
                        </p>
                    </div>
                )}

                {transaction.type === 'investment' && (
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Investment Information</h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Your investment of {formatCurrency(transaction.amount, currency)} has been {transaction.status === 'approved' ? 'successfully activated and is now earning returns.' : transaction.status === 'pending' ? 'submitted and is being processed.' : transaction.status === 'rejected' ? 'rejected. Please contact support for more information.' : 'failed. Please try again or contact support.'}
                        </p>
                    </div>
                )}

                {transaction.type === 'profit' && (
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Profit Information</h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                            This profit payout of {formatCurrency(transaction.amount, currency)} has been {transaction.status === 'approved' ? 'successfully credited to your account balance.' : 'processed.'}
                        </p>
                    </div>
                )}

                {transaction.type === 'transfer' && (
                    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Transfer Information</h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Your transfer of {formatCurrency(transaction.amount, currency)} has been {transaction.status === 'approved' ? 'successfully completed.' : transaction.status === 'pending' ? 'submitted and is being processed.' : transaction.status === 'rejected' ? 'rejected. Please contact support for more information.' : 'failed. Please try again or contact support.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
