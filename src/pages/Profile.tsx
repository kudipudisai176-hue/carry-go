import { motion } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Wallet, 
  Truck, 
  Package, 
  MapPin, 
  LogOut, 
  ArrowLeft,
  Settings,
  HelpCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const API_URL = "http://localhost:5000";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </motion.button>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          {/* Header/Cover */}
          <div className={`h-32 w-full ${
            user.role === 'traveller' ? 'bg-purple-600' :
            user.role === 'sender' ? 'bg-orange-500' : 'bg-indigo-600'
          }`} />

          <div className="px-8 pb-8">
            {/* Avatar Row */}
            <div className="relative -mt-16 mb-6 flex items-end justify-between">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-lg">
                  {user.profilePhoto ? (
                    <img 
                      src={`${API_URL}/${user.profilePhoto}`} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <User className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 rounded-2xl bg-white p-1.5 shadow-md">
                   <div className={`rounded-xl p-1.5 ${
                     user.role === 'traveller' ? 'bg-purple-100 text-purple-600' :
                     user.role === 'sender' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'
                   }`}>
                     {user.role === 'traveller' ? <Truck className="h-5 w-5" /> : 
                      user.role === 'sender' ? <Package className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                   </div>
                </div>
              </div>

              <div className="pb-2">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-sm font-medium text-slate-500 capitalize">{user.role} Account</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="rounded-xl bg-white p-2 text-slate-400 shadow-sm">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                    <p className="text-sm font-semibold text-slate-700">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="rounded-xl bg-white p-2 text-slate-400 shadow-sm">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</p>
                    <p className="text-sm font-semibold text-slate-700">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="rounded-xl bg-white p-2 text-slate-400 shadow-sm">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wallet Balance</p>
                    <p className="text-sm font-bold text-green-600">₹{user.walletBalance || 0}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {user.role === 'traveller' && (
                  <>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                      <div className="rounded-xl bg-white p-2 text-slate-400 shadow-sm">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aadhar Verified</p>
                        <p className="text-sm font-semibold text-slate-700">{user.adharNumber?.replace(/.(?=.{4})/g, '*')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                      <div className="rounded-xl bg-white p-2 text-slate-400 shadow-sm">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle Type</p>
                        <p className="text-sm font-semibold text-slate-700 capitalize">{user.vehicleType || 'Not specified'}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Other Options placeholders */}
                <div className="space-y-2 pt-2">
                  <button className="flex w-full items-center justify-between rounded-xl p-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>Account Settings</span>
                    </div>
                  </button>
                  <button className="flex w-full items-center justify-between rounded-xl p-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>Order History</span>
                    </div>
                  </button>
                  <button className="flex w-full items-center justify-between rounded-xl p-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-slate-400" />
                      <span>Help & Support</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Section */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <Button 
                onClick={handleLogout}
                variant="destructive" 
                className="w-full h-12 rounded-2xl gap-2 font-bold shadow-lg shadow-red-500/10"
              >
                <LogOut className="h-5 w-5" /> Logout from Account
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Identity Documents (Only for travellers) */}
        {user.role === 'traveller' && user.adharPhoto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50"
          >
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              Verification Documents
            </h2>
            <div className="bg-slate-50 rounded-2xl p-4 flex justify-center">
              <img 
                src={`${API_URL}/${user.adharPhoto}`} 
                alt="Aadhar Card" 
                className="max-h-48 rounded-xl shadow-md"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
