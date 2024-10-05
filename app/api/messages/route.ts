import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const Messages_Batch = 10

export async function GET(
    req: Request,
){
    try {
        const profile = await currentProfile()

        const {searchParams} = new URL(req.url) 

        const cursor = searchParams.get('cursor')
        const channelId = searchParams.get('channelId')

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }

        if(!channelId){
            return new NextResponse("Channel ID Missing",{status: 400})
        }

        let messages: Message[]= []

        if(cursor){
            messages = await db.message.findMany({
                where: {
                    channelId: channelId
                },
                orderBy: {
                    createdAt: "desc"
                },
                cursor: {
                    id: cursor
                },
                take: Messages_Batch,
                skip: 1,
                include:{
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        } else {
            messages = await db.message.findMany({
                where: {
                    channelId: channelId
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: Messages_Batch,
                include:{
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        let nextCursor = null;

         if(messages.length === Messages_Batch){
            nextCursor = messages[messages.length - 1].id
         }

         return NextResponse.json({
             items: messages,
             nextCursor
         })

    } catch (error) {
        console.log("[MESSAGES-GET] Error: ", error);
        return new NextResponse("Internal Err", { status: 500 });
    }
}