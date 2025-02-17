import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { PostCreationBanner } from "app/components/creations/PostCreationBanner";
import { Hero } from "app/components/hero/Hero";
import { Creations } from "app/components/homepage/Creations";

interface Props {
  params: { revolutionId: string };
}

const RevolutionPage = async (props: Props) => {
  const { revolutionId } = props.params;
  const { landingPage, name, logoUrl } = getRevolutionConfig(revolutionId);

  return (
    <>
      {landingPage.backdropImage && (
        <Hero
          name={name}
          backdropImage={landingPage.backdropImage}
          tagline={landingPage.tagline}
          logoUrl={logoUrl}
        />
      )}

      <main className="mx-auto w-full max-w-screen-2xl items-center px-4 pb-12 lg:px-6">
        <section className="my-8">
          <Creations revolutionId={revolutionId} />
          <PostCreationBanner
            title="Join the movement."
            subtitle="Post your creations, get paid for content and earn voting power!"
            ctaText="Share your creation"
            revolutionId={revolutionId}
            className="mt-4"
          />
        </section>
      </main>
    </>
  );
};

export default RevolutionPage;
