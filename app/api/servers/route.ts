import { currentProfile } from "@/lib/current-profile";
import {db} from '@/lib/db';
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request){
    
    try {
        
        const { name , imageUrl }  = await req.json()
        const profile = await currentProfile()

        if(!profile){
            return NextResponse.json({
                status: "error",
                message: "UnAuthorized Profile"
            })
        }

        const server = await db.server.create({
            data: {
                name: name,
                imageUrl: imageUrl,
                profileId: profile.id,
                inviteCode: uuidv4(),
                channels: {
                    create: [{
                        name: "general",
                        profileId: profile.id
                }]
                },
                members: {
                    create: [{
                        profileId: profile.id,
                        role: MemberRole.ADMIN
                }]
                }
            }
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("[Servers-POST] " , error)
        return new NextResponse("Internal Server Error " , {status: 500})
    }
}

