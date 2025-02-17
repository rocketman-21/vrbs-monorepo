import { VideoPlayer } from "@cobuild/ui/molecules/VideoPlayer/VideoPlayer";

interface Props {
  src: string;
  poster: string | undefined;
}

export const AuctionVideo = (props: Props) => {
  const { src, poster } = props;

  return <VideoPlayer src={src} poster={poster} />;
};
