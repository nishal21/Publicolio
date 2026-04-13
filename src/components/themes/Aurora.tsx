import React from 'react';
import type { ThemeProps } from './ThemeProps';
import { ExternalLink, Star, ArrowUpRight } from 'lucide-react';
import {
  radiusByCardStyle,
  resolveThemeOptions,
  sortProjects,
  textScaleMap,
  withAlpha,
} from './themeUtils';

const STRIPE_COLORS = [
  ['#7d8bff', '#56e0ff'],
  ['#6ff4bd', '#73a7ff'],
  ['#f394ff', '#7f8fff'],
  ['#ff9fa4', '#ffd976'],
  ['#85e5ff', '#7f8fff'],
  ['#81ffca', '#68d3ff'],
];

export const Aurora: React.FC<ThemeProps> = ({ profile, options }) => {
  const cfg = resolveThemeOptions(options);
  const projects = sortProjects(profile.projects, cfg.repoSort);
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
  const languages = [...new Set(projects.map(project => project.language).filter(Boolean))];
  const scale = textScaleMap[cfg.textScale];
  const compact = cfg.layout === 'compact';
  const radius = radiusByCardStyle[cfg.cardStyle];

  const shellPadding = compact ? '34px 22px 66px' : '52px 34px 92px';
  const heroPadding = compact ? '22px' : '30px';
  const cardPadding = compact ? '18px' : '24px';
  const cardMin = compact ? '272px' : '312px';
  const cardHeight = compact ? '190px' : '220px';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06070f',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(circle at 12% 8%, rgba(122,129,255,0.25) 0%, transparent 30%), radial-gradient(circle at 80% 10%, rgba(106,255,206,0.18) 0%, transparent 32%), radial-gradient(circle at 88% 86%, rgba(241,137,255,0.16) 0%, transparent 34%), #06070f',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-28%',
          left: '-18%',
          width: '78vw',
          height: '78vw',
          borderRadius: '50%',
          background: `radial-gradient(circle at 38% 44%, ${withAlpha(cfg.accentColor, 0.35)} 0%, ${withAlpha(cfg.accentColor, 0.1)} 34%, transparent 72%)`,
          filter: 'blur(62px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'au-drift-a 18s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '-16%',
          bottom: '-22%',
          width: '66vw',
          height: '66vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 60% 38%, rgba(90,214,255,0.2) 0%, rgba(255,117,225,0.12) 44%, transparent 76%)',
          filter: 'blur(72px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'au-drift-b 20s ease-in-out infinite alternate',
        }}
      />

      <div style={{ maxWidth: '1220px', margin: '0 auto', padding: shellPadding, position: 'relative', zIndex: 1 }}>
        <header
          style={{
            borderRadius: radius,
            border: `1px solid ${withAlpha(cfg.accentColor, 0.34)}`,
            background: 'linear-gradient(160deg, rgba(11,13,24,0.96) 0%, rgba(16,18,32,0.94) 50%, rgba(11,13,23,0.96) 100%)',
            padding: heroPadding,
            position: 'relative',
            overflow: 'hidden',
            marginBottom: compact ? '20px' : '28px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-35%',
              left: '-20%',
              width: '120%',
              height: '160%',
              background:
                'linear-gradient(100deg, rgba(125,139,255,0.12) 0%, rgba(86,224,255,0.08) 24%, rgba(111,244,189,0.08) 46%, rgba(243,148,255,0.08) 70%, rgba(255,159,164,0.06) 100%)',
              transform: 'rotate(-8deg)',
              filter: 'blur(16px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cfg.showAvatar ? '1fr minmax(180px, 240px)' : '1fr',
              gap: compact ? '18px' : '26px',
              alignItems: 'start',
              position: 'relative',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: compact ? '5px 12px' : '6px 14px',
                  borderRadius: '999px',
                  border: `1px solid ${withAlpha(cfg.accentColor, 0.3)}`,
                  background: withAlpha(cfg.accentColor, 0.14),
                  marginBottom: compact ? '14px' : '18px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#63ffc4', boxShadow: '0 0 8px #63ffc4', display: 'inline-block' }} />
                <span style={{ fontSize: `${10 * scale.meta}px`, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#eaf2ff' }}>
                  @{profile.username}
                </span>
              </div>

              <h1
                style={{
                  fontSize: `clamp(${2.8 * scale.title}rem, ${6.6 * scale.title}vw, ${6.2 * scale.title}rem)`,
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  lineHeight: 0.9,
                  marginBottom: cfg.showBio ? (compact ? '12px' : '16px') : compact ? '16px' : '20px',
                  color: '#f8fbff',
                  textShadow: `0 0 24px ${withAlpha(cfg.accentColor, 0.42)}`,
                  wordBreak: 'break-word',
                }}
              >
                {profile.name}
              </h1>

              {cfg.showBio && (
                <p
                  style={{
                    fontSize: `${16 * scale.body}px`,
                    color: 'rgba(229,238,255,0.74)',
                    lineHeight: 1.62,
                    maxWidth: '760px',
                    marginBottom: compact ? '14px' : '18px',
                  }}
                >
                  {profile.bio}
                </p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: compact ? '12px' : '14px' }}>
                {languages.slice(0, compact ? 4 : 6).map(language => (
                  <span
                    key={language}
                    style={{
                      fontSize: `${10 * scale.meta}px`,
                      fontWeight: 700,
                      color: '#e8f1ff',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: `1px solid ${withAlpha(cfg.accentColor, 0.24)}`,
                      background: 'rgba(255,255,255,0.04)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {language}
                  </span>
                ))}
              </div>

              <a
                href={`https://github.com/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: compact ? '9px 16px' : '11px 20px',
                  borderRadius: '999px',
                  border: `1px solid ${withAlpha(cfg.accentColor, 0.34)}`,
                  background: `linear-gradient(140deg, ${withAlpha(cfg.accentColor, 0.3)} 0%, ${withAlpha('#5fb8ff', 0.22)} 100%)`,
                  color: '#edf5ff',
                  fontSize: `${13 * scale.meta}px`,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: `0 10px 24px ${withAlpha(cfg.accentColor, 0.25)}`,
                }}
              >
                Open Profile
                <ArrowUpRight style={{ width: '15px', height: '15px' }} />
              </a>
            </div>

            {cfg.showAvatar && (
              <div style={{ justifySelf: 'end' }}>
                <div
                  style={{
                    borderRadius: cfg.cardStyle === 'soft' ? '22px' : radius,
                    border: `1px solid ${withAlpha(cfg.accentColor, 0.28)}`,
                    background: 'rgba(255,255,255,0.04)',
                    padding: compact ? '14px' : '16px',
                  }}
                >
                  <div
                    style={{
                      width: compact ? '136px' : '166px',
                      height: compact ? '136px' : '166px',
                      margin: '0 auto 12px',
                      borderRadius: '50%',
                      padding: compact ? '6px' : '8px',
                      border: `1px solid ${withAlpha(cfg.accentColor, 0.42)}`,
                      background: `conic-gradient(from 0deg, ${withAlpha(cfg.accentColor, 0.5)} 0%, rgba(111,244,189,0.36) 34%, rgba(243,148,255,0.4) 66%, rgba(86,224,255,0.42) 100%)`,
                      animation: 'au-spin 10s linear infinite',
                    }}
                  >
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        display: 'block',
                        border: `2px solid ${withAlpha('#ffffff', 0.36)}`,
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div
                      style={{
                        borderRadius: cfg.cardStyle === 'soft' ? '12px' : '6px',
                        border: `1px solid ${withAlpha(cfg.accentColor, 0.24)}`,
                        background: 'rgba(255,255,255,0.04)',
                        padding: '8px 10px',
                      }}
                    >
                      <div style={{ color: '#eef6ff', fontSize: `${15 * scale.title}px`, fontWeight: 800 }}>{projects.length}</div>
                      <div style={{ color: 'rgba(224,233,247,0.58)', fontSize: `${9 * scale.meta}px`, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Repos</div>
                    </div>
                    <div
                      style={{
                        borderRadius: cfg.cardStyle === 'soft' ? '12px' : '6px',
                        border: `1px solid ${withAlpha(cfg.accentColor, 0.24)}`,
                        background: 'rgba(255,255,255,0.04)',
                        padding: '8px 10px',
                      }}
                    >
                      <div style={{ color: '#eef6ff', fontSize: `${15 * scale.title}px`, fontWeight: 800 }}>{totalStars}</div>
                      <div style={{ color: 'rgba(224,233,247,0.58)', fontSize: `${9 * scale.meta}px`, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Stars</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {cfg.showStats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: compact ? '10px' : '14px',
              marginBottom: compact ? '16px' : '24px',
            }}
          >
            {[
              { label: 'Repositories', value: projects.length },
              { label: 'Total Stars', value: totalStars },
              { label: 'Languages', value: languages.length },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  borderRadius: cfg.cardStyle === 'soft' ? '16px' : '8px',
                  border: `1px solid ${withAlpha(cfg.accentColor, 0.24)}`,
                  background: 'rgba(255,255,255,0.05)',
                  padding: compact ? '12px 14px' : '14px 18px',
                }}
              >
                <div style={{ color: '#f3f9ff', fontSize: `${24 * scale.title}px`, fontWeight: 900, letterSpacing: '-0.04em' }}>{stat.value}</div>
                <div style={{ color: 'rgba(222,231,245,0.58)', fontSize: `${10 * scale.meta}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: compact ? '12px' : '16px',
            }}
          >
            <h2
              style={{
                color: '#f0f8ff',
                fontSize: `${27 * scale.title}px`,
                letterSpacing: '-0.03em',
                fontWeight: 800,
              }}
            >
              Aurora Atlas
            </h2>
            <span style={{ color: 'rgba(219,229,243,0.55)', fontSize: `${11 * scale.meta}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              sorted by {cfg.repoSort}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${cardMin}, 1fr))`,
              gap: compact ? '12px' : '18px',
            }}
          >
            {projects.map((project, index) => {
              const [from, to] = STRIPE_COLORS[index % STRIPE_COLORS.length];
              return (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: cardHeight,
                    borderRadius: radius,
                    padding: cardPadding,
                    textDecoration: 'none',
                    border: `1px solid ${withAlpha(cfg.accentColor, 0.24)}`,
                    background: 'linear-gradient(160deg, rgba(10,12,22,0.94) 0%, rgba(14,16,30,0.9) 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-6px)';
                    el.style.borderColor = withAlpha(cfg.accentColor, 0.42);
                    el.style.boxShadow = '0 22px 56px rgba(0,0,0,0.54)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.borderColor = withAlpha(cfg.accentColor, 0.24);
                    el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.45)';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${from} 0%, ${to} 100%)`,
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: compact ? '10px' : '14px' }}>
                    <h3
                      style={{
                        fontSize: `${20 * scale.title}px`,
                        fontWeight: 800,
                        color: '#f4fbff',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.14,
                        wordBreak: 'break-word',
                        flex: 1,
                        marginRight: '10px',
                      }}
                    >
                      {project.name}
                    </h3>
                    <ExternalLink style={{ width: '15px', height: '15px', color: 'rgba(228,237,250,0.44)', flexShrink: 0 }} />
                  </div>

                  <p
                    style={{
                      fontSize: `${13 * scale.body}px`,
                      color: 'rgba(224,233,247,0.7)',
                      lineHeight: 1.6,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: compact ? 2 : 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description || 'No description provided.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: compact ? '12px' : '16px', paddingTop: compact ? '10px' : '12px', borderTop: `1px solid ${withAlpha(cfg.accentColor, 0.2)}` }}>
                    <span
                      style={{
                        fontSize: `${10 * scale.meta}px`,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: `1px solid ${withAlpha(cfg.accentColor, 0.28)}`,
                        background: withAlpha(cfg.accentColor, 0.14),
                        color: '#eaf3ff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {project.language || 'Code'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: `${11 * scale.meta}px`, fontWeight: 700, color: 'rgba(225,234,248,0.62)' }}>
                      <Star style={{ width: '11px', height: '11px', fill: 'rgba(247,223,102,0.68)', stroke: 'rgba(247,223,102,0.68)' }} />
                      {project.stars}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes au-drift-a {
              0% { transform: translate(0, 0) scale(1); }
              100% { transform: translate(34px, -46px) scale(1.08); }
            }
            @keyframes au-drift-b {
              0% { transform: translate(0, 0) scale(1); }
              100% { transform: translate(-26px, 34px) scale(0.93); }
            }
            @keyframes au-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `,
        }}
      />
    </div>
  );
};
