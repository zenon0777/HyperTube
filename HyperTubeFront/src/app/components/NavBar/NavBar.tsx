"use client";
import { elements } from "@/app/data/NavBarElements";
import Image from "next/image";
import Link from "next/link";
import MenuDrawer from "./Drawer";
import ProvidersMenu from "./ProviderMenu";
import SearchInput from "./SearchInput";
import { redirect } from "next/navigation";

export default function NavBar() {
  return (
    <nav className="w-full px-8 md:px-12 py-4 flex justify-between items-center relative">
      <div
        className="flex items-center gap-2 md:gap-3 cursor-pointer"
        onClick={() => redirect("/home")}
      >
        <Image
          src="/logo.svg"
          alt="Z-Tube Logo"
          width={40}
          height={40}
          className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 transition-transform duration-200 hover:scale-110"
        />
        <span className="text-base md:text-lg lg:text-xl font-semibold font-praiseRegular text-white transition-colors duration-200 hover:text-orange-500">
          Z-Tube
        </span>
      </div>

      <div className="hidden lg:flex flex-wrap items-center gap-4 xl:gap-6">
        <div className="flex items-center gap-2 xl:gap-4">
          <SearchInput />
          <ProvidersMenu />
          {elements.map((element, index) => (
            <Link
              href={element.path}
              key={index}
              className="relative text-base xl:text-lg text-white/90 hover:text-orange-500 group transition-colors duration-200"
            >
              {element.name}
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-orange-500 scale-x-0 origin-left transition-transform duration-200 ease-out group-hover:scale-x-100"></span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 xl:gap-4">
          <button className="px-4 xl:px-5 py-1.5 xl:py-2 text-sm xl:text-base border border-white/80 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200">
            Sign in
          </button>
          <button className="px-4 xl:px-5 py-1.5 xl:py-2 text-sm xl:text-base bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200">
            Register
          </button>
        </div>
      </div>

      <div className="lg:hidden flex flex-wrap items-center gap-2">
        <SearchInput />
        <MenuDrawer />
      </div>
    </nav>
  );
}
