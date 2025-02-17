import Skeleton from "@cobuild/ui/atoms/Skeleton";

export const VotingViewSkeleton = () => {
  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex shrink-0 grow-0 space-x-20">
        <div className="w-[100px] space-y-2">
          <Skeleton height={18} width="100" rounded />
          <Skeleton height={24} width="100" rounded />
        </div>
        <div className="space-y-2">
          <Skeleton height={18} width="100" rounded />
          <Skeleton height={24} width="100" rounded />
        </div>
      </div>

      <Skeleton height={28} rounded />

      <div className="bg-card flex w-full grow flex-col space-y-6 rounded-2xl px-4 py-6">
        <Skeleton count={8} height={36} rounded />
      </div>
    </div>
  );
};
