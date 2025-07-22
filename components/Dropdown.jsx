import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Dropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-md font-medium hidden md:inline">Space</span>

        <ChevronDown
          size={17}
          className={`text-gray-600 hidden md:inline transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
          <Link
            href="#"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Apartment
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Co-living
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Pair with Me
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Real Estate
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
