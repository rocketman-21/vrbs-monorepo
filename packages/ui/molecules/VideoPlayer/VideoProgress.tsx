import { useEffect, useState } from "react";

interface Props {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
}

export const VideoProgress = (props: Props) => {
  const { videoRef } = props;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current) return;
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }, 30);
    return () => clearInterval(interval);
  }, [videoRef]);

  return (
    <div className="absolute inset-x-0 bottom-0 z-[5] h-1 w-full overflow-hidden rounded-b-md">
      <div style={{ width: `${progress}%` }} className="bg-lead-300 h-full" />
    </div>
  );
};
