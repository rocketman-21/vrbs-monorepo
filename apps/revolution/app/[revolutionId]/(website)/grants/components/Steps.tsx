const steps = (pointsName: string, grantsPercentage: number, revolutionName: string) => [
  {
    name: "Grant applications",
    description: `Have an idea you want to make a reality? Create for ${revolutionName}, and get paid to do it.`,
  },
  {
    name: "Continous voting",
    description: `Community members vote on projects they believe are having an impact for ${revolutionName} and the greater good.`,
  },
  {
    name: "Grants funding",
    description: `${grantsPercentage > 0 ? `${grantsPercentage}% of proceeds` : "Proceeds"} from the auctions and sales of ${pointsName} fund the ${revolutionName} grants program.`,
  },
  {
    name: "That's it!",
    description: `No proposals or bureaucracy. Earn a salary with ${revolutionName} grants, and focus on building.`,
  },
];

export const Steps = ({
  revolutionName,
  tokenName,
  pointsName,
  grantsPercentage,
}: {
  revolutionName: string;
  tokenName: string;
  pointsName: string;
  grantsPercentage: number;
}) => {
  return (
    <section className="mt-8 rounded-2xl bg-zinc-50 px-4 py-16 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Your vote matters.
          </h2>
          {/* <p className="mt-6 leading-8 text-zinc-500 lg:text-lg">
            With{" "}
            <a
              className="underline"
              target="_blank"
              href="https://vitalik.eth.limo/general/2019/12/07/quadratic.html"
            >
              quadratic funding
            </a>
            {", "}
            {revolutionName} funds the projects that matter most to the community and the greater
            public good.
          </p> */}
        </div>

        <div className="mt-16 grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:mt-24 lg:max-w-none lg:grid-cols-4">
          {steps(pointsName, grantsPercentage, revolutionName).map((item, index) => (
            <div key={item.name}>
              <div className="text-lead-600 flex items-center text-sm font-semibold leading-6">
                <svg viewBox="0 0 4 4" className="mr-4 h-1 w-1 flex-none" aria-hidden="true">
                  <circle cx={2} cy={2} r={2} fill="currentColor" />
                </svg>
                Step {index + 1}
                <div
                  className="absolute -ml-2 h-px w-screen -translate-x-full bg-zinc-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-zinc-900">
                {item.name}
              </p>
              <p className="mt-1 text-sm leading-7 text-zinc-500 lg:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
