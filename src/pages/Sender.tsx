import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Plus, Check, Trash2, MapPin, Weight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/StatusBadge";
import RouteMap from "@/components/RouteMap";
import { createParcel, getAllParcels, updateParcelStatus, deleteParcel, type Parcel } from "@/lib/parcelStore";
import { toast } from "sonner";

export default function Sender() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Parcel | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const refresh = () => setParcels(getAllParcels());
  useEffect(refresh, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createParcel({
      senderName: "Me",
      receiverName: fd.get("receiverName") as string,
      receiverPhone: fd.get("receiverPhone") as string,
      fromLocation: fd.get("fromLocation") as string,
      toLocation: fd.get("toLocation") as string,
      weight: parseFloat(fd.get("weight") as string) || 0,
      description: fd.get("description") as string,
    });
    toast.success("Parcel created!");
    setShowForm(false);
    refresh();
  };

  const handleAccept = (id: string) => {
    updateParcelStatus(id, "accepted");
    toast.success("Traveller request accepted!");
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteParcel(id);
    toast("Parcel deleted");
    refresh();
    if (selected?.id === id) setSelected(null);
  };

  const statusCounts = {
    total: parcels.length,
    pending: parcels.filter(p => p.status === "pending").length,
    inTransit: parcels.filter(p => p.status === "in-transit").length,
    delivered: parcels.filter(p => p.status === "delivered").length,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-20">

      {/* ── Animated page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mb-8 overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, hsl(222 60% 14%) 0%, hsl(232 55% 20%) 50%, hsl(222 55% 16%) 100%)",
        }}
      >
        {/* Glow orbs */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/25 blur-2xl" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-secondary/15 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Package className="h-6 w-6 text-secondary" />
              </motion.div>
              <h1 className="font-heading text-2xl font-bold text-white">Sender Dashboard</h1>
            </div>
            <p className="text-sm text-white/60">Create and manage your parcels</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowForm(!showForm)}
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(28 100% 55%), hsl(20 100% 45%))" }}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity hover:opacity-100" />
            <Plus className="h-4 w-4" />
            New Parcel
          </motion.button>
        </div>

        {/* Stats strip */}
        <div className="relative mt-5 grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: statusCounts.total, color: "hsl(28 100% 55%)" },
            { label: "Pending", value: statusCounts.pending, color: "#f59e0b" },
            { label: "In Transit", value: statusCounts.inTransit, color: "#60a5fa" },
            { label: "Delivered", value: statusCounts.delivered, color: "#34d399" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="font-heading text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-white/50">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── New Parcel Form ── */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="mb-6 overflow-hidden rounded-2xl border border-secondary/30 bg-card p-6 shadow-card"
            style={{ boxShadow: "0 0 0 1px hsl(28 100% 55% / 0.12), 0 8px 32px hsl(28 100% 55% / 0.08)" }}
          >
            {/* Form header */}
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15">
                <Sparkles className="h-4 w-4 text-secondary" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">New Parcel</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { id: "receiverName", label: "Receiver Name", placeholder: "John Doe" },
                { id: "receiverPhone", label: "Receiver Phone", placeholder: "+234..." },
                { id: "fromLocation", label: "From", placeholder: "Lagos" },
                { id: "toLocation", label: "To", placeholder: "Accra" },
                { id: "weight", label: "Weight (kg)", placeholder: "2.5", type: "number" },
              ].map((field) => (
                <div key={field.id} className="group">
                  <Label htmlFor={field.id} className="text-sm font-medium text-foreground/80">
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    required
                    placeholder={field.placeholder}
                    type={field.type || "text"}
                    step={field.id === "weight" ? "0.1" : undefined}
                    className="mt-1 border-border transition-all focus:border-secondary focus:ring-secondary/20"
                  />
                </div>
              ))}
              <div className="group">
                <Label htmlFor="description" className="text-sm font-medium text-foreground/80">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="What are you sending?"
                  className="mt-1 border-border transition-all focus:border-secondary focus:ring-secondary/20"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="rounded-full px-6 py-2 text-sm font-semibold text-white shadow"
                style={{ background: "linear-gradient(135deg, hsl(28 100% 55%), hsl(20 100% 45%))" }}
              >
                Create Parcel
              </motion.button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-full">
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── Empty state ── */}
      {parcels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-secondary/20 py-20 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10"
          >
            <Package className="h-8 w-8 text-secondary" />
          </motion.div>
          <p className="mb-1 font-heading text-lg font-semibold text-foreground">No parcels yet</p>
          <p className="mb-5 text-sm text-muted-foreground">Create your first parcel to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, hsl(28 100% 55%), hsl(20 100% 45%))" }}
          >
            <Plus className="h-4 w-4" /> Create Parcel
          </motion.button>
        </motion.div>
      ) : (
        /* ── Parcel cards ── */
        <motion.div
          className="grid gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {parcels.map((p) => {
            const isSelected = selected?.id === p.id;
            const isHovered = hoveredId === p.id;

            return (
              <motion.div
                key={p.id}
                layout
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -3 }}
                onHoverStart={() => setHoveredId(p.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => setSelected(isSelected ? null : p)}
                className="relative cursor-pointer overflow-hidden rounded-xl border bg-card"
                style={{
                  borderColor: isSelected
                    ? "hsl(28 100% 55% / 0.6)"
                    : isHovered
                      ? "hsl(28 100% 55% / 0.3)"
                      : "hsl(var(--border))",
                  boxShadow: isSelected
                    ? "0 0 0 2px hsl(28 100% 55% / 0.2), 0 12px 36px hsl(28 100% 55% / 0.12)"
                    : isHovered
                      ? "0 8px 28px hsl(28 100% 55% / 0.10)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                }}
              >
                {/* Orange top accent bar (animates in on hover/select) */}
                <motion.div
                  className="absolute left-0 top-0 h-0.5 rounded-t-xl"
                  style={{ background: "linear-gradient(90deg, hsl(28 100% 55%), hsl(40 100% 65%))" }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: isHovered || isSelected ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Glow blob on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-secondary/10 blur-2xl"
                    />
                  )}
                </AnimatePresence>

                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Icon + route info */}
                    <div className="flex items-start gap-3">
                      <motion.div
                        animate={{ backgroundColor: isHovered || isSelected ? "hsl(28 100% 55%)" : "hsl(28 100% 55% / 0.12)" }}
                        transition={{ duration: 0.25 }}
                        className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                      >
                        <Package
                          className="h-4 w-4 transition-colors duration-200"
                          style={{ color: isHovered || isSelected ? "#fff" : "hsl(28 100% 55%)" }}
                        />
                      </motion.div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-semibold text-foreground">{p.fromLocation}</span>
                          <motion.div
                            animate={{ x: isHovered ? [0, 4, 0] : 0 }}
                            transition={{ repeat: isHovered ? Infinity : 0, duration: 0.8 }}
                          >
                            <ArrowRight className="h-3.5 w-3.5 text-secondary" />
                          </motion.div>
                          <span className="font-heading font-semibold text-foreground">{p.toLocation}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-secondary/70" />
                            To: {p.receiverName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Weight className="h-3 w-3 text-secondary/70" />
                            {p.weight}kg
                          </span>
                        </div>
                        {p.travellerName && (
                          <p className="mt-1 text-xs font-medium text-secondary">
                            ✦ Traveller: {p.travellerName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right side: badge + actions */}
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <StatusBadge status={p.status} />

                      {p.status === "requested" && (
                        <motion.button
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.93 }}
                          className="flex items-center gap-1 rounded-full border border-green-500/40 px-3 py-1 text-xs font-semibold text-green-600 transition-colors hover:bg-green-500 hover:text-white"
                          onClick={(e) => { e.stopPropagation(); handleAccept(p.id); }}
                        >
                          <Check className="h-3 w-3" /> Accept
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded map */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="mb-2 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
                        {p.description && (
                          <p className="mb-3 text-sm text-muted-foreground">{p.description}</p>
                        )}
                        <RouteMap from={p.fromLocation} to={p.toLocation} animate={p.status === "in-transit"} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
