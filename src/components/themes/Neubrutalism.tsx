import React from 'react';
import type { ThemeProps } from './ThemeProps';
import { Code2, ArrowRight, Star } from 'lucide-react';
import {
  radiusByCardStyle,
  resolveThemeOptions,
  sortProjects,
  textScaleMap,
} from './themeUtils';

const PALETTE = [
  { bg: '#FF3B30', txt: '#fff', shadow: '#c41e14' },
  { bg: '#32D74B', txt: '#000', shadow: '#1fa432' },
  { bg: '#FFD60A', txt: '#000', shadow: '#c9a900' },
  { bg: '#0A84FF', txt: '#fff', shadow: '#0055cc' },
  { bg: '#BF5AF2', txt: '#fff', shadow: '#8a2dc4' },
  { bg: '#FF9F0A', txt: '#000', shadow: '#cc7200' },
];

export const Neubrutalism: React.FC<ThemeProps> = ({ profile, options }) => {
  const cfg = resolveThemeOptions(options);
  const projects = sortProjects(profile.projects, cfg.repoSort);
  const scale = textScaleMap[cfg.textScale];
  const compact = cfg.layout === 'compact';
  const cardRadius = radiusByCardStyle[cfg.cardStyle];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0ede6',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: compact ? '36px 24px 76px' : '46px 38px 96px' }}>
        <header
          style={{
            background: '#ffffff',
            border: '4px solid #000',
            boxShadow: '12px 12px 0 #000',
            borderRadius: cardRadius,
            marginBottom: compact ? '28px' : '42px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: compact ? '8px' : '10px',
              background: `repeating-linear-gradient(90deg, ${cfg.accentColor} 0px, ${cfg.accentColor} 20px, #FFD60A 20px, #FFD60A 40px, #32D74B 40px, #32D74B 60px, #0A84FF 60px, #0A84FF 80px)`,
            }}
          />

          <div style={{ padding: compact ? '30px 28px' : '46px 52px', display: 'flex', gap: compact ? '24px' : '42px', alignItems: 'center', flexWrap: 'wrap' }}>
            {cfg.showAvatar && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 0, background: cfg.accentColor, border: '4px solid #000', transform: 'translate(8px, 8px)', borderRadius: cfg.cardStyle === 'soft' ? '12px' : '6px' }} />
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  style={{
                    width: compact ? '140px' : '170px',
                    height: compact ? '140px' : '170px',
                    display: 'block',
                    objectFit: 'cover',
                    position: 'relative',
                    border: '4px solid #000',
                    borderRadius: cfg.cardStyle === 'soft' ? '12px' : '6px',
                  }}
                />
              </div>
            )}

            <div style={{ flex: 1, minWidth: '240px' }}>
              <h1
                style={{
                  fontSize: `clamp(${2.7 * scale.title}rem, ${5.6 * scale.title}vw, ${5.7 * scale.title}rem)`,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.04em',
                  color: '#000',
                  lineHeight: 0.9,
                  marginBottom: compact ? '16px' : '22px',
                  wordBreak: 'break-word',
                }}
              >
                {profile.name}
              </h1>

              <a
                href={`https://github.com/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#000',
                  color: '#fff',
                  border: '3px solid #000',
                  padding: compact ? '10px 18px' : '12px 22px',
                  fontSize: `${12 * scale.meta}px`,
                  fontWeight: 800,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: cfg.showBio ? (compact ? '14px' : '20px') : 0,
                  boxShadow: `5px 5px 0 ${cfg.accentColor}`,
                  borderRadius: cfg.cardStyle === 'soft' ? '10px' : '4px',
                  transition: 'box-shadow 0.12s, transform 0.12s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translate(3px, 3px)';
                  el.style.boxShadow = `2px 2px 0 ${cfg.accentColor}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translate(0, 0)';
                  el.style.boxShadow = `5px 5px 0 ${cfg.accentColor}`;
                }}
              >
                <Code2 style={{ width: '15px', height: '15px' }} />
                @{profile.username}
              </a>

              {cfg.showBio && (
                <p style={{ fontSize: `${15 * scale.body}px`, fontWeight: 500, lineHeight: 1.6, color: '#333', maxWidth: '560px' }}>{profile.bio}</p>
              )}
            </div>

            {cfg.showStats && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  width: compact ? '88px' : '98px',
                  height: compact ? '88px' : '98px',
                  borderRadius: '50%',
                  background: '#FFD60A',
                  border: '4px solid #000',
                  boxShadow: '5px 5px 0 #000',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: `${30 * scale.title}px`, fontWeight: 900, lineHeight: 1 }}>{projects.length}</span>
                <span style={{ fontSize: `${8 * scale.meta}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Projects</span>
              </div>
            )}
          </div>
        </header>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: compact ? '22px' : '36px' }}>
          <h2
            style={{
              fontSize: `clamp(${2.2 * scale.title}rem, ${4.8 * scale.title}vw, ${4.2 * scale.title}rem)`,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              color: '#000',
              background: '#FFD60A',
              border: '4px solid #000',
              padding: compact ? '6px 20px' : '8px 24px',
              boxShadow: '7px 7px 0 #000',
              display: 'inline-block',
              transform: 'rotate(-1.2deg)',
            }}
          >
            The Works.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(auto-fill, minmax(260px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: compact ? '16px' : '22px' }}>
          {projects.map((project, i) => {
            const pal = PALETTE[i % PALETTE.length];
            return (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: pal.bg,
                  border: '4px solid #000',
                  boxShadow: `8px 8px 0 ${pal.shadow}`,
                  borderRadius: cardRadius,
                  padding: compact ? '24px' : '28px',
                  textDecoration: 'none',
                  minHeight: compact ? '208px' : '236px',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translate(4px, 4px)';
                  el.style.boxShadow = `4px 4px 0 ${pal.shadow}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translate(0, 0)';
                  el.style.boxShadow = `8px 8px 0 ${pal.shadow}`;
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '14px',
                    fontSize: compact ? `${82 * scale.title}px` : `${96 * scale.title}px`,
                    fontWeight: 900,
                    color: 'rgba(0,0,0,0.08)',
                    lineHeight: 1,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                <h3
                  style={{
                    fontSize: `${23 * scale.title}px`,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    color: pal.txt,
                    wordBreak: 'break-word',
                    marginBottom: compact ? '12px' : '15px',
                    lineHeight: 1.1,
                    position: 'relative',
                  }}
                >
                  {project.name}
                </h3>

                <div style={{ background: '#fff', border: '3px solid #000', padding: compact ? '12px 14px' : '13px 15px', flex: 1, marginBottom: compact ? '14px' : '18px' }}>
                  <p
                    style={{
                      fontSize: `${12 * scale.body}px`,
                      color: '#111',
                      lineHeight: 1.6,
                      fontWeight: 500,
                      display: '-webkit-box',
                      WebkitLineClamp: compact ? 2 : 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description || 'No description provided. Check the repository for details.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: `${10 * scale.meta}px`,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      background: '#fff',
                      border: '3px solid #000',
                      padding: compact ? '4px 10px' : '5px 12px',
                      color: '#000',
                    }}
                  >
                    {project.language || 'Code'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: `${13 * scale.meta}px`, fontWeight: 900, color: pal.txt }}>
                      <Star style={{ width: '13px', height: '13px', fill: pal.txt, stroke: pal.txt }} />
                      {project.stars}
                    </span>
                    <div style={{ width: compact ? '34px' : '36px', height: compact ? '34px' : '36px', flexShrink: 0, background: '#000', border: '3px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight style={{ width: '15px', height: '15px', color: '#fff' }} />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
