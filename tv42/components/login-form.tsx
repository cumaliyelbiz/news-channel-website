"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { loginUserAsync } from "../redux/slices/userSlice"; // import loginUser action
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useRouter } from 'next/navigation';
import { RootState } from '../redux/store'; // store'dan RootState tipini alıyoruz
import { UnknownAction } from '@reduxjs/toolkit';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, UnknownAction>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.user);

  //console.log(user);  // user objesinin doğru şekilde geldiğini kontrol edin
  
  
  useEffect(() => {
    if (user) {
      router.push('/panel/dashboard');
    }
  }, [user, router]);

  if(user) {
    return <p>Successfully logged in!</p>;
  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kullanıcı verileri ile login isteği gönderiyoruz
    const resultAction = await dispatch(loginUserAsync({ email, password }));

    // Check if the action was fulfilled
    if (loginUserAsync.fulfilled.match(resultAction)) {
      // If the user is authenticated, redirect to the dashboard
      router.push("/panel/dashboard");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-red-500">{error}</div>} {/* Display error */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          </form>
          {isAuthenticated && <p>Successfully logged in!</p>}
        </CardContent>
      </Card>
    </div>
  );
}