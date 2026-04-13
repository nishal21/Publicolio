export interface Project {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
}

export interface DeveloperProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  projects: Project[];
}

export interface ShortenerResponse {
  shortUrl: string;
}
