'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from "next-auth/react"


export default function SignInForm() {
  const router=useRouter()

  //zod implementation
  const form=useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })

  const onSubmit= async(data:z.infer<typeof signInSchema>)=>{
     //console.log("Form submitted", data);
    const result=await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
      callbackUrl: "/dashboard",
      } 
    )
     //console.log("SignIn result:", result);
    if(result?.error){
      toast("Incorrect username or password")
    }
    if(result?.url){
      router.replace(result.url)
    }
    //console.log("Signed In")
  }

  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Feedbit
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} 
                  //name="identifier" 
                  placeholder="Enter your email or username"
                  />
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
            <Button type="submit" className="w-full">
              Sign-In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            <span>{`Don't have an account?`}</span>
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign-up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}