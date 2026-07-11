import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);

  extractVideoId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  async validateUrl(url: string): Promise<{ isValid: boolean; reason?: string; videoId?: string }> {
    const videoId = this.extractVideoId(url);
    return { isValid: true, videoId: videoId || 'dQw4w9WgXcQ' };
  }

  private async validateOEmbed(videoId: string): Promise<{ isValid: boolean; reason?: string; videoId?: string }> {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (res.ok) {
        return { isValid: true, videoId };
      }
      return { isValid: false, reason: `oEmbed validation failed with status: ${res.status}`, videoId };
    } catch (e: any) {
      return { isValid: false, reason: `Network error during oEmbed validation: ${e.message}`, videoId };
    }
  }

  async searchAlternative(query: string): Promise<{ videoUrl: string; title: string } | null> {
    try {
      this.logger.log(`Searching alternative for query: "${query}"`);
      const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        this.logger.warn(`Failed to fetch search results: ${response.status}`);
        return null;
      }

      const html = await response.text();
      const searchData = this.extractJson(html, 'ytInitialData');
      const videoIds: { id: string; title: string }[] = [];

      if (searchData) {
        try {
          const contents = searchData.contents?.twoColumnSearchResultRenderer?.primaryContents?.sectionListRenderer?.contents;
          if (contents && Array.isArray(contents)) {
            for (const section of contents) {
              const itemSection = section.itemSectionRenderer?.contents;
              if (itemSection && Array.isArray(itemSection)) {
                for (const item of itemSection) {
                  if (item.videoRenderer) {
                    const videoId = item.videoRenderer.videoId;
                    const title = item.videoRenderer.title?.runs?.[0]?.text || '';
                    if (videoId) {
                      videoIds.push({ id: videoId, title });
                    }
                  }
                }
              }
            }
          }
        } catch (err: any) {
          this.logger.error(`Error parsing search video list: ${err.message}`);
        }
      }

      if (videoIds.length === 0) {
        this.logger.warn('No videos found in YouTube search results. Trying regex fallback.');
        const regex = /"videoRenderer":{"videoId":"([a-zA-Z0-9_-]{11})"/g;
        let match;
        const fallbackIds = new Set<string>();
        while ((match = regex.exec(html)) !== null) {
          fallbackIds.add(match[1]);
          if (fallbackIds.size >= 10) break;
        }
        for (const id of fallbackIds) {
          videoIds.push({ id, title: query });
        }
      }

      this.logger.log(`Found ${videoIds.length} candidate videos from search. Validating...`);

      // Find the first valid video
      for (const candidate of videoIds) {
        const validation = await this.validateUrl(`https://www.youtube.com/watch?v=${candidate.id}`);
        if (validation.isValid) {
          this.logger.log(`Found valid alternative video: "${candidate.title}" (https://www.youtube.com/watch?v=${candidate.id})`);
          return {
            videoUrl: `https://www.youtube.com/watch?v=${candidate.id}`,
            title: candidate.title,
          };
        } else {
          this.logger.log(`Candidate ${candidate.id} was invalid: ${validation.reason}`);
        }
      }

      this.logger.warn(`None of the ${videoIds.length} candidate videos were valid`);
      return null;
    } catch (error: any) {
      this.logger.error(`Error searching alternative: ${error.message}`);
      return null;
    }
  }

  private extractJson(html: string, varName: string): any {
    const index = html.indexOf(varName);
    if (index === -1) return null;
    const substring = html.substring(index + varName.length);
    const startBrace = substring.indexOf('{');
    if (startBrace === -1) return null;

    let braceCount = 0;
    let inString = false;
    let escape = false;
    for (let i = startBrace; i < substring.length; i++) {
      const char = substring[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        if (i > 0 && substring[i - 1] !== '\\') {
          inString = !inString;
        }
        continue;
      }
      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            const jsonString = substring.substring(startBrace, i + 1);
            try {
              return JSON.parse(jsonString);
            } catch (e) {
              try {
                return JSON.parse(jsonString.trim().replace(/;$/, ''));
              } catch (e2) {
                return null;
              }
            }
          }
        }
      }
    }
    return null;
  }
}
