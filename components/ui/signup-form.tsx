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
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    return (
        <Card className="bg-[#0a0a0a]/80 backdrop-blur-2xl border-white/10 rounded-[20px] shadow-2xl shadow-rose-950/20 overflow-hidden relative" {...props}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 opacity-60" />
            <CardHeader className="space-y-0.5 pt-2 pb-3">
                <CardTitle className="text-2xl font-bold text-white text-center tracking-tight">Create an account</CardTitle>
                <CardDescription className="text-zinc-400 text-center text-sm">
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-5">
                <form className="space-y-4">
                    <FieldGroup className="gap-3">
                        <div className="flex flex-col gap-3">
                            <Field className="space-y-1">
                                <FieldLabel htmlFor="name" className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">Full Name</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    className="bg-white/5 border-white/10 h-9 rounded-lg transition-all text-sm"
                                />
                            </Field>
                            <Field className="space-y-1">
                                <FieldLabel htmlFor="email" className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="bg-white/5 border-white/10 h-9 rounded-lg transition-all text-sm"
                                />
                            </Field>
                            <Field className="space-y-1">
                                <FieldLabel htmlFor="password" className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="bg-white/5 border-white/10 h-9 rounded-lg transition-all text-sm"
                                />
                            </Field>
                            <Field className="space-y-1">
                                <FieldLabel htmlFor="confirm-password" className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">
                                    Confirm Password
                                </FieldLabel>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    required
                                    className="bg-white/5 border-white/10 h-9 rounded-lg transition-all text-sm"
                                />
                            </Field>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-1">
                            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-semibold rounded-full h-10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                                Sign up with Email
                            </Button>

                            <div className="relative my-1">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#0a0a0a] px-2 text-zinc-500">Or continue with</span>
                                </div>
                            </div>

                            <Button variant="outline" type="button" className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10 font-medium rounded-full h-10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                                GitHub
                            </Button>


                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
            <div className="py-4 text-center border-t border-white/5">
                <p className="text-sm text-zinc-500">
                    Already have an account? <a href="/login" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">Sign in</a>
                </p>
            </div>
        </Card>
    )
}
