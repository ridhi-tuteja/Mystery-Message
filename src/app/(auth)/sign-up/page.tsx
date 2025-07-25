'use client'
import {useDebounceCallback} from 'usehooks-ts';
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { Loader2 } from 'lucide-react';


const Page = () => {
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingUsername,setIsCheckingUsername]=useState(false)
  const [isSubmitting,setIsSubmitting]=useState(false)

  const debounced=useDebounceCallback(setUsername,500)

  // const { toast } = useToast()
  const router=useRouter()
  //toast("Event has been created.")

  //zod implementation
  const form=useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique=async()=>{
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')

        try {
          //const response=await axios.get(`/api/check-username-unique?username${debouncedUsername}`)
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError=error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username") 
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit= async(data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true)
    try {
      console.log("here atlesat")
      const response=await axios.post<ApiResponse>('/api/sign-up',data)
      toast(response.data.message)
      console.log("here i am")

      router.replace(`/verify/${username}`)
      setIsSubmitting(false)

    } catch (error) {
      console.error("Error in signup user")
          const axiosError=error as AxiosError<ApiResponse>
          const errorMessage=axiosError.response?.data.message ?? "Error checking username"
          toast(errorMessage)
          setIsSubmitting(false)
        }
  }

  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Feedbit
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    placeholder="Enter your username"
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} 
                  name="email" 
                  placeholder="Enter your email address"
                  />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} 
                  name="password"
                  placeholder="Enter your password"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page
