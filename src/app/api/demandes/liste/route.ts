import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getServerSession } from "next-auth";
import { Demande } from "@/app/models/demande";
import { authOptions } from "@/utils/auth";

export async function GET(request: NextRequest){

    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse(null, { status: 401 })
    }


    const demandesDocuments = await db.find({
        filter:{statut: {$ne: 2}}
    },
    {
        collection: 'demandes'
    })

    const demandes = demandesDocuments.documents

return new NextResponse(JSON.stringify(demandes), {
    status: 200,
  });
}