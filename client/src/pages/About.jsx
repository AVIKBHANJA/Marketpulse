import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiUsers, FiGlobe, FiAward, FiBriefcase, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-8"
            >
              Revolutionizing Market Intelligence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              Empowering investors with AI-driven insights and real-time analytics to make smarter financial decisions.
            </motion.p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-colors"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard icon={<FiUsers />} number="1M+" label="Active Users" />
          <StatCard icon={<FiGlobe />} number="50+" label="Countries Served" />
          <StatCard icon={<FiAward />} number="15+" label="Industry Awards" />
        </div>
      </SectionWrapper>

      {/* Mission Section */}
      <SectionWrapper bg="light">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              To democratize access to professional-grade financial analytics through cutting-edge AI technology, 
              enabling both novice and experienced investors to navigate markets with confidence.
            </p>
            <div className="space-y-6">
              <FeatureItem title="Real-time Analytics" />
              <FeatureItem title="AI-powered Predictions" />
              <FeatureItem title="Customizable Portfolios" />
            </div>
          </motion.div>
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-1 shadow-xl">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-96 flex items-center justify-center">
                <div className="animate-pulse">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 h-64 w-64 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Team Section */}
      <SectionWrapper>
        <h2 className="text-4xl font-bold text-center mb-16 dark:text-white">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TeamMember 
            name="John Carter" 
            role="CEO & Founder" 
            image="https://source.unsplash.com/random/600x600/?person"
            socials={{ linkedin: "#", twitter: "#" }}
          />
          <TeamMember 
            name="Emma Smith" 
            role="Lead Analyst" 
            image="https://source.unsplash.com/random/600x600/?woman"
            socials={{ linkedin: "#", github: "#" }}
          />
          <TeamMember 
            name="Michael Chen" 
            role="AI Architect" 
            image="https://source.unsplash.com/random/600x600/?asian"
            socials={{ twitter: "#", github: "#" }}
          />
        </div>
      </SectionWrapper>

      {/* Values Section */}
      <SectionWrapper bg="light">
        <h2 className="text-4xl font-bold text-center mb-16 dark:text-white">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard 
            title="Transparency" 
            icon={<FiBriefcase />}
            description="Open and honest communication with all stakeholders"
          />
          <ValueCard 
            title="Innovation" 
            icon={<FiAward />}
            description="Constantly pushing boundaries in financial technology"
          />
          <ValueCard 
            title="Integrity" 
            icon={<FiGlobe />}
            description="Ethical practices at the core of every decision"
          />
        </div>
      </SectionWrapper>
    </div>
  );
};

// Reusable Components
const SectionWrapper = ({ children, bg }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={controls}
      className={`py-20 ${bg === 'light' ? 'bg-white dark:bg-gray-800' : ''}`}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </motion.section>
  );
};

const StatCard = ({ icon, number, label }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
  >
    <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4 mx-auto w-fit">
      {icon}
    </div>
    <h3 className="text-4xl font-bold mb-2 dark:text-white">{number}</h3>
    <p className="text-gray-600 dark:text-gray-400">{label}</p>
  </motion.div>
);

const FeatureItem = ({ title }) => (
  <div className="flex items-center gap-4">
    <div className="w-2 h-2 bg-blue-600 rounded-full" />
    <span className="text-lg font-medium dark:text-white">{title}</span>
  </div>
);

const TeamMember = ({ name, role, image, socials }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="group relative overflow-hidden rounded-2xl shadow-lg"
  >
    <img 
      src={image} 
      alt={name} 
      className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-6">
      <div>
        <h3 className="text-white text-xl font-bold">{name}</h3>
        <p className="text-gray-300">{role}</p>
        <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {Object.entries(socials).map(([platform, link]) => (
            <a 
              key={platform}
              href={link}
              className="text-white hover:text-blue-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {platform === 'linkedin' && <FiLinkedin size={20} />}
              {platform === 'twitter' && <FiTwitter size={20} />}
              {platform === 'github' && <FiGithub size={20} />}
            </a>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const ValueCard = ({ title, icon, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-3 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

export default About;