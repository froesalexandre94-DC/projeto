'use client';
import React from 'react';

export default function SearchFilter({ search, setSearch }) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Buscar produto..."
        className="w-full max-w-sm px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
