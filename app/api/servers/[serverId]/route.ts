import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("unAuthorized", { status: 401 })
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("SERVER ID DELETE",error)
        return new NextResponse("Internal Err", { status: 500 })
    }
}