// frontend/src/components/account/DeleteAccountSection.tsx
"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, X, Loader2, ShieldAlert } from "lucide-react";

export default function DeleteAccountSection() {
  const { user } = useUser();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmInput.trim().toUpperCase() !== "DELETE") {
      setError("Please type 'DELETE' to confirm account deletion.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      if (user) {
        await user.delete();
      }

      // Clear local storage and signup tracking cookies
      if (typeof window !== "undefined") {
        localStorage.clear();
        document.cookie = "has_signed_up=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      }

      router.push("/sign-up");
    } catch (err: any) {
      console.error("Account deletion error:", err);
      setError(err?.errors?.[0]?.longMessage || err?.message || "Failed to delete account. Please try logging in again first.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-card via-card to-red-950/20 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">Danger Zone</h3>
              <p className="text-xs text-muted-foreground">Irreversible account actions</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full uppercase">
            Permanent Action
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">Delete Account Permanently</h4>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Permanently delete your profile, saved ATS resume audits, personalized target role roadmaps, and account data. This action cannot be undone.
            </p>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              setConfirmInput("");
              setError("");
            }}
            className="inline-flex items-center gap-2 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-red-950/30 cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-foreground">Delete Account?</h3>
                <p className="text-xs text-muted-foreground">This action is permanent and irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-foreground/90 leading-relaxed bg-red-500/5 border border-red-500/20 p-3.5 rounded-2xl">
              All of your saved resume audits, AI interview history, target role roadmaps, and profile settings will be permanently erased.
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground block font-bold">
                Type <span className="text-red-400 font-mono font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-background border border-border text-foreground text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={confirmInput.trim().toUpperCase() !== "DELETE" || isDeleting}
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-lg shadow-red-950/30 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Confirm Permanent Deletion
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
