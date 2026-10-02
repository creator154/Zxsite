import Link from "next/link";
export default function Home(){
return <><nav className="nav"><div className="brand">Yakeen Batch</div><Link className="btn" href="/login">Login</Link></nav>
<main className="wrap"><section className="hero"><span className="badge">DPP • TEST • BATCH</span><h1>Yakeen Batch Learning Portal</h1><p>DPPs, tests and study material — all in one place.</p><Link className="btn" href="/login">Open Student Panel</Link></section>
<section className="section"><h2>Everything in one dashboard</h2><div className="grid">
<div className="card"><h3>📚 DPP</h3><p className="muted">Daily practice papers organised by subject and chapter.</p></div>
<div className="card"><h3>📝 Tests</h3><p className="muted">Attempt tests and view your performance.</p></div>
<div className="card"><h3>📊 Results</h3><p className="muted">Keep track of your previous test results.</p></div>
</div></section></main><footer>Yakeen Batch Platform</footer></>}
