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

const DeleteServerModal = () => {

  const {isOpen , onClose , type , data, onOpen} = useModal()

  const {server} = data

  const [copied, setcopied] = useState(false)
  const [loading, setloading] = useState(false)

  const isModal = isOpen && type === "deleteServer"
  const router = useRouter()

  const onLeave = async()=>{
    try {
      setloading(true)
      await axios.delete(`/api/servers/${server?.id}`)
      
      onClose()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false)
    }
  }

  return (
    <Dialog open={isModal} onOpenChange={onClose}>
      <DialogContent className="bg-gray-200 text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Are you sure you want to do this?
            <div className="font-semibold text-indigo-500">{server?.name} will be permanently deleted. </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-center w-full">
            <Button onClick={onClose} disabled={loading} variant="ghost">
              Cancel
            </Button>
            <Button onClick={onLeave} disabled={loading} variant="primary">
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteServerModal
