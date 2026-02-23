"use client";

import { forwardRef } from "react";
import { format } from "date-fns";

interface DuesReceiptProps {
  memberName: string;
  memberId: string;
  matricNumber: string;
  department: string | null;
  academicSession: string;
  amount: number;
  paymentRef: string;
  paymentStatus: string;
  paidAt: string | null;
}

export const DuesReceipt = forwardRef<HTMLDivElement, DuesReceiptProps>(
  function DuesReceipt(
    { memberName, memberId, matricNumber, department, academicSession, amount, paymentRef, paymentStatus, paidAt },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="w-full max-w-md mx-auto bg-white rounded-2xl border border-surface-3 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-navy-800 text-white px-6 py-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="RUNACOS"
              className="h-8 w-8 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <h1 className="font-heading font-bold text-lg">RUNACOS</h1>
          </div>
          <p className="text-xs text-navy-300 font-mono uppercase tracking-wider">
            Dues Payment Receipt
          </p>
        </div>

        {/* Status Banner */}
        <div
          className={`px-6 py-2 text-center text-xs font-mono font-medium ${
            paymentStatus === "VERIFIED"
              ? "bg-emerald-50 text-emerald-700"
              : paymentStatus === "PENDING"
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {paymentStatus === "VERIFIED" ? "PAYMENT VERIFIED" : paymentStatus}
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-3">
          {[
            { label: "Member Name", value: memberName },
            { label: "Member ID", value: memberId },
            { label: "Matric Number", value: matricNumber },
            { label: "Department", value: department || "N/A" },
            { label: "Academic Session", value: academicSession },
            { label: "Amount Paid", value: `\u20A6${amount.toLocaleString()}` },
            { label: "Payment Reference", value: paymentRef },
            {
              label: "Payment Date",
              value: paidAt ? format(new Date(paidAt), "MMM dd, yyyy 'at' h:mm a") : "Pending",
            },
          ].map((item) => (
            <div key={item.label} className="flex justify-between border-b border-surface-3 pb-2">
              <span className="text-xs text-gray-500">{item.label}</span>
              <span className="text-xs font-medium text-gray-900 font-mono text-right max-w-[60%] break-all">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-1 text-center">
          <p className="text-[10px] text-gray-400">
            Redeemer&apos;s University Association of Computer Science Students
          </p>
          <p className="text-[10px] text-gray-400 font-mono mt-1">
            Generated on {format(new Date(), "MMM dd, yyyy")}
          </p>
        </div>
      </div>
    );
  }
);
