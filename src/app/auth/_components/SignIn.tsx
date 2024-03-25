import { Icons } from "@/app/shared/Icons";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Link href="/" className="flex justify-center">
          <Icons.roadmapai />
        </Link>
        <p className="text-sm text-gray-600 max-w-xs mx-auto pb-4">
          By continuing, you are setting up for a RoadmapAI account and agree to
          our User Agreement and Privacy Policy
        </p>
        <UserAuthForm />
        <div className="flex flex-row space-x-2 text-center justify-center pt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            Privacy Policy
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
