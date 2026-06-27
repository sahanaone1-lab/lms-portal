import React from 'react';
import { Play, ExternalLink, Video, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { lessonService } from '../services/apiService';

interface VideoPlayerProps {
  url: string;
  lessonId?: string;
  onPlayOrWatched?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, lessonId, onPlayOrWatched }) => {
  const [playingUrl, setPlayingUrl] = React.useState(url);
  const [playerError, setPlayerError] = React.useState(false);
  const [suggestedVideo, setSuggestedVideo] = React.useState<{ videoUrl: string; title: string } | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    setPlayingUrl(url);
    setPlayerError(false);
    setSuggestedVideo(null);
  }, [url]);

  // Load YouTube IFrame API script
  React.useEffect(() => {
    if (playingUrl && getYouTubeId(playingUrl)) {
      if (!(window as any).YT) {
        const existingTag = document.getElementById('youtube-iframe-api');
        if (!existingTag) {
          const tag = document.createElement('script');
          tag.id = 'youtube-iframe-api';
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }
      }
    }
  }, [playingUrl]);

  // Initialize YT Player
  const getYouTubeId = (videoUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(playingUrl);

  const initializePlayer = React.useCallback(() => {
    if (!containerRef.current || !youtubeId) return;

    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {}
      playerRef.current = null;
    }

    containerRef.current.innerHTML = '<div class="w-full h-full"></div>';
    const mountEl = containerRef.current.firstChild;

    try {
      playerRef.current = new (window as any).YT.Player(mountEl, {
        height: '100%',
        width: '100%',
        videoId: youtubeId,
        playerVars: {
          enablejsapi: 1,
          autoplay: 0,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === 1 || event.data === 0) {
              if (onPlayOrWatched) onPlayOrWatched();
            }
          },
          onError: (event: any) => {
            console.warn('YT Player error code:', event.data);
            setPlayerError(true);
          },
        },
      });
    } catch (err) {
      console.error('Failed to instantiate YT Player:', err);
    }
  }, [youtubeId, onPlayOrWatched]);

  React.useEffect(() => {
    let checkInterval: any;
    if (youtubeId) {
      if ((window as any).YT && (window as any).YT.Player) {
        initializePlayer();
      } else {
        checkInterval = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(checkInterval);
            initializePlayer();
          }
        }, 200);
      }
    }
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [youtubeId, initializePlayer]);

  // Fetch alternative suggestion when error occurs
  React.useEffect(() => {
    if (playerError && lessonId && !suggestedVideo && !loadingSuggestion) {
      setLoadingSuggestion(true);
      lessonService
        .suggestReplacement(lessonId)
        .then((res) => {
          setSuggestedVideo(res);
        })
        .catch((err) => {
          console.error('Failed to load alternative suggestion:', err);
        })
        .finally(() => {
          setLoadingSuggestion(false);
        });
    }
  }, [playerError, lessonId, suggestedVideo, loadingSuggestion]);

  if (!url) return null;

  // 1. YouTube Rendering
  if (youtubeId) {
    return (
      <div className="w-full space-y-3">
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-md relative">
          <div ref={containerRef} className={`w-full h-full ${playerError ? 'hidden' : 'block'}`} />
          
          {playerError && (
            <div className="absolute inset-0 bg-slate-955/95 flex flex-col items-center justify-center p-6 text-center text-white space-y-4 select-none">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-full animate-bounce">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="font-bold text-sm text-rose-400 uppercase tracking-wider">Video Unavailable</h4>
                <p className="text-xs text-slate-300">
                  This YouTube video cannot be embedded or played. It may have been deleted, marked private, or restricted by the creator.
                </p>
              </div>

              {loadingSuggestion && (
                <div className="flex items-center space-x-2 text-xs text-teal-400 font-semibold bg-teal-955/30 px-4 py-2.5 rounded-xl border border-teal-500/10">
                  <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                  <span>Searching for a high-quality replacement video...</span>
                </div>
              )}

              {suggestedVideo && (
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 animate-fade-in">
                  <div className="text-left space-y-0.5">
                    <span className="text-[9px] font-black uppercase text-teal-400 tracking-wider">Suggested Replacement</span>
                    <p className="text-xs font-bold text-slate-200 line-clamp-1">{suggestedVideo.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPlayingUrl(suggestedVideo.videoUrl);
                      setPlayerError(false);
                      setSuggestedVideo(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Use Recommended Video
                  </button>
                </div>
              )}

              {!loadingSuggestion && !suggestedVideo && (
                <p className="text-[11px] text-slate-500 italic">
                  Could not retrieve a suggested replacement for this lesson. Please contact the administrator.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Vimeo Handler
  const getVimeoId = (videoUrl: string) => {
    const match = videoUrl.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|showcase\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const vimeoId = getVimeoId(playingUrl);
  if (vimeoId) {
    return (
      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-md">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?api=1`}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo Video Player"
          onLoad={() => {
            if (onPlayOrWatched) onPlayOrWatched();
          }}
        />
      </div>
    );
  }

  // 3. Google Drive Handler
  const getGoogleDriveEmbedUrl = (videoUrl: string) => {
    const match = videoUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return null;
  };

  const driveEmbedUrl = getGoogleDriveEmbedUrl(playingUrl);
  if (driveEmbedUrl) {
    return (
      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-md">
        <iframe
          src={driveEmbedUrl}
          className="w-full h-full border-0"
          allow="autoplay"
          allowFullScreen
          title="Google Drive Video Player"
          onLoad={() => {
            if (onPlayOrWatched) onPlayOrWatched();
          }}
        />
      </div>
    );
  }

  // 4. Direct video files handler (.mp4, .webm, .ogg, .mov, etc.)
  const isDirectVideo = (videoUrl: string) => {
    return /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(videoUrl);
  };

  if (isDirectVideo(playingUrl)) {
    return (
      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-md">
        <video
          src={playingUrl}
          controls
          className="w-full h-full"
          preload="metadata"
          onPlay={onPlayOrWatched}
          onEnded={onPlayOrWatched}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // 5. Fallback Link Preview
  return (
    <div className="p-6 border border-primary/20 bg-primary/5 rounded-xl text-left flex flex-col justify-between items-start space-y-4 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
          <Video className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold font-display text-sm text-foreground">External Video Resource</h4>
          <p className="text-xs text-muted-foreground mt-0.5">This link may contain authentication requirements or custom platform restrictions. Open it in a new window to view.</p>
        </div>
      </div>
      
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-primary/10">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Resource Link</p>
          <p className="text-xs text-primary truncate hover:underline font-medium mt-0.5 max-w-lg">
            {playingUrl}
          </p>
        </div>
        <a
          href={playingUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onPlayOrWatched}
          className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-sm transition-all duration-200 whitespace-nowrap"
        >
          Open Video Resource <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
        </a>
      </div>
    </div>
  );
};
