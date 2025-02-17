interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const AuctionDetailItem = ({ title, children, className = "" }: Props) => (
  <div className="shrink-0 grow space-y-2.5 p-4 text-center lg:p-5">
    <p className="text-sm text-zinc-500 dark:text-zinc-300">{title}</p>
    <div className={`flex items-center justify-center text-2xl md:text-3xl ${className}`}>
      {children}
    </div>
  </div>
);
