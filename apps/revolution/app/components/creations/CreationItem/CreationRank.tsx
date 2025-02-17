import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  rank: number;
}

export const CreationRank = (props: Props) => {
  const { rank } = props;

  if (rank < 1 || rank > 3) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 * rank }}
      className="absolute right-2 md:right-4"
    >
      <Tooltip title={`Postion #${rank}`} subtitle={getComment(rank)}>
        <Image
          src={`/images/utility-img/medal-${rank}.svg`}
          width={28}
          height={28}
          className="size-5 md:size-7"
          alt={`Postion #${rank}`}
        />
      </Tooltip>
    </motion.div>
  );
};

function getComment(rank: number) {
  switch (rank) {
    case 1:
      return `Will it be the next winner?`;
    case 2:
      return "Runner-up";
    case 3:
      return "Rising star";
    default:
      return "";
  }
}
