import React from 'react';
import type { ThemeProps } from './ThemeProps';
import { ArrowUpRight, Star } from 'lucide-react';
import {
  radiusByCardStyle,
  resolveThemeOptions,
  sortProjects,
  textScaleMap,
  withAlpha,
} from './themeUtils';

export const BentoGrid: React.FC<ThemeProps> = ({ profile, options }) => {
  const cfg = resolveThemeOptions(options);
  const projects = sortProjects(profile.projects, cfg.repoSort);
  const totalStars = projects.reduce((s, p) => s + p.stars, 0);
  const languages = [...new Set(projects.map(p => p.language).filter(Boolean))];
  const scale = textScaleMap[cfg.textScale];
  const compact = cfg.layout === 'compact';
  const cardRadius = radiusByCardStyle[cfg.cardStyle];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#eff1f6',
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: compact ? '24px' : '32px',
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: compact ? '12px' : '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: cfg.showAvatar ? '1fr 320px' : '1fr', gap: compact ? '12px' : '18px' }}>
          <div
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f9f8ff 100%)',
              borderRadius: cardRadius,
              padding: compact ? '34px' : '50px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 34px rgba(0,0,0,0.06)',
              minHeight: compact ? '260px' : '320px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '-76px',
                right: '-76px',
                width: '290px',
                height: '290px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${withAlpha(cfg.accentColor, 0.13)}, transparent)`,
                pointerEvents: 'none',
              }}
            />
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: withAlpha(cfg.accentColor, 0.1),
                  border: `1px solid ${withAlpha(cfg.accentColor, 0.2)}`,
                  borderRadius: '999px',
                  padding: '6px 14px',
                  marginBottom: compact ? '16px' : '22px',
                }}
              >
                {cfg.showAvatar && <img src={profile.avatarUrl} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />}
                <span style={{ fontSize: `${11 * scale.meta}px`, fontWeight: 800, color: withAlpha(cfg.accentColor, 0.98), letterSpacing: '0.04em' }}>
                  @{profile.username}
                </span>
              </div>
              <h1
                style={{
                  fontSize: `clamp(${2.6 * scale.title}rem, ${5 * scale.title}vw, ${4.8 * scale.title}rem)`,
                  fontWeight: 800,
                  letterSpacing: '-0.05em',
                  color: '#1d1d1f',
                  lineHeight: 1,
                  marginBottom: compact ? '14px' : '20px',
                  wordBreak: 'break-word',
                }}
              >
                {profile.name}
              </h1>
              {cfg.showBio && (
                <p
                  style={{
                    fontSize: `${16 * scale.body}px`,
                    color: '#6e6e73',
                    lineHeight: 1.58,
                    maxWidth: '560px',
                  }}
                >
                  {profile.bio}
                </p>
              )}
            </div>

            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#1d1d1f',
                color: '#fff',
                padding: compact ? '11px 20px' : '14px 24px',
                borderRadius: '999px',
                fontSize: `${12 * scale.meta}px`,
                fontWeight: 700,
                textDecoration: 'none',
                width: 'fit-content',
                marginTop: compact ? '18px' : '28px',
              }}
            >
              View on GitHub
              <ArrowUpRight style={{ width: '15px', height: '15px' }} />
            </a>
          </div>

          {cfg.showAvatar && (
            <div
              style={{
                borderRadius: cardRadius,
                overflow: 'hidden',
                position: 'relative',
                minHeight: compact ? '260px' : '320px',
                boxShadow: '0 8px 38px rgba(0,0,0,0.16)',
                background: '#0a0a0a',
              }}
            >
              <img src={profile.avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.88 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.12) 50%, transparent 100%)' }} />
              {cfg.showStats && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: compact ? '16px' : '22px', display: 'flex', gap: '10px' }}>
                  {[
                    { val: projects.length, lbl: 'Repos' },
                    { val: totalStars, lbl: 'Stars' },
                  ].map(s => (
                    <div
                      key={s.lbl}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(14px)',
                        borderRadius: cfg.cardStyle === 'soft' ? '12px' : '8px',
                        padding: compact ? '8px 13px' : '9px 15px',
                        border: `1px solid ${withAlpha(cfg.accentColor, 0.22)}`,
                      }}
                    >
                      <div style={{ fontSize: `${18 * scale.title}px`, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>{s.val}</div>
                      <div style={{ fontSize: `${9 * scale.meta}px`, color: 'rgba(255,255,255,0.62)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {!cfg.showAvatar && cfg.showStats && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: cardRadius,
              padding: compact ? '14px 16px' : '18px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '10px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 14px rgba(0,0,0,0.05)',
            }}
          >
            {[
              ['Repositories', projects.length],
              ['Stars', totalStars],
              ['Languages', languages.length],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <div style={{ fontSize: `${24 * scale.title}px`, fontWeight: 800, color: '#1d1d1f' }}>{value}</div>
                <div style={{ fontSize: `${10 * scale.meta}px`, color: '#8a8a8f', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {languages.length > 0 && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: cfg.cardStyle === 'soft' ? '24px' : cardRadius,
              padding: compact ? '18px 22px' : '24px 30px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
              boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 16px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ fontSize: `${10 * scale.meta}px`, fontWeight: 800, color: '#aeaeb2', textTransform: 'uppercase', letterSpacing: '0.12em', marginRight: '4px' }}>
              Languages
            </span>
            {languages.map((lang, i) => {
              const hues = [220, 330, 160, 35, 270, 190];
              const hue = hues[i % hues.length];
              return (
                <span
                  key={lang}
                  style={{
                    fontSize: `${11 * scale.meta}px`,
                    fontWeight: 700,
                    color: `hsl(${hue},60%,38%)`,
                    background: `hsl(${hue},70%,95%)`,
                    border: `1px solid hsl(${hue},60%,85%)`,
                    borderRadius: '999px',
                    padding: compact ? '4px 11px' : '5px 14px',
                  }}
                >
                  {lang}
                </span>
              );
            })}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(auto-fill, minmax(270px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: compact ? '12px' : '18px' }}>
          {projects.map((project, i) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                borderRadius: cardRadius,
                padding: compact ? '24px' : '30px',
                minHeight: compact ? '210px' : '236px',
                textDecoration: 'none',
                boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 20px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-5px) scale(1.01)';
                el.style.boxShadow = `0 20px 56px ${withAlpha(cfg.accentColor, 0.18)}`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = '0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 20px rgba(0,0,0,0.05)';
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: [
                    `linear-gradient(90deg, ${cfg.accentColor}, #34aadc)`,
                    'linear-gradient(90deg,#30d158,#34c759)',
                    'linear-gradient(90deg,#ff375f,#ff6b6b)',
                    'linear-gradient(90deg,#bf5af2,#9b59b6)',
                    'linear-gradient(90deg,#ff9f0a,#ffcc00)',
                    'linear-gradient(90deg,#5ac8fa,#007aff)',
                  ][i % 6],
                }}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: compact ? '10px' : '14px' }}>
                  <h3
                    style={{
                      fontSize: `${20 * scale.title}px`,
                      fontWeight: 800,
                      color: '#1d1d1f',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.15,
                      wordBreak: 'break-word',
                      flex: 1,
                      marginRight: '10px',
                    }}
                  >
                    {project.name}
                  </h3>
                  <div
                    style={{
                      width: compact ? '34px' : '40px',
                      height: compact ? '34px' : '40px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: '#f5f5f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowUpRight style={{ width: '15px', height: '15px', color: '#1d1d1f' }} />
                  </div>
                </div>
                <p
                  style={{
                    fontSize: `${13 * scale.body}px`,
                    color: '#86868b',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: compact ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.description || 'Explore this project on GitHub.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: compact ? '16px' : '22px', paddingTop: compact ? '12px' : '16px', borderTop: '1px solid #f0f0f5' }}>
                <span
                  style={{
                    fontSize: `${10 * scale.meta}px`,
                    fontWeight: 800,
                    color: withAlpha(cfg.accentColor, 0.98),
                    background: withAlpha(cfg.accentColor, 0.08),
                    border: `1px solid ${withAlpha(cfg.accentColor, 0.2)}`,
                    borderRadius: '999px',
                    padding: compact ? '4px 10px' : '5px 14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {project.language || 'Code'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: `${12 * scale.meta}px`, fontWeight: 600, color: '#aeaeb2' }}>
                  <Star style={{ width: '12px', height: '12px', fill: '#ffcc00', stroke: '#ffcc00' }} />
                  {project.stars}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
