"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog"

import qs from 'query-string'


import { useEffect, useState } from "react"
import { useModal } from '@/hooks/useModalStore'
import React from "react"
import { ScrollArea } from "../ui/scroll-area"
import { ServerWithMembersWithProfiles } from "@/types"
import { UserAvatar } from "../UserAvatar"
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '../ui/dropdown-menu'
import { MemberRole } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"

const ManageMembers = () => {

  const { isOpen, onClose, type, data, onOpen } = useModal()

  const { server } = data as { server: ServerWithMembersWithProfiles }

  const isModal = isOpen && type === "members"

  const RoleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 text-indigo-500 ml-2" />,
    "ADMIN": <ShieldAlert className='h-4 w-4 text-rose-500' />
  }

  const router = useRouter()

  const [loadingId, setloadingId] = useState("")

  const onKick = async(memberId: string)=>{
    try {
      setloadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })

      const response = await axios.delete(url)

      router.refresh()
      onOpen("members",{server:response.data})

      // const response = await axios.delete(url)
      // router.refresh()
      onOpen("members", { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setloadingId("")
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setloadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })

      const response = await axios.patch(url, { role: role })
      router.refresh()
      onOpen("members", { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setloadingId("")
    }
  }

  return (
    <Dialog open={isModal} onOpenChange={onClose}>
      <DialogContent className="bg-gray-200 text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            {server?.members?.length} Members
          </DialogDescription>
          <ScrollArea className='mt-8 pr-6 max-h-[420px]'>
            {server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="gap-x-1 flex items-center text-xs font-semibold">
                    {member.profile.name}
                    {RoleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
                </div>
                {server.profileId !== member.profileId && loadingId !== member.id && (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="w-4 h-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='left'>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                <Shield className="w-4 h-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator>
                          <DropdownMenuItem onClick={()=>onKick(member.id)}>
                            <Gavel className="w-4 h-4 mr-2" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuSeparator>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                {loadingId === member.id && (
                  <Loader2 className="animate-spin w-4 h-4 text-zinc-500 ml-auto" />
                )}
              </div>
            )
            )}
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ManageMembers
