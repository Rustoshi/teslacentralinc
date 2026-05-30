import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { ObjectId } from "mongoose";
import TransactionDetailsClient from "@/components/dashboard/transactions/TransactionDetailsClient";

export const dynamic = "force-dynamic";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/invest/login");
    }

    await dbConnect();

    // Fetch transaction with user validation
    const transaction = await Transaction.findById(id).lean();
    if (!transaction) {
        redirect("/dashboard/transactions");
    }

    // Verify transaction belongs to the current user
    if (transaction.userId.toString() !== session.user.id) {
        redirect("/dashboard/transactions");
    }

    // Fetch user data for currency
    const user = await User.findById(session.user.id).select("currency").lean();
    const currency = user?.currency || "$";

    return (
        <TransactionDetailsClient
            transaction={{
                id: transaction._id.toString(),
                type: transaction.type,
                amount: transaction.amount,
                status: transaction.status,
                date: transaction.date,
                walletAddress: transaction.walletAddress,
                paymentMethod: transaction.paymentMethod,
                paymentProof: transaction.paymentProof,
                planId: transaction.planId?.toString(),
            }}
            currency={currency}
        />
    );
}
