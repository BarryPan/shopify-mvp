'use client';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
   <div className="w-[50%] flex items-center gap-2 border border-gray-500 px-3 py-2 shadow-sm">
      <Search className="w-4 h-4 text-gray-500" />
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full focus:outline-none"
      />
    </div>
  );
}
