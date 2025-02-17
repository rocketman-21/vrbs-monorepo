import { Avatar } from "@cobuild/ui/atoms/Avatar";
import { ConditionalWrapper } from "@cobuild/ui/atoms/ConditionalWrapper";
import { getShortEthAddress, isShortenedEthAddress } from "@cobuild/libs/utils/account";
import { zoraProfileUrl } from "@cobuild/libs/utils/url";

export const SplitEntity = ({
  name,
  imageUrl,
  address,
  url,
  chainId,
}: {
  name: string;
  imageUrl?: string | null;
  address?: string;
  url?: string;
  chainId?: number;
}) => {
  return (
    <div className="flex items-center space-x-3">
      <Avatar id={address || name} imageUrl={imageUrl} size={30} />
      <div className="flex flex-col">
        <ConditionalWrapper
          condition={!!url}
          wrapper={children => (
            <a href={url} className="hover:underline" target="_blank">
              {children}
            </a>
          )}
        >
          <strong className="text-sm font-medium">{name}</strong>
        </ConditionalWrapper>
        {address && chainId && !isShortenedEthAddress(name) && (
          <a
            href={zoraProfileUrl(address as `0x${string}`, chainId)}
            target="_blank"
            className="text-[10px] text-zinc-500 hover:underline"
          >
            {getShortEthAddress(address)}
          </a>
        )}
      </div>
    </div>
  );
};
