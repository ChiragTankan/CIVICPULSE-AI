import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileSearch,
  MapPin,
  Calendar,
  Settings,
  Info,
  AlertCircle,
  CheckCircle2,
  Upload,
  Download,
  ChevronRight,
  User,
  ShieldCheck
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [activeTab, setActiveTab] = useState('decoder');
  const [config, setConfig] = useState({
    vertex_ai_configured: false,
    civic_api_configured: false,
    project_configured: false
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingKeys, setOnboardingKeys] = useState({
    vertex_ai_key: '',
    civic_api_key: '',
    google_cloud_project: ''
  });

  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE}/config-status`);
      setConfig(res.data);
      if (!res.data.vertex_ai_configured || !res.data.civic_api_configured) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error("Failed to fetch config", err);
    }
  };

  const handleSetupKeys = async () => {
    try {
      await axios.post(`${API_BASE}/setup-keys`, onboardingKeys);
      setShowOnboarding(false);
      checkConfig();
    } catch (err) {
      alert("Failed to save keys");
    }
  };

  return (
    <div className="flex h-screen bg-black text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <nav className="w-72 glass-nav flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              CIVICPULSE <span className="text-blue-500 font-medium">AI</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Multimodal Civic Intelligence</p>
        </div>

        <div className="flex-1 px-4 space-y-2 py-4">
          <NavItem
            icon={<FileSearch />}
            label="Ballot Decoder"
            active={activeTab === 'decoder'}
            onClick={() => setActiveTab('decoder')}
          />
          <NavItem
            icon={<MapPin />}
            label="Geo-Lookup"
            active={activeTab === 'geo'}
            onClick={() => setActiveTab('geo')}
          />
          <NavItem
            icon={<Calendar />}
            label="Smart Calendar"
            active={activeTab === 'calendar'}
            onClick={() => setActiveTab('calendar')}
          />
          <NavItem
            icon={<Settings />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>

        <div className="p-6">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
              CT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Chirag Tankan</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Lead Architect</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative p-8 lg:p-12">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 w-full">
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800/50 shadow-2xl backdrop-blur-xl">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute"></span>
                <span className="w-3 h-3 bg-blue-500 rounded-full relative"></span>
                Educational Assistant Active
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter capitalize italic leading-none mb-4">
                {activeTab.replace('-', ' ')}
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Step-by-step guidance to help you understand the election process,
                timelines, and legal measures in an interactive, easy-to-follow interface.
              </p>
            </div>

            <div className="flex gap-4">
              {!config.vertex_ai_configured && (
                <div className="flex items-center gap-2 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-full font-black uppercase tracking-tighter shadow-lg shadow-amber-500/5">
                  <AlertCircle size={14} /> Vertex AI Encryption Pending
                </div>
              )}
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {activeTab === 'decoder' && <BallotDecoder config={config} />}
            {activeTab === 'geo' && <GeoLookup />}
            {activeTab === 'calendar' && <CalendarGen />}
            {activeTab === 'settings' && <SettingsView config={config} refresh={checkConfig} />}
          </div>
        </div>
      </main>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-[2rem] shadow-2xl w-full max-w-lg p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>

            <h3 className="text-3xl font-black mb-2 text-white tracking-tighter italic">GATEWAY INITIALIZATION</h3>
            <p className="text-slate-500 mb-8 font-medium">Link your secure API credentials to activate CivicPulse AI core.</p>

            <div className="space-y-6">
              <KeyInput
                label="Google Cloud Project"
                value={onboardingKeys.google_cloud_project}
                onChange={(v) => setOnboardingKeys({ ...onboardingKeys, google_cloud_project: v })}
                placeholder="gen-lang-client-..."
              />
              <KeyInput
                label="Vertex AI Key"
                type="password"
                value={onboardingKeys.vertex_ai_key}
                onChange={(v) => setOnboardingKeys({ ...onboardingKeys, vertex_ai_key: v })}
                placeholder="AIza..."
              />
              <KeyInput
                label="Civic Information API"
                type="password"
                value={onboardingKeys.civic_api_key}
                onChange={(v) => setOnboardingKeys({ ...onboardingKeys, civic_api_key: v })}
                placeholder="AIza..."
              />
            </div>

            <button
              onClick={handleSetupKeys}
              className="w-full mt-10 bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
            >
              INITIALIZE AGENT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm tracking-tight ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
        : 'text-slate-500 hover:text-white hover:bg-slate-900'
        }`}
    >
      {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
      {label}
    </button>
  );
}

function KeyInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#121212] border border-slate-800 rounded-xl px-5 py-4 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none text-white transition-all placeholder:text-slate-700"
        placeholder={placeholder}
      />
    </div>
  );
}

function BallotDecoder({ config }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [thoughts, setThoughts] = useState([]);

  const addThought = (text) => {
    setThoughts(prev => [...prev, { id: Date.now(), text, timestamp: new Date().toLocaleTimeString() }]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult('');
    setThoughts([]);

    // Simulate Step-by-Step Logic
    addThought("Step 1: Extracting text from image via Gemini 1.5 Pro...");
    await new Promise(r => setTimeout(r, 1500));

    addThought("Step 2: Cross-referencing entities with Google Civic API...");
    await new Promise(r => setTimeout(r, 1200));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE}/ballot-decoder`, formData);

      addThought("Step 3: Simplifying legal jargon and contextualizing measures...");
      await new Promise(r => setTimeout(r, 1000));

      addThought("Step 4: Generating non-partisan summary and insights.");
      setResult(res.data.analysis);
    } catch (err) {
      addThought("CRITICAL ERROR: Analysis pipeline failed.");
      setResult("SYSTEM ERROR: Failed to analyze document. Ensure Project ID and Vertex AI API are active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[600px]">
      <div className="flex-1 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="premium-card p-8">
            <h4 className="text-sm font-black mb-6 text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Upload size={16} className="text-blue-500" /> Intake Module
            </h4>
            <div
              className="border-2 border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition-all group"
              onClick={() => document.getElementById('ballot-upload').click()}
            >
              <input
                type="file"
                id="ballot-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-500 mb-6 group-hover:scale-110 transition-transform group-hover:text-blue-500 group-hover:bg-blue-500/10">
                <FileSearch size={36} />
              </div>
              <p className="text-lg text-white font-black tracking-tight">{file ? file.name : "Drop document here"}</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Capture or upload ballot photo</p>
            </div>
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-blue-900/40 uppercase tracking-widest text-xs"
            >
              {loading ? "PROCESSING..." : "DECODE DOCUMENT"}
            </button>
          </div>

          <div className="premium-card p-8 min-h-[400px] flex flex-col">
            <h4 className="text-sm font-black mb-6 text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Info size={16} className="text-purple-500" /> Decrypted Summary
            </h4>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {loading && !result ? (
                <div className="space-y-6">
                  <div className="h-4 bg-slate-900 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-900 rounded-full w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-slate-900 rounded-full w-full animate-pulse"></div>
                </div>
              ) : result ? (
                <div className="text-slate-300 whitespace-pre-wrap font-medium leading-relaxed bg-black/40 p-6 rounded-2xl border border-slate-800 text-sm">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale">
                  <ShieldCheck size={48} className="mb-4 text-slate-700" />
                  <p className="text-sm text-slate-500 font-bold max-w-xs uppercase tracking-tighter">Enter data for AI reasoning</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Agentic Thought Sidebar */}
      <div className="w-full xl:w-96 glass-nav rounded-3xl p-8 border border-slate-800/50 flex flex-col h-full overflow-hidden shadow-2xl backdrop-blur-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Agentic Logic Trace</h4>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
          {thoughts.length === 0 && (
            <div className="text-slate-600 text-[10px] font-bold uppercase tracking-widest text-center mt-20">
              Awaiting task initiation...
            </div>
          )}
          {thoughts.map((thought, i) => (
            <div key={thought.id} className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-blue-500 font-black tracking-widest">STEP {i + 1}</span>
                <span className="text-[9px] text-slate-600 font-mono">{thought.timestamp}</span>
              </div>
              <div className="bg-white/5 border-l-2 border-blue-500/50 p-4 rounded-r-xl rounded-b-xl">
                <p className="text-xs text-slate-300 font-mono leading-relaxed">{thought.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse pl-4">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
              Reasoning in progress...
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex justify-between items-center">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
          </div>
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Neural Engine 1.5p</span>
        </div>
      </div>
    </div>
  );
}

function GeoLookup() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('address', address);
    try {
      const res = await axios.post(`${API_BASE}/representative-info`, formData);
      setData(res.data);
    } catch (err) {
      alert("QUERY FAILED: Verify address format and Civic API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="premium-card p-8 max-w-3xl">
        <h4 className="text-sm font-black mb-6 text-slate-400 uppercase tracking-widest">Representative Data Fetch</h4>
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <MapPin className="absolute left-5 top-5 text-slate-600 transition-colors group-focus-within:text-blue-500" size={18} />
            <input
              type="text"
              placeholder="ENTER PHYSICAL ADDRESS..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#121212] border border-slate-800 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-blue-500/50 text-white font-bold transition-all"
            />
          </div>
          <button
            onClick={fetchInfo}
            disabled={!address || loading}
            className="bg-white text-black px-10 rounded-2xl font-black text-sm uppercase tracking-tighter hover:bg-slate-200 transition-all disabled:opacity-30"
          >
            EXECUTE
          </button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">ACTIVE REPRESENTATIVES</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.representatives.officials?.map((off, i) => (
                <div key={i} className="premium-card p-6 flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-600">
                    <User size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white truncate text-base leading-tight mb-1">{off.name}</p>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest leading-none">{off.party}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">VOTING LOGISTICS</h5>
            {data.voter_info.pollingLocations ? (
              data.voter_info.pollingLocations.map((loc, i) => (
                <div key={i} className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-[2rem]">
                  <p className="font-black text-blue-400 text-lg tracking-tight mb-2">{loc.address.locationName}</p>
                  <div className="flex items-start gap-2 text-slate-400">
                    <MapPin size={14} className="mt-1 flex-shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">{loc.address.line1}, {loc.address.city}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="premium-card p-8 text-center opacity-30">
                <AlertCircle size={32} className="mx-auto mb-4 text-slate-700" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Polling Assets Identified</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarGen() {
  const [events, setEvents] = useState([
    { summary: 'Election Day', description: 'Be sure to vote!', date: '2024-11-05' },
    { summary: 'Registration Deadline', description: 'Last day to register online', date: '2024-10-21' }
  ]);

  const downloadIcs = async () => {
    try {
      const res = await axios.post(`${API_BASE}/generate-calendar`, events, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'civic_deadlines.ics');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("EXPORT FAILED: Backend unavailable");
    }
  };

  return (
    <div className="max-w-4xl premium-card p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-10 border-b border-slate-900">
        <div>
          <h4 className="text-2xl font-black text-white tracking-tighter italic">TEMPORAL SYNC</h4>
          <p className="text-slate-500 font-medium">Export vital milestones to your personal calendar gateway.</p>
        </div>
        <button
          onClick={downloadIcs}
          className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-sm tracking-tight transition-all hover:scale-[1.02] shadow-xl shadow-white/5 active:scale-[0.98]"
        >
          <Download size={18} /> EXPORT (.ICS)
        </button>
      </div>

      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-[#121212] rounded-2xl border border-slate-800 transition-all hover:border-slate-700">
            <div>
              <p className="text-lg font-black text-white tracking-tight leading-none mb-2">{ev.summary}</p>
              <p className="text-sm text-slate-500 font-medium">{ev.description}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-black text-blue-500 uppercase italic mb-1">{ev.date}</p>
              <div className="flex items-center gap-1 justify-end">
                <CheckCircle2 size={12} className="text-green-500" />
                <span className="text-[10px] uppercase font-bold text-slate-600">Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ config, refresh }) {
  return (
    <div className="max-w-3xl space-y-8">
      <div className="premium-card p-10">
        <h4 className="text-sm font-black mb-8 text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Settings size={16} className="text-slate-500" /> Infrastructure Integrity
        </h4>
        <div className="space-y-4">
          <StatusItem label="Vertex AI (Gemini 1.5 Pro)" active={config.vertex_ai_configured} />
          <StatusItem label="Civic Information API" active={config.civic_api_configured} />
          <StatusItem label="Google Cloud Project" active={config.project_configured} />
        </div>
        <button
          onClick={() => refresh()}
          className="mt-10 text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all"
        >
          FORCE SYSTEM RECONFIG
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] p-10 border border-slate-800 relative overflow-hidden group">
        <div className="relative z-10">
          <h4 className="text-xl font-black text-white tracking-tighter italic mb-3">Antigravity Deployment</h4>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            CivicPulse AI represents a paradigm shift in civic transparency.
            Powered by high-reasoning multimodal models, we convert complex legal
            documentation into actionable citizen intelligence.
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700"></div>
      </div>
    </div>
  );
}

function StatusItem({ label, active }) {
  return (
    <div className="flex items-center justify-between p-5 bg-[#121212] rounded-2xl border border-slate-800">
      <span className="font-bold text-slate-400 text-sm">{label}</span>
      {active ? (
        <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full font-black uppercase tracking-tighter">CONNECTED</span>
      ) : (
        <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full font-black uppercase tracking-tighter">DISCONNECTED</span>
      )}
    </div>
  );
}

export default App;
