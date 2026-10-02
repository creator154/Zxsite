'use client';
import {useState} from 'react';
export default function Login(){
const [email,setEmail]=useState('');const [password,setPassword]=useState('');
function login(e){e.preventDefault();alert('Backend connect hone ke baad login active hoga.');}
return <><nav className="nav"><div className="brand">Yakeen Batch</div></nav><main className="wrap"><div className="card" style={{maxWidth:450,margin:'50px auto'}}><h2>Login</h2><p className="muted">Student / Admin login</p><form onSubmit={login}><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:12,margin:'7px 0',border:'1px solid #ddd',borderRadius:8}}/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:12,margin:'7px 0',border:'1px solid #ddd',borderRadius:8}}/><button className="btn" type="submit" style={{marginTop:10}}>Login</button></form></div></main></>}
