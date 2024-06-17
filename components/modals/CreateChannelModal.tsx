"use client"

import qs from 'query-string'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"

import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form"

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import FileUpload from "../FileUpload"
import axios from 'axios'
import { useParams, useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModalStore"
import { ChannelType } from "@prisma/client"



const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character long"
  }).refine(
    name => name !== "general",
    {
      message: "Channel name cannot be 'general' "
  }
  ),
  type: z.nativeEnum(ChannelType)
})


const CreateChannelModal = () => {

  const { isOpen, onClose, type, data } = useModal()
  const {channelType} = data

  const isModal = isOpen && type === "createChannel"

  const router = useRouter()
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT
    },
  })

  useEffect(() => {
    if(channelType){
      form.setValue("type",channelType);
    }else{
      form.setValue("type",ChannelType.TEXT);
    }
  }, [channelType , form])


  const params = useParams()

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {

      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params?.serverId
        }
      })

      await axios.post(url, data)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }


  const handleClose = () => {
    form.reset()
    onClose()
  }


  return (
    <Dialog open={isModal} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-200 text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-7">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs text-zinc-500 font-bold dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Channel Name"
                        disabled={isLoading}
                        className="
                        bg-zinc-300/50 border-0 focus-visible:ring-0 
                        text-black focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>
                        Channel Type
                      </FormLabel>
                      <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0  ring-offset-0 focus:ring-offset-0 text-black outline-none'>
                            <SelectValue placeholder="Select a Channel type"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type)=>(
                            <SelectItem key={type} value={type} className="capitalize">
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-200 px-6 py-2">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <DialogFooter>
      </DialogFooter>
    </Dialog>
  )
}

export default CreateChannelModal
