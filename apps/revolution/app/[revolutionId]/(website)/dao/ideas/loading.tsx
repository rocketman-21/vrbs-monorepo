import { Skeleton } from "@cobuild/ui/atoms/Skeleton";

export default function IdeaPageSkeleton() {
  return (
    <div className="mt-6 space-y-6">
      <Skeleton count={3} height={80} rounded />
    </div>
  );
}
