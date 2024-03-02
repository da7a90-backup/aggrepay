import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { Demande } from "@/app/models/demande";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function POST(request: NextRequest){

    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse(null, { status: 401 })
    }

    const params = new URL(request.url).searchParams

    const id_demande = params.get('id')

    const body = await request.json()

    const saved = await db.updateOne({
        filter: {_id: {$oid: id_demande}},
        update: {$set: {statut: body.statut}}
    },
    {
        collection: 'demandes'
    })

    console.log(saved)

return new NextResponse(JSON.stringify(saved), {
    status: 200,
  });
}