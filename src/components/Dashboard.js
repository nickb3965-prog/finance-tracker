* { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* THEMES */
.theme-dark {
  --bg: #0a0c12;
  --sidebar: #10121a;
  --card: #10121a;
  --border: #1e2130;
  --text: #e0e0e0;
  --text-muted: #555;
  --nav-active: #1a1d27;
  --input-bg: #0a0c12;
  --metric-bg: #10121a;
}

.theme-light {
  --bg: #f0f2f8;
  --sidebar: #ffffff;
  --card: #ffffff;
  --border: #e0e4ef;
  --text: #1a1d27;
  --text-muted: #888;
  --nav-active: #f0f2f8;
  --input-bg: #f8f9fc;
  --metric-bg: #ffffff;
}

.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  position: relative;
  transition: background 0.3s;
}

/* PATTERN OVERLAYS */
.app::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.pattern-dots::before {
  background-image: radial-gradient(circle, #ffffff18 1px, transparent 1px);
  background-size: 22px 22px;
}

.pattern-grid::before {
  background-image:
    linear-gradient(#ffffff0a 1px, transparent 1px),
    linear-gradient(90deg, #ffffff0a 1px, transparent 1px);
  background-size: 30px 30px;
}

.pattern-topo::before {
  background-image:
    repeating-radial-gradient(circle at 20% 30%, transparent 0, transparent 18px, #ffffff08 18px, #ffffff08 19px),
    repeating-radial-gradient(circle at 70% 70%, transparent 0, transparent 24px, #ffffff06 24px, #ffffff06 25px);
}

.pattern-diagonal::before {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 12px,
    #ffffff07 12px,
    #ffffff07 13px
  );
}

.pattern-hex::before {
  background-image:
    radial-gradient(circle at 0% 50%, transparent 20px, #ffffff06 21px, transparent 22px),
    radial-gradient(circle at 100% 50%, transparent 20px, #ffffff06 21px, transparent 22px);
  background-size: 40px 40px;
}

.pattern-circuit::before {
  background-image:
    linear-gradient(#ffffff08 2px, transparent 2px),
    linear-gradient(90deg, #ffffff08 2px, transparent 2px),
    linear-gradient(#ffffff04 1px, transparent 1px),
    linear-gradient(90deg, #ffffff04 1px, transparent 1px);
  background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px;
}

.pattern-concrete::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23ffffff03'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23ffffff08'/%3E%3Ccircle cx='3' cy='3' r='0.5' fill='%23ffffff05'/%3E%3C/svg%3E");
  background-size: 4px 4px;
}

.pattern-linen::before {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    #ffffff04 2px,
    #ffffff04 3px
  ), repeating-linear-gradient(
    90deg,
    transparent,
    transparent 4px,
    #ffffff03 4px,
    #ffffff03 5px
  );
}

/* GRADIENT BACKGROUNDS */
.pattern-gradient-sunset { background: linear-gradient(135deg, #1a0020 0%, #3d0015 25%, #6b1a00 50%, #0a0c12 80%) !important; }
.pattern-gradient-ocean { background: linear-gradient(135deg, #001a3d 0%, #003366 30%, #006680 60%, #0a0c12 90%) !important; }
.pattern-gradient-forest { background: linear-gradient(135deg, #001a0a 0%, #003320 30%, #005533 60%, #0a0c12 90%) !important; }
.pattern-gradient-aurora { background: linear-gradient(135deg, #001a1a 0%, #003344 25%, #1a0044 55%, #440022 80%, #0a0c12 100%) !important; }
.pattern-gradient-midnight { background: linear-gradient(135deg, #000033 0%, #110033 40%, #220044 70%, #0a0c12 100%) !important; }
.pattern-gradient-volcano { background: linear-gradient(135deg, #1a0000 0%, #3d0a00 30%, #660000 55%, #2d1a00 80%, #0a0c12 100%) !important; }
.pattern-gradient-rose { background: linear-gradient(135deg, #1a0010 0%, #3d0020 30%, #551a33 55%, #2d0a1a 80%, #0a0c12 100%) !important; }

/* MOBILE TOPBAR */
.mobile-topbar {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 52px;
  background: var(--sidebar);
  border-bottom: 1px solid var(--border);
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 100;
}

.hamburger {
  background: none;
  border: none;
  color: var(--text);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 150;
}

/* SIDEBAR */
.sidebar {
  width: 200px;
  min-width: 200px;
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 24px 12px;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.logo {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  padding: 0 10px;
  margin-bottom: 24px;
}

.desktop-only { display: block; }

.nav-btn {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.nav-btn:hover { background: var(--nav-active); color: var(--text); }
.nav-btn.active { background: var(--nav-active); color: var(--text); font-weight: 500; }

/* MAIN */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title { font-size: 20px; font-weight: 600; color: var(--text); text-transform: capitalize; }
.topbar-date { font-size: 12px; color: var(--text-muted); }

/* METRICS */
.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.metric {
  background: var(--metric-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
}

.metric-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.metric-value { font-size: 22px; font-weight: 600; }
.green { color: #1D9E75; }
.red { color: #E24B4A; }
.blue { color: #378ADD; }

/* OVERVIEW */
.overview { display: flex; flex-direction: column; gap: 14px; flex: 1; overflow: hidden; }
.overview-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; overflow: hidden; }

/* TAB CONTENT */
.tab-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.tab-content.single { grid-template-columns: 1fr; }

/* CARDS */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.card-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.empty {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  padding: 24px 0;
}

.list { flex: 1; overflow-y: auto; margin-bottom: 12px; min-height: 0; }
.list::-webkit-scrollbar { width: 4px; }
.list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

.entry-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}

.entry-label { color: var(--text); }
.entry-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

/* FORM */
.form-row { display: flex; gap: 6px; flex-wrap: wrap; flex-shrink: 0; }

.form-row input, .form-row select {
  flex: 1;
  min-width: 80px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--text);
  font-size: 12px;
  outline: none;
}

.form-row input:focus, .form-row select:focus { border-color: #378ADD; }

.add-btn {
  padding: 7px 14px;
  border-radius: 8px;
  border: none;
  background: #1D9E75;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.add-btn:hover { background: #17835f; }

.delete-btn {
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  font-size: 11px;
  padding: 2px 5px;
  border-radius: 4px;
  transition: all 0.15s;
}

.delete-btn:hover { color: #E24B4A; background: rgba(226,75,74,0.1); }

/* GOALS */
.goal-bar { background: var(--border); border-radius: 99px; height: 6px; margin-top: 6px; overflow: hidden; flex-shrink: 0; }
.goal-fill { height: 100%; border-radius: 99px; transition: width 0.4s; }

/* TRANSACTIONS */
.tx-form { flex-shrink: 0; margin-bottom: 8px; }
.tx-type-row { display: flex; gap: 8px; margin-bottom: 10px; }

.tx-type-btn {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.tx-type-btn.active-add { background: rgba(29,158,117,0.15); border-color: #1D9E75; color: #1D9E75; font-weight: 500; }
.tx-type-btn.active-remove { background: rgba(226,75,74,0.15); border-color: #E24B4A; color: #E24B4A; font-weight: 500; }

/* CUSTOMIZE */
.theme-row { display: flex; gap: 10px; margin-bottom: 8px; flex-shrink: 0; }

.theme-btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.theme-btn.active { border-color: #378ADD; color: #378ADD; background: rgba(55,138,221,0.1); font-weight: 500; }

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.pattern-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px 6px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-muted);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.pattern-btn.active { border-color: #378ADD; color: #378ADD; background: rgba(55,138,221,0.08); }
.pattern-btn:hover { border-color: var(--text-muted); }

.pattern-preview {
  width: 100%;
  height: 36px;
  border-radius: 6px;
  background: #1a1d27;
}

/* PATTERN PREVIEWS */
.pattern-preview-dots { background: radial-gradient(circle, #ffffff44 1px, transparent 1px) #1a1d27; background-size: 8px 8px; }
.pattern-preview-grid { background-image: linear-gradient(#ffffff33 1px, transparent 1px), linear-gradient(90deg, #ffffff33 1px, transparent 1px); background-size: 8px 8px; background-color: #1a1d27; }
.pattern-preview-topo { background: repeating-radial-gradient(circle at 30% 40%, transparent 0, transparent 6px, #ffffff22 6px, #ffffff22 7px) #1a1d27; }
.pattern-preview-diagonal { background: repeating-linear-gradient(45deg, transparent, transparent 4px, #ffffff22 4px, #ffffff22 5px) #1a1d27; }
.pattern-preview-hex { background: radial-gradient(circle at 0% 50%, transparent 8px, #ffffff22 9px, transparent 10px) #1a1d27; background-size: 16px 16px; }
.pattern-preview-circuit { background-image: linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px); background-size: 12px 12px; background-color: #1a1d27; }
.pattern-preview-concrete { background: #2a2d35; }
.pattern-preview-linen { background: repeating-linear-gradient(0deg, transparent, transparent 1px, #ffffff11 1px, #ffffff11 2px) #1a1d27; }
.pattern-preview-none { background: #1a1d27; }

/* GRADIENT PREVIEWS */
.pattern-preview-gradient-sunset { background: linear-gradient(135deg, #6b1a00, #3d0015, #1a0020); }
.pattern-preview-gradient-ocean { background: linear-gradient(135deg, #006680, #003366, #001a3d); }
.pattern-preview-gradient-forest { background: linear-gradient(135deg, #005533, #003320, #001a0a); }
.pattern-preview-gradient-aurora { background: linear-gradient(135deg, #440022, #1a0044, #003344, #001a1a); }
.pattern-preview-gradient-midnight { background: linear-gradient(135deg, #220044, #110033, #000033); }
.pattern-preview-gradient-volcano { background: linear-gradient(135deg, #660000, #3d0a00, #1a0000); }
.pattern-preview-gradient-rose { background: linear-gradient(135deg, #551a33, #3d0020, #1a0010); }

/* MOBILE */
@media (max-width: 768px) {
  .mobile-topbar { display: flex; }
  .app { flex-direction: column; padding-top: 52px; }

  .sidebar {
    position: fixed;
    top: 52px; left: 0; bottom: 0;
    width: 220px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 200;
    padding-top: 16px;
  }

  .sidebar.open { transform: translateX(0); }
  .desktop-only { display: none; }

  .main { padding: 16px; gap: 12px; overflow-y: auto; height: calc(100vh - 52px); }
  .metrics { grid-template-columns: repeat(2, 1fr); }
  .overview-charts { grid-template-columns: 1fr; overflow: visible; }
  .tab-content { grid-template-columns: 1fr; overflow: visible; }
  .topbar-date { display: none; }
  .metric-value { font-size: 18px; }
  .pattern-grid { grid-template-columns: repeat(3, 1fr); }
}