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
// import { useModalStore } from "@/hooks/useModalStore"
import React from "react"
import { useModal } from '../../hooks/useModalStore'
import { useRouter } from "next/navigation"
import qs from "query-string"



const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required"
  })

})


const Initial_Modal = () => {

  const { isOpen , onClose , type , data} = useModal()

  const {apiUrl , query} = data

  const isModalOpen = isOpen && type === "messageFile"
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      })

      await axios.post(url,
        {
          ...data,
          content: data.fileUrl
        }
      )

      form.reset()
      router.refresh()
      onClose( )
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose =()=>{
    form.reset()
    onClose()
  } 

  return (
    <Dialog open={isModalOpen } onOpenChange={handleClose}>
      <DialogContent className="bg-gray-200 text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Add an Attchment
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
              Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-7">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({field})=>{
                    return <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  }}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-200 px-6 py-2">
              <Button variant="primary" disabled={isLoading}>
                Send
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

export default Initial_Modal
