import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";

export function RSAC() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  void y;
  const revealVariant = {
    hidden: {
      opacity: 0,
      y: 60,
      clipPath: "inset(20% 0% 20% 0%)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }; 
  
  return (
    <section className="min-h-screen bg-black text-white py-20 px-6 md:px-12 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-orange-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[140px]" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          style={{ y }}>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            RSAC 2026 Booth Showcase
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Our interactive <span className="text-orange-400 font-semibold">Basketball Game</span> was deployed live at the AppViewX booth during RSAC 2026 — driving engagement, attracting visitors, and creating a fun cyber-themed experience.
          </p>
        </motion.div>

        {/* Media Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >

          {/* IMAGE */}
            <motion.div
              variants={revealVariant}
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 perspective-[1000px]"
            >
              {/* Glow sweep on reveal */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />

              <img
                src="/logo/booth.jpg"
                alt="RSAC Booth"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-4 left-4">
                <p className="text-sm text-gray-300">Live Booth Setup</p>
                <h3 className="text-xl font-bold">AppViewX @ RSAC</h3>
              </div>
            </motion.div>
          
           {/* image2 */}
            <motion.div
              variants={revealVariant}
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 perspective-[1000px]"
            >
              {/* Glow sweep on reveal */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />


            <img
              src="/logo/booth1.jpeg"
              alt="RSAC Booth"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {/* <div className="absolute bottom-4 left-4">
              <p className="text-sm text-gray-300">Live Booth Setup</p>
              <h3 className="text-xl font-bold">AppViewX @ RSAC</h3>
            </div> */}
          </motion.div>

          {/* VIDEO 1 */}
            <motion.div
              variants={revealVariant}
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 perspective-[1000px]"
            >
              {/* Glow sweep on reveal */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
            <video
              src="/logo/booth2.mp4" 
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-4 left-4">
              <p className="text-sm text-gray-300">Gameplay in Action</p>
              <h3 className="text-xl font-bold">Basketball Game</h3>
            </div>
          </motion.div>

          {/* VIDEO 2 */}
            <motion.div
              variants={revealVariant}
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 perspective-[1000px]"
            >
              {/* Glow sweep on reveal */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
            <video
              src="/logo/booth3.mp4" 
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute bottom-6 left-6">
              <p className="text-sm text-gray-300">User Engagement</p>
              <h3 className="text-2xl font-bold">
                Real Visitors Playing at Booth
              </h3>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-6 py-3 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-300 text-sm tracking-widest uppercase">
            Real Deployment • Real Engagement • Real Impact
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default RSAC;