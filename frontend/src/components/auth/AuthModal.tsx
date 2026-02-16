import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/hooks/useAuth" // TEK BAĞLANTIMIZ BU
import { loginSchema, registerSchema } from "@/lib/schemas" // Schemalar buradan geliyor
import type { LoginFormValues, RegisterFormValues } from "@/types/index"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export function AuthModal() {
  const [activeTab, setActiveTab] = useState("login")
  const [isOpen, setIsOpen] = useState(false)
  
  // --- HOOK KULLANIMI ---
  const { loginMutation, registerMutation } = useAuth()

  // Form Hookları
  const loginForm = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  // --- SUBMIT ---
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => setIsOpen(false),
      // Hata yönetimi (React Query sayesinde hook'tan geliyor)
    })
  }

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // confirmPassword hariç veriyi gönder
    const { confirmPassword, ...registerData } = data
    
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        toast.success("Successfully registered!", {position: "bottom-right"})
        setActiveTab("login")
        registerForm.reset()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer hover:bg-black hover:text-white transition-colors" variant="outline">
            Log in / Sign up
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">TrelloClone</DialogTitle>
          <DialogDescription className="text-center">Manage your projects efficiently.</DialogDescription>
        </DialogHeader>
        
        {/* API'den dönen genel hataları göstermek için */}
        {(loginMutation.isError) && (
             <div className="bg-red-100 text-red-600 p-2 text-sm rounded">
                Giriş başarısız. Bilgilerinizi kontrol edin.
             </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="cursor-pointer" value="login">Log In</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="register">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN FORM */}
          <TabsContent value="login" className="space-y-4 py-4">
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...loginForm.register("email")} />
                    {loginForm.formState.errors.email && <span className="text-red-500 text-xs">{loginForm.formState.errors.email.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...loginForm.register("password")} />
                    {loginForm.formState.errors.password && <span className="text-red-500 text-xs">{loginForm.formState.errors.password.message}</span>}
                </div>
                <Button type="submit" className="cursor-pointer w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? <Spinner /> : "Log In"}
                </Button>
            </form>
          </TabsContent>

          {/* REGISTER FORM */}
          <TabsContent value="register" className="space-y-4 py-4">
             <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input {...registerForm.register("first_name")} />
                        {registerForm.formState.errors.first_name && <span className="text-red-500 text-xs">{registerForm.formState.errors.first_name.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label>Surname</Label>
                        <Input {...registerForm.register("last_name")} />
                        {registerForm.formState.errors.last_name && <span className="text-red-500 text-xs">{registerForm.formState.errors.last_name.message}</span>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input {...registerForm.register("email")} />
                    {registerForm.formState.errors.email && <span className="text-red-500 text-xs">{registerForm.formState.errors.email.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" {...registerForm.register("password")} />
                    {registerForm.formState.errors.password && <span className="text-red-500 text-xs">{registerForm.formState.errors.password.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" {...registerForm.register("confirmPassword")} />
                    {registerForm.formState.errors.confirmPassword && <span className="text-red-500 text-xs">{registerForm.formState.errors.confirmPassword.message}</span>}
                </div>
                <Button type="submit" className="cursor-pointer w-full" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? <Spinner />: "Sign Up"}
                </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}