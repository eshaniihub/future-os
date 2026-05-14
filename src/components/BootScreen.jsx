import { motion } from "framer-motion";

export default function BootScreen() {
  return (

    <motion.div

      initial={{ opacity: 1 }}

      exit={{ opacity: 0 }}

      transition={{ duration: 1 }}

      className="
        fixed
        inset-0
        z-[999]
        bg-[#050816]
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >

      {/* BACKGROUND GLOW */}

      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[140px]" />

      <div className="absolute bottom-[-250px] right-[-120px] w-[500px] h-[500px] rounded-full bg-pink-500/20 blur-[140px]" />

      {/* SCAN LINE */}

      <motion.div

        animate={{
          y: [-500, 500],
        }}

        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}

        className="absolute w-full h-[2px] bg-cyan-400/20 blur-sm"
      />

      {/* CENTER */}

      <div className="relative flex flex-col items-center">

        {/* ORACLE */}

        <motion.div

          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 180, 360],
          }}

          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}

          className="
            relative
            w-[90px]
            h-[90px]
            rounded-full
            bg-gradient-to-br
            from-cyan-400
            via-purple-500
            to-pink-500
            flex
            items-center
            justify-center
            shadow-[0_0_90px_rgba(168,85,247,0.6)]
          "
        >

          <div className="absolute inset-[3px] rounded-full bg-[#050816] backdrop-blur-3xl" />

          <div className="relative z-10 text-center">

            <h1 className="text-white text-[11px] tracking-[0.35em] font-light">

              ORACLE

            </h1>

          </div>

        </motion.div>

        {/* TITLE */}

        <motion.h1

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 1,
          }}

          className="
            mt-8
            text-5xl
            font-black
            bg-gradient-to-r
            from-cyan-300
            via-purple-400
            to-pink-500
            bg-clip-text
            text-transparent
          "
        >

          FutureOS

        </motion.h1>

        {/* SUBTITLE */}

        <motion.p

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.4,
          }}

          className="
            mt-3
            text-xs
            tracking-[0.5em]
            text-white/40
          "
        >

          INITIALIZING FUTURE INTELLIGENCE

        </motion.p>

        {/* LOADING BAR */}

        <div className="mt-8 w-[260px] h-[5px] rounded-full bg-white/10 overflow-hidden">

          <motion.div

            initial={{
              width: 0,
            }}

            animate={{
              width: "100%",
            }}

            transition={{
              duration: 3,
            }}

            className="
              h-full
              bg-gradient-to-r
              from-cyan-400
              via-purple-500
              to-pink-500
            "
          />

        </div>

      </div>

    </motion.div>
  );
}