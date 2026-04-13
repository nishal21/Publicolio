import React, { useMemo, useRef, useState } from 'react';
import { fetchDeveloperData, generateShortUrl } from '../services/api';
import type { DeveloperProfile } from '../types';
import { LiquidGlass } from './themes/LiquidGlass.tsx';
import { BentoGrid } from './themes/BentoGrid.tsx';
import { Neubrutalism } from './themes/Neubrutalism.tsx';
import { Minimalism } from './themes/Minimalism.tsx';
import { Terminal } from './themes/Terminal.tsx';
import { Aurora } from './themes/Aurora.tsx';
import { DEFAULT_THEME_OPTIONS, type ThemeOptions } from './themes/ThemeProps.ts';
import {
  Loader2,
  Check,
  Sparkles,
  Zap,
  Search,
  X,
  SlidersHorizontal,
  Palette,
  Grid3X3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const THEMES = {
  aurora: { name: 'Aurora', emoji: '🌌', Component: Aurora },
  liquid: { name: 'Liquid Glass', emoji: '🪞', Component: LiquidGlass },
  bento: { name: 'Bento Grid', emoji: '⬛', Component: BentoGrid },
  minimal: { name: 'Minimalism', emoji: '◻️', Component: Minimalism },
  brutal: { name: 'Neubrutalism', emoji: '🔥', Component: Neubrutalism },
  terminal: { name: 'Terminal', emoji: '💻', Component: Terminal },
};

const ACCENT_SWATCHES = ['#6366f1', '#06b6d4', '#22c55e', '#f97316', '#ef4444', '#ec4899'];

const C = {
  bg: '#0d0d10',
  panel: '#111115',
  border: 'rgba(255,255,255,0.07)',
  muted: '#52525b',
  text: '#e4e4e7',
  accent: '#6366f1',
  accentBg: 'rgba(99,102,241,0.12)',
  accentBorder: 'rgba(99,102,241,0.3)',
  danger: '#f87171',
  success: '#34d399',
};

const input: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: C.text,
  fontSize: '14px',
  padding: '10px 14px',
  fontFamily: "'Inter', sans-serif",
};

const sectionTitle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontWeight: 800,
  color: C.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: '10px',
};

const optionButton = (active: boolean): React.CSSProperties => ({
  borderRadius: '9px',
  border: active ? `1px solid ${C.accentBorder}` : `1px solid ${C.border}`,
  background: active ? C.accentBg : 'rgba(255,255,255,0.015)',
  color: active ? '#c7d2fe' : '#a1a1aa',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.02em',
  padding: '7px 10px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
  whiteSpace: 'nowrap',
});

type ShortLinkDomainChoice = 'auto' | 'workers' | 'custom';

const resolveHostname = (value?: string): string => {
  if (!value) return '';
  const raw = value.trim();
  if (!raw) return '';

  try {
    const parsed = raw.includes('://') ? new URL(raw) : new URL(`https://${raw}`);
    return parsed.hostname;
  } catch {
    return '';
  }
};

