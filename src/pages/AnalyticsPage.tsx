import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Clock, Target, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const spendData = [
  { month: 'Jul', spend: 95000 }, { month: 'Aug', spend: 140000 }, { month: 'Sep', spend: 110000 },
  { month: 'Oct', spend: 175000 }, { month: 'Nov', spend: 200000 }, { month: 'Dec', spend: 165000 },
  { month: 'Jan', spend: 120000 }, { month: 'Feb', spend: 185000 }, { month: 'Mar', spend: 250000 },
  { month: 'Apr', spend: 280000 },
];

const radarData = [
  { metric: 'Price', A: 85, B: 72 },
  { metric: 'Quality', A: 78, B: 90 },
  { metric: 'Delivery', A: 92, B: 80 },
  { metric: 'Compliance', A: 88, B: 95 },
  { metric: 'Support', A: 75, B: 85 },
];

const kpis = [
  { label: 'Avg Cycle Time', value: '14.2 days', change: '-2.1d', icon: <Clock size={18} />, positive: true },
  { label: 'Cost Savings', value: '₹4.2L', change: '+18%', icon: <DollarSign size={18} />, positive: true },
  { label: 'Vendor Win Rate', value: '34%', change: '+5%', icon: <Target size={18} />, positive: true },
  { label: 'On-time Delivery', value: '91%', change: '-2%', icon: <Award size={18} />, positive: false },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const AnalyticsPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <BarChart3 className="text-primary" size={24} /> Analytics
      </h1>
      <p className="text-sm text-muted-foreground mt-1">Procurement performance insights</p>
    </div>

    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <motion.div key={i} variants={item} className="glass-card-hover p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">{kpi.icon}</span>
            <span className={`text-xs font-semibold ${kpi.positive ? 'text-success' : 'text-destructive'}`}>{kpi.change}</span>
          </div>
          <p className="text-xl font-bold text-foreground">{kpi.value}</p>
          <p className="text-sm text-muted-foreground">{kpi.label}</p>
        </motion.div>
      ))}
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" /> Procurement Spend
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={spendData}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `₹${v / 1000}k`} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Area type="monotone" dataKey="spend" stroke="hsl(var(--primary))" fill="url(#spendGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Vendor Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <PolarRadiusAxis stroke="hsl(var(--border))" fontSize={10} />
            <Radar name="TechCorp" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
            <Radar name="InnovateTech" dataKey="B" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  </div>
);

export default AnalyticsPage;
