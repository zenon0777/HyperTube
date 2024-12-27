"use client";
import { elements } from "@/app/data/NavBarElements";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdMenu, MdClose, MdSearch } from "react-icons/md";
import SearchInput from "./SearchInput";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);

  return (
    <nav className="w-full px-4 md:px-8 py-4 flex justify-between items-center relative">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <Image
          src="/logo.svg"
          alt="Z-Tube Logo"
          width={40}
          height={40}
          className="w-8 h-8 md:w-10 md:h-10"
        />
        <span className="text-lg md:text-xl font-semibold font-praiseRegular">
          Z-Tube
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="lg:flex hidden items-center gap-6">
        <SearchInput />
        <div className="flex items-center gap-6">
          {elements.map((element, index) => (
            <Link
              href={element.path}
              key={index}
              className="relative text-white group"
            >
              {element.name}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-l from-orange-500 to-yellow-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition">
            Sign in
          </button>
          <button className="px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600 transition">
            Register
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center gap-4">
        {/* Mobile Search Toggle */}
        <button
          onClick={toggleSearch}
          className="text-white p-2 rounded-full hover:bg-gray-700 transition"
        >
          <MdSearch className="w-6 h-6" />
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="text-white p-2 rounded-full hover:bg-gray-700 transition"
        >
          {isMenuOpen ? (
            <MdClose className="w-6 h-6" />
          ) : (
            <MdMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchVisible && (
        <div className="lg:hidden absolute top-full left-0 bg-gray-900 z-50 p-4 w-full">
          <SearchInput />
          <button
            onClick={toggleSearch}
            className="absolute top-2 right-2 text-white p-2 rounded-full hover:bg-gray-700 transition w-9 h-9"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        >
          <div
            className="w-64 h-full bg-gray-900 shadow-lg absolute right-0 top-0 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col space-y-4 justify-between">
              <div className="flex flex-col space-y-4">
                {elements.map((element, index) => (
                  <Link
                    href={element.path}
                    key={index}
                    className="text-white hover:text-orange-500 transition"
                    onClick={toggleMenu}
                  >
                    {element.name}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4 mt-4 space-y-4">
                <button
                  className="w-full px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition"
                  onClick={toggleMenu}
                >
                  Sign in
                </button>
                <button
                  className="w-full px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600 transition"
                  onClick={toggleMenu}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
