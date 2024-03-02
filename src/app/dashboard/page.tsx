import SidebarContentAdmin from "@/components/SidebarContentAdmin";

export default function Home() {

  return (
    <>
    <div className="bg-neutral-950 font-mono font-bold">
    <div className="flex h-max text-gray-400 grid grid-rows-1 gap-4">
        <div className="flex grid grid-cols-1 gap-4 h-screen bg-neutral-950 px-20">
            <div className="flex grid grid-cols-1 gap-4">
                <SidebarContentAdmin/>       
            </div>   
        </div>
    </div>
    </div>
    </>
  );
}
