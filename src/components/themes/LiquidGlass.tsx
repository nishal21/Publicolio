import React from 'react';
import type { ThemeProps } from './ThemeProps';
import { ExternalLink, Star, Code2 } from 'lucide-react';
import {
  radiusByCardStyle,
  resolveThemeOptions,
  sortProjects,
  textScaleMap,
  withAlpha,
} from './themeUtils';

export const LiquidGlass: React.FC<ThemeProps> = ({ profile, options }) => {
  const cfg = resolveThemeOptions(options);
  const projects = sortProjects(profile.projects, cfg.repoSort);
  const totalStars = projects.reduce((s, p) => s + p.stars, 0);
  const languages = [...new Set(projects.map(p => p.language).filter(Boolean))].length;
  const scale = textScaleMap[cfg.textScale];
  const cardRadius = radiusByCardStyle[cfg.cardStyle];
  const compact = cfg.layout === 'compact';

  const shellPadding = compact ? '32px 22px 64px' : '50px 34px 90px';
  const panelPadding = compact ? '20px' : '30px';
  const cardPadding = compact ? '20px' : '28px';
  const cardMinHeight = compact ? '204px' : '236px';
  const gridMin = compact ? '270px' : '318px';
  const lensRadius = cfg.cardStyle === 'soft' ? '30px' : '10px';
  const featuredRepos = projects.slice(0, compact ? 6 : 10);
  const featuredLanguages = [...new Set(projects.map(p => p.language).filter(Boolean))].slice(0, 5);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050512',
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.04) 0.6px, transparent 0.6px), radial-gradient(rgba(255,255,255,0.02) 0.4px, transparent 0.4px)',
          backgroundSize: '40px 40px, 22px 22px',
          backgroundPosition: '0 0, 8px 10px',
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '-18%',
          left: '-8%',
          width: '64vw',
          height: '64vw',
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 40%, ${withAlpha(cfg.accentColor, 0.48)} 0%, ${withAlpha(cfg.accentColor, 0.14)} 36%, transparent 72%)`,
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'lg-float-a 20s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-20%',
          right: '-10%',
          width: '58vw',
          height: '58vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 60% 40%, rgba(0,229,255,0.3) 0%, rgba(0,155,255,0.12) 42%, transparent 74%)',
          filter: 'blur(72px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'lg-float-b 18s ease-in-out infinite alternate',
        }}
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: shellPadding, position: 'relative', zIndex: 1 }}>
        <header
          style={{
            borderRadius: lensRadius,
            padding: panelPadding,
            marginBottom: compact ? '20px' : '28px',
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${withAlpha(cfg.accentColor, 0.35)}`,
            background: `linear-gradient(150deg, ${withAlpha('#ffffff', 0.11)} 0%, ${withAlpha(cfg.accentColor, 0.1)} 48%, rgba(255,255,255,0.03) 100%)`,
            backdropFilter: 'blur(26px) saturate(155%)',
            boxShadow: `0 20px 70px rgba(0,0,0,0.45), inset 0 1px 0 ${withAlpha('#ffffff', 0.28)}, inset 0 -24px 60px ${withAlpha('#000000', 0.2)}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `linear-gradient(118deg, ${withAlpha('#ffffff', 0.52)} 0%, ${withAlpha('#ffffff', 0.06)} 34%, transparent 60%)`,
              mixBlendMode: 'screen',
              opacity: 0.55,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              left: '-55%',
              width: '82%',
              height: '200%',
              transform: 'rotate(18deg)',
              pointerEvents: 'none',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 48%, transparent 100%)',
              opacity: 0.2,
              animation: 'lg-specular 8s ease-in-out infinite',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cfg.showAvatar ? '1fr minmax(170px, 220px)' : '1fr',
              gap: compact ? '18px' : '28px',
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
                  borderRadius: '999px',
                  padding: compact ? '5px 12px' : '6px 14px',
                  marginBottom: compact ? '14px' : '18px',
                  border: `1px solid ${withAlpha(cfg.accentColor, 0.32)}`,
                  background: withAlpha(cfg.accentColor, 0.17),
                }}
              >
                <span style={{ fontSize: `${10 * scale.meta}px`, color: withAlpha('#f8fbff', 0.96), fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  @{profile.username}
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: withAlpha('#ffffff', 0.7), display: 'inline-block' }} />
                <span style={{ fontSize: `${10 * scale.meta}px`, color: withAlpha('#f8fbff', 0.9), fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {projects.length} repos
                </span>
              </div>

              <h1
                style={{
                  fontSize: `clamp(${3.1 * scale.title}rem, ${7.1 * scale.title}vw, ${6.1 * scale.title}rem)`,
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.93,
                  marginBottom: compact ? '12px' : '16px',
                  color: '#f8fbff',
                  textShadow: `0 0 22px ${withAlpha(cfg.accentColor, 0.35)}`,
                  wordBreak: 'break-word',
                }}
              >
                {profile.name}
              </h1>

              {cfg.showBio && (
                <p
                  style={{
                    fontSize: `${16 * scale.body}px`,
                    color: 'rgba(235,241,255,0.7)',
                    lineHeight: 1.6,
                    maxWidth: '760px',
                    marginBottom: compact ? '14px' : '20px',
                  }}
                >
                  {profile.bio}
                </p>
              )}

              <a
                href={`https://github.com/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '999px',
                  padding: compact ? '8px 16px' : '10px 20px',
                  border: `1px solid ${withAlpha(cfg.accentColor, 0.35)}`,
                  background: `linear-gradient(140deg, ${withAlpha(cfg.accentColor, 0.34)} 0%, ${withAlpha('#4facfe', 0.26)} 100%)`,
                  color: '#eef4ff',
                  fontSize: `${13 * scale.meta}px`,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: `0 10px 26px ${withAlpha(cfg.accentColor, 0.25)}`,
                }}
              >
                <Code2 style={{ width: '14px', height: '14px' }} />
                @{profile.username}
              </a>
            </div>

            {cfg.showAvatar && (
              <div style={{ justifySelf: 'end', position: 'relative' }}>
                <div
                  style={{
                    width: compact ? '150px' : '182px',
                    height: compact ? '150px' : '182px',
                    borderRadius: '50%',
                    padding: compact ? '8px' : '10px',
                    border: `1px solid ${withAlpha(cfg.accentColor, 0.4)}`,
                    background: `linear-gradient(145deg, ${withAlpha('#ffffff', 0.22)} 0%, ${withAlpha(cfg.accentColor, 0.14)} 55%, rgba(255,255,255,0.04) 100%)`,
                    backdropFilter: 'blur(16px)',
                    boxShadow: `0 10px 30px ${withAlpha(cfg.accentColor, 0.24)}, inset 0 1px 0 ${withAlpha('#ffffff', 0.44)}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: '0',
                      background: `conic-gradient(from 0deg, ${withAlpha('#ffffff', 0.22)} 0%, transparent 28%, ${withAlpha(cfg.accentColor, 0.3)} 44%, transparent 70%, ${withAlpha('#00e5ff', 0.32)} 88%, transparent 100%)`,
                      animation: 'lg-rotate 12s linear infinite',
                    }}
                  />
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: compact ? '14px' : '18px',
              borderRadius: cfg.cardStyle === 'soft' ? '16px' : '8px',
              border: `1px solid ${withAlpha(cfg.accentColor, 0.28)}`,
              background: withAlpha('#ffffff', 0.05),
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: compact ? '10px' : '12px',
                alignItems: 'center',
              }}
            >
              {featuredLanguages.map(lang => (
                <span
                  key={lang}
                  style={{
                    fontSize: `${10 * scale.meta}px`,
                    fontWeight: 700,
                    color: '#e9f2ff',
                    borderRadius: '999px',
                    border: `1px solid ${withAlpha(cfg.accentColor, 0.32)}`,
                    background: withAlpha(cfg.accentColor, 0.16),
                    padding: '4px 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {lang}
                </span>
              ))}
              {featuredRepos.map(repo => (
                <span
                  key={repo.name}
                  style={{
                    fontSize: `${10 * scale.meta}px`,
                    fontWeight: 600,
                    color: 'rgba(240,246,255,0.82)',
                    borderRadius: '999px',
                    border: `1px solid ${withAlpha('#ffffff', 0.16)}`,
                    background: withAlpha('#ffffff', 0.04),
                    padding: '4px 10px',
                    maxWidth: '220px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={repo.name}
                >
                  {repo.name}
                </span>
              ))}
            </div>
          </div>

          {cfg.showStats && (
            <div
              style={{
                marginTop: compact ? '14px' : '18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
                gap: compact ? '10px' : '12px',
              }}
            >
              {[
                { label: 'Repositories', value: projects.length },
                { label: 'Total Stars', value: totalStars },
                { label: 'Languages', value: languages },
              ].map(stat => (
                <div
                  key={stat.label}
                  style={{
                    borderRadius: cfg.cardStyle === 'soft' ? '14px' : '8px',
                    padding: compact ? '11px 14px' : '14px 16px',
                    border: `1px solid ${withAlpha(cfg.accentColor, 0.26)}`,
                    background: withAlpha('#ffffff', 0.06),
                    boxShadow: `inset 0 1px 0 ${withAlpha('#ffffff', 0.26)}`,
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div style={{ color: '#f6f8ff', fontSize: `${25 * scale.title}px`, fontWeight: 900, letterSpacing: '-0.04em' }}>{stat.value}</div>
                  <div style={{ color: 'rgba(226,233,245,0.58)', fontSize: `${10 * scale.meta}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </header>

        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '16px',
              marginBottom: compact ? '12px' : '16px',
              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                color: '#f2f7ff',
                fontSize: `${27 * scale.title}px`,
                letterSpacing: '-0.03em',
                fontWeight: 800,
              }}
            >
              Glassified Projects
            </h2>
            <span style={{ color: 'rgba(220,230,245,0.55)', fontSize: `${11 * scale.meta}px`, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              sorted by {cfg.repoSort}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${gridMin}, 1fr))`,
              gap: compact ? '12px' : '18px',
            }}
          >
            {projects.map((project, i) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: cardRadius,
                  padding: cardPadding,
                  textDecoration: 'none',
                  minHeight: cardMinHeight,
                  position: 'relative',
                  overflow: 'hidden',
                  border: `1px solid ${withAlpha(cfg.accentColor, 0.3)}`,
                  background: `linear-gradient(150deg, ${withAlpha('#ffffff', 0.1)} 0%, ${withAlpha(cfg.accentColor, 0.08)} 52%, rgba(255,255,255,0.02) 100%)`,
                  backdropFilter: 'blur(22px) saturate(150%)',
                  boxShadow: `0 18px 44px rgba(0,0,0,0.38), inset 0 1px 0 ${withAlpha('#ffffff', 0.3)}`,
                  transition: 'transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-6px)';
                  el.style.borderColor = withAlpha(cfg.accentColor, 0.46);
                  el.style.boxShadow = `0 24px 62px rgba(0,0,0,0.48), inset 0 1px 0 ${withAlpha('#ffffff', 0.42)}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = withAlpha(cfg.accentColor, 0.3);
                  el.style.boxShadow = `0 18px 44px rgba(0,0,0,0.38), inset 0 1px 0 ${withAlpha('#ffffff', 0.3)}`;
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, ${withAlpha(cfg.accentColor, 0)} 0%, ${withAlpha(cfg.accentColor, 0.65)} 50%, ${withAlpha('#00e5ff', 0)} 100%)`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '-45%',
                    left: '-65%',
                    width: '80%',
                    height: '200%',
                    transform: 'rotate(18deg)',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.24) 48%, transparent 100%)',
                    opacity: 0.12,
                    animation: `lg-specular ${7 + (i % 4)}s ease-in-out infinite`,
                    pointerEvents: 'none',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: compact ? '10px' : '14px' }}>
                  <h3
                    style={{
                      fontSize: `${22 * scale.title}px`,
                      fontWeight: 800,
                      color: '#f7faff',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.14,
                      wordBreak: 'break-word',
                      flex: 1,
                      marginRight: '12px',
                    }}
                  >
                    {project.name}
                  </h3>
                  <div
                    style={{
                      width: compact ? '34px' : '38px',
                      height: compact ? '34px' : '38px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      border: `1px solid ${withAlpha(cfg.accentColor, 0.34)}`,
                      background: withAlpha('#ffffff', 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ExternalLink style={{ width: '14px', height: '14px', color: '#cfe6ff' }} />
                  </div>
                </div>

                <p
                  style={{
                    fontSize: `${14 * scale.body}px`,
                    color: 'rgba(224,235,248,0.72)',
                    lineHeight: 1.62,
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: compact ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.description || 'No description provided.'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: compact ? '14px' : '20px',
                    paddingTop: compact ? '10px' : '14px',
                    borderTop: `1px solid ${withAlpha(cfg.accentColor, 0.25)}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: `${10 * scale.meta}px`,
                      fontWeight: 700,
                      color: '#eaf4ff',
                      background: withAlpha(cfg.accentColor, 0.2),
                      border: `1px solid ${withAlpha(cfg.accentColor, 0.34)}`,
                      borderRadius: '999px',
                      padding: '5px 12px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {project.language || 'Code'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: `${12 * scale.meta}px`, fontWeight: 700, color: 'rgba(227,238,252,0.66)' }}>
                    <Star style={{ width: '12px', height: '12px', fill: 'rgba(250,220,60,0.72)', stroke: 'rgba(250,220,60,0.72)' }} />
                    {project.stars}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes lg-float-a {
              0% { transform: translate(0, 0) scale(1); }
              100% { transform: translate(34px, -50px) scale(1.08); }
            }
            @keyframes lg-float-b {
              0% { transform: translate(0, 0) scale(1); }
              100% { transform: translate(-28px, 38px) scale(0.94); }
            }
            @keyframes lg-specular {
              0%, 100% { transform: translateX(0) rotate(18deg); opacity: 0.06; }
              50% { transform: translateX(58%) rotate(18deg); opacity: 0.22; }
            }
            @keyframes lg-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `,
        }}
      />
    </div>
  );
};
