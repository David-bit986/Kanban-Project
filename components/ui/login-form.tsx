"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient, signIn } from "@/lib/auth-client"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        const email = String(formData.get("email") ?? "").trim()
        const password = String(formData.get("password") ?? "")

        const { error } = await authClient.signIn.email({
            email,
            password,
        })

        setIsPending(false)

        if (error) {
            setError(error.message ?? "Unable to sign in.")
            return
        }

        router.replace("/dashboard")
        router.refresh()
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-[#0a0a0a]/80 backdrop-blur-2xl border-white/10 rounded-[20px] shadow-2xl shadow-rose-950/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 opacity-60" />
                <CardHeader className="space-y-1 pt-8 pb-4">
                    <CardTitle className="text-3xl font-bold text-white text-center tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-zinc-300 text-center text-sm">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <FieldGroup className="gap-4">
                            <div className="flex flex-col gap-4">
                                <Field className="space-y-1.5">
                                    <FieldLabel htmlFor="email" className="text-zinc-200 font-medium text-xs uppercase tracking-wider">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="bg-white/5 border-white/10 focus:border-rose-500/50 focus:ring-rose-500/20 h-10 rounded-xl transition-all"
                                    />
                                </Field>
                                <Field className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="password" className="text-zinc-200 font-medium text-xs uppercase tracking-wider">Password</FieldLabel>
                                        <a
                                            href="/forgot"
                                            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors underline-offset-4 hover:underline"
                                        >
                                            Forgot?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-white/5 border-white/10 focus:border-rose-500/50 focus:ring-rose-500/20 h-10 rounded-xl transition-all"
                                    />
                                </Field>
                            </div>
                            {error ? (
                                <p className="text-sm text-red-400">{error}</p>
                            ) : null}
                            <div className="flex flex-col gap-3 pt-2">
                                <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-semibold rounded-full h-11 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" disabled={isPending}>
                                    {isPending ? "Signing in..." : "Sign In with Email"}
                                </Button>

                                <div className="relative my-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/10"></span>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-[#0a0a0a] px-2 text-zinc-500">Or continue with</span>
                                    </div>
                                </div>

                                <Button variant="outline" type="button" onClick={signIn} className="w-full bg-white/5 text-white border-white/10 font-medium rounded-full h-11 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                    GitHub
                                </Button>


                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
                <div className="pb-6 text-center border-t border-white/5 pt-4">
                    <p className="text-sm text-zinc-500">
                        Don&apos;t have an account? <a href="/register" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">Sign up</a>
                    </p>
                </div>
            </Card>
        </div>
    )
}
