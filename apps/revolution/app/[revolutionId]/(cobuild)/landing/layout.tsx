export const revalidate = 600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
