import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Navigation_Action from "./Navigation_Action"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { NavigationItem } from "./NavigationItem"
import { ModeToggle } from "../ModeToggle"
import { UserButton } from "@clerk/nextjs"

const Navigation_sidebar = async() => {

    const profile = await currentProfile()

    if(!profile){
        return redirect("/")
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

  return (
    <div className="space-y-4 flex flex-col h-full w-full items-center text-primary dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <Navigation_Action/>
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto w-10"/>
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
            <div key={server.id} className="mb-4">
                <NavigationItem
                    id={server.id}
                    imageUrl={server.imageUrl}
                    name={server.name}
                />
            </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle/>
        <UserButton
            afterSignOutUrl="/"
            appearance={{
                elements: {
                    avatarBox: "h-[48px] w-[48px]"
                }
            }}
        />
      </div>
    </div>
  )
}

export default Navigation_sidebar
