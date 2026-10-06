"use client";

import { MessageCircle, X } from "@esmate/shadcn/pkgs/lucide-react";

export function ChatButton({
  onClick,
  open,
}: {
  onClick: () => void;
  open: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed z-50 hidden items-center justify-center rounded-full bg-[#f6a45d] text-white shadow-lg transition-transform hover:scale-105 lg:bottom-6 lg:left-6 lg:flex lg:h-14 lg:w-14"
      aria-label={open ? "Close AI assistant" : "Open AI assistant"}
    >
      {open ? <X className="h-5 w-5 lg:h-6 lg:w-6" /> : <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />}
    </button>
  );
}

