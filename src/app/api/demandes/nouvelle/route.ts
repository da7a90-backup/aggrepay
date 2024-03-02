import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { Demande } from "@/app/models/demande";

export async function POST(request: NextRequest){

    const demande: Demande = await request.json()

    const saved = await db.insertOne({
        document: demande
    },
    {
        collection: 'demandes'
    })

    console.log(saved)

return new NextResponse(JSON.stringify(saved), {
    status: 200,
  });
}