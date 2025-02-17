import { IRevolution, Serialized } from "@cobuild/database/types";
import { etherscanNetworkUrl } from "@cobuild/libs/utils/url";
import { formatVotes } from "app/components/Votes";
import capitalize from "lodash/capitalize";
import Link from "next/link";
import pluralize from "pluralize";
import { IFaqItem } from "../FaqItem";

export const revolutionFaq = (revolution: Serialized<IRevolution>): IFaqItem[] => {
  const collectibleName = revolution.collectibleName;

  const votesName = revolution.points?.name || "votes";

  const votesNameWithoutTrailingS = votesName.replace(/s$/, "").toLowerCase();

  const daoName = `${revolution.name}${revolution.name.toLowerCase().endsWith("dao") ? "" : " DAO"}`;

  const votesShortName = revolution.config.votesShortName || "votes";

  let soldPerDay = 1;

  if (revolution.revolutionId === "characters") {
    soldPerDay = 2;
  }

  return [
    {
      type: "summary",
      question: `WTF is ${revolution.name}`,
      answer: (
        <>
          <div>
            {revolution.name} is a global, community-run organization that uses money raised by the
            community to fund open-source technology, art and public-works projects.{" "}
            {revolution.name} positively impacts the world by funding ideas and fostering
            permissionless collaboration.
          </div>
          <br />
          <div>
            Ownership in {revolution.name} is accessible to anyone. {revolution.name} rewards
            creators, builders, and community participants with money and voting power, and the
            community builds out the {revolution.name} vision, together.
          </div>
          <br />
          <div>
            Anyone can earn a living and decision making power in {revolution.name} for their
            efforts.
          </div>
        </>
      ),
    },
    {
      question: "How can I help?",
      type: "summary",
      answer: (
        <>
          <div>
            There&apos;s a way for everyone to get involved with {revolution.name}. Whether
            you&apos;re an artist, athlete, scientist, professional, academic, engineer, organizer,
            designer, content creator, educator, worker etc, {revolution.name} funds people and
            projects of all sizes and domains.
          </div>
          <br />
          <div>If you&apos;re excited about {revolution.name}, there&apos;s a place for you.</div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}/grants`, text: "Start building" },
    },
    {
      question: `How does it work`,
      type: "summary",
      answer: (
        <>
          <div>
            Our community raises money through the sale of {pluralize(collectibleName)} and votes.
            The money raised is held in our community treasury, and we collectively decide how to
            spend it to further our mission.
          </div>
          <br />
          <div>
            Artists create {pluralize(collectibleName)}, and the community votes on their favorite
            art piece. {revolution.name} artwork is original work and stored directly onchain (not
            IPFS). Every day, the community chooses the next {collectibleName} to send to auction.
          </div>
          <br />
          <div>
            {collectibleName} auction proceeds are split between the treasury and the artist behind
            each {collectibleName}. Artists who have their art auctioned receive their split of
            proceeds in the form of {votesName} and ETH. The proportion of votes and ETH artists
            receive is configurable by {daoName}.
          </div>
          <br />
          <div>
            {`${votesName} are a nontransferable token that tracks your contributions to ${revolution.name}. Votes can be purchased at any time, by anyone. The price of votes is determined by a continuous `}
            <a
              href="https://www.paradigm.xyz/2022/08/vrgda"
              target="_blank"
              rel="noopener noreferrer"
            >
              VRGDA
            </a>
            .
            {` On average, ${(revolution.vrgda?.perTimeUnit || 0) / 1e18} votes are sold every day.`}
          </div>
          <br />
          <div>
            All {collectibleName} holders are members of {daoName}. One {collectibleName} is equal
            to {formatVotes(revolution.votingPower?.tokenVoteWeight || 0, "revolution")} votes. The
            treasury is controlled exclusively by {collectibleName} and {votesName} holders via
            governance.
          </div>
        </>
      ),
    },

    {
      question: `How is  ${revolution.name} different from Nouns?`,
      type: "summary",
      answer: (
        <div>
          <div>
            Ownership in {revolution.name} is accessible to everyone, and available at any price
            point.
          </div>
          <br />

          <div>
            There are two ways to get voting power in {revolution.name}:{" "}
            <ul>
              <li>
                Win the{" "}
                <Link href={`/${revolution.revolutionId}/auction`}>{collectibleName} auction</Link>
              </li>
              <li>
                <Link href={`/${revolution.revolutionId}?buyPoints=true`}>Buy</Link> or{" "}
                <Link href={`/${revolution.revolutionId}?createSplit=true`}>earn</Link> any fraction
                of {votesName} directly
              </li>
            </ul>
          </div>

          <br />

          <div>
            The DAO is governed 50/50 by {collectibleName} and {votesName} holders.
          </div>

          <br />

          <div>Vote sales are not exclusionary, but are accessible to all.</div>

          <br />

          <div>
            The {collectibleName} daily auction puts up the top voted art piece as chosen by the
            community, and profits are split with the artist.
          </div>
        </div>
      ),
    },
    {
      question: `How is ${revolution.name} similar to Nouns?`,
      type: "summary",
      answer: (
        <>
          <div>
            {revolution.name} is inspired by{" "}
            <a href="https://nouns.wtf/" target="_blank">
              Nouns
            </a>
            . {pluralize(collectibleName, soldPerDay, true)}, every day, forever.
          </div>
          <br />

          <div>
            Many of the{" "}
            <Link href={`/${revolution.revolutionId}?viewContracts=true`}>contracts</Link> are a
            fork of Nouns.
          </div>
          <br />
          <div>
            Like Nouns, {revolution.name} is a community-run organization that uses money raised by
            the community to fund open-source technology, art and public-works projects.
          </div>
          <br />
          <div>
            {revolution.name} committed at the protocol level to a targeted issuance of {votesName}{" "}
            every day through a{" "}
            <a
              href="https://www.paradigm.xyz/2022/08/vrgda"
              target="_blank"
              rel="noopener noreferrer"
            >
              VRGDA
            </a>
            , and an auction of {pluralize(collectibleName, soldPerDay, true)} every day, forever.
          </div>
          <br />
          <div>
            {revolution.name} is CC0. No one owns the brand, and you can use it any way you want,
            without asking for permission from anyone.
          </div>

          <br />
          <div>
            last but not least,
            <br />
            ⌐◨-◨
          </div>
        </>
      ),
    },
    {
      question: `Why does it matter?`,
      type: "summary",
      answer: (
        <>
          <div>
            {revolution.name} is important because it incentivizes anyone to help build a positive
            future for everyone. Instead of working for a corporation with a sole pursuit of profit,
            you can spend your time and energy growing community-led impact in the world that
            benefits the public.
          </div>
          <br />
          <div>{revolution.name} empowers you to spend your time building for a better future.</div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}/grants`, text: "Start building" },
    },
    {
      question: `What is our purpose?`,
      type: "summary",
      answer: (
        <>
          <div>{revolution.dao?.purpose}</div>
        </>
      ),
    },
    {
      question: `How is creating for ${revolution.name} different?`,
      type: "building",
      answer: (
        <>
          <div>
            The {revolution.name} brand is in the{" "}
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              public domain
            </a>
            . This means you can use the {revolution.name} logo and brand any way you want, without
            asking for permission from anyone.
          </div>
          <br />
          <div>
            <strong>No one is in charge.</strong> The community as a whole makes the most important
            decisions via a DAO proposal.
          </div>
          <br />
          <div>
            <strong>Earn a say.</strong> Your efforts to build {revolution.name} are rewarded with
            voting power and money.
          </div>
          <br />
          <div>
            <strong>You can get funded immediately.</strong> Through various funding routes like{" "}
            <a href={`/${revolution.revolutionId}/dao`} target="_blank" rel="noopener noreferrer">
              DAO proposals
            </a>{" "}
            and{" "}
            <a
              href={`/${revolution.revolutionId}/grants`}
              target="_blank"
              rel="noopener noreferrer"
            >
              grants
            </a>
            , you can be paid to help build and grow {revolution.name}.
          </div>
          <br />
          <div>
            <strong>You have a support network.</strong> The {revolution.name} community is ready to
            help and excited to try out what you create.
          </div>
          <br />
          <div>
            <strong>You can build anything.</strong> {revolution.name} funds all types of projects
            and people.
          </div>
          <br />
          <div>
            <strong>You can get started immediately.</strong> There&apos;s no one to ask for
            permission. Let your imagination run wild and help us build a global movement defined by
            positive impact for everyone.
          </div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}/grants`, text: "Start building" },
    },

    {
      question: "Daily Auctions",
      type: "auction",
      answer: (
        <>
          <div>
            The {revolution.name} Auction Contract acts as a self-sufficient {collectibleName}{" "}
            generation and distribution mechanism, auctioning one {collectibleName} every 24 hours,
            forever. The top voted art piece from the {revolution.name} Art Race is chosen by the
            community every day to be the next {collectibleName}.
          </div>
          <br />
          <div>
            A portion of auction proceeds (ETH) are automatically deposited in the {revolution.name}{" "}
            DAO treasury. The artist behind each {collectibleName} is paid the remaining portion of
            the auction proceeds in the form of ETH and {votesName} at a rate configurable by the
            DAO.
          </div>
          <br />
          <div>
            Each time an auction is settled, the settlement transaction will also cause a new{" "}
            {collectibleName} to be minted and a new 24 hour auction to begin. While settlement is
            most heavily incentivized for the winning bidder, it can be triggered by anyone.
          </div>
        </>
      ),
      cta: { url: "#", text: `Bid on the next ${collectibleName}` },
    },
    {
      question: "How can I submit art for the auction?",
      type: "auction",
      answer: (
        <>
          <div>
            Anyone can submit art pieces to the {revolution.name} Art Race. The community votes on
            their favorite to become the next {collectibleName}.
          </div>
          <br />
          {revolution.cultureIndex?.checklist && (
            <div className="whitespace-pre-line">
              The guidelines for creating the next {collectibleName} are as follows:
              <br />
              {revolution.cultureIndex?.checklist}
            </div>
          )}
        </>
      ),
      cta: {
        url: `/${revolution.revolutionId}/creations?create=true`,
        text: `Create the next ${collectibleName}`,
      },
    },
    {
      question: "How are artists paid?",
      type: "auction",
      answer: (
        <>
          <div>
            For every {collectibleName} chosen for the daily auction,{" "}
            {(revolution.auction?.creatorRateBPS || 0) / 100}% of the auction proceeds are reserved
            to pay the artist who created the {collectibleName}.
          </div>
          <br />
          <div>
            Of the {Number(revolution.auction?.creatorRateBPS || 0) / 100}% of the winning bid
            reserved for the artist, {(revolution.auction?.creatorPayment.etherBPS || 0) / 100}% is
            paid to the artist directly in ETH, and the remaining{" "}
            {(revolution.auction?.creatorPayment.pointsBPS || 0) / 100}% is used to purchase{" "}
            {votesName} for the artist(s).
          </div>
          <br />
          <div>
            Up to {revolution.cultureIndex?.MAX_NUM_CREATORS || 21} artists can collaborate on a
            piece and receive payment and {votesName} if their art is chosen to be the next{" "}
            {collectibleName}.
          </div>
        </>
      ),
    },
    {
      question: "How is the next " + collectibleName + " chosen?",
      type: "auction",
      answer: (
        <>
          <div>
            The community votes on art pieces in the {revolution.cultureIndex?.name || "Art Race"}.
            The art piece with the most votes when the previous auction is settled is removed from
            the list of eligible pieces and auctioned off as the next {collectibleName}.
          </div>
          <br />
          <div>
            Owning one {collectibleName} gets you{" "}
            {formatVotes(revolution.votingPower?.tokenVoteWeight || 0, "revolution")} votes, and one{" "}
            {votesName.toLowerCase()} is {revolution.votingPower?.pointsVoteWeight || 0} vote. Your
            votes are not “used”, they are like an “upvote”. You can vote on as many art pieces as
            you wish to help decide the next {collectibleName}.
          </div>
          <br />
          <div>
            Pieces must reach a quorum of at least{" "}
            {Math.round((revolution.cultureIndex?.quorumVotesBPS || 0) / 100)}% of the total supply
            of votes in order to be auctioned off.
          </div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}/creations`, text: `View all creations` },
    },

    {
      question: votesName,
      type: "voting",
      answer: (
        <>
          <div>
            {votesName} are an ERC20 token that tracks your contributions to {revolution.name}. They
            are nontransferable, and can be purchased at any time. {capitalize(votesShortName)} are
            divisible up to 18 decimal places, like ETH.
          </div>
          <br />
          <div>
            When you buy {votesName}, the money you spend to buy them goes directly to the{" "}
            {revolution.name} treasury, which is governed by the DAO. Owning one {votesName} counts
            as one vote in the DAO. {votesName} and voting power are non-transferable but
            delegatable, which means you can assign your voting power to someone else.
          </div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}?buyPoints=true`, text: `Buy ${votesName}` },
    },

    {
      question: `How are ${votesName} sold?`,
      type: "voting",
      answer: (
        <>
          <div>
            {votesName} are sold using a novel token issuance mechanism called a{" "}
            <a href="https://www.paradigm.xyz/2022/08/vrgda" target="_blank">
              VRGDA
            </a>
            . Basically, {revolution.name} sells an average of{" "}
            {formatVotes(revolution.vrgda?.perTimeUnit || 0, "revolution")} {votesName} every day.
            This is accomplished by raising prices when sales are ahead of schedule and lowering
            prices when sales are behind schedule. You can read more about{" "}
            <a href="https://www.paradigm.xyz/2022/08/vrgda" target="_blank">
              VRGDAs
            </a>{" "}
            here and check out the implementation for {revolution.name}{" "}
            <a
              href="https://github.com/collectivexyz/revolution-protocol/blob/main/packages/revolution/src/RevolutionPointsEmitter.sol"
              target="_blank"
            >
              here
            </a>
            .
          </div>
        </>
      ),
    },

    {
      question: `How can I earn ${votesName}?`,
      type: "voting",
      answer: (
        <>
          <div>
            {votesName} can be earned by splitting revenue from your {revolution.name} endeavors
            with the {revolution.name} treasury. {revolution.name} offers a set of splits contracts
            to make this easier. In the future, the DAO might reward activity it deems valuable with{" "}
            {votesName}.
          </div>
          <br />
          <div>
            You can integrate directly with the {revolution.name} votes emitter contract. Any money
            earned for the {revolution.name} treasury that is sent through the{" "}
            <a
              target="_blank"
              href="https://github.com/collectivexyz/revolution-protocol/blob/c77eef3e88960e776e45ab53c54dad49011d7ce9/packages/revolution/src/RevolutionPointsEmitter.sol#L186"
            >
              buyToken
            </a>{" "}
            function can earn the builder or other recipients {votesName} for their efforts.
          </div>
        </>
      ),
    },
    {
      question: `What is ${daoName}?`,
      type: "dao",
      answer: (
        <>
          <div>
            {daoName} utilizes a fork of{" "}
            <a
              target="_blank"
              href="https://github.com/nounsDAO/nouns-monorepo/blob/master/packages/nouns-contracts/contracts/governance/NounsDAOLogicV2.sol"
            >
              Nouns DAO V2
            </a>{" "}
            and is the main governing body of the {revolution.name} ecosystem.
          </div>
          <br />
          <div>
            Each {collectibleName} sold through the daily {collectibleName} auctions is an
            irrevocable member of {daoName} and entitled to{" "}
            {formatVotes(revolution.votingPower?.tokenVoteWeight || 0, "revolution")} votes in all
            governance matters.
          </div>
          <br />
          <div>
            Each {votesName} sold through the {revolution.name} Votes Emitter contract grants you
            voting rights in {daoName}.
          </div>
          <br />
          <div>
            Voting power is non-transferable (if you sell your {collectibleName} the vote goes with
            it) but delegatable, which means you can assign your vote to someone else.
          </div>
        </>
      ),
    },
    {
      question: `How does ${revolution.name} make decisions?`,
      type: "dao",
      answer: (
        <>
          <div>
            {revolution.name} makes its most important decisions via proposals to the DAO. The
            community votes on proposed actions for the DAO to execute. If the vote passes, the
            actions are executed onchain.
          </div>
          <br />
          <div>
            Proposals are usually requests for funding, but they can also be used to change certain
            parameters like the DAO quorum or the proportion of auction proceeds reserved for the
            creator.
          </div>
        </>
      ),
    },
    {
      question: `How is voting power calculated in ${revolution.name}?`,
      type: "voting",
      answer: (
        <>
          <div>
            Voting is calculated using the {revolution.name} Voting Power contract. Owning one{" "}
            {collectibleName} collectible gets you{" "}
            {formatVotes(revolution.votingPower?.tokenVoteWeight || 0, "revolution")} votes, and one{" "}
            {votesNameWithoutTrailingS} gets you one vote.
          </div>
          <br />
          <div>
            Votes are linked to the {collectibleName} collectible and {votesName}, and are built off
            of OpenZeppelin&apos;s{" "}
            <a
              target="_blank"
              href="https://github.com/collectivexyz/revolution-protocol/blob/main/packages/revolution/src/base/VotesUpgradeable.sol"
            >
              Votes.sol
            </a>{" "}
            which means you can delegate your votes to others if you wish.
          </div>
          <br />
          {revolution.addresses?.revolutionVotingPower && (
            <div>
              <a
                target="_blank"
                href={etherscanNetworkUrl(
                  revolution.addresses?.revolutionVotingPower,
                  revolution.chainId,
                  "address",
                )}
              >
                The voting power contract
              </a>{" "}
              surfaces a set of helpful utilities for calculating votes and building experiences on
              top of {revolution.name} voting power.
            </div>
          )}
        </>
      ),
    },
    {
      question: `How is voting power calculated in ${revolution.name}?`,
      type: "dao",
      answer: (
        <>
          <div>
            Voting is calculated using the {revolution.name} Voting Power contract. Owning one{" "}
            {collectibleName} collectible gets you{" "}
            {formatVotes(revolution.votingPower?.tokenVoteWeight || 0, "revolution")} votes, and one{" "}
            {votesNameWithoutTrailingS} gets you one vote.
          </div>
          <br />
          <div>
            Votes are linked to the {collectibleName} collectible and {votesName}, and are built off
            of OpenZeppelin&apos;s{" "}
            <a
              target="_blank"
              href="https://github.com/collectivexyz/revolution-protocol/blob/main/packages/revolution/src/base/VotesUpgradeable.sol"
            >
              Votes.sol
            </a>{" "}
            which means you can delegate your votes to others if you wish.
          </div>
          <br />
          {revolution.addresses?.revolutionVotingPower && (
            <div>
              <a
                target="_blank"
                href={etherscanNetworkUrl(
                  revolution.addresses?.revolutionVotingPower,
                  revolution.chainId,
                  "address",
                )}
              >
                The voting power contract
              </a>{" "}
              surfaces a set of helpful utilities for calculating votes and building experiences on
              top of {revolution.name} voting power.
            </div>
          )}
        </>
      ),
    },
    {
      question: "What is the proposal veto right?",
      type: "dao",
      answer: (
        <>
          <div>
            Similar to Nouns DAO, {revolution.name} has a proposal veto right to prevent the passage
            of malicious proposals. This veto is seen as an emergency measure. The founders of{" "}
            {revolution.name} are committed to researching a more sophisticated game-theoretic
            approach to replace the veto right in the future.
          </div>
          <br />
          <div>
            The {revolution.name} founders consider the veto an emergency power that should not be
            exercised in the normal course of business. The {revolution.name} founders will exercise
            the veto right in situations where proposals pose significant legal or existential
            threats to the {daoName} or its founders. Examples of such proposals include, but are
            not limited to:
          </div>
          <ul>
            <li>Proposals that unfairly extract treasury funds for personal benefit.</li>
            <li>
              Proposals that involve bribing voters to facilitate treasury withdrawals for personal
              gain.
            </li>
            <li>
              Proposals that aim to change the {collectibleName} auction or {votesName} timing to
              manipulate or maintain a voting majority.
            </li>
            <li>
              Proposals that suggest upgrades to critical smart contracts without a prior audit.
            </li>
          </ul>
          <br />
          <div>
            There are unfortunately no algorithmic solutions for making these determinations in
            advance (if there were, the veto would not be required), and proposals must be
            considered on a case by case basis.
          </div>
        </>
      ),
    },
    {
      question: "What is a split?",
      type: "building",
      answer: (
        <>
          <div>
            A split is a payable account that you can use to split revenue with the{" "}
            {revolution.name} treasury. ETH sent to the split account is shared with the{" "}
            {revolution.name} treasury at a rate you decide.
          </div>
          <br />
          <div>
            Money earned for the treasury will earn the recipients of the split votes. Imagine you
            want to sell a {revolution.name} branded product, you can direct 10% of your revenue to
            the {revolution.name} treasury through a split, and earn votes for yourself or your
            consumers in the process.
          </div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}/auction/?createSplit=true`, text: "Create a split" },
    },
    {
      question: `What are ${revolution.name} grants?`,
      type: "building",
      answer: (
        <>
          <div>
            Our grants program is a unique, community-driven program designed to support builders in{" "}
            {revolution.name}. You can get paid to bring your best ideas to life without going
            through the longer process of a formal proposal. The full onchain implementation of{" "}
            {revolution.name} grants is coming soon, for now, get ahead of the game and submit an
            initiative on the Grants page.
          </div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}/grants`, text: "Submit a grant" },
    },

    {
      question: `How can I get funded to build on ${revolution.name}?`,
      type: "building",
      answer: (
        <>
          <div>
            You can make a proposal to the DAO to request funding, or create a grants application.
          </div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}/dao/drafts`, text: "Make a proposal" },
    },
    {
      question: `What kind of ideas does ${revolution.name} fund?`,
      type: "building",
      answer: (
        <>
          <div>
            {revolution.name} funds any ideas in line with our mission or any ideas in general that
            make positive impact in the public sphere. Learn more about what you can build, and find
            help getting started on the {revolution.name} Grants page.
          </div>
        </>
      ),
      cta: { url: `/${revolution.revolutionId}/grants`, text: "Learn more" },
    },
    {
      question: `What are ${revolution.name} protocol rewards?`,
      type: "building",
      answer: (
        <>
          <div>
            Protocol rewards, modeled after{" "}
            <a href="https://github.com/ourzora/zora-protocol/" target="_blank">
              Zora
            </a>
            &apos;s protocol rewards, help creators and developers earn from their contributions to
            the {revolution.name} ecosystem. A flat rate of 2.5% of all ETH paid to purchase{" "}
            {votesName.toLowerCase()} is routed to the protocol rewards contract.
          </div>
          <br />
          <div>
            This 2.5% reward can be claimed by builders (1%), referrals (0.50%), and sponsors
            (0.25%) who make an effort to direct people to buy {votesName}. The remaining 0.75% is
            reserved for the{" "}
            <a href="https://twitter.com/collectivexyz" target="_blank">
              team
            </a>{" "}
            who is developing the {revolution.name} protocol.
          </div>
          <br />
          <div>
            People can claim and earn protocol rewards by passing in their address to the `buyToken`
            function call on the{" "}
            <a
              href="https://github.com/collectivexyz/revolution-protocol/blob/main/packages/revolution/src/RevolutionPointsEmitter.sol"
              target="_blank"
            >
              Votes Emitter
            </a>{" "}
            contract. This directly incentivizes the creation of alternative frontends and contract
            implementations to earn money for the treasury by selling {votesName}.
          </div>
        </>
      ),
    },
    {
      question: `What is the ${revolution.cultureIndex?.name || "Art Race"}?`,
      type: "art-race",
      answer: (
        <>
          <div>
            The {revolution.cultureIndex?.name || "Art Race"} is a contest designed to reward
            artists in {revolution.name}.
          </div>
          <br />
          <div>
            The community votes their favorite art piece to be auctioned as the next{" "}
            {collectibleName}.
          </div>
          <br />
          <div>
            {(revolution.auction?.creatorRateBPS || 0) / 100}% of proceeds from the auction are
            split with the artist behind the piece, with{" "}
            {((revolution.auction?.creatorRateBPS || 0) *
              (revolution.auction?.entropyRateBPS || 0)) /
              1e6}
            % paid in ether, and the remaining{" "}
            {((revolution.auction?.creatorRateBPS || 0) *
              (10000 - (revolution.auction?.entropyRateBPS || 0))) /
              1e6}
            % in {votesName}.
          </div>
          <br />
          <div>
            Up to {revolution.cultureIndex?.MAX_NUM_CREATORS || 21} artists can collaborate on a
            piece and receive money and {votesName} if their art is chosen to be the next{" "}
            {collectibleName}.
          </div>
        </>
      ),
      cta: {
        url: `/${revolution.revolutionId}/creations?create=true`,
        text: `Create the next ${collectibleName}`,
      },
    },
    {
      question: "Who votes on art?",
      type: "art-race",
      answer: (
        <>
          <div>The {revolution.name} community votes on their favorite art pieces.</div>
          <br />
          <div>
            Owning one {collectibleName} gets you{" "}
            {formatVotes(revolution.cultureIndex?.tokenVoteWeight || 0, "revolution")} votes, and
            one {votesNameWithoutTrailingS} token gets you{" "}
            {revolution.cultureIndex?.pointsVoteWeight || 0}{" "}
            {pluralize("vote", revolution.cultureIndex?.pointsVoteWeight || 0)}.
          </div>
        </>
      ),
      cta: {
        url: `/${revolution.revolutionId}/creations`,
        text: `Vote on the next ${collectibleName}`,
      },
    },
    {
      question: "How is art chosen for the auction?",
      type: "art-race",
      answer: (
        <>
          <div>The {revolution.name} community votes on their favorite art pieces.</div>
          <br />
          <div>The top voted art piece is auctioned as the next {collectibleName}.</div>
          <br />{" "}
          <div>
            The piece must reach a quorum of {(revolution.cultureIndex?.quorumVotesBPS || 0) / 100}%
            in order to be eligible for auction.
          </div>
        </>
      ),
      cta: {
        url: `/${revolution.revolutionId}/creations`,
        text: `Vote on the next ${collectibleName}`,
      },
    },
    {
      question: "How can I submit art?",
      type: "art-race",
      answer: (
        <>
          <div>
            Anyone can submit art pieces to the {revolution.name} Art Race. The community votes on
            their favorite to become the next {collectibleName}.
          </div>
          <br />
          {revolution.cultureIndex?.checklist && (
            <div className="whitespace-pre-line">
              The guidelines for creating the next {collectibleName} are as follows:
              <br />
              {revolution.cultureIndex?.checklist}
            </div>
          )}
        </>
      ),
      cta: {
        url: `/${revolution.revolutionId}/creations?create=true`,
        text: `Create the next ${collectibleName}`,
      },
    },
    {
      question: `Why is the ${revolution.cultureIndex?.name || "Art Race"} important?`,
      type: "art-race",
      answer: (
        <>
          <div>
            Artists are rewarded for their work directly, and the community gets to create its
            cultural identity onchain, together.
          </div>
          <br />
          <div>Artists are traditionally underpaid and underappreciated.</div>
          <br />
          <div>The {revolution.cultureIndex?.name} is a way to change that.</div>
        </>
      ),
    },
  ];
};
