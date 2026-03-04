import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function AuthAnimationWrapper({ children }: { children: React.ReactNode }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Animation sequence:
        // 0: Boy walking in (1.5s)
        // 1: Looking left (0.5s)
        // 2: Looking right (0.5s)
        // 3: Throwing paper (0.8s)
        // 4: Show form (rest)

        const timers = [
            setTimeout(() => setStep(1), 1500),
            setTimeout(() => setStep(2), 2000),
            setTimeout(() => setStep(3), 2500),
            setTimeout(() => setStep(4), 3300),
        ];

        return () => timers.forEach(t => clearTimeout(t));
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#05070a]">
            {/* Vibrant Orange & Blue Particle Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Sky-like Glows (Much stronger now) */}
                <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-blue-600/25 blur-[180px] rounded-full mix-blend-screen" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-orange-600/20 blur-[150px] rounded-full mix-blend-screen" />

                {/* Subtle Horizontal Bloom */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/15 to-transparent" />

                {/* Techy Grid pattern with color hints */}
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
                        backgroundSize: "60px 60px"
                    }}
                />

                {/* Floating Particles (More vibrant orange/blue) */}
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            opacity: 0,
                            scale: Math.random() * 0.5 + 0.3
                        }}
                        animate={{
                            y: [null, "-110%"],
                            x: [null, (Math.random() - 0.5) * 40 + "%"],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 20,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 15
                        }}
                        className={`absolute w-1.5 h-1.5 rounded-full blur-[0.8px] shadow-lg shadow-current ${i % 2 === 0 ? "bg-orange-500/70 text-orange-400" : "bg-blue-500/70 text-blue-400"
                            }`}
                    />
                ))}
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4 pt-20">
                {/* The Boy Character */}
                {step < 4 && (
                    <motion.div
                        initial={{ x: "-100vw", opacity: 0 }}
                        animate={{
                            x: step === 0 ? "0" : "0",
                            opacity: 1,
                            transition: { duration: 1.5, ease: "easeOut" }
                        }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    >
                        {/* 3D Delivery Boy Image with Real Walk Cycle */}
                        <motion.div
                            animate={step === 0 ? {
                                y: [0, -12, 0, -12, 0],
                                rotate: [0, 4, -4, 4, 0],
                                scaleY: [1, 1.03, 0.98, 1.03, 1],
                                x: [-10, 10, -10, 10, -10]
                            } : {
                                y: 0,
                                rotate: step === 1 ? -15 : step === 2 ? 15 : 0,
                                scaleY: 1,
                                x: 0
                            }}
                            transition={step === 0 ? {
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            } : {
                                duration: 0.4
                            }}
                            className="relative"
                        >
                            <motion.div
                                animate={step === 0 ? {
                                    scale: [1, 0.8, 1, 0.8, 1],
                                    opacity: [0.3, 0.15, 0.3, 0.15, 0.3]
                                } : { scale: 1, opacity: 0.3 }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-3 sm:h-4 bg-black/40 blur-xl rounded-full"
                            />

                            <img
                                src="/delivery-boy.png"
                                alt="Delivery Boy"
                                className="w-32 sm:w-48 h-auto drop-shadow-2xl filter brightness-110 relative z-10"
                            />

                            <AnimatePresence>
                                {step === 1 && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 bg-white/90 px-3 py-1 rounded-full shadow-lg text-[10px] font-bold text-primary"
                                    >
                                        Hmm?
                                    </motion.div>
                                )}
                                {step === 2 && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 bg-white/90 px-3 py-1 rounded-full shadow-lg text-[10px] font-bold text-primary"
                                    >
                                        Clear!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* The Thrown Paper (Form Materializer) */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [-20, -100, -250], // Adjusted for mobile height
                                    x: [0, 40, -10],
                                    rotate: [0, 720, 1440],
                                }}
                                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                                className="absolute top-10 sm:top-20 flex items-center justify-center"
                            >
                                <div className="w-12 h-16 sm:w-16 sm:h-20 bg-white rounded shadow-2xl border-2 border-primary/20 flex flex-col p-2 gap-1 overflow-hidden">
                                    <div className="w-full h-1 bg-secondary/30 rounded" />
                                    <div className="w-[80%] h-1 bg-muted rounded" />
                                    <div className="w-full h-1 bg-muted rounded" />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* The Form Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.1, y: 100, rotate: -20 }}
                    animate={{
                        opacity: step >= 4 ? 1 : 0,
                        scale: step >= 4 ? 1 : 0.1,
                        y: step >= 4 ? 0 : 100,
                        rotate: step >= 4 ? 0 : -20
                    }}
                    transition={{
                        type: "spring",
                        damping: 14,
                        stiffness: 100,
                        duration: 0.8
                    }}
                    className="w-full max-w-[95%] sm:max-w-md"
                >
                    {children}
                </motion.div>
            </div>

            <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-20" />

            {step === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium"
                >
                    *step step step*
                </motion.div>
            )}
        </div>
    );
}
