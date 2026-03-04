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
            {/* Journey Background Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/journey-bg.jpg"
                    alt="Journey"
                    className="h-full w-full object-cover brightness-[0.4] contrast-[1.1]"
                />

                {/* Atmospheric Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#05070a]/80 via-transparent to-[#05070a]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070a]/40 via-transparent to-[#05070a]/40" />

                {/* Drifting Clouds */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={`cloud-${i}`}
                            initial={{ x: "-100%", y: 10 + i * 15 + "%" }}
                            animate={{ x: "200%" }}
                            transition={{
                                duration: 60 + i * 20,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * -15
                            }}
                            className="absolute h-32 w-[500px] bg-blue-400/10 blur-[60px] rounded-full"
                        />
                    ))}
                </div>

                {/* Pulsing City Lights (Simulated via localized glows) */}
                <div className="absolute top-[40%] right-[15%] w-40 h-40 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-orange-500/20 blur-[40px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [0.8, 1.1, 0.8],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full translate-x-10"
                    />
                </div>

                {/* Road Light Streaks */}
                <div className="absolute bottom-[20%] left-0 w-full h-1 pointer-events-none perspective-[1000px]">
                    <div className="absolute inset-0 flex flex-col gap-4">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={`streak-${i}`}
                                initial={{ x: "-100%", opacity: 0 }}
                                animate={{
                                    x: "200%",
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{
                                    duration: 3 + i,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: i * 0.8
                                }}
                                className={`h-[1px] w-1/3 bg-gradient-to-r from-transparent via-${i % 2 === 0 ? 'orange' : 'blue'}-500 to-transparent shadow-[0_0_15px_${i % 2 === 0 ? 'rgba(249,115,22,0.5)' : 'rgba(59,130,246,0.5)'}]`}
                                style={{
                                    transform: `translateY(${i * 10}px) rotateX(45deg) skewX(-20deg)`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Glowing Particles (Refined) */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            initial={{
                                x: Math.random() * 100 + "%",
                                y: Math.random() * 100 + "%",
                                opacity: 0,
                                scale: Math.random() * 0.5 + 0.3
                            }}
                            animate={{
                                y: [null, "-10%"],
                                opacity: [0, 0.4, 0],
                            }}
                            transition={{
                                duration: 15 + Math.random() * 10,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 10
                            }}
                            className={`absolute w-1 h-1 rounded-full blur-[1px] ${i % 2 === 0 ? "bg-orange-400/50" : "bg-blue-400/50"
                                }`}
                        />
                    ))}
                </div>
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
