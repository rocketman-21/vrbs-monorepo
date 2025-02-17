import { getNetworkLogoUrl, getNetworkName } from "@cobuild/libs/web3/utils";
import Image from "next/image";
import { ConditionalWrapper } from "../../atoms/ConditionalWrapper";
import { Tooltip } from "../../atoms/Tooltip/Tooltip";

interface Props {
  chainId: number;
  showLabel?: boolean;
  label?: string;
  showTooltip?: boolean;
  size?: number | `${number}`;
  className?: string;
}

export const NetworkLogo = (props: Props) => {
  const {
    chainId,
    showLabel,
    showTooltip = false,
    size = 16,
    className = "",
    label = getNetworkName(chainId),
  } = props;

  const name = getNetworkName(chainId);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <ConditionalWrapper
        condition={showTooltip}
        wrapper={children => (
          <Tooltip subtitle={name} className="inline-flex shrink-0">
            {children}
          </Tooltip>
        )}
      >
        <Image
          src={getNetworkLogoUrl(chainId)}
          alt={name}
          width={size}
          height={size}
          style={{ width: size, height: size }}
          className="mr-1.5 inline-flex shrink-0"
        />
      </ConditionalWrapper>
      {showLabel && <span>{label}</span>}
    </span>
  );
};
