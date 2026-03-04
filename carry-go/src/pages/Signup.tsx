import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Package, Truck, MapPin, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type UserRole } from "@/lib/authContext";
import { toast } from "sonner";
import AuthAnimationWrapper from "@/components/AuthAnimationWrapper";

const roles: { value: UserRole; label: string; icon: typeof Package; desc: string }[] = [
  { value: "sender", label: "Sender", icon: Package, desc: "Send parcels to anyone, anywhere" },
  { value: "traveller", label: "Traveller", icon: Truck, desc: "Carry parcels along your route & earn" },
  { value: "receiver", label: "Receiver", icon: MapPin, desc: "Track incoming parcels in real-time" },
];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select your role");
      return;
    }
    if (signup(name, email, password, role)) {
      toast.success("Account created! Welcome to CarryGo 🎉");
      navigate("/dashboard");
    } else {
      toast.error("An account with this email already exists");
    }
  };

  return (
    <AuthAnimationWrapper>
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-orange-500/20">
        <div className="mb-8 text-center text-white">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mx-auto mb-4 flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20"
          >
            <Package className="h-7 w-7 text-white" />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Create account</h1>
          <p className="mt-2 text-slate-400">Join the CarryGo global network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="group space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors group-hover:text-orange-400">
                <User className="h-4 w-4" /> Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="border-white/10 bg-black/40 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>
            <div className="group space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors group-hover:text-orange-400">
                <Mail className="h-4 w-4" /> Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-white/10 bg-black/40 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>
          </div>
          <div className="group space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors group-hover:text-orange-400">
              <Lock className="h-4 w-4" /> Secure Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border-white/10 bg-black/40 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20"
            />
          </div>

          <div>
            <Label className="mb-4 block text-sm font-semibold text-slate-300">Choose your role</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {roles.map((r) => {
                const isSelected = role === r.value;
                const Icon = r.icon;
                return (
                  <motion.button
                    key={r.value}
                    type="button"
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole(r.value)}
                    className={`group relative flex flex-col items-center rounded-2xl border-2 p-4 text-center transition-all ${isSelected
                        ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                        : "border-white/5 bg-white/5 hover:border-orange-500/40 hover:bg-white/10"
                      }`}
                  >
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-all ${isSelected
                        ? "bg-orange-500 text-white"
                        : "bg-white/5 text-slate-400 group-hover:text-orange-400"
                      }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm font-bold transition-colors ${isSelected ? "text-orange-400" : "text-slate-300"}`}>
                      {r.label}
                    </span>
                    <span className="mt-1 text-[10px] leading-tight text-slate-500">{r.desc}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full bg-orange-600 font-bold text-white hover:bg-orange-500 shadow-xl shadow-orange-600/20">
              <UserPlus className="mr-2 h-4 w-4" /> Get Started
            </Button>
          </motion.div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already a member?{" "}
          <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300 hover:underline underline-offset-4 decoration-2">
            Sign In
          </Link>
        </p>
      </div>
    </AuthAnimationWrapper>
  );
}
