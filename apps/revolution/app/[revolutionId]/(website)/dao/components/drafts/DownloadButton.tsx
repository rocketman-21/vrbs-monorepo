import { Tooltip } from "@cobuild/ui/atoms/Tooltip/Tooltip";
import SvgDownload from "@cobuild/ui/pixel-icons/Download";

interface DownloadButtonProps {
  content: string; // This will be the markdown content you want to download
  filename: string; // Desired name of the file
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ content, filename }) => {
  // Convert content to a blob
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  return (
    <Tooltip subtitle="Download as MDX">
      <a
        href={url}
        download={`${filename}.md`}
        className="flex items-center justify-center rounded-full bg-zinc-100 p-2 text-zinc-800 duration-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        <SvgDownload className="h-4 w-4" />
      </a>
    </Tooltip>
  );
};

export default DownloadButton;
