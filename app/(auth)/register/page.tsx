import { SignupForm } from "@/components/ui/signup-form"
import AppNav from "@/components/ui/app-nav";
export default function Page() {
    return (
        <main>
            <AppNav />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <SignupForm />
                </div>
            </div>
        </main>
    )
}
