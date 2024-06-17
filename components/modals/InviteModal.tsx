"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"


import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModalStore"
import { Button } from "../ui/button"
import { Check, CopyIcon, RefreshCw } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import useOrigin from "@/hooks/useOrigin"
import { useState } from "react"
import axios from "axios"

const InviteModal = () => {

  const {isOpen , onClose , type , data, onOpen} = useModal()

  const {server} = data

  const [copied, setcopied] = useState(false)
  const [loading, setloading] = useState(false)

  const onCopy = ()=>{
    navigator.clipboard.writeText(inviteURL)
    setcopied(true)
    setTimeout(()=>{
      setcopied(false)
    },2000)
  }

  const onNew = async()=>{
    try {
      setloading(true)
      
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
      onOpen("invite",{server: response.data})
    } catch (error) {
      console.log(error) 
    }
    finally {
      setloading(false)
    }
  }  

  const origin = useOrigin()

  const inviteURL = `${origin}/invite/${server?.inviteCode}`

  const isModal = isOpen && type === "invite"

  return (
    <Dialog open={isModal} onOpenChange={onClose}>
      <DialogContent className="bg-gray-200 text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-">
          <Label className="uppercase text-xs text-zinc-500 dark:text-secondary/70 font-bold">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input disabled={loading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black" value={inviteURL}/>
            <Button size="icon" disabled={loading} onClick={onCopy}>
              {copied? <Check  className='w-4 h-4'/> : <CopyIcon className='w-4 h-4'/>} 
            </Button>
          </div>
          <Button onClick={onNew} variant="link" disabled={loading} size="sm" className="text-xs text-zinc-500 mt-4">
            Generate a new link
            <RefreshCw className='w-4 h-4 ml-2'/>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteModal
