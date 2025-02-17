import DonationsIcon from "@cobuild/ui/pixel-icons/Gift";
import AuctionsIcon from "@cobuild/ui/pixel-icons/Label";
import SplitsIcon from "@cobuild/ui/pixel-icons/Tournament";
import VotesIcon from "@cobuild/ui/pixel-icons/Zap";

export const funding = [
  {
    id: "auctions",
    name: "Auctions",
    description: "Funds raised through Vrb auctions",
    icon: AuctionsIcon,
  },
  {
    id: "splits",
    name: "Splits",
    description: "People splitting revenue to earn votes",
    icon: SplitsIcon,
  },
  {
    id: "donations",
    name: "Donations",
    description: "Direct contributions from supporters",
    icon: DonationsIcon,
  },
  {
    id: "votes",
    name: "Vrb Votes",
    description: "Income from the sale of our ERC20 token",
    icon: VotesIcon,
  },
] as const;
