"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { authClient } from "@/lib/auth-client"

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const tokenParam = searchParams.get("token")
        if (!tokenParam) {
            setError("Invalid or missing reset token. Please use the link from your email.")
        } else {
            setToken(tokenParam)
        }
    }, [searchParams])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!token) {
            setError("No reset token available.")
            return
        }

        setError(null)
        setMessage(null)
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        const newPassword = String(formData.get("password") ?? "")
        const confirmPassword = String(formData.get("confirm-password") ?? "")

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.")
            setIsPending(false)
            return
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.")
            setIsPending(false)
            return
        }

        const { error } = await authClient.resetPassword({
            newPassword,
            token,
        })

        setIsPending(false)

        if (error) {
            setError(error.message ?? "Unable to reset password.")
            return
        }

        setMessage("Password reset successfully! Redirecting to login...")
        setTimeout(() => {
            router.replace("/login")
        }, 2000)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-[#0a0a0a]/80 backdrop-blur-2xl border-white/10 rounded-[20px] shadow-2xl shadow-rose-950/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 opacity-60" />
                <CardHeader className="space-y-1 pt-8 pb-4">
                    <CardTitle className="text-3xl font-bold text-white text-center tracking-tight">Reset Password</CardTitle>
                    <CardDescription className="text-zinc-400 text-center text-sm">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                    {!token ? (
                        <div className="text-center">
                            <p className="text-sm text-red-400">Invalid reset link. Check your email for a valid reset link.</p>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <FieldGroup className="gap-4">
                                <div className="flex flex-col gap-4">
                                    <Field className="space-y-1.5">
                                        <FieldLabel htmlFor="password" className="text-zinc-300 font-medium text-xs uppercase tracking-wider">New Password</FieldLabel>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Enter new password"
                                            required
                                            className="bg-white/5 border-white/10 focus:border-rose-500/50 focus:ring-rose-500/20 h-10 rounded-xl transition-all"
                                        />
                                    </Field>
                                    <Field className="space-y-1.5">
                                        <FieldLabel htmlFor="confirm-password" className="text-zinc-300 font-medium text-xs uppercase tracking-wider">Confirm Password</FieldLabel>
                                        <Input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type="password"
                                            placeholder="Confirm password"
                                            required
                                            className="bg-white/5 border-white/10 focus:border-rose-500/50 focus:ring-rose-500/20 h-10 rounded-xl transition-all"
                                        />
                                    </Field>
                                </div>
                                {error ? (
                                    <p className="text-sm text-red-400">{error}</p>
                                ) : null}
                                {message ? (
                                    <p className="text-sm text-emerald-400">{message}</p>
                                ) : null}
                                <div className="flex flex-col gap-3 pt-2">
                                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-semibold rounded-full h-11 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" disabled={isPending}>
                                        {isPending ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </div>
                            </FieldGroup>
                        </form>
                    )}
                </CardContent>
                <div className="pb-6 text-center border-t border-white/5 pt-4">
                    <p className="text-sm text-zinc-500">
                        Remember your password? <a href="/login" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">Sign in</a>
                    </p>
                </div>
            </Card>
        </div>
    )
}
