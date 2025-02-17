import { IRevolutionConfig } from "../interfaces";
import { getPalette } from "../palette";

const config: IRevolutionConfig = {
  darkMode: true,
  name: "Shredit",
  url: "shredit.tv",
  mintActionTerm: "Collect",
  logoUrl: "/images/shreddingsassy/logo.jpeg",
  hiddenMenuItems: ["stories"],
  customMenuItems: [{ url: "creations", name: "Shredits", icon: null, onlyMobile: false }],
  socialLinks: {
    twitter: "https://twitter.com/shredit_tv",
  },
  auth: {
    dynamic: {
      environmentId: "0b814f02-d20f-4b36-9cd8-894184830c7b",
      publicKey: `-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA05jiortNBPNwJvWtOJmp
    UoOxRN8NNkgBRsktrbG3frTzLRUF9VtNfnSR6Unm1tQPDPxsu46Rutd1OJlH7uc8
    Nx+cjtiqjVWPyRxlthp/RDd45m+VOZ86WBMdkakVNjY2DQoNK4ZZ/FqQZJr58vug
    3o56+bgnpZiHqGE88G7sS3tqia3JrDa63/ZlMPIwL85ktAPGQcKwd3YRpZuudC/8
    ET2nbEAvun6SGgQUKDIfsjUjgyqoLTZX+rtqkoNYXbEqKrX1rFx2d69isymR/wdR
    eaFPrc1ObnSG2t8KDGCvTfE73ghasBOAdbV4qeFHXrpE7WoHG2EEBn7w4HXbA9Wc
    KRECyIyQeZ1yyooC7UneyyORzsYoBT8OGrpw3RzAw21LpWDm03lW0FKvvtJKatLB
    f8W7266VwuxK++/M0uMoPRitZ4jJIjMeG3fMBWiNrhApg1yjH36u4WlQoZyD1n47
    ix+4XADcTOmuRZF4nkCVSi3t03Pexe3N121zIzmDFqhbdQyeN5NT4/sWnd8RaWxz
    JnKeSs4CC4BjnypEtxK043qKjrIovCEtF2imddBd22RYjwxVhuUWvEBi19h2FNG9
    EQ3YSnRLUS7bbDv7YYca+leJTO4R0BtGk9SczyLH2zmknuWYENtCd66JLxOz+3Yz
    ZN/YXp/ElUDS/WUW8gJ3yf8CAwEAAQ==
    -----END PUBLIC KEY-----
    `,
    },
  },
  backgroundColor: "#280646",
  cardColor: getPalette("purple")[950],
  faviconUrl: "/images/shreddingsassy/logo.jpeg",
  landingPage: {
    tagline: `Discover the dopest action sports content.\nCollect Shredits. Support Athletes.`,
    baseDomain: "shredit.tv",
    backdropImage: "/images/shreddingsassy/header.png",
  },
  colorPalette: { lead: "purple" },
  upvoteIcon: {
    hasVotedUrl: "/images/shreddingsassy/shaka-voted.png",
    notVotedUrl: "/images/shreddingsassy/upvote.png",
    width: 25,
    height: 30,
  },
  backgroundPattern: null,
  hashtag: "shredit",
  defaultSeo: {
    title: "Shredit",
    description:
      "Discover the dopest action sports content where passionate athletes and fans come together to share their love for freedom and good times. #shredit",
  },
};

export default config;
