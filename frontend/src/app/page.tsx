"use client"

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from "zod"
import FieldForm from '@/components/fieldform';
import { cn } from "@/lib/utils";
import { useAuth } from '@/hooks/auth';
import BackGround from '@/components/background/page';
import { FieldConfig } from '@/lib/interfaces/fields';
import { RolesOptions } from '../../constants/user_roles';

const formSchema = z.object({
  name: z.string(),
  email: z
  .string()
  .email("Invalid email address."),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long."}),
  role: z
    .string()
    .optional()
})

type FormValues = z.infer<typeof formSchema>

function LandingScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", role: RolesOptions[0].value, name: "" },
  });

  const loginConfig: FieldConfig<FormValues>[] = [
    { name: 'email', label: 'E-mail', type: 'email', placeholder: 'E-mail...'},
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Password...' },
  ];

  const registerConfig: FieldConfig<FormValues>[] = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Name...'},
    ...loginConfig,
    { name: 'role', label: 'Role', type: 'select', options: RolesOptions}
  ];

  const onAuthSubmit = async (data: FormValues) => {
    setErrorMessage("");
    try {
      if (isLogin) {
        // Login
        await auth.signin(
          data.email!, 
          data.password!
        );
        router.replace("/home");
      } else {
        // Register
        await auth.register(
          data.name ?? "", 
          data.email!, 
          data.password!, 
          data.role
        );
        alert("Account created! Now please log in.");
        setIsLogin(true);
        form.reset();
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "An unexpected error occurred";
      setErrorMessage(msg);
    }
  };

  return (
    <div className='p-4 flex flex-col justify-center items-center relative min-h-screen gap-6 overflow-auto'>
      
      <BackGround />

      {/* Login/Register form */}
      <Card className="z-1 lg:w-full lg:h-[660px] lg:flex-row lg:p-20 lg:max-w-6xl max-w-2xl w-full bg-white backdrop-blur-sm shadow-2xl border-none h-auto
      rounded-3xl p-20 flex flex-col justify-between shrink-0 transition-all duration-500">
          
          <div className='flex flex-col justify-center items-center w-full lg:w-1/2'>
            <Image 
              src="/pivotsy-icon.png"
              alt="App Icon"
              width={150}
              height={150}
              className="object-contain"
              priority
            />

            <div className='flex flex-col gap-5 items-center justify-center mt-10'>
              <h1 className="font-bold text-2xl"> Welcome to PivotSY </h1>
              <h2 className="text-l"> The future of professional networking and job hunting. </h2>
            </div>
          </div>
          
          <div className='w-full lg:w-1/2 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-100 pt-10 lg:pt-0 lg:pl-10'>
            <div className='flex flex-col items-center justify-center mb-6'>
              <h1 className='font-bold text-3xl tracking-tight'> 
                {isLogin ? "Welcome Back" : "Create Account"} 
              </h1>
              <p className='text-muted-foreground text-sm mt-1'>
                {isLogin ? "Enter your details to login" : "Join PivotSY today"}
              </p>
            </div>
            
            <div className="flex-1">
              <FieldForm 
                form={form} 
                formId="auth-form" 
                fieldsConfig={isLogin ? loginConfig : registerConfig}
                onSubmit={onAuthSubmit}
              />
            </div>

            {/* Form Errors */}
            <div className="relative w-full h-[100px]"> 
              <div className={cn(
                "absolute inset-0 transition-all duration-300 transform",
                Object.keys(form.formState.errors).length > 0 
                  ? "opacity-100 scale-100 translate-y-0" 
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}>
                <div className="bg-red-50 p-3 rounded-xl border border-red-100 shadow-sm">
                  <p className="text-red-600 font-bold text-[10px] uppercase tracking-wider mb-1">
                    Validation Errors
                  </p>
                  <ul className="space-y-1">
                    {Object.values(form.formState.errors).map((error, index) => (
                      <li key={index} className="text-red-500 text-xs flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full shrink-0" />
                        {error?.message?.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Register/Login button and existing account */}
            <div className='flex flex-col items-center'>
              <Button 
                type="submit" 
                form="auth-form"
                className="rounded-xl font-bold h-12 w-full bg-black hover:bg-zinc-800 transition-all text-white"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>

              <div className='flex gap-2 mt-6 items-center'>
                <p className='text-sm text-muted-foreground'>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrorMessage("");
                    form.reset();
                  }}
                  className='text-sm font-bold text-black hover:underline underline-offset-4 transition-all'
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </div>
            </div>
          </div>

      </Card>

    </div>
  )
}

export default LandingScreen;