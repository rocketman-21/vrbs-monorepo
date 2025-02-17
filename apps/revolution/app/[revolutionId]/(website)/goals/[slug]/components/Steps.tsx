const steps = [
  {
    name: "Contest submissions",
    description: `Creators submit their best work to be voted on by the community.`,
  },
  {
    name: "Composable creation",
    description: `Each contest uses assets from previous contests, to create something beautiful, together.`,
  },
  {
    name: "Final masterpiece",
    description: `A collaboratively created series of short videos to help explain Vrbs and bring creators onchain.`,
  },
];

export const Steps = () => {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 pb-24 pt-8 sm:px-6 lg:pl-24 lg:pr-8 lg:pt-24">
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          How does it work?
        </h2>
      </div>

      <div className="mt-12 grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {steps.map((item, index) => (
          <div key={item.name}>
            <div className="flex items-center text-base font-semibold text-black dark:text-white">
              <svg
                viewBox="0 0 4 4"
                className="text-goal mr-4 size-2.5 flex-none"
                aria-hidden="true"
              >
                <circle cx={2} cy={2} r={2} fill="currentColor" />
              </svg>
              Phase #{index + 1}
              <div
                className="dark:bg-goal absolute -ml-2 h-px w-screen -translate-x-full bg-zinc-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                aria-hidden="true"
              />
            </div>
            <p className="mt-6 text-xl font-semibold leading-8 tracking-tight text-zinc-900 lg:text-xl dark:text-white">
              {item.name}
            </p>
            <p className="mt-2.5 text-base leading-relaxed text-zinc-500 dark:text-white/75">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
