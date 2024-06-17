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
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import useOrigin from "@/hooks/useOrigin"
import { useState } from "react"
import axios from "axios"

const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { server } = data || {} // Ensure `data` is handled when undefined
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isModal = isOpen && type === "leaveServer"

  const onLeave = async () => {
    try {
      setLoading(true)
      await axios.patch(`/api/servers/${server?.id}/leave`)
      
      onClose()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.error("Error leaving server:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModal} onOpenChange={onClose}>
      <DialogContent className="bg-gray-200 text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-center w-full">
            <Button onClick={onClose} disabled={loading} variant="ghost">
              Cancel
            </Button>
            <Button onClick={onLeave} disabled={loading} variant="primary">
              {loading ? "Leaving..." : "Leave"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveServerModal
