import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
){
    try {
        const profile = await currentProfile() 

        const {name , type} = await req.json()

        const {searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if(!profile){
            return new NextResponse("unAuthorized",{status: 401})
        }

        if(!serverId){
            return new NextResponse("Server Id Missing",{status: 400})
        }

        if(name==="general"){
            return new NextResponse("General Channel Can't Be Created",{status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN , MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name: name,
                        type: type
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("CHANNELS-ERROR",error)
        return new NextResponse("Internal Server Error",{status: 500})
    }
}