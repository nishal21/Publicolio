import type { Project } from '../../types';
import {
  DEFAULT_THEME_OPTIONS,
  type CardStyle,
  type TextScale,
  type ThemeOptions,
} from './ThemeProps';

export const resolveThemeOptions = (options?: ThemeOptions): ThemeOptions => ({
  ...DEFAULT_THEME_OPTIONS,
  ...options,
});

export const sortProjects = (projects: Project[], mode: ThemeOptions['repoSort']): Project[] => {
  if (mode === 'featured') return projects;
  const copy = [...projects];
  if (mode === 'stars') {
    return copy.sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
  }
  return copy.sort((a, b) => a.name.localeCompare(b.name));
};

export const textScaleMap: Record<TextScale, { title: number; body: number; meta: number }> = {
  sm: { title: 0.88, body: 0.92, meta: 0.9 },
  md: { title: 1, body: 1, meta: 1 },
  lg: { title: 1.1, body: 1.06, meta: 1.05 },
};

export const radiusByCardStyle: Record<CardStyle, string> = {
  soft: '22px',
  sharp: '8px',
};

export const withAlpha = (hexColor: string, alpha: number): string => {
  const hex = hexColor.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return `rgba(99,102,241,${alpha})`;
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};
