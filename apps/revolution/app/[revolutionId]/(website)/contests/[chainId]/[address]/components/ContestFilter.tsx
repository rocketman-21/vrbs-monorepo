"use client";

import { IContest } from "@cobuild/database/models/revolution/contests/IContest";
import { useUrlState } from "@cobuild/libs/hooks/useUrlState";
import { useUser } from "@cobuild/libs/hooks/useUser";
import { Button } from "@cobuild/ui/atoms/Button";
import { Dropdown } from "@cobuild/ui/atoms/Dropdown";
import Medal from "@cobuild/ui/icons/Medal";
import CalendarArrowRight from "@cobuild/ui/pixel-icons/CalendarArrowRight";
import SvgChevronDown from "@cobuild/ui/pixel-icons/ChevronDown";
import SvgGift from "@cobuild/ui/pixel-icons/Gift";
import SvgPlus from "@cobuild/ui/pixel-icons/Plus";
import Zap from "@cobuild/ui/pixel-icons/Zap";
import clsx from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DonateContestModal } from "./DonateContestModal";

interface Props {
  filter: "recent" | "next-up" | "auctioned";
  contest: IContest;
}

export const ContestsFilter = (props: Props) => {
  const { filter, contest } = props;
  const { isAuthenticated, login } = useUser();
  const [_, setShowCreateModal] = useUrlState("submit");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const router = useRouter();

  return (
    <div className="flex justify-between">
      <div className="flex">
        {contest.status === "active" && (
          <Button
            onClick={() => {
              if (!isAuthenticated) return login();
              setShowCreateModal("true");
            }}
            color="outline"
            className="mr-2.5 max-sm:hidden"
          >
            <SvgPlus className="mr-1 size-4" /> Submit
          </Button>
        )}

        {contest.status !== "ended" && (
          <>
            <Button
              onClick={() => {
                if (!isAuthenticated) return login();
                setShowDonateModal(true);
              }}
              color="outline"
            >
              <SvgGift className="mr-1.5 size-4" /> Fund
              <span className="max-sm:hidden">&nbsp;to earn votes</span>
            </Button>
            <DonateContestModal
              isOpen={showDonateModal}
              closeModal={() => setShowDonateModal(false)}
              contest={contest}
            />
          </>
        )}
      </div>

      <Dropdown
        button={({ isOpen }) => (
          <button className="flex items-center">
            {filter === "next-up" && <>Top</>}
            {filter === "recent" && <>Recent</>}
            {filter === "auctioned" && <>Winners</>}
            <SvgChevronDown
              className={clsx("ml-1.5 size-4 duration-75 ease-in-out", { "-rotate-90": isOpen })}
            />
          </button>
        )}
      >
        {contest.status === "ended" && (
          <Dropdown.Item icon={Medal} onClick={() => router.push(`?filter=auctioned`)}>
            Winners
          </Dropdown.Item>
        )}
        <Dropdown.Item icon={Zap} onClick={() => router.push(`?filter=next-up`)}>
          Top
        </Dropdown.Item>
        <Dropdown.Item icon={CalendarArrowRight} onClick={() => router.push(`?filter=recent`)}>
          Recent
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};
