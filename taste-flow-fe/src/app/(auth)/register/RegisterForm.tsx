'use client'

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useRegister } from "@/hook/useAuth"
import { RegisterBodyType } from "@/schemaValidations/auth-schema"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<RegisterBodyType>({
    name:"",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: ""
  })

  const registerMutation = useRegister(() => {
    router.push("/login"); 
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...dataToSend } = formData
    registerMutation.mutate(dataToSend)
  }

  const handleInputChange = (field: keyof RegisterBodyType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="bg-[#2B2B2B] border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Join Forkful</CardTitle>
        <CardDescription className="text-gray-400">Create your account to start cooking</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-[#1B1B1B] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16]"
              required
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="bg-[#1B1B1B] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16] pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="address" className="text-white">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-[#1B1B1B] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16]"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-[#1B1B1B] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16]"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={registerMutation.isPending}
            className="w-full bg-[#F26D16] hover:bg-orange-600 text-white font-semibold disabled:opacity-50"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </Button>

          {registerMutation.isError && (
            <p className="text-red-500 text-sm text-center">
              Registration failed. Please try again.
            </p>
          )}

          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link href="/auth/login" className="text-[#F26D16] hover:text-orange-400 transition font-semibold">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}