"use client";

import { cn } from "@heroui/theme";
import { IconVideo } from "@tabler/icons-react";
import { useState } from "react";
import HLSPlayer from "../../core/HLSPlayer";
import ImageItem from "./ImageItem";

interface ImageGridProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: string[];
  showControls?: boolean;
  videos?: { url: string; description?: string }[];
  itemDeleted?: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  itemDeleted,
  showControls = false,
  videos,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={cn(
        "overflow-y-auto rounded-xl scrollbar-hide",
        rest.className,
      )}
    >
      <div className="grid min-h-full auto-rows-[minmax(min-content,max-content)] gap-2 md:grid-cols-2">
        {videos &&
          videos.map((video, i) =>
            video.url.endsWith("m3u8") ? (
              <HLSItem
                url={video.url}
                title={video.description}
                key={`${video.url}-${i}`}
              />
            ) : (
              <button
                className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border border-theme-light-gray bg-theme-foreground px-2 hover:border-theme-green md:h-48"
                key={video.url}
                onClick={() => {
                  open(video.url, "_blank");
                }}
              >
                <p className="text-lg font-medium">
                  {video.description || "לחץ לצפייה בסרטון"}
                </p>
                <IconVideo width={24} height={24} />
              </button>
            ),
          )}
        {images &&
          images.map((image, i) => (
            <ImageItem
              alt="image"
              className="h-64 md:h-48"
              image={image}
              key={image}
              itemDeleted={() => itemDeleted && itemDeleted(i)}
              showControls={showControls}
            />
          ))}
      </div>
    </div>
  );
};

export default ImageGrid;

function HLSItem({ url, title }: { url: string; title?: string }) {
  const [paused, setPaused] = useState(true);

  return (
    <div className="relative h-64 overflow-hidden rounded-xl md:h-48" key={url}>
      <HLSPlayer
        onVideoPlay={() => {
          setPaused(false);
        }}
        onVideoPause={() => setPaused(true)}
        src={url}
        autoplay={false}
        controls
      />
      {paused && (
        <div className="absolute top-0 h-16 w-full bg-gradient-to-b from-theme-green to-transparent">
          <p className="mt-1 text-center text-sm font-semibold text-white">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
