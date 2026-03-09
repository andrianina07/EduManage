import { useState } from "react";

// ─── COLOR PALETTE & DESIGN TOKENS ───────────────────────────────────────────
// Primary: Slate-900 (#0F172A)     – sidebar, headers
// Surface: #F8F7F4                 – warm off-white background
// Card:    #FFFFFF                 – card surface
// Accent:  #4F67FF                 – indigo-blue (CTAs, highlights)
// Accent2: #10B981                 – emerald (success, positive)
// Accent3: #F59E0B                 – amber (warnings, gold ranking)
// Muted:   #6B7280                 – secondary text
// Border:  #E5E7EB                 – subtle borders

const COLORS = {
  bg: "#F8F7F4",
  sidebar: "#0F172A",
  sidebarHover: "#1E293B",
  card: "#FFFFFF",
  accent: "#4F67FF",
  accentLight: "#EEF1FF",
  green: "#10B981",
  greenLight: "#D1FAE5",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  red: "#EF4444",
  redLight: "#FEE2E2",
  purple: "#8B5CF6",
  purpleLight: "#EDE9FE",
  text: "#0F172A",
  muted: "#6B7280",
  border: "#E5E7EB",
  borderLight: "#F1F0EE",
};

// ─── SHARED MICRO-COMPONENTS ─────────────────────────────────────────────────

const Badge = ({ color = "accent", children, size = "sm" }) => {
  const map = {
    accent: { bg: COLORS.accentLight, text: COLORS.accent },
    green: { bg: COLORS.greenLight, text: COLORS.green },
    amber: { bg: COLORS.amberLight, text: "#92400E" },
    red: { bg: COLORS.redLight, text: COLORS.red },
    purple: { bg: COLORS.purpleLight, text: COLORS.purple },
  };
  const c = map[color] || map.accent;
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: size === "sm" ? "2px 8px" : "4px 12px",
      borderRadius: 20, fontSize: size === "sm" ? 11 : 12,
      fontWeight: 600, letterSpacing: 0.3, whiteSpace: "nowrap"
    }}>{children}</span>
  );
};

const Avatar = ({ name = "?", size = 32, color = COLORS.accent }) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "22", color, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      border: `1.5px solid ${color}44`
    }}>{initials}</div>
  );
};

const Card = ({ children, style = {}, hover = false }) => (
  <div style={{
    background: COLORS.card, borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.2s, transform 0.15s",
    ...style
  }}
    onMouseEnter={hover ? e => {
      e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)";
      e.currentTarget.style.transform = "translateY(-1px)";
    } : null}
    onMouseLeave={hover ? e => {
      e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    } : null}
  >{children}</div>
);

const Btn = ({ children, variant = "primary", onClick, style = {}, icon }) => {
  const styles = {
    primary: { background: COLORS.accent, color: "#fff", border: "none" },
    secondary: { background: "#F1F5F9", color: COLORS.text, border: "none" },
    ghost: { background: "transparent", color: COLORS.muted, border: `1px solid ${COLORS.border}` },
    danger: { background: COLORS.red, color: "#fff", border: "none" },
    success: { background: COLORS.green, color: "#fff", border: "none" },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant], borderRadius: 8, padding: "8px 16px",
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.15s, transform 0.1s", letterSpacing: 0.2,
      fontFamily: "inherit", ...style
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >{icon && <span>{icon}</span>}{children}</button>
  );
};

const Input = ({ placeholder, type = "text", icon, style = {} }) => (
  <div style={{ position: "relative", ...style }}>
    {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: COLORS.muted, fontSize: 14 }}>{icon}</span>}
    <input type={type} placeholder={placeholder} style={{
      width: "100%", padding: icon ? "9px 12px 9px 36px" : "9px 12px",
      border: `1.5px solid ${COLORS.border}`, borderRadius: 8,
      fontSize: 13, color: COLORS.text, background: COLORS.card,
      outline: "none", fontFamily: "inherit", boxSizing: "border-box",
      transition: "border-color 0.15s"
    }}
      onFocus={e => e.target.style.borderColor = COLORS.accent}
      onBlur={e => e.target.style.borderColor = COLORS.border}
    />
  </div>
);

