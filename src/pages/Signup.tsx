import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Package, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type UserRole } from "@/lib/authContext";
import { toast } from "sonner";

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
    <div className="flex min-h-screen items-center justify-center px-4 py-20 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-elevated"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground">Join the CarryGo community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          {/* Role Selection */}
          <div>
            <Label className="mb-3 block">I want to…</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {roles.map((r) => {
                const isSelected = role === r.value;
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`group relative flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all ${
                      isSelected
                        ? "border-secondary bg-secondary/10 shadow-card"
                        : "border-border hover:border-secondary/40"
                    }`}
                  >
                    <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      isSelected ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground group-hover:bg-secondary/20 group-hover:text-secondary"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-heading text-sm font-semibold text-foreground">{r.label}</span>
                    <span className="mt-1 text-[11px] leading-tight text-muted-foreground">{r.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <UserPlus className="mr-2 h-4 w-4" /> Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-secondary hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
