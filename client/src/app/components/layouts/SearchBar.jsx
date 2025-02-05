"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

// icons
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center w-96 px-5 py-2 
            rounded-sm shadow-sm border ">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearch}
        className="text-sm outline-none flex-grow "
        placeholder="Search ..."
      />
      <FaSearch className="text-sm text-gray-300" />
    </div>
  );
}
