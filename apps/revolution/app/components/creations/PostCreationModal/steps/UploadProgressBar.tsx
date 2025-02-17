interface Props {
  progress: number;
}

const UploadProgressBar = ({ progress }: Props) => {
  if (!progress) return null;

  return (
    <div className="h-6 w-full rounded-lg bg-zinc-100 dark:bg-zinc-300">
      <div
        className="bg-lead-400 dark:bg-lead-300 flex h-full items-center justify-center rounded-lg text-center text-xs leading-none text-white duration-100"
        style={{ width: `${progress}%` }}
      >
        <span>{progress > 5 ? `${progress}%` : ""}</span>
      </div>
    </div>
  );
};

export default UploadProgressBar;
