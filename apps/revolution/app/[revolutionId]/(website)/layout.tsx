import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { Footer } from "app/components/Footer";
import WebsiteHeader from "app/components/header/WebsiteHeader";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

interface PageProps {
  params: {
    revolutionId: string;
  };
  modal: ReactNode;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { revolutionId } = params;
  return getRevolutionConfig(revolutionId).defaultSeo;
}

export default async function WebsiteLayout(props: PageProps & PropsWithChildren) {
  const { children, params } = props;
  const { revolutionId } = params;

  const revolution = await Revolutions().getById(revolutionId);

  if (!revolution) return notFound();

  return (
    <>
      <WebsiteHeader revolution={revolution} />
      {props.modal}
      {children}
      <Footer />
    </>
  );
}
