import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Profiles } from "@cobuild/database/models/social/Profiles";
import { serializeSync } from "@cobuild/database/utils";
import {
  getRevolutionConfig,
  getRevolutionStyles,
  getRevolutionThemeColor,
} from "@cobuild/libs/revolution/config";
import { getFontForRevolution } from "@cobuild/libs/revolution/font";
import { getPaletteCSS } from "@cobuild/libs/revolution/palette";
import { DynamicProvider } from "@cobuild/libs/user/DynamicProvider";
import { UserProvider } from "@cobuild/libs/user/UserProvider";
import { getUser } from "@cobuild/libs/user/server";
import { VideoPlayerProvider } from "@cobuild/ui/molecules/VideoPlayer/VideoPlayerContext";
import { Notifications } from "@cobuild/ui/organisms/Notifications";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CreateSplitModal } from "app/components/CreateSplitModal";
import { RevolutionProvider } from "app/components/RevolutionProvider";
import { BuyPointsModal } from "app/components/buy-points/BuyPointsModal";
import { getAveragePointPrice } from "app/components/buy-points/points-price";
import { ViewContractsModal } from "app/components/contracts/ViewContractsModal";
import { getUserPower } from "app/libs/vote-power";
import { notFound } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";
import "styles/globals.css";
import { AnalyticsWrapper } from "../components/analytics/analytics";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    revolutionId: string;
  };
}

export default async function RootLayout(props: PropsWithChildren<PageProps>) {
  const { children, params } = props;
  const { revolutionId } = params;

  const config = getRevolutionConfig(revolutionId);
  const [revolution, user, userPower] = await Promise.all([
    Revolutions().getById(revolutionId),
    getUser(revolutionId),
    getUserPower(revolutionId),
  ]);

  if (!revolution || !config) notFound();
  const { addresses } = revolution;

  const profile = user ? await Profiles().get(user) : null;

  const font = getFontForRevolution(revolutionId);

  const averagePointPrice = getAveragePointPrice(revolutionId);

  return (
    <html lang="en" className={config.darkMode ? "dark" : "light"}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content={getRevolutionThemeColor(revolutionId)} />
        <link rel="icon" href={config.faviconUrl} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {process.env.NODE_ENV === "production" && (
          <>
            <script
              defer
              src="/stats/js/script.js"
              data-api="/stats/api/event"
              data-domain={config.url}
            />
            <script async src="/stats/js/embed.host.js" />
          </>
        )}
        {config.palette && <style>{getPaletteCSS(config.palette)}</style>}
      </head>
      <body
        className={`bg-page overscroll-none text-black dark:text-white ${font.variable} ${font.tailwindClass}`}
        style={getRevolutionStyles(revolutionId)}
      >
        <div className="flex flex-col">
          <DynamicProvider revolutionId={revolutionId}>
            <UserProvider revolutionId={revolutionId} {...userPower} profile={profile}>
              <RevolutionProvider revolution={serializeSync(revolution)}>
                <VideoPlayerProvider>
                  {addresses?.pointsEmitter && (
                    <Suspense>
                      <BuyPointsModal averagePointPrice={await averagePointPrice} />
                    </Suspense>
                  )}
                  {!!addresses && <CreateSplitModal />}
                  {!!addresses && <ViewContractsModal />}
                  <AnalyticsWrapper />
                  <Notifications />
                  {children}
                </VideoPlayerProvider>
              </RevolutionProvider>
            </UserProvider>
          </DynamicProvider>
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
