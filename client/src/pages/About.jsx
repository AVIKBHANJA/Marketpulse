import { motion } from 'framer-motion';
import { Briefcase, BarChart, Users, Award, Clock, Globe } from 'react-feather';

const About = () => {
  const stats = [
    { icon: <Briefcase size={40} />, value: '10K+', label: 'Daily Transactions' },
    { icon: <BarChart size={40} />, value: '$5T+', label: 'Assets Analyzed' },
    { icon: <Users size={40} />, value: '250K+', label: 'Active Users' },
    { icon: <Award size={40} />, value: '15+', label: 'Industry Awards' },
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', exp: '15+ years in FinTech', img: '/team1.jpg' },
    { name: 'Michael Chen', role: 'Chief Analyst', exp: 'Wall Street Veteran', img: '/team2.jpg' },
    { name: 'Emma Wilson', role: 'Lead Developer', exp: 'AI & ML Expert', img: '/team3.jpg' },
    { name: 'David Patel', role: 'Risk Manager', exp: 'Portfolio Strategist', img: '/team4.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent mb-6"
          >
            Revolutionizing Market Intelligence
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Empowering investors with cutting-edge analytics, AI-driven insights, and institutional-grade tools 
            to navigate global financial markets with confidence.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-teal-500 dark:text-teal-400 mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-2 dark:text-white">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-teal-500/10 dark:bg-teal-500/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              To democratize access to professional-grade financial tools and insights, 
              enabling both individual investors and institutions to make data-driven 
              decisions in an increasingly complex global market.
            </p>
            <div className="space-y-4">
              {['Real-time Analytics', 'AI Predictions', 'Risk Management', 'Global Coverage'].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-2 bg-teal-500/20 rounded-lg">
                    <Clock className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="/market-analytics.jpg" 
              alt="Market Analytics" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">
            Meet Our Experts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
              >
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 dark:text-white">{member.name}</h3>
                  <p className="text-teal-600 dark:text-teal-400 mb-2">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{member.exp}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Globe className="w-16 h-16 mx-auto text-teal-400 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Global Reach, Local Expertise</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Operating in 15+ countries with localized insights and 24/7 market coverage
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {['Integrity First', 'Innovation Driven', 'Client Focused'].map((value, index) => (
              <div key={index} className="p-8 bg-gray-800 rounded-xl hover:bg-gray-700/50 transition-colors">
                <div className="text-teal-400 text-2xl mb-4">0{index + 1}</div>
                <h3 className="text-xl font-bold mb-3">{value}</h3>
                <p className="text-gray-400">
                  {index === 0 && 'Uncompromising ethics in data and analysis'}
                  {index === 1 && 'Pioneering new frontiers in financial technology'}
                  {index === 2 && 'Tailored solutions for every investment strategy'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;