// ─── SPARKLINE / MINI CHART ───────────────────────────────────────────────────
const Sparkline = ({ data, color, height = 48 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 120, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  const areaPath = `M0,${h} ${data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * (h - 8) - 4;
    return `L${x},${y}`;
  }).join(" ")} L${w},${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#g${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
};

// ─── BAR CHART ────────────────────────────────────────────────────────────────
const BarChart = ({ data, color = COLORS.accent, height = 160 }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, paddingTop: 12 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600 }}>{d.value}</div>
          <div style={{
            width: "100%", background: i === data.length - 1 ? color : color + "55",
            height: `${(d.value / max) * (height - 40)}px`,
            borderRadius: "4px 4px 0 0", transition: "height 0.3s"
          }} />
          <div style={{ fontSize: 10, color: COLORS.muted, textAlign: "center", lineHeight: 1.2 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
const DonutChart = ({ segments, size = 100 }) => {
  const total = segments.reduce((a, s) => a + s.value, 0);
  let offset = 0;
  const r = 38, cx = 50, cy = 50, circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {segments.map((s, i) => {
        const dash = (s.value / total) * circumference;
        const seg = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={s.color} strokeWidth="14"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset} strokeLinecap="butt"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50px 50px" }}
          />
        );
        offset += dash;
        return seg;
      })}
      <circle cx={cx} cy={cy} r={32} fill="white" />
    </svg>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ role, activePage, onNavigate }) => {
  const navItems = {
    director: [
      { id: "dashboard", icon: "⊞", label: "Dashboard" },
      { id: "teachers", icon: "👥", label: "Teachers" },
      { id: "classes", icon: "🏛", label: "Classes" },
      { id: "students-dir", icon: "🎓", label: "Students" },
      { id: "subjects", icon: "📚", label: "Subjects" },
      { id: "ranking", icon: "🏆", label: "Rankings" },
      { id: "reports", icon: "📊", label: "Reports" },
      { id: "settings", icon: "⚙", label: "Settings" },
    ],
    teacher: [
      { id: "teacher-dash", icon: "⊞", label: "Dashboard" },
      { id: "my-classes", icon: "🏛", label: "My Classes" },
      { id: "grades", icon: "✏", label: "Grade Entry" },
      { id: "students-t", icon: "🎓", label: "Students" },
      { id: "schedule", icon: "📅", label: "Schedule" },
    ],
    supervisor: [
      { id: "supervisor-dash", icon: "⊞", label: "Dashboard" },
      { id: "register", icon: "➕", label: "Registration" },
      { id: "reenroll", icon: "🔄", label: "Re-enrollment" },
      { id: "manage-students", icon: "🎓", label: "Manage Students" },
      { id: "reports-s", icon: "📊", label: "Reports" },
    ],
    student: [
      { id: "student-dash", icon: "⊞", label: "Dashboard" },
      { id: "report-card", icon: "📋", label: "Report Card" },
      { id: "trimester", icon: "📈", label: "Trimester Results" },
      { id: "history", icon: "🕐", label: "Academic History" },
      { id: "profile", icon: "👤", label: "My Profile" },
    ],
  };

  const items = navItems[role] || navItems.director;
  const roleLabels = { director: "Director", teacher: "Teacher", supervisor: "Supervisor", student: "Student" };
  const roleColors = { director: COLORS.accent, teacher: COLORS.green, supervisor: COLORS.purple, student: COLORS.amber };

  return (
    <div style={{
      width: 220, background: COLORS.sidebar, height: "100vh",
      display: "flex", flexDirection: "column", position: "fixed",
      left: 0, top: 0, zIndex: 100, userSelect: "none"
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${COLORS.accent}, #818CF8)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: "0 4px 12px rgba(79,103,255,0.35)"
          }}>🏫</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: 0.3 }}>EduManage</div>
            <div style={{ color: "#64748B", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", marginTop: 1 }}>School System</div>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div style={{ padding: "12px 20px" }}>
        <div style={{
          background: roleColors[role] + "22", border: `1px solid ${roleColors[role]}44`,
          borderRadius: 8, padding: "6px 12px", display: "inline-flex",
          alignItems: "center", gap: 6
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: roleColors[role] }} />
          <span style={{ color: roleColors[role], fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
            {roleLabels[role]}
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "4px 12px", overflow: "auto" }}>
        {items.map(item => (
          <div key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 10px", borderRadius: 8, cursor: "pointer",
            marginBottom: 2, transition: "background 0.15s",
            background: activePage === item.id ? "#1E293B" : "transparent",
            borderLeft: activePage === item.id ? `3px solid ${COLORS.accent}` : "3px solid transparent"
          }}
            onMouseEnter={e => { if (activePage !== item.id) e.currentTarget.style.background = "#1E293B88"; }}
            onMouseLeave={e => { if (activePage !== item.id) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span style={{
              color: activePage === item.id ? "#fff" : "#94A3B8",
              fontSize: 13, fontWeight: activePage === item.id ? 600 : 400
            }}>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom User */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #1E293B" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name="Marie Dupont" size={32} color={roleColors[role]} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Marie Dupont</div>
            <div style={{ color: "#64748B", fontSize: 11 }}>Logged in</div>
          </div>
          <span style={{ color: "#475569", fontSize: 14, cursor: "pointer" }}>⇥</span>
        </div>
      </div>
    </div>
  );
};

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
const Topbar = ({ title, subtitle }) => (
  <div style={{
    height: 60, background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 28px", position: "sticky", top: 0, zIndex: 50
  }}>
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 1 }}>{subtitle}</div>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Input placeholder="Search anything..." icon="🔍" style={{ width: 220 }} />
      <div style={{ position: "relative", cursor: "pointer" }}>
        <span style={{ fontSize: 20 }}>🔔</span>
        <div style={{
          position: "absolute", top: -4, right: -4, width: 16, height: 16,
          background: COLORS.red, borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700
        }}>3</div>
      </div>
      <Avatar name="Marie Dupont" size={34} />
    </div>
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, change, icon, color, data }) => (
  <Card hover style={{ padding: "20px 22px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>{value}</div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: change > 0 ? COLORS.green : COLORS.red, fontWeight: 700 }}>
            {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
          <span style={{ fontSize: 11, color: COLORS.muted }}>vs last term</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: color + "18", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 18
        }}>{icon}</div>
        {data && <Sparkline data={data} color={color} />}
      </div>
    </div>
  </Card>
);

// ════════════════════════════════════════════════════════════════════════════════
// PAGE: LOGIN
// ════════════════════════════════════════════════════════════════════════════════
const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState("director");
  const roles = [
    { id: "director", label: "Director", icon: "🏛", color: COLORS.accent },
    { id: "teacher", label: "Teacher", icon: "👩‍🏫", color: COLORS.green },
    { id: "supervisor", label: "Supervisor", icon: "🔍", color: COLORS.purple },
    { id: "student", label: "Student", icon: "🎓", color: COLORS.amber },
  ];
  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden"
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.accent}12 0%, transparent 70%)`
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.purple}10 0%, transparent 70%)`
      }} />

      <div style={{ display: "flex", gap: 48, maxWidth: 960, width: "100%", padding: 24, alignItems: "center" }}>
        {/* Left branding */}
        <div style={{ flex: 1, display: "none", flexDirection: "column", gap: 24 }} className="left-brand">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, fontSize: 24,
              background: `linear-gradient(135deg, ${COLORS.accent}, #818CF8)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 8px 24px ${COLORS.accent}40`
            }}>🏫</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>EduManage</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>School Management System</div>
            </div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.text, lineHeight: 1.2 }}>
            Manage your school<br />
            <span style={{ color: COLORS.accent }}>smarter</span> & faster.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["Complete grade & report card management", "Real-time academic performance tracking", "Multi-role access control"].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: COLORS.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</div>
                <span style={{ fontSize: 14, color: COLORS.muted }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <div style={{ flex: 1, maxWidth: 420, margin: "0 auto" }}>
          <Card style={{ padding: "36px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, margin: "0 auto 16px",
                background: `linear-gradient(135deg, ${COLORS.accent}, #818CF8)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, boxShadow: `0 8px 20px ${COLORS.accent}35`
              }}>🏫</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>Welcome back</div>
              <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Sign in to EduManage</div>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Sign in as</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {roles.map(r => (
                  <div key={r.id} onClick={() => setRole(r.id)} style={{
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                    border: `2px solid ${role === r.id ? r.color : COLORS.border}`,
                    background: role === r.id ? r.color + "0D" : "transparent",
                    display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s"
                  }}>
                    <span style={{ fontSize: 16 }}>{r.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: role === r.id ? 700 : 500, color: role === r.id ? r.color : COLORS.muted }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Email address</div>
                <Input placeholder="you@school.edu" type="email" icon="✉" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Password</div>
                  <div style={{ fontSize: 12, color: COLORS.accent, cursor: "pointer", fontWeight: 500 }}>Forgot password?</div>
                </div>
                <Input placeholder="••••••••" type="password" icon="🔒" />
              </div>

              <button onClick={() => onLogin(role)} style={{
                width: "100%", padding: "12px", background: `linear-gradient(135deg, ${COLORS.accent}, #818CF8)`,
                border: "none", borderRadius: 10, color: "#fff", fontSize: 14,
                fontWeight: 700, cursor: "pointer", letterSpacing: 0.3, fontFamily: "inherit",
                boxShadow: `0 4px 16px ${COLORS.accent}40`, marginTop: 4,
                transition: "opacity 0.15s, transform 0.1s"
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Sign in to EduManage
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: COLORS.muted }}>
              Demo credentials pre-filled · Select your role above
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// PAGE: DIRECTOR DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════
const DirectorDashboard = () => {
  const bestClasses = [
    { rank: 1, name: "6ème A", level: "6ème", avg: 16.4, students: 32, teacher: "M. Bernard" },
    { rank: 2, name: "4ème B", level: "4ème", avg: 15.8, students: 30, teacher: "Mme. Claire" },
    { rank: 3, name: "3ème A", level: "3ème", avg: 15.2, students: 28, teacher: "M. Dupuis" },
    { rank: 4, name: "5ème C", level: "5ème", avg: 14.9, students: 31, teacher: "Mme. Leclerc" },
    { rank: 5, name: "2nde A", level: "2nde", avg: 14.5, students: 29, teacher: "M. Martin" },
  ];

  const perf = [
    { label: "T1", value: 13.2 }, { label: "T2", value: 14.1 }, { label: "T3", value: 15.0 }
  ];
  const perfBars = [
    { label: "Math", value: 85 }, { label: "French", value: 78 }, { label: "Physics", value: 72 },
    { label: "History", value: 80 }, { label: "English", value: 88 }, { label: "Biology", value: 75 },
  ];

  const rankColors = ["#F59E0B", "#94A3B8", "#CD7C2F"];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.text }}>Good morning, Director 👋</div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Academic Year 2024–2025 · Trimester 2</div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Students" value="1,248" change={4.2} icon="🎓" color={COLORS.accent} data={[980, 1020, 1080, 1120, 1200, 1248]} />
        <StatCard label="Teachers" value="64" change={2.1} icon="👩‍🏫" color={COLORS.green} data={[58, 59, 60, 61, 63, 64]} />
        <StatCard label="Classes" value="38" change={0} icon="🏛" color={COLORS.purple} data={[36, 36, 37, 37, 38, 38]} />
        <StatCard label="School Average" value="14.3" change={1.8} icon="📊" color={COLORS.amber} data={[12.1, 12.8, 13.2, 13.9, 14.1, 14.3]} />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.8fr", gap: 16, marginBottom: 24 }}>
        {/* Bar chart */}
        <Card style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Subject Performance</div>
            <Badge color="accent">T2 2024–25</Badge>
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16 }}>Average class scores by subject (%)</div>
          <BarChart data={perfBars} height={160} />
        </Card>

        {/* Trimester trend */}
        <Card style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Trimester Progression</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 20 }}>School average evolution</div>
          {perf.map((p, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Trimester {i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: i === 2 ? COLORS.accent : COLORS.muted }}>{p.value}/20</span>
              </div>
              <div style={{ height: 8, background: COLORS.borderLight, borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4, width: `${(p.value / 20) * 100}%`,
                  background: i === 2 ? COLORS.accent : i === 1 ? COLORS.green : "#CBD5E1",
                  transition: "width 0.5s"
                }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20, padding: "12px", background: COLORS.accentLight, borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700 }}>📈 TREND</div>
            <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600, marginTop: 2 }}>+1.8 pts over the year</div>
          </div>
        </Card>

        {/* Distribution donut */}
        <Card style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Grade Distribution</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>By performance band</div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <DonutChart segments={[
              { value: 34, color: COLORS.green },
              { value: 42, color: COLORS.accent },
              { value: 16, color: COLORS.amber },
              { value: 8, color: COLORS.red },
            ]} size={110} />
          </div>
          {[
            { label: "Excellent (≥16)", pct: 34, color: COLORS.green },
            { label: "Good (12–15)", pct: 42, color: COLORS.accent },
            { label: "Average (10–11)", pct: 16, color: COLORS.amber },
            { label: "Failing (<10)", pct: 8, color: COLORS.red },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                <span style={{ fontSize: 11, color: COLORS.muted }}>{d.label}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.text }}>{d.pct}%</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Best Classes Ranking */}
      <Card style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>🏆 Best Classes Ranking</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Ranked by trimester average — Academic Year 2024–2025</div>
          </div>
          <Btn variant="ghost" icon="↓">Export</Btn>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              {["Rank", "Class", "Level", "Avg Score", "Students", "Main Teacher", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bestClasses.map((c, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8F9FF"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "14px 12px" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: i < 3 ? rankColors[i] + "22" : COLORS.borderLight,
                    fontSize: i < 3 ? 14 : 12, fontWeight: 800,
                    color: i < 3 ? rankColors[i] : COLORS.muted
                  }}>
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : c.rank}
                  </div>
                </td>
                <td style={{ padding: "14px 12px" }}><span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{c.name}</span></td>
                <td style={{ padding: "14px 12px" }}><Badge color="purple">{c.level}</Badge></td>
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: c.avg >= 15 ? COLORS.green : COLORS.amber }}>{c.avg}</span>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>/20</span>
                    <div style={{ height: 6, width: 60, background: COLORS.borderLight, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(c.avg / 20) * 100}%`, background: c.avg >= 15 ? COLORS.green : COLORS.amber, borderRadius: 3 }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 12px", fontSize: 13, color: COLORS.text }}>{c.students}</td>
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={c.teacher} size={24} color={COLORS.green} />
                    <span style={{ fontSize: 13, color: COLORS.text }}>{c.teacher}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 12px" }}><Badge color={c.avg >= 15 ? "green" : "amber"}>{c.avg >= 15 ? "Excellent" : "Good"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// PAGE: TEACHER MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════════
const TeacherManagement = () => {
  const teachers = [
    { name: "Marie Bernard", subject: "Mathematics", classes: ["6ème A", "5ème B"], avg: 15.2, status: "active" },
    { name: "Paul Dupuis", subject: "French", classes: ["4ème A", "3ème A"], avg: 14.8, status: "active" },
    { name: "Sophie Leclerc", subject: "Physics", classes: ["2nde B", "1ère A"], avg: 13.9, status: "active" },
    { name: "Jean Martin", subject: "History", classes: ["6ème B"], avg: 14.2, status: "leave" },
    { name: "Claire Moreau", subject: "Biology", classes: ["5ème A", "4ème B"], avg: 15.6, status: "active" },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>Teacher Management</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>64 teachers registered · 58 active</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" icon="⬆">Import</Btn>
          <Btn variant="primary" icon="＋">Add Teacher</Btn>
        </div>
      </div>

      {/* Search & filter bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Input placeholder="Search teachers..." icon="🔍" style={{ flex: 1, maxWidth: 320 }} />
        <select style={{ padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, color: COLORS.text, background: COLORS.card, fontFamily: "inherit", cursor: "pointer" }}>
          <option>All Subjects</option>
          <option>Mathematics</option>
          <option>French</option>
          <option>Physics</option>
        </select>
        <select style={{ padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, color: COLORS.text, background: COLORS.card, fontFamily: "inherit", cursor: "pointer" }}>
          <option>All Status</option>
          <option>Active</option>
          <option>On Leave</option>
        </select>
      </div>

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}`, background: "#FAFAFA" }}>
              {["Teacher", "Subject", "Assigned Classes", "Avg Score", "Status", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}`, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8F9FF"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar name={t.name} size={36} color={COLORS.accent} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>ID: TCH{String(i + 101).padStart(3, "0")}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 20px" }}><Badge color="purple">{t.subject}</Badge></td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {t.classes.map(c => <Badge key={c} color="accent">{c}</Badge>)}
                  </div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: t.avg >= 15 ? COLORS.green : COLORS.amber }}>{t.avg}</span>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>/20</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <Badge color={t.status === "active" ? "green" : "amber"}>
                    {t.status === "active" ? "Active" : "On Leave"}
                  </Badge>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="ghost" style={{ padding: "5px 10px", fontSize: 12 }}>View</Btn>
                    <Btn variant="secondary" style={{ padding: "5px 10px", fontSize: 12 }}>Edit</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// PAGE: TEACHER DASHBOARD – Grade Entry
// ════════════════════════════════════════════════════════════════════════════════
const TeacherDashboard = () => {
  const [selectedClass, setSelectedClass] = useState("6ème A");
  const [selectedSubject] = useState("Mathematics");

  const classes = ["6ème A", "5ème B", "4ème A"];
  const students = [
    { name: "Alice Martin", id: "STU001", t1: 15, t2: 16, t3: "", avg: 15.5 },
    { name: "Bob Lefèvre", id: "STU002", t1: 12, t2: 11, t3: "", avg: 11.5 },
    { name: "Clara Rousseau", id: "STU003", t1: 18, t2: 17, t3: "", avg: 17.5 },
    { name: "David Chen", id: "STU004", t1: 9, t2: 10, t3: "", avg: 9.5 },
    { name: "Emma Dubois", id: "STU005", t1: 14, t2: 15, t3: "", avg: 14.5 },
    { name: "Fabien Girard", id: "STU006", t1: 11, t2: 13, t3: "", avg: 12.0 },
  ];

  const getScoreColor = (v) => {
    if (!v && v !== 0) return COLORS.muted;
    if (v >= 16) return COLORS.green;
    if (v >= 12) return COLORS.accent;
    if (v >= 10) return COLORS.amber;
    return COLORS.red;
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>My Dashboard</div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>M. Bernard · Mathematics · T2 2024–25</div>
      </div>

      {/* Class Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {classes.map(c => (
          <Card key={c} hover style={{ padding: "18px 20px", cursor: "pointer", border: `2px solid ${selectedClass === c ? COLORS.accent : COLORS.border}` }}
            onClick={() => setSelectedClass(c)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: selectedClass === c ? COLORS.accent : COLORS.text }}>{c}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Mathematics · 32 students</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: selectedClass === c ? COLORS.accentLight : COLORS.borderLight,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
              }}>📐</div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>Class avg</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.green, marginTop: 2 }}>14.8</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>Pending</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.amber, marginTop: 2 }}>T3</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Grade Entry Table */}
      <Card>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Grade Entry — {selectedClass} · {selectedSubject}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Enter Trimester 3 grades below</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost">Cancel</Btn>
            <Btn variant="success" icon="💾">Save Grades</Btn>
          </div>
        </div>

        <div style={{ padding: "0 8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: `1px solid ${COLORS.border}` }}>
                {["Student", "ID", "Trimester 1", "Trimester 2", "Trimester 3 ✏", "Annual Avg", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={s.name} size={30} color={COLORS.accent} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: COLORS.muted }}>{s.id}</td>
                  {[s.t1, s.t2].map((g, j) => (
                    <td key={j} style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: 15, fontWeight: 800, color: getScoreColor(g),
                        background: getScoreColor(g) + "15", padding: "3px 10px", borderRadius: 6
                      }}>{g}/20</span>
                    </td>
                  ))}
                  <td style={{ padding: "14px 16px" }}>
                    <input type="number" min="0" max="20" placeholder="—" style={{
                      width: 70, padding: "7px 10px", border: `2px solid ${COLORS.accent}44`,
                      borderRadius: 8, fontSize: 14, fontWeight: 700, color: COLORS.text,
                      textAlign: "center", outline: "none", fontFamily: "inherit",
                      background: COLORS.accentLight,
                    }}
                      onFocus={e => e.target.style.borderColor = COLORS.accent}
                      onBlur={e => e.target.style.borderColor = COLORS.accent + "44"}
                    />
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: getScoreColor(s.avg) }}>{s.avg}/20</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Badge color={s.avg >= 12 ? (s.avg >= 15 ? "green" : "accent") : s.avg >= 10 ? "amber" : "red"}>
                      {s.avg >= 16 ? "Excellent" : s.avg >= 12 ? "Good" : s.avg >= 10 ? "Pass" : "Failing"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Footer row - class average */}
            <tfoot>
              <tr style={{ background: COLORS.accentLight, borderTop: `2px solid ${COLORS.accent}33` }}>
                <td colSpan={2} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 0.4 }}>Class Average</td>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 800, color: COLORS.accent }}>13.2/20</td>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 800, color: COLORS.accent }}>13.7/20</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.muted }}>—</td>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 800, color: COLORS.green }}>13.45/20</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// PAGE: SUPERVISOR DASHBOARD – Student Registration
// ════════════════════════════════════════════════════════════════════════════════
const SupervisorDashboard = () => {
  const [tab, setTab] = useState("registration");
  const tabs = [
    { id: "registration", label: "New Registration" },
    { id: "reenroll", label: "Re-enrollment" },
    { id: "manage", label: "Manage Students" },
  ];

  const students = [
    { name: "Lucas Petit", class: "6ème A", status: "enrolled", year: "2024", fees: "paid" },
    { name: "Manon Garnier", class: "5ème B", status: "re-enrolled", year: "2024", fees: "partial" },
    { name: "Nathan Girard", class: "4ème A", status: "enrolled", year: "2024", fees: "pending" },
    { name: "Océane Laurent", class: "3ème B", status: "enrolled", year: "2024", fees: "paid" },
  ];

  const feeColor = { paid: "green", partial: "amber", pending: "red" };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>Supervisor Dashboard</div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Student administration & enrollment management</div>
      </div>

      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "New This Year", value: "142", icon: "➕", color: COLORS.green },
          { label: "Re-enrolled", value: "1,106", icon: "🔄", color: COLORS.accent },
          { label: "Pending Fees", value: "38", icon: "⚠", color: COLORS.amber },
        ].map(s => (
          <Card key={s.label} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>{s.value}</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: COLORS.borderLight, padding: 4, borderRadius: 10, width: "fit-content" }}>
        {tabs.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t.id ? COLORS.card : "transparent",
            color: tab === t.id ? COLORS.text : COLORS.muted,
            boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s"
          }}>{t.label}</div>
        ))}
      </div>

      {tab === "registration" && (
        <Card style={{ padding: "28px 32px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>Register New Student</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "First Name", ph: "e.g. Marie" },
              { label: "Last Name", ph: "e.g. Dupont" },
              { label: "Date of Birth", ph: "DD/MM/YYYY", type: "date" },
              { label: "Place of Birth", ph: "e.g. Paris" },
              { label: "Parent/Guardian Name", ph: "e.g. Jean Dupont" },
              { label: "Contact Phone", ph: "+33 6 XX XX XX XX" },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{f.label}</div>
                <Input placeholder={f.ph} type={f.type || "text"} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Assign Class</div>
              <select style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, color: COLORS.text, background: COLORS.card, fontFamily: "inherit" }}>
                <option>Select class...</option>
                <option>6ème A</option>
                <option>6ème B</option>
                <option>5ème A</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Academic Year</div>
              <select style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, color: COLORS.text, background: COLORS.card, fontFamily: "inherit" }}>
                <option>2024–2025</option>
                <option>2025–2026</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 20, padding: "12px 16px", background: COLORS.borderLight, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>📎</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Upload Documents</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>Birth certificate, previous report card, health record</div>
            </div>
            <Btn variant="ghost" style={{ fontSize: 12 }}>Browse</Btn>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn variant="ghost">Cancel</Btn>
            <Btn variant="primary" icon="✓">Register Student</Btn>
          </div>
        </Card>
      )}

      {tab === "manage" && (
        <Card>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", gap: 12 }}>
            <Input placeholder="Search students..." icon="🔍" style={{ flex: 1 }} />
            <Btn variant="ghost">Filter</Btn>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAFA" }}>
                {["Student", "Class", "Year", "Status", "Fees", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={s.name} size={30} color={COLORS.purple} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}><Badge color="accent">{s.class}</Badge></td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: COLORS.muted }}>{s.year}–{parseInt(s.year) + 1}</td>
                  <td style={{ padding: "14px 20px" }}><Badge color="green">{s.status}</Badge></td>
                  <td style={{ padding: "14px 20px" }}><Badge color={feeColor[s.fees]}>{s.fees}</Badge></td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn variant="ghost" style={{ padding: "5px 10px", fontSize: 12 }}>View</Btn>
                      <Btn variant="secondary" style={{ padding: "5px 10px", fontSize: 12 }}>Edit</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "reenroll" && (
        <Card style={{ padding: "24px 28px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Re-enrollment — 2025–2026</div>
          <div style={{ padding: "16px", background: COLORS.amberLight, borderRadius: 10, border: `1px solid ${COLORS.amber}40`, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>⚠ Re-enrollment period: Jan 15 – Feb 28, 2025</div>
            <div style={{ fontSize: 12, color: "#B45309", marginTop: 4 }}>1,106 students eligible for re-enrollment. 342 remaining.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Search Student</div>
              <Input placeholder="Name or student ID..." icon="🔍" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Current Class</div>
              <select style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, color: COLORS.text, background: COLORS.card, fontFamily: "inherit" }}>
                <option>6ème A</option>
                <option>5ème A</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Next Year Class</div>
              <select style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, color: COLORS.text, background: COLORS.card, fontFamily: "inherit" }}>
                <option>Promote to 5ème A</option>
                <option>Promote to 5ème B</option>
                <option>Repeat year</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Decision</div>
              <select style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, color: COLORS.text, background: COLORS.card, fontFamily: "inherit" }}>
                <option>✅ Promoted</option>
                <option>🔄 Repeating</option>
                <option>❌ Excluded</option>
                <option>➡ Transferred</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn variant="ghost">Cancel</Btn>
            <Btn variant="primary" icon="🔄">Confirm Re-enrollment</Btn>
          </div>
        </Card>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// PAGE: STUDENT DASHBOARD + REPORT CARD
// ════════════════════════════════════════════════════════════════════════════════
const StudentDashboard = ({ page }) => {
  const results = [
    { subject: "Mathematics", t1: 15, t2: 16, t3: 14, coeff: 4, rank: 3 },
    { subject: "French Language", t1: 12, t2: 13, t3: 14, coeff: 4, rank: 8 },
    { subject: "Physics & Chemistry", t1: 14, t2: 15, t3: 13, coeff: 3, rank: 5 },
    { subject: "History & Geography", t1: 11, t2: 12, t3: 12, coeff: 3, rank: 12 },
    { subject: "English", t1: 17, t2: 18, t3: 16, coeff: 2, rank: 1 },
    { subject: "Biology", t1: 13, t2: 14, t3: 15, coeff: 2, rank: 6 },
    { subject: "Sports (EPS)", t1: 16, t2: 16, t3: 17, coeff: 1, rank: 4 },
  ];

  const getAvg = (r) => ((r.t1 + r.t2 + r.t3) / 3).toFixed(1);
  const getWeighted = (r) => (((r.t1 + r.t2 + r.t3) / 3) * r.coeff);
  const totalCoeff = results.reduce((a, r) => a + r.coeff, 0);
  const totalWeighted = results.reduce((a, r) => a + getWeighted(r), 0);
  const overallAvg = (totalWeighted / totalCoeff).toFixed(2);

  const getGradeColor = (v) => {
    const n = parseFloat(v);
    if (n >= 16) return COLORS.green;
    if (n >= 12) return COLORS.accent;
    if (n >= 10) return COLORS.amber;
    return COLORS.red;
  };

  if (page === "report-card") {
    return (
      <div style={{ padding: "28px 32px", maxWidth: 900 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>Report Card</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Academic Year 2024–2025 · Annual Summary</div>
          </div>
          <Btn variant="primary" icon="⬇">Download PDF</Btn>
        </div>

        {/* Student info card */}
        <Card style={{ padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Avatar name="Alice Martin" size={56} color={COLORS.accent} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>Alice Martin</div>
              <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
                <div><span style={{ fontSize: 11, color: COLORS.muted }}>Class: </span><span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>6ème A</span></div>
                <div><span style={{ fontSize: 11, color: COLORS.muted }}>ID: </span><span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>STU001</span></div>
                <div><span style={{ fontSize: 11, color: COLORS.muted }}>Year: </span><span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>2024–2025</span></div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>Annual Average</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: getGradeColor(overallAvg), lineHeight: 1.1 }}>{overallAvg}</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>/20</div>
              <Badge color="green" size="lg">Promoted ✓</Badge>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>Class Rank</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.amber, lineHeight: 1.1 }}>3<sup style={{ fontSize: 14 }}>rd</sup></div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>/ 32 students</div>
            </div>
          </div>
        </Card>

        {/* Grades table */}
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}` }}>
                {["Subject", "Coeff.", "T1", "T2", "T3", "Annual Avg", "Class Rank"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const avg = getAvg(r);
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: COLORS.text }}>{r.subject}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: COLORS.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: COLORS.accent }}>{r.coeff}</div>
                    </td>
                    {[r.t1, r.t2, r.t3].map((g, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: getGradeColor(g) }}>{g}</span>
                        <span style={{ fontSize: 11, color: COLORS.muted }}>/20</span>
                      </td>
                    ))}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: getGradeColor(avg) }}>{avg}</span>
                        <div style={{ height: 5, width: 50, background: COLORS.borderLight, borderRadius: 3 }}>
                          <div style={{ height: "100%", width: `${(parseFloat(avg) / 20) * 100}%`, background: getGradeColor(avg), borderRadius: 3 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {r.rank <= 3 && <span>{["🥇", "🥈", "🥉"][r.rank - 1]}</span>}
                        <span style={{ fontSize: 13, fontWeight: 700, color: r.rank <= 3 ? COLORS.amber : COLORS.muted }}>{r.rank}/{32}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: COLORS.accentLight, borderTop: `2px solid ${COLORS.accent}44` }}>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 800, color: COLORS.accent }}>OVERALL</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 800, color: COLORS.accent }}>{totalCoeff}</td>
                <td colSpan={3} />
                <td style={{ padding: "14px 16px", fontSize: 18, fontWeight: 900, color: getGradeColor(overallAvg) }}>{overallAvg}/20</td>
                <td style={{ padding: "14px 16px" }}><Badge color="amber">3rd / 32</Badge></td>
              </tr>
            </tfoot>
          </table>
        </Card>

        {/* Teacher comments */}
        <Card style={{ padding: "20px 24px", marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Teacher's Appreciation</div>
          <div style={{ padding: "14px 16px", background: COLORS.borderLight, borderRadius: 10, borderLeft: `3px solid ${COLORS.accent}` }}>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>Class Teacher · M. Bernard</div>
            <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
              Alice demonstrates excellent academic aptitude with remarkable consistency across all subjects. Her engagement in class discussions and diligent work ethic are commendable. Keep up this outstanding performance!
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Student home dashboard
  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>Hello, Alice! 👋</div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>6ème A · Academic Year 2024–2025</div>
      </div>

      {/* Overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Overall Average", value: overallAvg, unit: "/20", color: COLORS.accent },
          { label: "Class Rank", value: "3rd", unit: "/ 32", color: COLORS.amber },
          { label: "Best Subject", value: "English", unit: "18/20", color: COLORS.green },
          { label: "Attendance", value: "97%", unit: "Present", color: COLORS.purple },
        ].map(s => (
          <Card key={s.label} hover style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{s.unit}</div>
          </Card>
        ))}
      </div>

      {/* Quick grade overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        <Card style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Subject Overview</div>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 12, width: 140, color: COLORS.text, fontWeight: 500 }}>{r.subject}</div>
              <div style={{ flex: 1, height: 8, background: COLORS.borderLight, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(parseFloat(getAvg(r)) / 20) * 100}%`, background: getGradeColor(getAvg(r)), borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: getGradeColor(getAvg(r)), width: 36, textAlign: "right" }}>{getAvg(r)}</div>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Academic History</div>
            {[
              { year: "2024–25", avg: overallAvg, class: "6ème A", rank: "3/32" },
              { year: "2023–24", avg: "13.45", class: "CM2", rank: "5/28" },
              { year: "2022–23", avg: "12.80", class: "CM1", rank: "7/30" },
            ].map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${COLORS.borderLight}` : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{h.year}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{h.class} · Rank {h.rank}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: getGradeColor(h.avg) }}>{h.avg}</div>
              </div>
            ))}
          </Card>

          <Card style={{ padding: "16px 20px", background: `linear-gradient(135deg, ${COLORS.accent}0A, ${COLORS.purple}0A)`, border: `1px solid ${COLORS.accent}22` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, marginBottom: 6 }}>🏆 ACHIEVEMENT</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Top 10% in English</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Ranked 1st in class · T2 2024–25</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// PAGE: CLASS RANKING
// ════════════════════════════════════════════════════════════════════════════════
const ClassRanking = () => {
  const classes = [
    { rank: 1, name: "6ème A", avg: 16.4, students: 32, best: "Emma Dupont", bestAvg: 18.5, level: "6ème" },
    { rank: 2, name: "4ème B", avg: 15.8, students: 30, best: "Lucas Martin", bestAvg: 17.9, level: "4ème" },
    { rank: 3, name: "3ème A", avg: 15.2, students: 28, best: "Sofia Leroy", bestAvg: 18.1, level: "3ème" },
    { rank: 4, name: "5ème C", avg: 14.9, students: 31, best: "Noah Garnier", bestAvg: 17.4, level: "5ème" },
    { rank: 5, name: "2nde A", avg: 14.5, students: 29, best: "Chloé Durand", bestAvg: 16.8, level: "2nde" },
    { rank: 6, name: "1ère B", avg: 13.9, students: 27, best: "Tom Petit", bestAvg: 16.2, level: "1ère" },
  ];
  const rankColors = [COLORS.amber, "#94A3B8", "#CD7C2F"];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>🏆 Class Ranking</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Best performing classes by annual average — 2024–2025</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select style={{ padding: "8px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>
            <option>All Levels</option>
            <option>6ème</option>
            <option>5ème</option>
          </select>
          <Btn variant="ghost" icon="↓">Export</Btn>
        </div>
      </div>

      {/* Podium top 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 16, marginBottom: 24, alignItems: "flex-end" }}>
        {[classes[1], classes[0], classes[2]].map((c, i) => {
          const isTop = i === 1;
          const podiumColors = [rankColors[1], rankColors[0], rankColors[2]];
          const ranks = [2, 1, 3];
          return (
            <Card key={c.name} style={{
              padding: isTop ? "24px 24px 28px" : "20px 20px 20px",
              textAlign: "center",
              border: `2px solid ${isTop ? COLORS.amber + "60" : COLORS.border}`,
              background: isTop ? `linear-gradient(180deg, ${COLORS.amber}0A 0%, transparent 100%)` : COLORS.card,
              transform: isTop ? "translateY(-8px)" : "none"
            }}>
              <div style={{ fontSize: isTop ? 36 : 28, marginBottom: 8 }}>{["🥈", "🥇", "🥉"][i]}</div>
              <div style={{ fontSize: isTop ? 20 : 17, fontWeight: 900, color: COLORS.text }}>{c.name}</div>
              <Badge color="purple" size="sm">{c.level}</Badge>
              <div style={{ fontSize: isTop ? 32 : 26, fontWeight: 900, color: podiumColors[i], margin: "12px 0 4px" }}>{c.avg}</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>Class Average /20</div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: COLORS.borderLight, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: COLORS.muted }}>Top Student</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginTop: 2 }}>{c.best} · {c.bestAvg}/20</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full ranking table */}
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAFAFA", borderBottom: `1px solid ${COLORS.border}` }}>
              {["Rank", "Class", "Level", "Average", "Students", "Top Student", "Trend"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.map((c, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8F9FF"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: i < 3 ? 20 : 14, fontWeight: 800, color: i < 3 ? rankColors[i] : COLORS.muted }}>
                      {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${c.rank}`}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 15, fontWeight: 800, color: COLORS.text }}>{c.name}</td>
                <td style={{ padding: "16px 20px" }}><Badge color="purple">{c.level}</Badge></td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: c.avg >= 15 ? COLORS.green : COLORS.amber }}>{c.avg}</span>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>/20</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontSize: 13, color: COLORS.muted }}>{c.students} students</td>
                <td style={{ padding: "16px 20px" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{c.best}</div>
                    <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 700 }}>{c.bestAvg}/20</div>
                  </div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <Sparkline data={[c.avg - 1.2, c.avg - 0.8, c.avg - 0.3, c.avg]} color={COLORS.green} height={32} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// PAGE: STUDENT PROFILE
// ════════════════════════════════════════════════════════════════════════════════
const StudentProfile = () => (
  <div style={{ padding: "28px 32px", maxWidth: 900 }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>Student Profile</div>
      <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Full academic record & personal information</div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
      {/* Profile Card */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ padding: "24px", textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accent}, #818CF8)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, margin: "0 auto 12px",
            boxShadow: `0 8px 24px ${COLORS.accent}30`
          }}>AM</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>Alice Martin</div>
          <div style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 12px" }}>Student ID: STU001</div>
          <Badge color="green" size="lg">Active · 6ème A</Badge>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Date of Birth", value: "March 12, 2012" },
              { label: "Age", value: "13 years" },
              { label: "Enrolled", value: "Sept 2024" },
            ].map(f => (
              <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <span style={{ fontSize: 12, color: COLORS.muted }}>{f.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{f.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <Btn variant="primary" style={{ flex: 1, justifyContent: "center" }}>Edit</Btn>
            <Btn variant="ghost" style={{ flex: 1, justifyContent: "center" }}>Print</Btn>
          </div>
        </Card>

        <Card style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Parent / Guardian</div>
          {[
            { label: "Name", value: "Jean Martin" },
            { label: "Phone", value: "+33 6 12 34 56 78" },
            { label: "Email", value: "j.martin@email.fr" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: COLORS.muted }}>{f.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{f.value}</div>
            </div>
          ))}
        </Card>
      </div>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Academic Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "Annual Average", value: "14.8/20", color: COLORS.accent },
              { label: "Class Rank", value: "3 / 32", color: COLORS.amber },
              { label: "Attendance", value: "97.2%", color: COLORS.green },
            ].map(s => (
              <div key={s.label} style={{ padding: "14px", background: COLORS.borderLight, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>Enrollment History</div>
          {[
            { year: "2024–25", class: "6ème A", avg: "14.8", decision: "Current", color: "accent" },
            { year: "2023–24", class: "CM2", avg: "13.5", decision: "Promoted", color: "green" },
            { year: "2022–23", class: "CM1", avg: "12.8", decision: "Promoted", color: "green" },
          ].map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${COLORS.borderLight}` : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.borderLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: COLORS.muted }}>{h.year.slice(2, 4)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{h.year} · {h.class}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>Annual average: {h.avg}/20</div>
              </div>
              <Badge color={h.color}>{h.decision}</Badge>
            </div>
          ))}
        </Card>

        <Card style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>Achievements & Notes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "🏆", text: "1st in English — T2 2024–25", color: COLORS.amber },
              { icon: "⭐", text: "Honor Roll — T1 & T2 2024–25", color: COLORS.green },
              { icon: "📖", text: "Reading Excellence Award 2023", color: COLORS.accent },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: a.color + "0D", borderRadius: 8, border: `1px solid ${a.color}22` }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{a.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("director");
  const [page, setPage] = useState("dashboard");

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    const defaultPages = { director: "dashboard", teacher: "teacher-dash", supervisor: "supervisor-dash", student: "student-dash" };
    setPage(defaultPages[selectedRole]);
    setIsLoggedIn(true);
  };

  const handleNavigate = (p) => setPage(p);

  const getTitle = (p) => ({
    dashboard: "Dashboard", teachers: "Teacher Management", classes: "Class Management",
    ranking: "Class Rankings", "teacher-dash": "My Dashboard", grades: "Grade Entry",
    "supervisor-dash": "Supervisor Dashboard", "student-dash": "My Dashboard",
    "report-card": "Report Card", trimester: "Trimester Results", history: "Academic History",
    profile: "My Profile", "manage-students": "Manage Students",
  }[p] || "EduManage");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DirectorDashboard />;
      case "teachers": return <TeacherManagement />;
      case "teacher-dash":
      case "grades":
      case "my-classes": return <TeacherDashboard />;
      case "supervisor-dash":
      case "register":
      case "reenroll":
      case "manage-students": return <SupervisorDashboard />;
      case "student-dash":
      case "trimester":
      case "history": return <StudentDashboard page={page} />;
      case "report-card": return <StudentDashboard page="report-card" />;
      case "ranking": return <ClassRanking />;
      case "profile": return <StudentProfile />;
      default: return <DirectorDashboard />;
    }
  };

  if (!isLoggedIn) return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <LoginPage onLogin={handleLogin} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: COLORS.bg, minHeight: "100vh" }}>
      <Sidebar role={role} activePage={page} onNavigate={handleNavigate} />
      <div style={{ marginLeft: 220 }}>
        <Topbar title={getTitle(page)} subtitle="EduManage · School Management System" />
        <div style={{ minHeight: "calc(100vh - 60px)", overflowY: "auto" }}>
          {renderPage()}
        </div>
      </div>

      {/* Role switcher for demo */}
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        background: COLORS.sidebar, borderRadius: 14, padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)", border: "1px solid #1E293B"
      }}>
        <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontWeight: 700 }}>Switch Role</div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "director", icon: "🏛", color: COLORS.accent },
            { id: "teacher", icon: "👩‍🏫", color: COLORS.green },
            { id: "supervisor", icon: "🔍", color: COLORS.purple },
            { id: "student", icon: "🎓", color: COLORS.amber },
          ].map(r => (
            <div key={r.id} onClick={() => handleLogin(r.id)} style={{
              width: 36, height: 36, borderRadius: 8, cursor: "pointer",
              background: role === r.id ? r.color + "30" : "#1E293B",
              border: `2px solid ${role === r.id ? r.color : "transparent"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              transition: "all 0.15s"
            }} title={r.id.charAt(0).toUpperCase() + r.id.slice(1)}>{r.icon}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
