import type { DeveloperProfile } from '../../types';

export type ThemeLayout = 'compact' | 'comfortable';
export type RepoSort = 'featured' | 'stars' | 'name';
export type CardStyle = 'soft' | 'sharp';
export type TextScale = 'sm' | 'md' | 'lg';

export interface ThemeOptions {
  showStats: boolean;
  showAvatar: boolean;
  showBio: boolean;
  accentColor: string;
  layout: ThemeLayout;
  repoSort: RepoSort;
  cardStyle: CardStyle;
  textScale: TextScale;
}

export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
  showStats: true,
  showAvatar: true,
  showBio: true,
  accentColor: '#6366f1',
  layout: 'comfortable',
  repoSort: 'featured',
  cardStyle: 'soft',
  textScale: 'md',
};

export interface ThemeProps {
  profile: DeveloperProfile;
  options?: ThemeOptions;
}
