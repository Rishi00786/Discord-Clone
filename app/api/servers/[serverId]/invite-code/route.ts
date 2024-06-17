import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {serverId: string}}
){
    try {
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse("unAuthorized" , {status: 401})
        }

        if(!params.serverId){
            return new NextResponse("Server id Missing!!",{status: 400})
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: randomUUID()
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVER-ID]",error)
        return new NextResponse("Internal Err",{status: 500})
        
    }
}