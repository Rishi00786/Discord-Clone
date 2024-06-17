"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog"

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
} from "../ui/form"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import FileUpload from "../FileUpload"
import axios from 'axios'
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModalStore"
import React from "react"



const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character long"
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required"
  })

})


const EditServerModal = () => {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  })

  const {isOpen , onClose , type , data , onOpen} = useModal()

  const isModal = isOpen && type === "editServer"
  const {server } = data
  const router = useRouter()

  useEffect(() => {
    if(server){
      form.setValue('name',server.name)
      form.setValue('imageUrl',server.imageUrl)
    }
  }, [form , server])
  
  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      axios.patch(`/api/servers/${server?.id}`,data)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }


  const handleClose = ()=>{
      form.reset()
      onClose()
  }


  return (
    <Dialog open={isModal} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-200 text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to the server!
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Give your server a name and an image. You can always change it later
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-7">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({field})=>{
                    return <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  }}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({field})=>(
                  <FormItem>
                    <FormLabel className="uppercase text-xs text-zinc-500 font-bold dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Server Name"
                        disabled={isLoading}
                        className="
                        bg-zinc-300/50 border-0 focus-visible:ring-0 
                        text-black focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-200 px-6 py-2">
              <Button variant="primary" disabled={isLoading}>
                Save
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

export default EditServerModal
