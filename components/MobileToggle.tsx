import { Menu } from 'lucide-react'

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Navigation_sidebar from "@/components/navigation/navigation_sidebar"
import ServerSidebar from "@/components/server/ServerSidebar"


const MobileToggle = ({serverId}: {serverId: string}) => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant='ghost' size="icon" className='md:hidden'>
                <Menu/>
            </Button>
        </SheetTrigger>
        <SheetContent side = "left" className="flex gap-0 p-0">
            <div className="w-[72px]">
                <Navigation_sidebar/>
            </div>
            <ServerSidebar serverId={serverId}/>
        </SheetContent>
    </Sheet>
  )
}

export default MobileToggle
