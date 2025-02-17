import FullScreenIcon from "../../pixel-icons/Scale";

interface Props {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
}

export const VideoFullScreenButton = (props: Props) => {
  const { videoRef } = props;

  return (
    <button
      className="hover:text-lead-100 absolute bottom-4 right-4 z-[5] flex w-[30px] items-center justify-center text-white outline-none"
      onClick={() => videoRef.current?.requestFullscreen()}
    >
      <FullScreenIcon className="h-5 w-5" />
    </button>
  );
};
