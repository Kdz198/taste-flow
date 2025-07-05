'use client'

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, ArrowRight, ChefHat } from "lucide-react"
import { useLogin } from "@/hook/useAuth"
import { LoginBodyType } from "@/schemaValidations/auth-schema"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginBodyType>({
    email: '',
    password: ''
  })

  const loginMutation = useLogin(() => {
    router.push("/")
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  return (

 

      <Card className="bg-[#2B2B2B]/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
          <CardDescription className="text-gray-400">
            Access your Forkful account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                <Mail size={16} className="text-[#F26D16]" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#1B1B1B]/80 border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16] focus:ring-2 focus:ring-[#F26D16]/20 transition-all duration-200 h-12"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium flex items-center gap-2">
                <Lock size={16} className="text-[#F26D16]" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-[#1B1B1B]/80 border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16] focus:ring-2 focus:ring-[#F26D16]/20 transition-all duration-200 h-12 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-[#F26D16] hover:text-orange-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-[#F26D16] to-[#FF8C42] hover:from-[#E55D0E] hover:to-[#F26D16] text-white font-semibold disabled:opacity-50 h-12 text-lg transition-all duration-300 transform hover:scale-[1.02] group"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>

            {/* Error Message */}
            {loginMutation.isError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center">
                <p className="font-medium">Login failed</p>
                <p className="text-sm opacity-80">Please check your credentials</p>
              </div>
            )}

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-700/50">
              <span className="text-gray-400">Don't have an account? </span>
              <Link 
                href="/register" 
                className="text-[#F26D16] hover:text-orange-400 transition-colors font-semibold hover:underline"
              >
                Create one here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
   
  )
}

