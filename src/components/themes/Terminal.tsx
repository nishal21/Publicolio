import React from 'react';
import type { ThemeProps } from './ThemeProps';
import { Star, ExternalLink } from 'lucide-react';
import {
  radiusByCardStyle,
  resolveThemeOptions,
  sortProjects,
  textScaleMap,
  withAlpha,
} from './themeUtils';

export const Terminal: React.FC<ThemeProps> = ({ profile, options }) => {
  const cfg = resolveThemeOptions(options);
  const projects = sortProjects(profile.projects, cfg.repoSort);
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
  const scale = textScaleMap[cfg.textScale];
  const compact = cfg.layout === 'compact';
  const cardRadius = radiusByCardStyle[cfg.cardStyle];
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0c0c',
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        color: '#00ff41',
        padding: compact ? '22px' : '36px',
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div
          style={{
            background: '#161718',
            border: `1px solid ${withAlpha(cfg.accentColor, 0.35)}`,
            borderRadius: cardRadius,
            overflow: 'hidden',
            boxShadow: '0 34px 76px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ background: '#252526', padding: compact ? '11px 16px' : '13px 18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #2a2a2a' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', flexShrink: 0 }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', flexShrink: 0 }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', flexShrink: 0 }} />
            <span style={{ flex: 1, textAlign: 'center', fontSize: `${11 * scale.meta}px`, color: '#666', letterSpacing: '0.05em' }}>
              portfolio - {profile.username}@github.com
            </span>
          </div>

          <div style={{ padding: compact ? '22px' : '30px', lineHeight: 1.68 }}>
            <div style={{ marginBottom: compact ? '18px' : '26px', fontSize: `${12 * scale.meta}px` }}>
              <div style={{ color: '#555', marginBottom: '4px' }}>
                <span style={{ color: '#00ff41' }}>system</span> initialized at {timestamp}
              </div>
              <div style={{ color: '#555' }}>
                <span style={{ color: '#00ff41' }}>arch</span> serverless/spa · <span style={{ color: '#00ff41' }}>runtime</span> browser · <span style={{ color: '#00ff41' }}>theme</span> terminal
              </div>
            </div>

            <div style={{ marginBottom: compact ? '26px' : '34px' }}>
              <div style={{ fontSize: `${12 * scale.meta}px`, color: '#444', marginBottom: '10px' }}>$ whoami</div>
              <div
                style={{
                  background: 'rgba(0,255,65,0.03)',
                  border: '1px solid rgba(0,255,65,0.15)',
                  borderRadius: cfg.cardStyle === 'soft' ? '9px' : '3px',
                  padding: compact ? '16px 18px' : '20px 24px',
                  display: 'flex',
                  gap: compact ? '18px' : '24px',
                  alignItems: 'flex-start',
                }}
              >
                {cfg.showAvatar && (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      style={{
                        width: compact ? '64px' : '76px',
                        height: compact ? '64px' : '76px',
                        borderRadius: cfg.cardStyle === 'soft' ? '8px' : '3px',
                        objectFit: 'cover',
                        filter: `grayscale(100%) brightness(0.7) sepia(1) hue-rotate(80deg) saturate(3) drop-shadow(0 0 6px ${withAlpha(cfg.accentColor, 0.42)})`,
                        border: '1px solid rgba(0,255,65,0.2)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        right: '-5px',
                        width: '13px',
                        height: '13px',
                        borderRadius: '50%',
                        background: '#00ff41',
                        border: '2px solid #0b0c0c',
                        animation: 'blink 1.2s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ color: '#00ff41', fontWeight: 700, fontSize: `${compact ? 26 : 30 * scale.title}px`, letterSpacing: '-0.02em' }}>{profile.name}</span>
                    <span style={{ color: '#444', fontSize: `${13 * scale.meta}px` }}>#{profile.username}</span>
                  </div>
                  <a href={`https://github.com/${profile.username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5aebff', fontSize: `${12 * scale.meta}px`, textDecoration: 'none', display: 'block', marginBottom: cfg.showBio ? '10px' : '0' }}>
                    github.com/{profile.username}
                  </a>
                  {cfg.showBio && <div style={{ color: '#888', fontSize: `${13 * scale.body}px`, lineHeight: 1.58, maxWidth: '560px' }}>{profile.bio}</div>}
                  {cfg.showStats && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#6ce38d', fontSize: `${11 * scale.meta}px` }}>{projects.length} repos</span>
                      <span style={{ color: '#6ce38d', fontSize: `${11 * scale.meta}px` }}>{totalStars} stars</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '14px', fontSize: `${12 * scale.meta}px`, color: '#444' }}>
              $ ls -la ./repositories/ <span style={{ color: '#00ff41' }}>({projects.length} items)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '8px' : '10px' }}>
              {projects.map((project, i) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: compact ? '24px 1fr auto' : '28px 1fr auto',
                    gap: compact ? '10px' : '14px',
                    alignItems: 'center',
                    padding: compact ? '10px 12px' : '12px 14px',
                    background: 'rgba(0,255,65,0.02)',
                    border: '1px solid rgba(0,255,65,0.07)',
                    borderRadius: cfg.cardStyle === 'soft' ? '7px' : '2px',
                    textDecoration: 'none',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(0,255,65,0.07)';
                    el.style.borderColor = 'rgba(0,255,65,0.24)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(0,255,65,0.02)';
                    el.style.borderColor = 'rgba(0,255,65,0.07)';
                  }}
                >
                  <span style={{ color: '#333', fontSize: `${11 * scale.meta}px`, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#00ff41', fontWeight: 600, fontSize: `${13 * scale.body}px`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      drwxr-xr-x <span style={{ color: '#5aebff', marginLeft: '8px' }}>{project.name}/</span>
                    </div>
                    {project.description && <div style={{ color: '#555', fontSize: `${11 * scale.meta}px`, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}># {project.description}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: compact ? '10px' : '14px', flexShrink: 0 }}>
                    {project.language && <span style={{ fontSize: `${10 * scale.meta}px`, color: '#666', whiteSpace: 'nowrap' }}>[{project.language}]</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#555', fontSize: `${11 * scale.meta}px` }}>
                      <Star style={{ width: '10px', height: '10px' }} />
                      {project.stars}
                    </span>
                    <ExternalLink style={{ width: '11px', height: '11px', color: '#333' }} />
                  </div>
                </a>
              ))}
            </div>

            <div style={{ marginTop: compact ? '20px' : '30px', fontSize: `${12 * scale.meta}px`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#00ff41' }}>→</span>
              <span style={{ color: '#444' }}>~/portfolio</span>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '16px',
                  background: '#00ff41',
                  animation: 'cursor-blink 1.1s step-end infinite',
                  verticalAlign: 'middle',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes cursor-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            @keyframes blink { 0%, 100% { opacity: 1; box-shadow: 0 0 6px #00ff41; } 50% { opacity: 0.4; } }
          `,
        }}
      />
    </div>
  );
};