export const LandingBuilder: React.FC = () => {
  const [username, setUsername] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof THEMES>('aurora');
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [repoSearch, setRepoSearch] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [shortLinkDomain, setShortLinkDomain] = useState<ShortLinkDomainChoice>('auto');
  const [showEditorControls, setShowEditorControls] = useState(false);
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>(DEFAULT_THEME_OPTIONS);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  const shortenerEndpoint = import.meta.env.VITE_SHORTENER_URL || import.meta.env.VITE_SHORTENER_API_URL || '';
  const workersShortDomain = resolveHostname(import.meta.env.VITE_SHORTENER_WORKERS_DOMAIN || shortenerEndpoint);
  const customShortDomain = resolveHostname(import.meta.env.VITE_SHORTENER_CUSTOM_DOMAIN);
  const selectedShortDomain = shortLinkDomain === 'workers' ? workersShortDomain : shortLinkDomain === 'custom' ? customShortDomain : '';

  const filteredRepos = useMemo(() => {
    if (!profile) return [];
    const q = repoSearch.trim().toLowerCase();
    if (!q) return profile.projects;
    return profile.projects.filter(
      p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }, [profile, repoSearch]);

  const previewProfile = profile
    ? { ...profile, projects: profile.projects.filter(p => selectedRepos.has(p.name)) }
    : null;

  const ActiveTheme = THEMES[selectedTheme].Component;

  const scrollPreviewToTop = () => {
    previewScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const updateOption = <K extends keyof ThemeOptions>(key: K, value: ThemeOptions[K]) => {
    setThemeOptions(prev => ({ ...prev, [key]: value }));
  };

  const fetchProfile = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setProfile(null);
    setRepoSearch('');
    scrollPreviewToTop();
    try {
      const data = await fetchDeveloperData(username.trim(), customToken.trim() || undefined);
      setProfile(data);
      setSelectedRepos(new Set(data.projects.map(p => p.name)));
      requestAnimationFrame(scrollPreviewToTop);
    } catch {
      setError("Couldn't fetch this GitHub profile. Check username/token and try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRepo = (name: string) => {
    const next = new Set(selectedRepos);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelectedRepos(next);
  };

  const selectAll = () => profile && setSelectedRepos(new Set(filteredRepos.map(p => p.name)));
  const selectNone = () => setSelectedRepos(new Set());

  const copyUrlWithAlert = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      window.alert('Link copied');
      return;
    } catch {
      // Fallback for environments where Clipboard API is unavailable.
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        window.alert('Link copied');
      } catch {
        window.alert('Link generated, but copy failed. Please copy manually.');
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleDeploy = async () => {
    if (!profile || selectedRepos.size === 0) return;
    setDeploying(true);
    setError('');
    try {
      const params = new URLSearchParams({
        user: profile.username,
        theme: selectedTheme,
        repos: Array.from(selectedRepos).join(','),
        stats: themeOptions.showStats ? '1' : '0',
        avatar: themeOptions.showAvatar ? '1' : '0',
        bio: themeOptions.showBio ? '1' : '0',
        accent: themeOptions.accentColor.replace('#', ''),
        layout: themeOptions.layout,
        sort: themeOptions.repoSort,
        card: themeOptions.cardStyle,
        text: themeOptions.textScale,
      });
      const generatedUrl = await generateShortUrl(`${window.location.origin}/?${params}`, {
        preferredDomain: selectedShortDomain || undefined,
      });
      setShortUrl(generatedUrl);
      await copyUrlWithAlert(generatedUrl);
    } catch {
      setError('Deploy failed unexpectedly.');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: C.bg,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <aside
        style={{
          width: '372px',
          minWidth: '372px',
          height: '100vh',
          background: C.panel,
          borderRight: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: C.accentBg,
              border: `1px solid ${C.accentBorder}`,
              borderRadius: '999px',
              padding: '3px 12px',
              marginBottom: '12px',
            }}
          >
            <Sparkles style={{ width: '10px', height: '10px', color: C.accent }} />
            <span style={{ fontSize: '10px', fontWeight: 800, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Portfolio Generator
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Publicolio</h1>
          <p style={{ fontSize: '12px', color: C.muted, marginTop: '5px' }}>GitHub -&gt; serverless portfolio, zero config.</p>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={sectionTitle}>GitHub Username</label>
            <div style={{ display: 'flex', gap: '8px', background: '#18181b', border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <input
                style={input}
                type="text"
                value={username}
                placeholder="torvalds"
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchProfile()}
              />
              <button
                onClick={fetchProfile}
                disabled={loading || !username.trim()}
                style={{
                  flexShrink: 0,
                  background: C.accent,
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '0 18px',
                  margin: '5px',
                  borderRadius: '8px',
                  opacity: loading || !username.trim() ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'inherit',
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? <Loader2 style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} /> : 'Fetch'}
              </button>
            </div>
            {error && (
              <p style={{ fontSize: '11px', color: C.danger, marginTop: '7px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '5px', height: '5px', background: C.danger, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                {error}
              </p>
            )}
          </div>

          <div>
            <label style={sectionTitle}>GitHub Token (Optional)</label>
            <div style={{ display: 'flex', gap: '8px', background: '#18181b', border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <input
                style={input}
                type="password"
                value={customToken}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                onChange={e => setCustomToken(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              {customToken && (
                <button
                  onClick={() => setCustomToken('')}
                  style={{
                    flexShrink: 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: C.muted,
                    fontWeight: 700,
                    fontSize: '11px',
                    padding: '0 12px',
                    fontFamily: 'inherit',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <p style={{ fontSize: '10px', color: '#71717a', marginTop: '7px', lineHeight: 1.45 }}>
              Used only in builder fetch calls to bypass rate limits and read your private repos. Never saved to deploy links.
            </p>
          </div>

          <div>
            <label style={sectionTitle}>Short Link Domain</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                onClick={() => setShortLinkDomain('auto')}
                style={optionButton(shortLinkDomain === 'auto')}
              >
                Auto
              </button>
              <button
                onClick={() => workersShortDomain && setShortLinkDomain('workers')}
                disabled={!workersShortDomain}
                style={{
                  ...optionButton(shortLinkDomain === 'workers'),
                  opacity: workersShortDomain ? 1 : 0.45,
                  cursor: workersShortDomain ? 'pointer' : 'not-allowed',
                }}
              >
                workers.dev
              </button>
              <button
                onClick={() => customShortDomain && setShortLinkDomain('custom')}
                disabled={!customShortDomain}
                style={{
                  ...optionButton(shortLinkDomain === 'custom'),
                  opacity: customShortDomain ? 1 : 0.45,
                  cursor: customShortDomain ? 'pointer' : 'not-allowed',
                }}
              >
                Custom
              </button>
            </div>
            <p style={{ fontSize: '10px', color: '#71717a', marginTop: '7px', lineHeight: 1.45 }}>
              {shortLinkDomain === 'workers' && workersShortDomain
                ? `Short links will use ${workersShortDomain}`
                : shortLinkDomain === 'custom' && customShortDomain
                  ? `Short links will use ${customShortDomain}`
                  : 'Auto uses the domain returned by your shortener worker.'}
            </p>
          </div>

          <div>
            <label style={sectionTitle}>Theme</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
              {Object.entries(THEMES).map(([key, theme]) => {
                const active = selectedTheme === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTheme(key as keyof typeof THEMES);
                      scrollPreviewToTop();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: active ? `1px solid ${C.accentBorder}` : `1px solid ${C.border}`,
                      background: active ? C.accentBg : 'rgba(255,255,255,0.02)',
                      color: active ? '#a5b4fc' : C.muted,
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{theme.emoji}</span>
                    <span>{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <label style={{ ...sectionTitle, marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SlidersHorizontal style={{ width: '12px', height: '12px' }} />
                Editor Controls
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setThemeOptions(DEFAULT_THEME_OPTIONS)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: C.muted,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowEditorControls(prev => !prev)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '8px',
                    border: `1px solid ${C.border}`,
                    background: 'rgba(255,255,255,0.02)',
                    color: '#a1a1aa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label={showEditorControls ? 'Collapse editor controls' : 'Expand editor controls'}
                  title={showEditorControls ? 'Collapse controls' : 'Expand controls'}
                >
                  {showEditorControls ? <ChevronUp style={{ width: '13px', height: '13px' }} /> : <ChevronDown style={{ width: '13px', height: '13px' }} />}
                </button>
              </div>
            </div>
            {showEditorControls && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {[
                    ['showAvatar', 'Avatar'],
                    ['showBio', 'Bio'],
                    ['showStats', 'Stats'],
                  ].map(([key, label]) => {
                    const k = key as keyof ThemeOptions;
                    return (
                      <button key={key} onClick={() => updateOption(k, !themeOptions[k] as never)} style={optionButton(Boolean(themeOptions[k]))}>
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Layout Density
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {['compact', 'comfortable'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => updateOption('layout', mode as ThemeOptions['layout'])}
                        style={optionButton(themeOptions.layout === mode)}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Repository Sort
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {[
                      ['featured', 'Featured'],
                      ['stars', 'Stars'],
                      ['name', 'Name'],
                    ].map(([sort, label]) => (
                      <button
                        key={sort}
                        onClick={() => updateOption('repoSort', sort as ThemeOptions['repoSort'])}
                        style={optionButton(themeOptions.repoSort === sort)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Card Style
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {['soft', 'sharp'].map(style => (
                        <button
                          key={style}
                          onClick={() => updateOption('cardStyle', style as ThemeOptions['cardStyle'])}
                          style={optionButton(themeOptions.cardStyle === style)}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Text Scale
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {['sm', 'md', 'lg'].map(size => (
                        <button
                          key={size}
                          onClick={() => updateOption('textScale', size as ThemeOptions['textScale'])}
                          style={optionButton(themeOptions.textScale === size)}
                        >
                          {size.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Palette style={{ width: '11px', height: '11px' }} /> Accent Color
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    {ACCENT_SWATCHES.map(color => (
                      <button
                        key={color}
                        onClick={() => updateOption('accentColor', color)}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '999px',
                          border: themeOptions.accentColor === color ? '2px solid #fff' : `1px solid ${C.border}`,
                          background: color,
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${C.border}`, background: '#18181b', borderRadius: '9px', padding: '6px 8px' }}>
                    <input
                      type="color"
                      value={themeOptions.accentColor}
                      onChange={e => updateOption('accentColor', e.target.value)}
                      style={{ width: '22px', height: '22px', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
                    />
                    <input
                      value={themeOptions.accentColor.toUpperCase()}
                      onChange={e => {
                        const val = e.target.value.trim();
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) updateOption('accentColor', val as never);
                      }}
                      onBlur={() => {
                        const v = themeOptions.accentColor;
                        if (!/^#[0-9A-Fa-f]{6}$/.test(v)) updateOption('accentColor', DEFAULT_THEME_OPTIONS.accentColor);
                      }}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: C.text,
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {profile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={sectionTitle}>
                  Repositories <span style={{ color: C.accent }}>({selectedRepos.size}/{profile.projects.length})</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={selectAll}
                    style={{ fontSize: '10px', fontWeight: 700, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 6px' }}
                  >
                    All
                  </button>
                  <span style={{ color: C.border }}>|</span>
                  <button
                    onClick={selectNone}
                    style={{ fontSize: '10px', fontWeight: 700, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 6px' }}
                  >
                    None
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#18181b', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '0 12px' }}>
                <Search style={{ width: '13px', height: '13px', color: C.muted, flexShrink: 0 }} />
                <input
                  style={{ ...input, padding: '9px 0', fontSize: '13px' }}
                  type="text"
                  placeholder="Search repos..."
                  value={repoSearch}
                  onChange={e => setRepoSearch(e.target.value)}
                />
                {repoSearch && (
                  <button onClick={() => setRepoSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
                    <X style={{ width: '12px', height: '12px', color: C.muted }} />
                  </button>
                )}
              </div>

              <div
                style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  overscrollBehaviorY: 'contain',
                  touchAction: 'pan-y',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  paddingRight: '2px',
                }}
              >
                {filteredRepos.length === 0 && (
                  <p style={{ fontSize: '12px', color: C.muted, textAlign: 'center', paddingTop: '16px' }}>No repos match.</p>
                )}
                {filteredRepos.map(repo => {
                  const active = selectedRepos.has(repo.name);
                  return (
                    <div
                      key={repo.name}
                      onClick={() => toggleRepo(repo.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '9px 11px',
                        borderRadius: '9px',
                        cursor: 'pointer',
                        border: active ? `1px solid ${C.accentBorder}` : `1px solid ${C.border}`,
                        background: active ? C.accentBg : 'rgba(255,255,255,0.015)',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '4px',
                          flexShrink: 0,
                          marginTop: '1px',
                          border: active ? `2px solid ${C.accent}` : '2px solid #3f3f46',
                          background: active ? C.accent : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}
                      >
                        {active && <Check style={{ width: '9px', height: '9px', color: '#fff' }} strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: active ? C.text : '#a1a1aa',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {repo.name}
                        </div>
                        {repo.description && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#52525b',
                              marginTop: '2px',
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {repo.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          {shortUrl ? (
            <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '14px' }}>
              <p style={{ fontSize: '9px', fontWeight: 800, color: C.success, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Portfolio Deployed</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => copyUrlWithAlert(shortUrl)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: '7px', padding: '6px', cursor: 'pointer', color: C.success, display: 'flex' }}
                >
                  <Check style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDeploy}
                  disabled={deploying || !profile || selectedRepos.size === 0}
                  style={{
                    flex: 1,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#fff',
                    background: `linear-gradient(135deg, ${C.accent}, #4f46e5)`,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    cursor: deploying ? 'not-allowed' : 'pointer',
                    opacity: deploying ? 0.6 : 1,
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {deploying ? (
                    <>
                      <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Zap style={{ width: '12px', height: '12px' }} />
                      Update Link
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShortUrl('')}
                  style={{
                    fontSize: '11px',
                    color: C.muted,
                    background: 'none',
                    border: `1px solid ${C.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: '8px 10px',
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDeploy}
              disabled={!profile || selectedRepos.size === 0 || deploying}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: !profile || selectedRepos.size === 0 || deploying ? '#1f1f23' : `linear-gradient(135deg, ${C.accent}, #4f46e5)`,
                color: !profile || selectedRepos.size === 0 || deploying ? C.muted : '#fff',
                cursor: !profile || selectedRepos.size === 0 || deploying ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: !profile || selectedRepos.size === 0 || deploying ? 'none' : '0 6px 24px rgba(99,102,241,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {deploying ? (
                <>
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                  Publishing...
                </>
              ) : (
                <>
                  <Zap style={{ width: '14px', height: '14px' }} />
                  Deploy Portfolio
                </>
              )}
            </button>
          )}
        </div>
      </aside>

      <main style={{ flex: 1, height: '100vh', overflow: 'hidden', position: 'relative', background: '#080808' }}>
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 50,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${C.border}`,
            borderRadius: '999px',
            padding: '5px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ position: 'relative', display: 'flex', width: '7px', height: '7px' }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e', animation: 'ping 1.5s ease infinite', opacity: 0.6 }} />
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'block', position: 'relative' }} />
          </span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '7px' }}>
            Live · {THEMES[selectedTheme].name}
            <span style={{ color: '#7c83ff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Grid3X3 style={{ width: '10px', height: '10px' }} /> {themeOptions.layout}
            </span>
          </span>
        </div>

        {!previewProfile ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              background: 'radial-gradient(ellipse at center, #12121a 0%, #080808 70%)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles style={{ width: '28px', height: '28px', color: '#2a2a35' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2a2a35' }}>Enter a GitHub username to begin</p>
              <p style={{ fontSize: '12px', color: '#1e1e26', marginTop: '4px' }}>Your portfolio preview renders here in real-time</p>
            </div>
          </div>
        ) : (
          <div ref={previewScrollRef} style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            <ActiveTheme profile={previewProfile} options={themeOptions} />
          </div>
        )}
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes ping { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(2); opacity:0; } }
            * { box-sizing: border-box; }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
          `,
        }}
      />
    </div>
  );
};
