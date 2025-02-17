import { Skeleton } from "@cobuild/ui/atoms/Skeleton";

export function ProposalBodySkeleton() {
  return (
    <div>
      <div className="bg-card rounded-2xl p-4 lg:col-span-2 lg:p-6">
        <Skeleton height={36} rounded />

        <div className="mt-5 flex flex-col space-y-4">
          <div className="space-y-2">
            <Skeleton height={18} width={100} rounded />
            <Skeleton height={24} width={240} rounded />
          </div>
          <div className="space-y-2">
            <Skeleton height={18} width={100} rounded />
            <Skeleton height={24} width={240} rounded />
          </div>
          <div className="space-y-2">
            <Skeleton height={18} width={100} rounded />
            <Skeleton height={24} width={240} rounded />
          </div>
        </div>

        <hr className="my-3 border-zinc-200 lg:my-6 dark:border-zinc-700" />

        <div className="space-y-2">
          <Skeleton count={10} rounded height={24} />
        </div>
      </div>
    </div>
  );
}
