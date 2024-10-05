"use client"

import { useEffect, useState } from "react"
import CreateServerModal from "../modals/CreateServerModal"
import EditServerModal from "../modals/EditServerModal"
import InviteModal from "../modals/InviteModal"
import ManageMembers from "../modals/ManageMembers"
import CreateChannelModal from "../modals/CreateChannelModal"
import LeaveServerModal from "../modals/LeaveServer"
import DeleteServerModal from "../modals/DeleteServer"
import DeleteChannelModal from "../modals/DeleteChannel"
import DeleteMessageModal from "../modals/DeleteMessageModal"
import EditChannelModal from "../modals/EditChannelModal"
import MessageFileModal from "../modals/MessageFileModal"


const ModeProvider = () => {

    const [isMounted, setisMounted] = useState(false)

    useEffect(() => {
      setisMounted(true)
    }, [])
    
    if(!isMounted){
        return null;
    }

  return (
    <>
    <CreateServerModal/>
    <InviteModal/>
    <EditServerModal/>
    <ManageMembers/>
    <CreateChannelModal/>
    <LeaveServerModal/>
    <DeleteServerModal/>
    <DeleteChannelModal/>
    <EditChannelModal/>
    <MessageFileModal/>
    <DeleteMessageModal/>
    </>
  )
}

export default ModeProvider
