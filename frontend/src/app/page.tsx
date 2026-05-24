import Link from 'next/link';
import { ArrowRight, Beef, Droplets, TrendingUp, Users, BarChart3, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Beef size={28} />, color: '#1B4332', bg: '#D8F3DC',
      title: 'Cattle Management', titleAm: 'የከብት አስተዳደር',
      desc: 'Track individual cattle with health records, weight monitoring, feeding schedules, and complete history.',
      descAm: 'እያንዳንዱን ከብት ከጤና መዝገብ፣ ክብደት ክትትል እና ሙሉ ታሪክ ጋር ይከታተሉ።',
    },
    {
      icon: <Droplets size={28} />, color: '#0369A1', bg: '#E0F2FE',
      title: 'Dairy Production', titleAm: 'የወተት ምርት',
      desc: 'Record daily milk yield per cow, track quality metrics, and analyze production trends.',
      descAm: 'በየቀኑ የወተት ምርት ይመዝግቡ፣ ጥራት ይከታተሉ እና የምርት አዝማሚያዎችን ይተነትኑ።',
    },
    {
      icon: <TrendingUp size={28} />, color: '#8B5E3C', bg: '#FEF3C7',
      title: 'Sales & Invoicing', titleAm: 'ሽያጭ እና ደረሰኞች',
      desc: 'Manage cattle and dairy product sales, generate professional invoices, and track payments.',
      descAm: 'የከብትና የወተት ሽያጭ ያስተዳድሩ፣ ደረሰኞች ያዘጋጁ እና ክፍያዎችን ይከታተሉ።',
    },
    {
      icon: <Users size={28} />, color: '#7C3AED', bg: '#EDE9FE',
      title: 'Employee Payroll', titleAm: 'የሰራተኛ ደሞዝ',
      desc: 'Manage farm workers, process monthly payroll with bonuses and deductions.',
      descAm: 'የእርሻ ሰራተኞችን ያስተዳድሩ፣ ወርሃዊ ደሞዝ ቦነስ እና ቅነሳ ጋር ያቀናጁ።',
    },
    {
      icon: <BarChart3 size={28} />, color: '#0F766E', bg: '#CCFBF1',
      title: 'Reports & Analytics', titleAm: 'ሪፖርቶች እና ትንታኔ',
      desc: 'Comprehensive reports on weight gain, feeding costs, milk production, and revenue.',
      descAm: 'ስለ ክብደት ጭማሪ፣ የምግብ ወጪ፣ የወተት ምርት እና ገቢ ሙሉ ሪፖርቶች።',
    },
    {
      icon: <ShieldCheck size={28} />, color: '#B45309', bg: '#FEF9C3',
      title: 'Health Tracking', titleAm: 'የጤና ክትትል',
      desc: 'Record veterinary visits, vaccinations, treatments, and schedule follow-up checkups.',
      descAm: 'የሐኪም ጉብኝቶች፣ ክትባቶች፣ ሕክምናዎችን ይመዝግቡ እና ቀጣይ ምርመራዎችን ያቅዱ።',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF5' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐄</span>
            <div>
              <p className="font-bold text-gray-800 text-sm leading-tight">Oliyad & Aklilu</p>
              <p className="text-xs font-amharic" style={{ color: '#40916C' }}>ኦሊያድ እና አቅሊሉ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">
              Sign In / ግባ
            </Link>
            <Link href="/login" className="btn-primary text-sm">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 -z-10" style={{
          background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)',
          clipPath: 'ellipse(120% 80% at 50% 0%)',
        }} />
        <div className="max-w-4xl mx-auto text-center pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <span>🌿</span>
            <span>Professional Farm Management System / ሙያዊ የእርሻ አስተዳደር ስርዓት</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Oliyad, Aklilu
            <br />&amp; Friends Farm
          </h1>
          <p className="text-xl font-amharic mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
            ኦሊያድ፣ አቅሊሉ እና ጓደኞቻቸው የከብት ማድለብ እና የወተት ምርት
          </p>
          <p className="text-base max-w-2xl mx-auto mb-10 text-white/75">
            Complete cattle fattening and dairy management platform. Track your herd, monitor milk production,
            manage sales, and grow your farm business with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#F4A261' }}>
              ስርዓቱን ይጀምሩ / Get Started <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              View Dashboard / ዳሽቦርድ
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto -mt-12 px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 border border-gray-100">
          {[
            { value: '200+', label: 'Cattle / ከብቶች', icon: '🐄' },
            { value: '500L', label: 'Daily Milk / ዕለታዊ ወተት', icon: '🥛' },
            { value: '99%', label: 'Accuracy / ትክክለኛነት', icon: '✅' },
            { value: '24/7', label: 'Monitoring / ክትትል', icon: '📊' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold" style={{ color: '#1B4332' }}>{stat.value}</div>
              <div className="text-xs text-gray-500 font-amharic">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Everything You Need</h2>
          <p className="text-gray-500 max-w-xl mx-auto font-amharic text-sm">
            ሁሉንም የእርሻ ተግባሮቻቸዎን በአንድ ቦታ ያስተዳድሩ
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-hover group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-xs font-amharic mb-3" style={{ color: f.color }}>{f.titleAm}</p>
              <p className="text-sm text-gray-600 mb-2">{f.desc}</p>
              <p className="text-xs font-amharic text-gray-400">{f.descAm}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-20 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl p-12 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #1B4332 0%, #40916C 100%)' }}>
          <h2 className="text-3xl font-bold mb-3">Ready to modernize your farm?</h2>
          <p className="font-amharic mb-8 text-white/80">እርሻዎን ዘመናዊ ለማድረግ ዝግጁ ነዎት?</p>
          <Link href="/login"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{ background: '#F4A261', color: 'white' }}>
            ይጀምሩ / Start Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4" style={{ backgroundColor: '#1B4332' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐄</span>
            <span className="text-white font-semibold text-sm">Oliyad, Aklilu &amp; Friends Cattle Fattening and Dairy</span>
          </div>
          <p className="text-sm font-amharic text-white/60">
            © {new Date().getFullYear()} ኦሊያድ፣ አቅሊሉ እና ጓደኞቻቸው
          </p>
        </div>
      </footer>
    </div>
  );
}
