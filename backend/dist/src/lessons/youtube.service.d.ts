export declare class YoutubeService {
    private readonly logger;
    extractVideoId(url: string): string | null;
    validateUrl(url: string): Promise<{
        isValid: boolean;
        reason?: string;
        videoId?: string;
    }>;
    private validateOEmbed;
    searchAlternative(query: string): Promise<{
        videoUrl: string;
        title: string;
    } | null>;
    private extractJson;
}
