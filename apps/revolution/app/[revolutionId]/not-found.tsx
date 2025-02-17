import { Button } from "@cobuild/ui/atoms/Button";
import EmptyState from "@cobuild/ui/atoms/EmptyState/EmptyState";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-card flex h-svh w-full flex-col items-center justify-center">
      <EmptyState illustration="lost" />
      <h1 className="mt-2.5 text-2xl font-bold">Error 404</h1>
      <p className="mt-2.5 text-zinc-700 dark:text-zinc-300">
        The page you are looking for doesn&apos;t exists.
      </p>
      <Link href="/" className="mt-6">
        <Button size="md">Return Home</Button>
      </Link>
    </div>
  );
}
