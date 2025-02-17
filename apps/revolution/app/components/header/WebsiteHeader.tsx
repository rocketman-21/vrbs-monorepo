import "server-only";

import { IRevolution } from "@cobuild/database/models/revolution/revolutions/IRevolution";
import { isParentRevolution } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { RevolutionLogoLink } from "../links/header/LogoLink";
import { CreatePostModal } from "./CreatePostModal";
import Header from "./Header";
import { MenuDesktop } from "./MenuDesktop";
import { MenuMobile } from "./MenuMobile";
import { RevolutionSelect } from "./RevolutionSelect";
import UserMenu from "./UserMenu";

export interface Props {
  revolution: IRevolution;
}

export default async function WebsiteHeader(props: Props) {
  const { revolution } = props;
  const { revolutionId } = revolution;

  return (
    <Header revolutionId={revolutionId}>
      <div className="flex items-center">
        {!isParentRevolution(revolution) && (
          <RevolutionLogoLink
            revolutionId={revolution.scope?.id}
            className="mr-2 max-sm:hidden md:mr-3.5"
          />
        )}
        <RevolutionSelect revolution={revolution} />
      </div>

      <div className="flex items-center md:space-x-6">
        <CreatePostModal />
        <MenuDesktop />
        <UserMenu revolutionId={revolutionId} />
        <MenuMobile />
      </div>
    </Header>
  );
}
