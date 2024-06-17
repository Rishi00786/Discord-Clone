"use client"

import { CommandIcon, Search } from "lucide-react"
import { useEffect, useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../ui/command"
import { useParams } from "next/navigation"
import { useRouter} from "next/navigation"

interface ServerData {
  icon: React.ReactNode,
  name: string,
  id: string,
}

interface ServerSearchProps {
  data: {
    label: string,
    type: "channel" | "member",
    data: ServerData[] | undefined
  }[]
}

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [onOpen, setOnOpen] = useState(false)

  const router = useRouter()
  const params = useParams()

  const onClick = ({id , type }: {id: string , type: "channel" | "member"})=>{
    setOnOpen(false)
    if(type==="member"){
        router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }

    if(type=="channel"){
        router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  }

  useEffect(() => {
    const down = (e: KeyboardEvent)=>{
        if(e.key === "k" && (e.metaKey || e.ctrlKey)){
            e.preventDefault()
            setOnOpen(true)
        }
    }
    document.addEventListener("keydown", down)
    return () => {
      document.removeEventListener("keydown", down)
    }
  }, [])
  

  return (
    <>
      <button
        onClick={() => setOnOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground ml-auto font-medium'>
          <span className='text-sm'>&#8984;</span>K
        </kbd>
      </button>
      <CommandDialog open={onOpen} onOpenChange={setOnOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>
            No Results Found!
          </CommandEmpty>
          {
            data.map(({ label,type, data }) => {
              if (data?.length === 0) return null;
              return (
                <CommandGroup key={label} heading={label}>
                  {data?.map(({ id, icon, name }) => (
                    <CommandItem key={id} onSelect={()=>onClick({id , type})}>
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
