"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Shield } from "lucide-react"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1 = email input, 2 = verification code
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)

  // Countdown timer for resend verification
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
    // Send verification email logic here
    console.log("Sending verification email to:", email)
    setStep(2)
    setCountdown(60) // Start 1-minute countdown
    setCanResend(false)
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Verify code logic here
    console.log("Verifying code:", verificationCode)
    // Redirect to reset password page or show success
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
  <div className="w-full max-w-md mt-20">
        <Card className="bg-[#2B2B2B] border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {step === 1 ? (
                <div className="w-12 h-12 bg-[#F26D16] rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-[#F26D16] rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {step === 1 ? "Forgot Password?" : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {step === 1
                ? "Enter your email address and we'll send you a verification code"
                : `We've sent a verification code to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1B1B1B] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#F26D16] hover:bg-orange-600 text-white font-semibold">
                  Send Verification Code
                </Button>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-[#F26D16] hover:text-orange-400 transition font-semibold inline-flex items-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="code" className="text-white">
                      Verification Code
                    </Label>
                    <div className="flex items-center gap-2">
                      {countdown > 0 ? (
                        <span className="text-sm text-gray-400">Resend in {formatTime(countdown)}</span>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleResendCode}
                          className="text-[#F26D16] hover:text-orange-400 p-0 h-auto font-normal"
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
                    className="bg-[#1B1B1B] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#F26D16] text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#F26D16] hover:bg-orange-600 text-white font-semibold"
                  disabled={verificationCode.length !== 6}
                >
                  Verify Code
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-[#F26D16] hover:text-orange-400 transition font-semibold inline-flex items-center gap-2 p-0 h-auto"
                  >
                    <ArrowLeft size={16} />
                    Change Email Address
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
