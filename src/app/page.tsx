import Contenu from "@/components/Contenu";
import SidebarContent from "@/components/SidebarContent";
//import SignOutButton from "@/components/SignOutButton";

export default function Home() {
  return (
    <>
    <div className="bg-neutral-550 font-mono font-bold">
    <div className="flex h-max text-gray-900 grid grid-rows-1 gap-4">
        <Contenu/>
    </div>
    </div>
    </>
  );
}

/**
 * signout button <div className="float-right px-48 hover:text-white"><SignOutButton></SignOutButton></div>
 */