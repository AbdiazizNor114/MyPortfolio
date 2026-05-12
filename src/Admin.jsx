import React, { useState } from 'react';
import { dataService } from './services/dataService';

export default function Admin() {
  const [form, setForm] = useState({ title: '', desc: '', tech: '', type: 'project' });

  const handlePublish = (e) => {
    e.preventDefault();
    const entry = { ...form, id: Date.now(), date: new Date().toLocaleDateString() };
    
    if (form.type === 'project') dataService.saveProject(entry);
    else dataService.saveBlog(entry);
    
    alert("System Updated Successfully!");
    setForm({ title: '', desc: '', tech: '', type: 'project' });
  };

  return (
    <div style={{background: '#1a1a1a', color: '#fff', minHeight: '100vh', padding: '50px'}}>
      <div style={{maxWidth: '600px', margin: '0 auto', background: '#2a2a2a', padding: '40px', borderRadius: '20px'}}>
        <h1 style={{color: '#0047AB'}}>ADMIN BACKEND</h1>
        <form onSubmit={handlePublish} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={inputStyle}>
            <option value="project">New Project</option>
            <option value="blog">New Blog Post</option>
          </select>
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} />
          <input placeholder="Tech Stack (e.g. Python, AI)" value={form.tech} onChange={e => setForm({...form, tech: e.target.value})} style={inputStyle} />
          <textarea placeholder="Description / Content" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} style={{...inputStyle, height: '150px'}} />
          <button type="submit" style={{background: '#0047AB', color: 'white', padding: '15px', borderRadius: '10px', fontWeight: 'bold'}}>PUSH TO PORTFOLIO</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', background: '#333', border: '1px solid #444', color: 'white', borderRadius: '8px' };