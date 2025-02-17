import { getPinJobs } from "@cobuild/libs/storage/Pinata";

export const revalidate = 0;

export default async function PinataPage() {
  const { rows, count } = await getPinJobs();

  return (
    <section className="dark:bg-page relative mt-20 bg-zinc-100 py-12 md:pb-16">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-6">
        <div>Files in queue: {count}</div>
        {rows.length > 0 && (
          <div className="mt-12 overflow-x-auto">
            <table className="min-w-full border border-zinc-200">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2 text-left text-zinc-600">IPFS Hash</th>
                  <th className="border-b px-4 py-2 text-left text-zinc-600">Queued at</th>
                  <th className="border-b px-4 py-2 text-left text-zinc-600">Region(s)</th>
                  <th className="border-b px-4 py-2 text-left text-zinc-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(job => (
                  <tr key={job.id} className="bg-card hover:bg-zinc-50">
                    <td className="border-b px-4 py-2">
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${job.ipfs_pin_hash}`}
                        target="_blank"
                        className="text-zinc-950 duration-100 ease-in-out hover:underline"
                      >
                        {job.ipfs_pin_hash}
                      </a>
                    </td>
                    <td className="border-b px-4 py-2">
                      {new Date(job.date_queued).toLocaleString()}
                    </td>
                    <td className="border-b px-4 py-2">
                      {job.pin_policy.regions.map(r => r.id).join(", ")}
                    </td>
                    <td className="border-b px-4 py-2">{job.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
