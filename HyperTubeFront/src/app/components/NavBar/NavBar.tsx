import { elements } from "@/app/data/NavBarElements";
import { Button, Drawer } from "@mui/material";
import Image from "next/image";
import { MdMenu } from "react-icons/md";
import MenuDrawer from "./Drawer";

export default function NavBar() {
  return (
    <nav className="w-full px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Image src="/logo.svg" alt="Z-Tube Logo" width={40} height={40} />
        <span className="text-xl font-semibold font-praiseRegular">Z-Tube</span>
      </div>
      <div className="lg:flex hidden items-center gap-8">
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-700 bg-opacity-60 placeholder:text-start placeholder:text-white text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {elements.map((element: any, index: number) => (
          <a
            href={element.path}
            key={index}
            className="relative text-white group"
          >
            {element.name}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-l from-orange-500 to-yellow-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </a>
        ))}
        <button className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition">
          Sign in
        </button>
        <button className="px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600 transition">
          Register
        </button>
      </div>
      <div className="lg:hidden flex  items-center gap-4">
        <MenuDrawer />
      </div>
    </nav>
  );
}
