import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type CustomDomain = [string, string[], string[]];

const CUSTOM_DOMAINS: CustomDomain[] = [
  //format of ['revolutionId', ['domain1', 'domain2'], ['sub revolutionId']]
  ["thatsnounish", ["thatsnounish.com"], []],
  ["thatsgnarly", ["thatsgnar.ly"], ["dhnouns"]],
  ["ontheroofs", ["urbanexploration.wtf"], []],
  ["shreddingsassy", ["shredit.tv"], []],
  ["skateboardingcares", ["skateboardingcares.com"], []],
  ["vrbs", ["vrbs.wtf", "co.build", "vrbs.build", "ourrevolution.wtf"], []],
  ["nouns", ["houseofnouns.wtf"], []],
  ["token8", ["token8.life"], []],
  ["grounds", ["groundsdao.wtf", "grounds.wtf", "grounds.build"], []],
  ["vrbstest", ["vrbstest.build"], []],
  ["atxdao", ["atxdao.wtf"], []],
  ["durian", ["duriandao.lol"], []],
  ["dfw", ["dfw.builders"], []],
  ["characters", ["build.characters.lol"], []],
];

//for proxied plausible analytics
const IGNORE_PATHS = ["stats"];

const REVOLUTIONS = CUSTOM_DOMAINS.map(([revolutionId]) => revolutionId);

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host");
  const rootPath = url.pathname.split("/")[1];

  //if we're on co.build, redirect to /landing
  // if (hostname === "co.build" || hostname === `co.build.localhost:3000`) {
  //   url.pathname = "/vrbs/landing";
  //   return NextResponse.rewrite(url);
  // }

  for (const [mainRevolutionId, domains, subRevolutions] of CUSTOM_DOMAINS) {
    for (const domain of domains) {
      if (hostname === domain || hostname === `${domain}.localhost:3000`) {
        const revolutionIds = [mainRevolutionId, ...subRevolutions];

        //don't redirect if we're already on the correct revolution, and only redirect if we're on the root path
        for (const revolutionId of revolutionIds) {
          const { homepageRedirect } = getRevolutionConfig(revolutionId);

          if (
            url.pathname === "/" ||
            url.pathname === `/${revolutionId}` ||
            url.pathname.startsWith("/routes/")
          ) {
            url.pathname = rewritePathname(rootPath, url.pathname, revolutionId, homepageRedirect);
          }
        }

        return NextResponse.rewrite(url);
      }
    }
  }

  // On Vercel Preview, use vrbs as default revolution
  if (process.env.VERCEL === "1" && process.env.VERCEL_ENV === "preview") {
    const { homepageRedirect } = getRevolutionConfig("vrbs");
    if (url.pathname === "/" || url.pathname.startsWith("/routes/")) {
      url.pathname = rewritePathname(rootPath, url.pathname, "vrbs", homepageRedirect);
    }
    return NextResponse.rewrite(url);
  }
}

//rewrite pathname to include revolutionId
const rewritePathname = (
  rootPath: string,
  urlPathname: string,
  revolutionId: string,
  homepageRedirect?: string,
) => {
  if ((urlPathname === "/" || urlPathname === `/${revolutionId}`) && homepageRedirect) {
    return `/${revolutionId}/${homepageRedirect}`;
  }
  if (!REVOLUTIONS.includes(rootPath) && !IGNORE_PATHS.includes(rootPath)) {
    // if the url doesnt already include a revolutionId, rewrite the url to include it
    return `/${revolutionId}${urlPathname}`;
  }

  //otherwise just return the original url
  return urlPathname;
};

export const config = {
  matcher: "/((?!api|_next|images|crons|[\\w-]+\\.(?!eth)\\w+).*)/",
};
