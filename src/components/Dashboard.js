import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import './Dashboard.css';

const COLORS = ['#1D9E75', '#E24B4A', '#378ADD', '#EF9F27', '#9B59B6'];

const defaultBalanceHistory = [
  { month: 'Jan', balance: 4200 },
  { month: 'Feb', balance: 4800 },
  { month: 'Mar', balance: 5100 },
  { month: 'Apr', balance: 4900 },
  { month: 'May', balance: 5500 },
  { month: 'Jun', balance: 6200 },
  { month: 'Jul', balance: 7000 },
  { month: 'Aug', balance: 7800 },
];

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

export default function Dashboard() {
  const [income, setIncome] = useLocalStorage('fm_income', [
    { id: 1, label: 'Salary', amt: 3500 },
    { id: 2, label: 'Freelance', amt: 400 }
  ]);
  const [expenses, setExpenses] = useLocalStorage('fm_expenses', [
    { id: 1, label: 'Rent', amt: 1200 },
    { id: 2, label: 'Groceries', amt: 350 },
    { id: 3, label: 'Transport', amt: 150 }
  ]);
  const [accounts, setAccounts] = useLocalStorage('fm_accounts', [
    { id: 1, label: 'Chequing', amt: 2800 },
    { id: 2, label: 'Savings', amt: 5200 }
  ]);
  const [goals, setGoals] = useLocalStorage('fm_goals', [
    { id: 1, label: 'Emergency Fund', saved: 3000, target: 5000 },
    { id: 2, label: 'Vacation', saved: 800, target: 2000 }
  ]);
  const [balanceHistory, setBalanceHistory] = useLocalStorage('fm_history', defaultBalanceHistory);
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [incomeForm, setIncomeForm] = useState({ label: '', amt: '' });
  const [expenseForm, setExpenseForm] = useState({ label: '', amt: '' });
  const [accountForm, setAccountForm] = useState({ label: '', amt: '' });
  const [goalForm, setGoalForm] = useState({ label: '', saved: '', target: '' });
  const [balForm, setBalForm] = useState({ month: '', balance: '' });

  const totalIncome = income.reduce((s, e) => s + e.amt, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amt, 0);
  const netFlow = totalIncome - totalExpenses;
  const totalBalance = accounts.reduce((s, e) => s + e.amt, 0);
  const fmt = (n) => '$' + Number(n).toLocaleString();

  const tabs = ['overview', 'income', 'expenses', 'accounts', 'goals'];
  const icons = { overview: '⬛', income: '📈', expenses: '📉', accounts: '🏦', goals: '🎯' };

  const switchTab = (tab) => { setActiveTab(tab); setMenuOpen(false); };

  return (
    <div className="app">
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <div className="logo">💰 FinanceMe</div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar / mobile drawer */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="logo desktop-only">💰 FinanceMe</div>
        <nav>
          {tabs.map(tab => (
            <button key={tab} className={`nav-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => switchTab(tab)}>
              {icons[tab]} {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <h1 className="page-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="topbar-date">{new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="overview">
            <div className="metrics">
              <div className="metric"><div className="metric-label">Monthly Income</div><div className="metric-value green">{fmt(totalIncome)}</div></div>
              <div className="metric"><div className="metric-label">Monthly Expenses</div><div className="metric-value red">{fmt(totalExpenses)}</div></div>
              <div className="metric"><div className="metric-label">Net Cash Flow</div><div className={`metric-value ${netFlow >= 0 ? 'green' : 'red'}`}>{fmt(netFlow)}</div></div>
              <div className="metric"><div className="metric-label">Total Balance</div><div className="metric-value blue">{fmt(totalBalance)}</div></div>
            </div>
            <div className="overview-charts">
              <div className="card">
                <div className="card-title">Balance Over Time</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={balanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#666' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#666' }} tickFormatter={v => '$' + v.toLocaleString()} width={70} />
                    <Tooltip formatter={v => fmt(v)} contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="balance" stroke="#1D9E75" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <div className="card-title">Expense Breakdown</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={expenses} dataKey="amt" nameKey="label" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => fmt(v)} contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* INCOME */}
        {activeTab === 'income' && (
          <div className="tab-content">
            <div className="card list-card">
              <div className="card-title">Income Sources</div>
              <div className="list">
                {income.map(e => (
                  <div className="entry-row" key={e.id}>
                    <span className="entry-label">{e.label}</span>
                    <div className="entry-right">
                      <span className="green">{fmt(e.amt)}</span>
                      <button className="delete-btn" onClick={() => setIncome(income.filter(i => i.id !== e.id))}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-row">
                <input placeholder="Source" value={incomeForm.label} onChange={ev => setIncomeForm({ ...incomeForm, label: ev.target.value })} />
                <input placeholder="Amount" type="number" value={incomeForm.amt} onChange={ev => setIncomeForm({ ...incomeForm, amt: ev.target.value })} />
                <button className="add-btn" onClick={() => { if (!incomeForm.label || !incomeForm.amt) return; setIncome([...income, { id: Date.now(), label: incomeForm.label, amt: parseFloat(incomeForm.amt) }]); setIncomeForm({ label: '', amt: '' }); }}>Add</button>
              </div>
            </div>
            <div className="card chart-card">
              <div className="card-title">Income Breakdown</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={income}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#666' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#666' }} tickFormatter={v => '$' + v.toLocaleString()} />
                  <Tooltip formatter={v => fmt(v)} contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8 }} />
                  <Bar dataKey="amt" fill="#1D9E75" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="tab-content">
            <div className="card list-card">
              <div className="card-title">Expenses</div>
              <div className="list">
                {expenses.map(e => (
                  <div className="entry-row" key={e.id}>
                    <span className="entry-label">{e.label}</span>
                    <div className="entry-right">
                      <span className="red">-{fmt(e.amt)}</span>
                      <button className="delete-btn" onClick={() => setExpenses(expenses.filter(i => i.id !== e.id))}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-row">
                <input placeholder="Category" value={expenseForm.label} onChange={ev => setExpenseForm({ ...expenseForm, label: ev.target.value })} />
                <input placeholder="Amount" type="number" value={expenseForm.amt} onChange={ev => setExpenseForm({ ...expenseForm, amt: ev.target.value })} />
                <button className="add-btn" onClick={() => { if (!expenseForm.label || !expenseForm.amt) return; setExpenses([...expenses, { id: Date.now(), label: expenseForm.label, amt: parseFloat(expenseForm.amt) }]); setExpenseForm({ label: '', amt: '' }); }}>Add</button>
              </div>
            </div>
            <div className="card chart-card">
              <div className="card-title">Expense Breakdown</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={expenses} dataKey="amt" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => fmt(v)} contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ACCOUNTS */}
        {activeTab === 'accounts' && (
          <div className="tab-content">
            <div className="card list-card">
              <div className="card-title">Bank Accounts</div>
              <div className="list">
                {accounts.map(e => (
                  <div className="entry-row" key={e.id}>
                    <span className="entry-label">{e.label}</span>
                    <div className="entry-right">
                      <span className="blue">{fmt(e.amt)}</span>
                      <button className="delete-btn" onClick={() => setAccounts(accounts.filter(i => i.id !== e.id))}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-row">
                <input placeholder="Account name" value={accountForm.label} onChange={ev => setAccountForm({ ...accountForm, label: ev.target.value })} />
                <input placeholder="Balance" type="number" value={accountForm.amt} onChange={ev => setAccountForm({ ...accountForm, amt: ev.target.value })} />
                <button className="add-btn" onClick={() => { if (!accountForm.label || !accountForm.amt) return; setAccounts([...accounts, { id: Date.now(), label: accountForm.label, amt: parseFloat(accountForm.amt) }]); setAccountForm({ label: '', amt: '' }); }}>Add</button>
              </div>
            </div>
            <div className="card chart-card">
              <div className="card-title">Balance Over Time</div>
              <div className="form-row" style={{ marginBottom: 12 }}>
                <input placeholder="Month (e.g. Sep)" value={balForm.month} onChange={ev => setBalForm({ ...balForm, month: ev.target.value })} />
                <input placeholder="Balance" type="number" value={balForm.balance} onChange={ev => setBalForm({ ...balForm, balance: ev.target.value })} />
                <button className="add-btn" onClick={() => { if (!balForm.month || !balForm.balance) return; setBalanceHistory([...balanceHistory, { month: balForm.month, balance: parseFloat(balForm.balance) }]); setBalForm({ month: '', balance: '' }); }}>Add</button>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={balanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#666' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#666' }} tickFormatter={v => '$' + v.toLocaleString()} width={70} />
                  <Tooltip formatter={v => fmt(v)} contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="balance" stroke="#378ADD" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* GOALS */}
        {activeTab === 'goals' && (
          <div className="tab-content single">
            <div className="card list-card">
              <div className="card-title">Savings Goals</div>
              <div className="list">
                {goals.map(e => {
                  const pct = Math.min(100, Math.round(e.saved / e.target * 100));
                  return (
                    <div key={e.id} style={{ marginBottom: 14 }}>
                      <div className="entry-row">
                        <span className="entry-label">{e.label}</span>
                        <div className="entry-right">
                          <span style={{ fontSize: 12, color: '#888' }}>{fmt(e.saved)} / {fmt(e.target)} · {pct}%</span>
                          <button className="delete-btn" onClick={() => setGoals(goals.filter(i => i.id !== e.id))}>✕</button>
                        </div>
                      </div>
                      <div className="goal-bar"><div className="goal-fill" style={{ width: pct + '%', background: pct < 50 ? '#EF9F27' : '#1D9E75' }} /></div>
                    </div>
                  );
                })}
              </div>
              <div className="form-row">
                <input placeholder="Goal name" value={goalForm.label} onChange={ev => setGoalForm({ ...goalForm, label: ev.target.value })} />
                <input placeholder="Saved" type="number" value={goalForm.saved} onChange={ev => setGoalForm({ ...goalForm, saved: ev.target.value })} />
                <input placeholder="Target" type="number" value={goalForm.target} onChange={ev => setGoalForm({ ...goalForm, target: ev.target.value })} />
                <button className="add-btn" onClick={() => { if (!goalForm.label || !goalForm.saved || !goalForm.target) return; setGoals([...goals, { id: Date.now(), label: goalForm.label, saved: parseFloat(goalForm.saved), target: parseFloat(goalForm.target) }]); setGoalForm({ label: '', saved: '', target: '' }); }}>Add</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}