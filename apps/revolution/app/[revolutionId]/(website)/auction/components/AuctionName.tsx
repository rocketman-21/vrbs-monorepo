import classNames from "classnames";

interface Props {
  tokenName: string;
  tokenId: string;
}

export const AuctionName = (props: Props) => {
  const { tokenName } = props;

  const tokenId = props.tokenId.toString().padStart(2, "0");

  return (
    <h1
      className={classNames(
        "text-lead-600 dark:text-lead-500 flex items-center justify-center space-x-7",
        {
          "text-5xl md:text-6xl lg:text-7xl": tokenName.length > 4,
          "text-7xl lg:text-[100px]": tokenName.length <= 4,
        },
      )}
    >
      <span className="font-black">
        {tokenName.toLowerCase() === "vrb" ? (
          <VrbsLogo className="w-[140px] lg:w-[190px]" />
        ) : (
          tokenName
        )}
      </span>
      <span className="font-light">{tokenId}</span>
    </h1>
  );
};

const VrbsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 193 77" fill="none" {...props}>
    <path
      fill="currentColor"
      d="M0 0h19.25v40.238l9.625 9.538 9.625-9.538V0h19.25l-.037 48.163L28.876 77 .037 48.163 0 0ZM77 19.25V77h19.25V38.5h19.25V19.25H77Z"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M154 0v19.25h38.5V77H154V57.75h19.25V38.5H154v19.115h-19.25V0H154Z"
      clipRule="evenodd"
    />
  </svg>
);
