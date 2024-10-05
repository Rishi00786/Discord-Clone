"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

import qs from 'query-string'

import { useParams, useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModalStore"
import { Button } from "../ui/button"
import { Check, CopyIcon, RefreshCw } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import useOrigin from "@/hooks/useOrigin"
import { useState } from "react"
import axios from "axios"
 
const DeleteMessageModal = () => {

  const {isOpen , onClose , type , data, onOpen} = useModal()

  const {apiUrl , query} = data

  const [copied, setcopied] = useState(false)
  const [loading, setloading] = useState(false)

  const isModal = isOpen && type === "deleteMessage"
  const router = useRouter()
  const params = useParams()

  const onLeave = async()=>{
    try {
      setloading(true)

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query        
      })

      await axios.delete(url)
      
      onClose()
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Are you sure you want to do this?<br/>
            The message will be permanently deleted
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

export default DeleteMessageModal
