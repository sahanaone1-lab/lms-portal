"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var YoutubeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const common_1 = require("@nestjs/common");
let YoutubeService = YoutubeService_1 = class YoutubeService {
    logger = new common_1.Logger(YoutubeService_1.name);
    extractVideoId(url) {
        if (!url)
            return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }
    async validateUrl(url) {
        const videoId = this.extractVideoId(url);
        if (!videoId) {
            return { isValid: false, reason: 'Invalid YouTube URL format' };
        }
        try {
            const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
            });
            if (!response.ok) {
                return { isValid: false, reason: `HTTP error fetching watch page: ${response.status}`, videoId };
            }
            const html = await response.text();
            const playerResponse = this.extractJson(html, 'ytInitialPlayerResponse');
            if (!playerResponse) {
                if (html.includes('PLAYER_ERR_OUT_OF_DATE') || html.includes('Video unavailable')) {
                    return { isValid: false, reason: 'Video unavailable (detected from static HTML text)', videoId };
                }
                return this.validateOEmbed(videoId);
            }
            const status = playerResponse.playabilityStatus?.status;
            const reason = playerResponse.playabilityStatus?.reason || 'Unknown restriction';
            if (status && status !== 'OK') {
                return { isValid: false, reason: `Playability status: ${status} (${reason})`, videoId };
            }
            const playableInEmbed = playerResponse.playabilityStatus?.playableInEmbed !== false;
            if (!playableInEmbed) {
                return { isValid: false, reason: 'Embedding is restricted by the owner', videoId };
            }
            return { isValid: true, videoId };
        }
        catch (error) {
            this.logger.error(`Error validating video ${videoId}: ${error.message}`);
            return this.validateOEmbed(videoId);
        }
    }
    async validateOEmbed(videoId) {
        try {
            const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            if (res.ok) {
                return { isValid: true, videoId };
            }
            return { isValid: false, reason: `oEmbed validation failed with status: ${res.status}`, videoId };
        }
        catch (e) {
            return { isValid: false, reason: `Network error during oEmbed validation: ${e.message}`, videoId };
        }
    }
    async searchAlternative(query) {
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
            const videoIds = [];
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
                }
                catch (err) {
                    this.logger.error(`Error parsing search video list: ${err.message}`);
                }
            }
            if (videoIds.length === 0) {
                this.logger.warn('No videos found in YouTube search results. Trying regex fallback.');
                const regex = /"videoRenderer":{"videoId":"([a-zA-Z0-9_-]{11})"/g;
                let match;
                const fallbackIds = new Set();
                while ((match = regex.exec(html)) !== null) {
                    fallbackIds.add(match[1]);
                    if (fallbackIds.size >= 10)
                        break;
                }
                for (const id of fallbackIds) {
                    videoIds.push({ id, title: query });
                }
            }
            this.logger.log(`Found ${videoIds.length} candidate videos from search. Validating...`);
            for (const candidate of videoIds) {
                const validation = await this.validateUrl(`https://www.youtube.com/watch?v=${candidate.id}`);
                if (validation.isValid) {
                    this.logger.log(`Found valid alternative video: "${candidate.title}" (https://www.youtube.com/watch?v=${candidate.id})`);
                    return {
                        videoUrl: `https://www.youtube.com/watch?v=${candidate.id}`,
                        title: candidate.title,
                    };
                }
                else {
                    this.logger.log(`Candidate ${candidate.id} was invalid: ${validation.reason}`);
                }
            }
            this.logger.warn(`None of the ${videoIds.length} candidate videos were valid`);
            return null;
        }
        catch (error) {
            this.logger.error(`Error searching alternative: ${error.message}`);
            return null;
        }
    }
    extractJson(html, varName) {
        const index = html.indexOf(varName);
        if (index === -1)
            return null;
        const substring = html.substring(index + varName.length);
        const startBrace = substring.indexOf('{');
        if (startBrace === -1)
            return null;
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
                if (char === '{')
                    braceCount++;
                if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const jsonString = substring.substring(startBrace, i + 1);
                        try {
                            return JSON.parse(jsonString);
                        }
                        catch (e) {
                            try {
                                return JSON.parse(jsonString.trim().replace(/;$/, ''));
                            }
                            catch (e2) {
                                return null;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
};
exports.YoutubeService = YoutubeService;
exports.YoutubeService = YoutubeService = YoutubeService_1 = __decorate([
    (0, common_1.Injectable)()
], YoutubeService);
//# sourceMappingURL=youtube.service.js.map