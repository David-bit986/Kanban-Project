"use client"

import { useState } from "react"
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

export function ForgotForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setMessage(null)
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        const email = String(formData.get("email") ?? "").trim()

        const { error } = await authClient.requestPasswordReset({
            email,
            redirectTo: `${window.location.origin}/forgot`,
        })

        setIsPending(false)

        if (error) {
            setError(error.message ?? "Unable to send reset link.")
            return
        }

        setMessage("If the email exists, a reset link has been sent.")
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-[#0a0a0a]/80 backdrop-blur-2xl border-white/10 rounded-[20px] shadow-2xl shadow-rose-950/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 opacity-60" />
                <CardHeader className="space-y-1 pt-8 pb-4">
                    <CardTitle className="text-3xl font-bold text-white text-center tracking-tight">Forgot password?</CardTitle>
                    <CardDescription className="text-zinc-400 text-center text-sm">
                        Enter your email and we&apos;ll send you a reset link
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <FieldGroup className="gap-4">
                            <div className="flex flex-col gap-4">
                                <Field className="space-y-1.5">
                                    <FieldLabel htmlFor="email" className="text-zinc-300 font-medium text-xs uppercase tracking-wider">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="bg-white/5 border-white/10 focus:border-rose-500/50 focus:ring-rose-500/20 h-10 rounded-xl transition-all"
                                    />
                                </Field>
                            </div>
                            {error ? <p className="text-sm text-red-400">{error}</p> : null}
                            {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
                            <div className="flex flex-col gap-3 pt-2">
                                <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-semibold rounded-full h-11 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" disabled={isPending}>
                                    {isPending ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
                <div className="pb-6 text-center border-t border-white/5 pt-4">
                    <p className="text-sm text-zinc-500">
                        Remembered it? <a href="/login" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">Back to login</a>
                    </p>
                </div>
            </Card>
        </div>
    )
}
