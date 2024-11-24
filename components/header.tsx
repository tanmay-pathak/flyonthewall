"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="bg-zuPrimary border-b border-gray-200">
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-8"
            onClick={handleRefresh}
          >
            <Image src="/zu-logo.png" alt="zu" width={48} height={48} />
            <span className="h-12 border-r-2 border-black"></span>
            <span className="text-lg font-bold uppercase italic">
              Fly on the Wall
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
