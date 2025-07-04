


import { Metadata } from "next"
import RegisterForm from "./RegisterForm"


export const metadata: Metadata = {
  title: "Register - Forkful",
  description: "Create your Forkful account to start managing your recipes.",
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md mt-20">
      <RegisterForm />
    </div>
  )
}
