import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Truck, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import RouteMap from "@/components/RouteMap";
import { searchParcels, updateParcelStatus, type Parcel } from "@/lib/parcelStore";
import { toast } from "sonner";

export default function Traveller() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState<Parcel[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSearch = () => {
    setResults(searchParcels(from, to));
  };

  useEffect(handleSearch, []);

  const handleRequest = (id: string) => {
    updateParcelStatus(id, "requested", "Traveller");
    toast.success("Request sent to sender!");
    handleSearch();
  };

  const handleStartTransit = (id: string) => {
    updateParcelStatus(id, "in-transit");
    toast.success("Parcel is now in transit!");
    handleSearch();
  };

  const handleDeliver = (id: string) => {
    updateParcelStatus(id, "delivered");
    toast.success("Parcel delivered! 🎉");
    handleSearch();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-24">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Traveller Dashboard</h1>
        <p className="text-muted-foreground">Find parcels along your route</p>
      </div>

      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-foreground">From</label>
          <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Origin city" />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-foreground">To</label>
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination city" />
        </div>
        <Button onClick={handleSearch} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <Truck className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No parcels found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {results.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div className="cursor-pointer" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-secondary" />
                    <p className="font-heading font-semibold text-foreground">{p.fromLocation}</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <p className="font-heading font-semibold text-foreground">{p.toLocation}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.weight}kg · To: {p.receiverName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  {p.status === "pending" && (
                    <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => handleRequest(p.id)}>
                      Request
                    </Button>
                  )}
                  {p.status === "accepted" && (
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleStartTransit(p.id)}>
                      Start Transit
                    </Button>
                  )}
                  {p.status === "in-transit" && (
                    <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => handleDeliver(p.id)}>
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
              {expanded === p.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                  {p.description && <p className="mb-3 text-sm text-muted-foreground">{p.description}</p>}
                  <RouteMap from={p.fromLocation} to={p.toLocation} animate={p.status === "in-transit"} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
