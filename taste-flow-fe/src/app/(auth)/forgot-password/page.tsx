"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Shield, ChefHat, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1 = email, 2 = verification
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0 && step === 2) {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown, step])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sending verification email to:", email)
    setStep(2)
    setCountdown(60)
    setCanResend(false)
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Verifying code:", verificationCode)
  }

  const handleResendCode = () => {
    if (canResend) {
      console.log("Resending verification code to:", email)
      setCountdown(60)
      setCanResend(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
 

      <Card className="bg-[#2B2B2B]/80 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F26D16] to-[#FF8C42] rounded-full flex items-center justify-center shadow-lg">
              {step === 1 ? (
                <Mail className="w-6 h-6 text-white" />
              ) : (
                <Shield className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {step === 1 ? "Forgot Password?" : "Verify Your Email"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {step === 1
              ? "Enter your email and we'll send you a verification code"
              : `We've sent a 6-digit code to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                  <Mail size={16} className="text-[#F26D16]" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1B1B1B]/80 border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16] focus:ring-2 focus:ring-[#F26D16]/20 transition-all duration-200 h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F26D16] to-[#FF8C42] hover:from-[#E55D0E] hover:to-[#F26D16] text-white font-semibold h-12 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Send Verification Code
              </Button>

              <div className="text-center pt-4 border-t border-gray-700/50">
                <Link
                  href="/auth/login"
                  className="text-[#F26D16] hover:text-orange-400 transition-colors font-semibold inline-flex items-center gap-2 hover:underline"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="code" className="text-white font-medium flex items-center gap-2">
                    <Shield size={16} className="text-[#F26D16]" />
                    Verification Code
                  </Label>
                  <div className="flex items-center gap-2">
                    {countdown > 0 ? (
                      <span className="text-sm text-gray-400">
                        Resend in {formatTime(countdown)}
                      </span>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendCode}
                        className="text-[#F26D16] hover:text-orange-400 p-0 h-auto font-normal text-sm"
                      >
                        Resend Code
                      </Button>
                    )}
                  </div>
                </div>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="bg-[#1B1B1B]/80 border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16] focus:ring-2 focus:ring-[#F26D16]/20 transition-all duration-200 h-12 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F26D16] to-[#FF8C42] hover:from-[#E55D0E] hover:to-[#F26D16] text-white font-semibold h-12 transition-all duration-300 transform hover:scale-[1.02]"
                disabled={verificationCode.length !== 6}
              >
                Verify Code
              </Button>

              <div className="text-center pt-4 border-t border-gray-700/50">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-[#F26D16] hover:text-orange-400 transition-colors font-semibold inline-flex items-center gap-2 p-0 h-auto hover:underline"
                >
                  <ArrowLeft size={16} />
                  Change Email Address
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
 
  )
}
