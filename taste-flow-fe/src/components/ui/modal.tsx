"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={cn("bg-[#2A2A2A] rounded-2xl p-6 border border-[#3A3A3A] w-full max-w-md", className)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-[#858787] hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

Modal.displayName = "Modal";

export { Modal };