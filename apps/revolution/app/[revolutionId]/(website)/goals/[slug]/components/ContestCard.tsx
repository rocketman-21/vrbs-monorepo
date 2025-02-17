import { IContest } from "@cobuild/database/models/revolution/contests/IContest";
import { Ether } from "@cobuild/ui/atoms/Ether";
import * as motion from "@cobuild/ui/atoms/Motion";
import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import Image from "next/image";
import Link from "next/link";
import { ContestStatus } from "./ContestStatus";

interface Props {
  contest: IContest;
  index: number;
  imageUrl: string;
}

export const ContestCard = async (props: Props) => {
  const { contest, index, imageUrl } = props;

  return (
    <Link href={contest.url}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.5 + index * 0.2, duration: 0.2 },
        }}
        whileHover={{ scale: 1.05 }}
        className="bg-card group relative flex min-h-80 overflow-hidden rounded-xl shadow-sm dark:bg-zinc-900"
      >
        <div className="dark:from-goal dark:to-goal absolute dark:inset-0 dark:bg-gradient-to-b dark:via-white/50 dark:to-80%" />

        <Image
          src={imageUrl}
          className="absolute h-full w-full object-cover duration-200 dark:opacity-85 dark:mix-blend-multiply dark:grayscale dark:group-hover:grayscale-0"
          width={320}
          height={320}
          alt={contest.name}
        />

        <div className="relative flex grow flex-col justify-between bg-gradient-to-b from-black/50 via-black/0 via-15% to-black/50 p-4 dark:bg-none">
          <div className="flex justify-between text-white">
            <Tooltip subtitle="Active pool">
              <span className="text-[13px] font-medium">
                <Ether amount={BigInt(contest.balance)} symbol="Ξ" />
              </span>
            </Tooltip>
            <ContestStatus status={contest.status} />
          </div>
          <h3 className="text-balance text-lg font-black text-white">{contest.name}</h3>
        </div>
      </motion.div>
    </Link>
  );
};
