import type { DeveloperProfile, Project } from '../types';

const CORS_PROXY = import.meta.env.VITE_CORS_PROXY_URL || '';

interface FetchOptions {
  customToken?: string;
  forceProxy?: boolean;
}

interface ShortUrlOptions {
  preferredDomain?: string;
}

const isGithubApiUrl = (url: string): boolean => url.includes('api.github.com');

const buildDirectHeaders = (customToken?: string): HeadersInit => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (customToken) {
    headers.Authorization = `Bearer ${customToken}`;
  }
  return headers;
};

async function fetchDirect(url: string, customToken?: string) {
  const response = await fetch(url, {
    headers: buildDirectHeaders(customToken),
  });
  if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
  return await response.json();
}

async function fetchViaProxy(url: string, customToken?: string) {
  if (!CORS_PROXY) {
    throw new Error('VITE_CORS_PROXY_URL is missing');
  }

  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
  const proxyHeaders: HeadersInit = {
    Accept: 'application/json',
  };

  if (customToken) {
    proxyHeaders['X-Custom-GitHub-Token'] = customToken;
  }

  const proxyResponse = await fetch(proxyUrl, {
    headers: proxyHeaders,
  });

  if (!proxyResponse.ok) {
    throw new Error(`Proxy fetch failed: ${proxyResponse.status}`);
  }

  return await proxyResponse.json();
}

async function fetchWithProxyFallback(url: string, options: FetchOptions = {}) {
  const { customToken, forceProxy = false } = options;
  const proxyAvailable = Boolean(CORS_PROXY);
  const shouldPreferProxy = forceProxy || Boolean(customToken) || (proxyAvailable && isGithubApiUrl(url));

  if (shouldPreferProxy) {
    try {
      return await fetchViaProxy(url, customToken);
    } catch (proxyError) {
      if (forceProxy) throw proxyError;
      console.warn(`Proxy fetch failed for ${url}, trying direct...`, proxyError);
      return await fetchDirect(url, customToken);
    }
  }

  try {
    return await fetchDirect(url);
  } catch (directError) {
    console.warn(`Direct fetch failed for ${url}, trying proxy...`, directError);
    return await fetchViaProxy(url);
  }
}

const mapGithubRepoToProject = (repo: any): Project => ({
  name: repo.name,
  description: repo.description || '',
  url: repo.html_url,
  stars: repo.stargazers_count || 0,
  language: repo.language || 'Unknown',
});

const toHostname = (value?: string): string | undefined => {
  if (!value) return undefined;
  const raw = value.trim();
  if (!raw) return undefined;

  try {
    const parsed = raw.includes('://') ? new URL(raw) : new URL(`https://${raw}`);
    return parsed.hostname;
  } catch {
    return undefined;
  }
};

const applyPreferredShortDomain = (url: string, preferredDomain?: string): string => {
  const preferredHost = toHostname(preferredDomain);
  if (!preferredHost) return url;

  if (url.startsWith('/')) {
    return `https://${preferredHost}${url}`;
  }

  try {
    const parsed = new URL(url);
    parsed.protocol = 'https:';
    parsed.host = preferredHost;
    return parsed.toString();
  } catch {
    return url;
  }
};

export async function fetchDeveloperData(username: string, customToken?: string): Promise<DeveloperProfile> {
  const normalizedUsername = username.trim();
  const normalizedToken = customToken?.trim() || undefined;

  // Dynamically switch endpoints based on token presence.
  // With token: pull owner repos (public + private) via /user/repos.
  // Without token: pull public repos from /users/{username}/repos.
  const profileUrl = normalizedToken
    ? 'https://api.github.com/user'
    : `https://api.github.com/users/${normalizedUsername}`;

  const repoApiUrl = normalizedToken
    ? 'https://api.github.com/user/repos?type=owner&sort=updated&per_page=500'
    : `https://api.github.com/users/${normalizedUsername}/repos?sort=updated&per_page=500`;

  const pinnedUrl = `https://gh-pinned-repos.egoist.dev/?username=${normalizedUsername}`;

  // Fetch all data in parallel
  const [profileData, pinnedData, repoData] = await Promise.all([
    fetchWithProxyFallback(profileUrl, { customToken: normalizedToken, forceProxy: true }),
    fetchWithProxyFallback(pinnedUrl).catch(() => []), // egoist API might fail, gracefully fallback to empty
    fetchWithProxyFallback(repoApiUrl, { customToken: normalizedToken, forceProxy: true }).catch(() => []), // fallback to empty if repos list fails
  ]);

  // Map raw repo API results directly to avoid accidental filtering/truncation in merge logic.
  const projectsFromApi: Project[] = Array.isArray(repoData)
    ? repoData
        .filter((repo: any) => repo?.name && repo?.html_url)
        .map((repo: any) => mapGithubRepoToProject(repo))
    : [];

  // Fallback if repo API fails completely.
  const projectsFromPinned: Project[] = Array.isArray(pinnedData)
    ? pinnedData
        .filter((repo: any) => repo?.repo && repo?.link)
        .map((repo: any) => ({
          name: repo.repo,
          description: repo.description || '',
          url: repo.link,
          stars: repo.stars ? parseInt(repo.stars.toString(), 10) : 0,
          language: repo.language || 'Unknown',
        }))
    : [];

  const projects = projectsFromApi.length > 0 ? projectsFromApi : projectsFromPinned;

  const finalUsername = profileData.login || normalizedUsername;
  return {
    username: finalUsername,
    name: profileData.name || finalUsername,
    avatarUrl: profileData.avatar_url,
    bio: profileData.bio || 'Developer',
    projects,
  };
}

export async function generateShortUrl(originalUrl: string, options: ShortUrlOptions = {}): Promise<string> {
  const { preferredDomain } = options;
  const shortenerUrl = import.meta.env.VITE_SHORTENER_URL || import.meta.env.VITE_SHORTENER_API_URL;
  if (!shortenerUrl) {
    console.warn('VITE_SHORTENER_URL (or VITE_SHORTENER_API_URL) is missing! Returning original URL for local testing.');
    return originalUrl;
  }

  try {
    const response = await fetch(shortenerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send both keys for compatibility with different worker payload contracts.
      body: JSON.stringify({ longUrl: originalUrl, url: originalUrl }),
    });

    if (!response.ok) {
      throw new Error(`Shortener failed: ${response.status}`);
    }

    const data = await response.json();
    const candidate = data.shortened_url || data.shortUrl || data.short_url || data.url || originalUrl;
    if (typeof candidate !== 'string' || !candidate.trim()) {
      return originalUrl;
    }
    return applyPreferredShortDomain(candidate, preferredDomain);
  } catch (err) {
    console.error('Error generating short URL, falling back to original URL:', err);
    return originalUrl;
  }
}

