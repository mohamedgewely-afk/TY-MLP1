
import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  className = '',
  autoplay = false,
  muted = true,
  controls = true
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [showControls, setShowControls] = useState(true);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: isPlaying ? '1' : '0',
    mute: muted ? '1' : '0',
    controls: controls ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    loop: '1',
    playlist: videoId
  }).toString()}`;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`relative ${className}`}>
      <iframe
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full absolute inset-0 object-cover"
        style={{ border: 'none' }}
      />
      
      {showControls && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-gray-700" />
            ) : (
              <Play className="h-4 w-4 text-gray-700" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default YouTubeEmbed;
