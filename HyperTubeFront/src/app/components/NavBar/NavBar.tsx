"use client";
import { elements } from "@/app/data/NavBarElements";
import Image from "next/image";
import Link from "next/link";
import MenuDrawer from "./Drawer";
import ProvidersMenu from "./ProviderMenu";
import SearchInput from "./SearchInput";
import { useRouter } from "next/navigation";
import { RootState, useAppSelector } from "@/app/store";
import ProfileMenu from "./ProfileMenu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/app/store/userSlice";

export default function NavBar() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getUserProfile() as any);
  }, [dispatch]);

  // if (user.error) {
  //   console.log("Error fetching user data:", user.error);
  //   return (
  //     <nav className="w-full px-8 md:px-12 py-4 flex justify-between items-center">
  //       <div className="text-red-500">Error loading user data</div>
  //     </nav>
  //   );
  // }

  // useEffect(() => {
  //   console.log("User data:", user);
  //   if (user.error) {
  //     console.error("Error fetching user data:", user.error);
  //     router.push("/login");
  //   }
  // }, [user.error, router]);

  useEffect(() => {
    console.log("User data:", user);
  }, [user]);

  return (
    <nav className="w-full px-8 md:px-12 py-4 flex justify-between items-center relative">
      <div
        className="flex items-center gap-2 md:gap-3 cursor-pointer"
        onClick={() => router.push("/home")}
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
          {user.user && <ProfileMenu {...user.user} />}
        </div>
      </div>

      <div className="lg:hidden flex flex-wrap items-center gap-2">
        <SearchInput />
        <MenuDrawer />
      </div>
    </nav>
  );
}
