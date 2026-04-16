import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Building2, FileText, ShoppingCart, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const barData = [
  { month: 'Jan', rfqs: 12, pos: 8 }, { month: 'Feb', rfqs: 19, pos: 14 },
  { month: 'Mar', rfqs: 15, pos: 11 }, { month: 'Apr', rfqs: 22, pos: 18 },
  { month: 'May', rfqs: 28, pos: 22 }, { month: 'Jun', rfqs: 25, pos: 20 },
];

const pieData = [
  { name: 'Approved', value: 45, color: 'hsl(142, 76%, 36%)' },
  { name: 'Pending', value: 20, color: 'hsl(38, 92%, 50%)' },
  { name: 'Rejected', value: 8, color: 'hsl(0, 84%, 60%)' },
];

const lineData = [
  { month: 'Jan', spend: 120000 }, { month: 'Feb', spend: 185000 },
  { month: 'Mar', spend: 150000 }, { month: 'Apr', spend: 220000 },
  { month: 'May', spend: 280000 }, { month: 'Jun', spend: 250000 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const DashboardPage = () => {
  const { user } = useAuth();

  const kpis = [
    { label: 'Total Vendors', value: '73', change: '+12%', icon: <Building2 size={20} />, accent: 'primary' },
    { label: 'Active RFQs', value: '18', change: '+5', icon: <FileText size={20} />, accent: 'accent' },
    { label: 'Purchase Orders', value: '142', change: '+8%', icon: <ShoppingCart size={20} />, accent: 'success' },
    { label: 'Pending Approvals', value: '7', change: '-3', icon: <Clock size={20} />, accent: 'warning' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your procurement today.</p>
      </div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} variants={item}
            className="glass-card-hover p-5 cursor-default">
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-lg bg-${kpi.accent}/10 text-${kpi.accent}`}>{kpi.icon}</span>
              <span className={`text-xs font-semibold ${kpi.change.startsWith('+') ? 'text-success' : 'text-warning'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary" /> RFQs vs Purchase Orders
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="rfqs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="RFQs" />
              <Bar dataKey="pos" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="POs" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users size={16} className="text-primary" /> Vendor Status
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Spend trend + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Monthly Spend Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Spend']} />
              <Line type="monotone" dataKey="spend" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-warning" /> Recent Alerts
          </h3>
          <div className="space-y-3">
            {[
              { msg: 'Vendor TechCorp compliance docs expiring in 5 days', type: 'warning' },
              { msg: 'RFQ #RFQ-2026-042 deadline in 2 hours', type: 'destructive' },
              { msg: '3 new vendor registrations pending approval', type: 'primary' },
              { msg: 'PO #PO-2026-138 marked as received', type: 'success' },
              { msg: 'Monthly procurement report ready for export', type: 'muted-foreground' },
            ].map((alert, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 bg-${alert.type}`} />
                <span className="text-sm text-foreground">{alert.msg}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
