import React from 'react';
import type { ThemeProps } from './ThemeProps';
import { ArrowUpRight } from 'lucide-react';
import {
  radiusByCardStyle,
  resolveThemeOptions,
  sortProjects,
  textScaleMap,
  withAlpha,
} from './themeUtils';

export const Minimalism: React.FC<ThemeProps> = ({ profile, options }) => {
  const cfg = resolveThemeOptions(options);
  const projects = sortProjects(profile.projects, cfg.repoSort);
  const scale = textScaleMap[cfg.textScale];
  const compact = cfg.layout === 'compact';
  const cardRadius = radiusByCardStyle[cfg.cardStyle];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f8f5',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        color: '#0a0a0a',
        overflowX: 'hidden',
      }}
    >
      <header
        style={{
          borderBottom: '1px solid #e8e8e4',
          padding: compact ? '52px 6vw 40px' : '70px 7vw 58px',
          display: 'grid',
          gridTemplateColumns: cfg.showAvatar ? '1fr auto' : '1fr',
          gap: compact ? '28px' : '52px',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: compact ? '22px' : '30px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: cfg.accentColor }} />
            <span style={{ fontSize: `${10 * scale.meta}px`, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
              Portfolio - @{profile.username}
            </span>
          </div>

          <h1
            style={{
              fontSize: `clamp(${3.2 * scale.title}rem, ${8.2 * scale.title}vw, ${9 * scale.title}rem)`,
              fontWeight: 800,
              letterSpacing: '-0.06em',
              lineHeight: 0.9,
              color: '#0a0a0a',
              textTransform: 'uppercase',
              marginBottom: cfg.showBio ? (compact ? '20px' : '28px') : compact ? '16px' : '24px',
              wordBreak: 'break-word',
            }}
          >
            {profile.name}
          </h1>

          {cfg.showBio && (
            <p style={{ fontSize: `${16 * scale.body}px`, color: '#777', lineHeight: 1.68, maxWidth: '640px', marginBottom: compact ? '24px' : '34px' }}>
              {profile.bio}
            </p>
          )}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: `${12 * scale.meta}px`,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#f9f9f7',
                textDecoration: 'none',
                background: '#0a0a0a',
                padding: compact ? '11px 24px' : '13px 28px',
                borderRadius: cfg.cardStyle === 'soft' ? '10px' : '4px',
              }}
            >
              GitHub Profile
              <ArrowUpRight style={{ width: '15px', height: '15px' }} />
            </a>
            {cfg.showStats && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: `${12 * scale.meta}px`,
                  fontWeight: 700,
                  color: '#888',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: `2px solid ${withAlpha(cfg.accentColor, 0.25)}`,
                  padding: compact ? '11px 22px' : '13px 26px',
                  borderRadius: cfg.cardStyle === 'soft' ? '10px' : '4px',
                }}
              >
                {projects.length} Works
              </div>
            )}
          </div>
        </div>

        {cfg.showAvatar && (
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: compact ? '166px' : '196px',
                height: compact ? '202px' : '236px',
                overflow: 'hidden',
                borderRadius: cardRadius,
                filter: 'grayscale(100%) contrast(1.08)',
                boxShadow: `8px 8px 0 ${withAlpha(cfg.accentColor, 0.85)}`,
              }}
            >
              <img src={profile.avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        )}
      </header>

      <main style={{ padding: compact ? '0 6vw 84px' : '0 7vw 112px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: compact ? '28px 0 22px' : '38px 0 28px', borderBottom: '2px solid #0a0a0a' }}>
          <span style={{ fontSize: `${10 * scale.meta}px`, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Selected Works
          </span>
          <span style={{ fontSize: `${10 * scale.meta}px`, fontWeight: 800, color: '#0a0a0a', letterSpacing: '0.1em' }}>{String(projects.length).padStart(2, '0')}</span>
        </div>

        {projects.map((project, idx) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'grid',
              gridTemplateColumns: compact ? '46px 1fr 44px' : '54px 1fr 190px 50px',
              gap: compact ? '18px' : '30px',
              alignItems: 'center',
              padding: compact ? '26px 0' : '34px 0',
              borderBottom: '1px solid #e8e8e4',
              textDecoration: 'none',
              transition: 'padding-left 0.28s ease, border-bottom-color 0.28s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.paddingLeft = compact ? '10px' : '16px';
              el.style.borderBottomColor = withAlpha(cfg.accentColor, 0.8);
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.paddingLeft = '0';
              el.style.borderBottomColor = '#e8e8e4';
            }}
          >
            <span style={{ fontSize: `${12 * scale.meta}px`, fontWeight: 800, color: '#ccc', letterSpacing: '0.05em', fontFamily: "'JetBrains Mono', monospace" }}>
              {String(idx + 1).padStart(2, '0')}
            </span>

            <h3
              style={{
                fontSize: `clamp(${1.45 * scale.title}rem, ${2.8 * scale.title}vw, ${2.9 * scale.title}rem)`,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#0a0a0a',
                lineHeight: 1,
                wordBreak: 'break-word',
              }}
            >
              {project.name}
            </h3>

            {!compact && (
              <p
                style={{
                  fontSize: `${12 * scale.body}px`,
                  color: '#999',
                  lineHeight: 1.55,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {project.description || '-'}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <div
                style={{
                  width: compact ? '38px' : '42px',
                  height: compact ? '38px' : '42px',
                  borderRadius: '50%',
                  border: `2px solid ${cfg.accentColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ArrowUpRight style={{ width: compact ? '14px' : '16px', height: compact ? '14px' : '16px', color: cfg.accentColor }} />
              </div>
            </div>
          </a>
        ))}
      </main>
    </div>
  );
};
