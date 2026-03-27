"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ScanLine, RotateCcw, UserCheck, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
  event: { title: string; eventDate: string; location: string };
}

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "loading" }
  | { status: "already_checked_in"; registration: Registration }
  | { status: "success"; registration: Registration }
  | { status: "error"; message: string };

export default function CheckInPage() {
  const scannerRef = useRef<any>(null);
  const [scanState, setScanState] = useState<ScanState>({ status: "idle" });
  const processingRef = useRef(false);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
  };

  const startScanner = async () => {
    processingRef.current = false;
    setScanState({ status: "scanning" });

    // small delay to let React render the qr-reader div into view
    await new Promise((r) => setTimeout(r, 100));

    const { Html5Qrcode } = await import("html5-qrcode");
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText: string) => {
          if (processingRef.current) return;
          processingRef.current = true;
          await stopScanner();
          handleScan(decodedText);
        },
        undefined
      );
    } catch (err: any) {
      setScanState({
        status: "error",
        message: err?.message?.includes("permission")
          ? "Camera permission denied. Please allow camera access."
          : "Could not start camera. Try again.",
      });
    }
  };

  const handleScan = async (registrationId: string) => {
    setScanState({ status: "loading" });

    try {
      const res = await fetch(`/api/checkin?id=${encodeURIComponent(registrationId)}`);
      const data = await res.json();

      if (!res.ok) {
        setScanState({ status: "error", message: data.error || "Registration not found" });
        return;
      }

      const reg: Registration = data.data;

      if (reg.checkedIn) {
        setScanState({ status: "already_checked_in", registration: reg });
        return;
      }

      const checkRes = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      const checkData = await checkRes.json();

      if (checkRes.ok) {
        setScanState({ status: "success", registration: checkData.data });
      } else {
        setScanState({ status: "error", message: checkData.error || "Check-in failed" });
      }
    } catch {
      setScanState({ status: "error", message: "Network error. Please try again." });
    }
  };

  const reset = async () => {
    await stopScanner();
    setScanState({ status: "idle" });
    processingRef.current = false;
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  const isScanning = scanState.status === "scanning";

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Event Check-In</h1>
        <p className="text-sm text-gray-500 mt-1">Scan attendee QR codes to check them in</p>
      </div>

      {/* Scanner box — always in DOM so html5-qrcode can mount into it */}
      <div className="rounded-xl border border-surface-3 bg-surface-0 overflow-hidden min-h-[200px] flex items-center justify-center">
        {!isScanning ? (
          <div className="flex flex-col items-center gap-3 text-gray-400 py-10">
            <ScanLine className="h-12 w-12" />
            <p className="text-sm">Camera is off</p>
            <div id="qr-reader" className="hidden" />
          </div>
        ) : (
          <div id="qr-reader" className="w-full" />
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {scanState.status === "idle" || scanState.status === "error" || scanState.status === "success" || scanState.status === "already_checked_in" ? (
          <button onClick={startScanner} className="btn-primary flex-1 gap-2">
            <ScanLine className="h-4 w-4" />
            {scanState.status === "idle" ? "Start Scanner" : "Scan Again"}
          </button>
        ) : scanState.status === "scanning" ? (
          <button onClick={reset} className="btn-secondary flex-1 gap-2">
            Stop Scanner
          </button>
        ) : null}

        {scanState.status !== "idle" && scanState.status !== "scanning" && (
          <button onClick={reset} className="btn-ghost gap-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {scanState.status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-surface-3 bg-surface-0 p-6 flex items-center justify-center gap-3 text-sm text-gray-500"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            Verifying registration…
          </motion.div>
        )}

        {scanState.status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-green-200 bg-green-50 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-600 shrink-0" />
              <div>
                <p className="font-semibold text-green-800">Checked In!</p>
                <p className="text-xs text-green-600">
                  {format(new Date(scanState.registration.checkedInAt!), "h:mm a, MMM d")}
                </p>
              </div>
            </div>
            <RegistrationCard registration={scanState.registration} />
          </motion.div>
        )}

        {scanState.status === "already_checked_in" && (
          <motion.div
            key="duplicate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-amber-200 bg-amber-50 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-7 w-7 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800">Already Checked In</p>
                <p className="text-xs text-amber-600">
                  {format(new Date(scanState.registration.checkedInAt!), "h:mm a, MMM d")}
                </p>
              </div>
            </div>
            <RegistrationCard registration={scanState.registration} />
          </motion.div>
        )}

        {scanState.status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-center gap-3"
          >
            <XCircle className="h-7 w-7 text-red-500 shrink-0" />
            <div>
              <p className="font-semibold text-red-700">Error</p>
              <p className="text-sm text-red-600">{scanState.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RegistrationCard({ registration }: { registration: Registration }) {
  return (
    <div className="space-y-2 text-sm">
      {[
        { label: "Name", value: registration.name },
        { label: "Email", value: registration.email },
        { label: "Phone", value: registration.phone || "—" },
        { label: "Event", value: registration.event.title },
      ].map((item) => (
        <div key={item.label} className="flex justify-between border-b border-black/5 pb-1">
          <span className="text-gray-500">{item.label}</span>
          <span className="font-medium text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
