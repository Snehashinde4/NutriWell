import Link from "next/link"
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.google className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm max-w-xs mx-auto">By continuing, you are setting up a NutriWell account and agree to our User agreement and Privacy Policy.</p>

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
            Already using NutriWell?{" "}
            <Link href="/sign-in" className="hover:text-zinc-800 text-sm underline underline-offset-4">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp;

