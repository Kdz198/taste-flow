"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", formData)
  }

  return (
    <div className="w-full max-w-md mt-20">
      <Card className="bg-[#2B2B2B] border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400">Sign in to your Forkful account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#1B1B1B] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-[#1B1B1B] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16] pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-[#F26D16] hover:text-orange-400 transition">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-[#F26D16] hover:bg-orange-600 text-white font-semibold">
              Sign In
            </Button>

            <div className="text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <Link href="/auth/register" className="text-[#F26D16] hover:text-orange-400 transition font-semibold">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
