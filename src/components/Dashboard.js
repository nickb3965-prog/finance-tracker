import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import './Dashboard.css';

const COLORS = ['#1D9E75', '#E24B4A', '#378ADD', '#EF9F27', '#9B59B6'];

const PATTERNS = [
  { name: 'None', value: 'none', preview: '#0a0c12' },
  { name: 'Dots', value: 'dots', preview: '#0a0c12' },
  { name: 'Grid', value: 'grid', preview: '#0a0c12' },
  { name: 'Triangles', value: 'triangles', preview: '#0a0c12' },
  { name: 'Waves', value: 'waves', preview: '#0a0c12' },
  { name: 'Purple Gradient', value: 'gradient-purple', preview: 'linear-gradient(135deg,#1a0533,#0a0c12)' },
  { name: 'Blue Gradient', value: 'gradient-blue', preview: 'linear-gradient(135deg,#001f3f,#0a0c12)' },
  { name: 'Green Gradient', value: 'gradient-green', preview: 'linear-gradient(135deg,#001a0f,#0a0c12)' },
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
  const [income, setIncome] = useLocalStorage('fm_income', []);
  const [expenses, setExpenses] = useLocalStorage('fm_expenses', []);
  const [accounts, setAccounts] = useLocalStorage('fm_accounts', []);
  const [goals, setGoals] = useLocalStorage('fm_goals', []);
  const [transactions, setTransactions] = useLocalStorage('fm_transactions', []);
  const [balanceHistory, setBalanceHistory] = useLocalStorage('fm_history', []);
  const [theme, setTheme] = useLocalStorage('fm_theme', 'dark');
  const [pattern, setPattern] = useLocalStorage('fm_pattern', 'none');

  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  const [incomeForm, setIncomeForm] = useState({ label: '', amt: '' });
  const [expenseForm, setExpenseForm] = useState({ label: '', amt: '' });
  const [accountForm, setAccountForm] = useState({ label: '' });
  const [goalForm, setGoalForm] = useState({ label: '', saved: '', target: '' });
  const [balForm, setBalForm] = useState({ month: '', balance: '' });
  const [txForm, setTxForm] = useState({ type: 'add', amount: '', account: '', label: '' });

  const totalIncome = income.reduce((s, e) => s + e.amt, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amt, 0);
  const netFlow = totalIncome - totalExpenses;
  const totalBalance = accounts.reduce((s, e) => s + e.balance, 0);
  const fmt = (n) => '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const addTransaction = () => {
    if (!txForm.amount || !txForm.account || !txForm.label) return;
    const amt = parseFloat(txForm.amount);
    const tx = { id: Date.now(), ...txForm, amount: amt, date: new Date().toLocaleDateString() };
    setTransactions([tx, ...transactions]);
    setAccounts(accounts.map(a =>
      a.id === parseInt(txForm.account)
        ? { ...a, balance: txForm.type === 'add' ? a.balance + amt : a.balance - amt }
        : a
    ));
    setTxForm({ type: 'add', amount: '', account: '', label: '' });
  };

  const tabs = ['overview', 'transactions', 'income', 'expenses', 'accounts', 'goals', 'customize'];
  const icons = { overview: '⬛', transactions: '💳', income: '📈', expenses: '📉', accounts: '🏦', goals: '🎯', customize: '🎨' };

  const switchTab = (tab) => { setActiveTab(tab); setMenuOpen(false); };

  const isLight = theme === 'light';

  return (
    <div className={`app theme-${theme} pattern-${pattern}`}>
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <div className="logo">💰 FinanceMe</div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
      </div>

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
                {balanceHistory.length === 0 ? <div className="empty">No data yet — add entries in Accounts tab</div> : (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={balanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => '$' + v.toLocaleString()} width={70} />
                      <Tooltip formatter={v => fmt(v)} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="balance" stroke="#1D9E75" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="card">
                <div className="card-title">Expense Breakdown</div>
                {expenses.length === 0 ? <div className="empty">No expenses yet</div> : (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={expenses} dataKey="amt" nameKey="label" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={v => fmt(v)} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="tab-content">
            <div className="card list-card">
              <div className="card-title">Log Transaction</div>
              <div className="tx-form">
                <div className="tx-type-row">
                  <button className={`tx-type-btn ${txForm.type === 'add' ? 'active-add' : ''}`} onClick={() => setTxForm({ ...txForm, type: 'add' })}>+ Add Money</button>
                  <button className={`tx-type-btn ${txForm.type === 'remove' ? 'active-remove' : ''}`} onClick={() => setTxForm({ ...txForm, type: 'remove' })}>− Remove Money</button>
                </div>
                <div className="form-row">
                  <input placeholder="Label (e.g. Groceries)" value={txForm.label} onChange={e => setTxForm({ ...txForm, label: e.target.value })} />
                  <input placeholder="Amount" type="number" value={txForm.amount} onChange={e => setTxForm({ ...txForm, amount: e.target.value })} />
                </div>
                <div className="form-row" style={{ marginTop: 8 }}>
                  <select value={txForm.account} onChange={e => setTxForm({ ...txForm, account: e.target.value })}>
                    <option value="">Select account...</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.label} ({fmt(a.balance)})</option>)}
                  </select>
                  <button className="add-btn" onClick={addTransaction}>Log</button>
                </div>
                {accounts.length === 0 && <div className="empty" style={{ marginTop: 8 }}>Add an account first in the Accounts tab</div>}
              </div>
              <div className="card-title" style={{ marginTop: 16 }}>Transaction History</div>
              <div className="list">
                {transactions.length === 0 ? <div className="empty">No transactions yet</div> : transactions.map(tx => (
                  <div className="entry-row" key={tx.id}>
                    <div>
                      <div className="entry-label">{tx.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{accounts.find(a => a.id === parseInt(tx.account))?.label} · {tx.date}</div>
                    </div>
                    <div className="entry-right">
                      <span className={tx.type === 'add' ? 'green' : 'red'}>{tx.type === 'add' ? '+' : '-'}{fmt(tx.amount)}</span>
                      <button className="delete-btn" onClick={() => {
                        setTransactions(transactions.filter(t => t.id !== tx.id));
                        setAccounts(accounts.map(a =>
                          a.id === parseInt(tx.account)
                            ? { ...a, balance: tx.type === 'add' ? a.balance - tx.amount : a.balance + tx.amount }
                            : a
                        ));
                      }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card chart-card">
              <div className="card-title">Account Balances</div>
              {accounts.length === 0 ? <div className="empty">No accounts yet</div> : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={accounts.map(a => ({ name: a.label, balance: a.balance }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={v => '$' + v.toLocaleString()} />
                    <Tooltip formatter={v => fmt(v)} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Bar dataKey="balance" fill="#378ADD" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* INCOME */}
        {activeTab === 'income' && (
          <div className="tab-content">
            <div className="card list-card">
              <div className="card-title">Income Sources</div>
              <div className="list">
                {income.length === 0 ? <div className="empty">No income added yet</div> : income.map(e => (
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
              {income.length === 0 ? <div className="empty">No income yet</div> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={income}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={v => '$' + v.toLocaleString()} />
                    <Tooltip formatter={v => fmt(v)} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Bar dataKey="amt" fill="#1D9E75" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="tab-content">
            <div className="card list-card">
              <div className="card-title">Expenses</div>
              <div className="list">
                {expenses.length === 0 ? <div className="empty">No expenses added yet</div> : expenses.map(e => (
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
              {expenses.length === 0 ? <div className="empty">No expenses yet</div> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={expenses} dataKey="amt" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => fmt(v)} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* ACCOUNTS */}
        {activeTab === 'accounts' && (
          <div className="tab-content">
            <div className="card list-card">
              <div className="card-title">Bank Accounts</div>
              <div className="list">
                {accounts.length === 0 ? <div className="empty">No accounts yet — add one below</div> : accounts.map(e => (
                  <div className="entry-row" key={e.id}>
                    <span className="entry-label">{e.label}</span>
                    <div className="entry-right">
                      <span className="blue">{fmt(e.balance)}</span>
                      <button className="delete-btn" onClick={() => setAccounts(accounts.filter(i => i.id !== e.id))}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-row">
                <input placeholder="Account name (e.g. Chequing)" value={accountForm.label} onChange={ev => setAccountForm({ label: ev.target.value })} />
                <button className="add-btn" onClick={() => { if (!accountForm.label) return; setAccounts([...accounts, { id: Date.now(), label: accountForm.label, balance: 0 }]); setAccountForm({ label: '' }); }}>Add</button>
              </div>
            </div>
            <div className="card chart-card">
              <div className="card-title">Balance History</div>
              <div className="form-row" style={{ marginBottom: 12 }}>
                <input placeholder="Month (e.g. Jun)" value={balForm.month} onChange={ev => setBalForm({ ...balForm, month: ev.target.value })} />
                <input placeholder="Balance" type="number" value={balForm.balance} onChange={ev => setBalForm({ ...balForm, balance: ev.target.value })} />
                <button className="add-btn" onClick={() => { if (!balForm.month || !balForm.balance) return; setBalanceHistory([...balanceHistory, { month: balForm.month, balance: parseFloat(balForm.balance) }]); setBalForm({ month: '', balance: '' }); }}>Add</button>
              </div>
              {balanceHistory.length === 0 ? <div className="empty">Add monthly snapshots to see your trend</div> : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={balanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => '$' + v.toLocaleString()} width={70} />
                    <Tooltip formatter={v => fmt(v)} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="balance" stroke="#378ADD" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* GOALS */}
        {activeTab === 'goals' && (
          <div className="tab-content single">
            <div className="card list-card">
              <div className="card-title">Savings Goals</div>
              <div className="list">
                {goals.length === 0 ? <div className="empty">No goals yet — add one below</div> : goals.map(e => {
                  const pct = Math.min(100, Math.round(e.saved / e.target * 100));
                  return (
                    <div key={e.id} style={{ marginBottom: 14 }}>
                      <div className="entry-row">
                        <span className="entry-label">{e.label}</span>
                        <div className="entry-right">
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmt(e.saved)} / {fmt(e.target)} · {pct}%</span>
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

        {/* CUSTOMIZE */}
        {activeTab === 'customize' && (
          <div className="tab-content single">
            <div className="card list-card">
              <div className="card-title">Theme</div>
              <div className="theme-row">
                <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>🌙 Dark Mode</button>
                <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>☀️ Light Mode</button>
              </div>
              <div className="card-title" style={{ marginTop: 24 }}>Background Pattern</div>
              <div className="pattern-grid">
                {PATTERNS.map(p => (
                  <button key={p.value} className={`pattern-btn ${pattern === p.value ? 'active' : ''}`} onClick={() => setPattern(p.value)}>
                    <div className={`pattern-preview pattern-${p.value}`} />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}