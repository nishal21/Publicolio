import { useMemo } from 'react';
import { LandingBuilder } from './components/LandingBuilder';
import { PortfolioRenderer } from './components/PortfolioRenderer';
import { DEFAULT_THEME_OPTIONS, type ThemeOptions } from './components/themes';
import './App.css';

const parseBool = (value: string | null, fallback: boolean): boolean => {
  if (value === null) return fallback;
  return value === '1' || value.toLowerCase() === 'true';
};

const parseEnum = <T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T
): T => (value && allowed.includes(value as T) ? (value as T) : fallback);

const parseAccent = (value: string | null, fallback: string): string => {
  if (!value) return fallback;
  const normalized = value.startsWith('#') ? value : `#${value}`;
  return /^#[0-9a-fA-F]{6}$/.test(normalized) ? normalized : fallback;
};

function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const user = params.get('user');
  const theme = params.get('theme');
  const reposParam = params.get('repos');
  const options: ThemeOptions = {
    showStats: parseBool(params.get('stats'), DEFAULT_THEME_OPTIONS.showStats),
    showAvatar: parseBool(params.get('avatar'), DEFAULT_THEME_OPTIONS.showAvatar),
    showBio: parseBool(params.get('bio'), DEFAULT_THEME_OPTIONS.showBio),
    accentColor: parseAccent(params.get('accent'), DEFAULT_THEME_OPTIONS.accentColor),
    layout: parseEnum(params.get('layout'), ['compact', 'comfortable'] as const, DEFAULT_THEME_OPTIONS.layout),
    repoSort: parseEnum(params.get('sort'), ['featured', 'stars', 'name'] as const, DEFAULT_THEME_OPTIONS.repoSort),
    cardStyle: parseEnum(params.get('card'), ['soft', 'sharp'] as const, DEFAULT_THEME_OPTIONS.cardStyle),
    textScale: parseEnum(params.get('text'), ['sm', 'md', 'lg'] as const, DEFAULT_THEME_OPTIONS.textScale),
  };

  // If we have a user and theme, this is a distinct deployed portfolio link
  if (user && theme) {
    const repos = reposParam ? reposParam.split(',').filter(Boolean) : [];
    return <PortfolioRenderer username={user} theme={theme} repos={repos} options={options} />;
  }

  return (
    <>
      <LandingBuilder />
    </>
  );
}

export default App;
