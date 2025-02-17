const globalAdmins: Array<`0x${string}`> = [

] as const;

const admins: Record<string, Array<`0x${string}`>> = {

} as const;

export function isAdmin(user: `0x${string}` | null, revolutionId: string): boolean {
  if (!user) return false;
  return (
    globalAdmins.includes(user) ||
    admins[revolutionId]?.map(addr => addr.toLowerCase()).includes(user.toLowerCase())
  );
}
