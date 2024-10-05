import ChatHeader from "@/components/chat/ChatHeader"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ChatInput from '@/components/chat/ChatInput'
import ChatMessages from '@/components/chat/ChatMessages'
import { ChannelType } from "@prisma/client"
import { MediaRoom } from "@/components/media-room"

interface ChannelIdPageProps {
  params: {
    serverId: string,
    channelsId: string,
  }
}

const ChannelIdPage = async ({params}:ChannelIdPageProps) => {
  // console.log("ChannelIdPage params:", params); // Log the params for debugging

  const profile = await currentProfile()

  if(!profile){
    return redirectToSignIn()
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelsId,
    },
  })

  const member = await db.member.findFirst({
    where: { 
      profileId: profile.id,
      serverId: params.serverId,
    },
  })

  if(!channel || !member){
    redirect("/")
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader 
          name = {channel.name}
          type = "channel"
          serverId = {channel.serverId}
      />
        {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages 
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput 
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom 
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom 
                    chatId={channel.id}
                    video={true}
                    audio={true}
                />
            )}
        </div>
  )
}

export default ChannelIdPage