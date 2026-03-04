import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Package, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";
import AuthAnimationWrapper from "@/components/AuthAnimationWrapper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <AuthAnimationWrapper>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] group/card">
        <div className="mb-8 text-center text-white">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mx-auto mb-4 flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl bg-primary"
          >
            <Package className="h-7 w-7 text-primary-foreground" />
          </motion.div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your CarryGo account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 font-medium text-slate-300 transition-colors group-hover:text-purple-400">
              <Mail className="h-4 w-4" /> Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="border-white/10 bg-black/40 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-purple-500/20"
            />
          </div>
          <div className="group space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 font-medium text-slate-300 transition-colors group-hover:text-purple-400">
              <Lock className="h-4 w-4" /> Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border-white/10 bg-black/40 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-purple-500/20"
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg transition-all duration-200">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </motion.div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-secondary hover:underline underline-offset-4 decoration-2">
            Sign Up
          </Link>
        </p>
      </div>
    </AuthAnimationWrapper>
  );
}
