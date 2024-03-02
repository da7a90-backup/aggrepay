'use client'

import { DemandesList } from "@/components/DemandesList";
import { useState } from "react";


export default function SidebarContentAdmin() {
    const [loaded, setLoaded] = useState<boolean>(false)

  return (
      <DemandesList loaded={loaded} setLoaded={setLoaded} />
  );
}
