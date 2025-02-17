"use client";

import { IframeVideoPlayer } from "@cobuild/ui/molecules/IframeVideoPlayer/IframeVideoPlayer";
import { AspectRatioTypeEnum } from "@cobuild/libs/media/AspectRatio";
import StartARevolution from "../components/StartRevolution";

export default function cobuild() {
  return (
    <main className="relative mx-auto mt-20 w-full max-w-screen-2xl px-3 pb-20 lg:mt-32 lg:px-24">
      <div className="flex flex-col items-end space-y-4">
        <div className="w-full overflow-hidden rounded-2xl">
          <IframeVideoPlayer
            autoplay
            embedUrl="https://www.youtube.com/embed/vwSRqaZGsPw?si=-_-KygdfvjpLDWMc"
            thumbnailUrl="https://i3.ytimg.com/vi/vwSRqaZGsPw/hqdefault.jpg"
            aspectRatio={AspectRatioTypeEnum.Horizontal}
          />
        </div>
        <div>
          <StartARevolution />
        </div>
      </div>
    </main>
  );
}
