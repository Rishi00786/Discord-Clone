import ChatHeader from "@/components/chat/ChatHeader"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

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
    </div>
  )
}

export default ChannelIdPage