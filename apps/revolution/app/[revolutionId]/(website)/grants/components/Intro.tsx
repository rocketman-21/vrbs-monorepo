import { Grants } from "@cobuild/database/models/revolution/grants/Grants";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { VRBS_GRANTS_PROXY } from "@cobuild/database/models/revolution/revolutions/addresses";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  revolutionId: string;
}

export const Intro = async (props: Props) => {
  const { revolutionId } = props;

  const [grantsCount, revolution, buildersCount, opportunitiesCount, totalEarned] =
    await Promise.all([
      Grants().countForRevolution(revolutionId),
      Revolutions().getById(revolutionId),
      Grants().countBuilders(revolutionId),
      Grants().countOpportunities(revolutionId),
      Grants().getTotalEarnedForGrants(VRBS_GRANTS_PROXY),
    ]);

  if (!revolution) return notFound();

  const links = [
    { name: "Vote", href: "#vote" },
    { name: "Check opportunities", href: `/${revolutionId}/opportunities` },
    { name: `Apply for a grant`, href: `/${revolutionId}/grants/apply` },
  ];

  const stats = [
    { name: "Grants", value: grantsCount },
    { name: "Builders", value: buildersCount },
    { name: "Opportunities", value: opportunitiesCount },
    {
      name: "Earned so far",
      value: Intl.NumberFormat("en", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(totalEarned),
    },
  ];

  return (
    <section className="bg-lead-500 relative isolate overflow-hidden rounded-2xl py-8 lg:py-20">
      <Image
        src={revolution.config.grantsImage || "/images/vrbs/backdrop.jpeg"}
        alt=""
        width="1500"
        height="500"
        priority
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover opacity-50 mix-blend-multiply"
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight text-white lg:text-7xl">
            {revolution.name} Grants
          </h2>
          <p className="mt-6 leading-7 text-white/80 lg:text-xl lg:leading-8">
            Get paid <strong>every second</strong> to bring your best ideas to life with{" "}
            {revolution.name} and make positive impact in the world.
          </p>
        </div>

        <div className="mt-8 lg:mt-10">
          <div className="flex flex-col max-md:gap-y-4 md:flex-row md:gap-x-12">
            {links.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="font-semibold leading-7 text-white underline-offset-4 hover:underline"
              >
                {link.name} <span aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
          <dl className="mt-12 grid grid-cols-2 items-start gap-8 lg:mt-16 lg:max-w-3xl lg:grid-cols-4">
            {stats.map(stat => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-sm leading-7 text-white/80 md:text-base">{stat.name}</dt>
                <dd className="text-2xl font-medium tracking-tight text-white lg:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
