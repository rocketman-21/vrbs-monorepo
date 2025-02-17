import "server-only";

import { Grants } from "@cobuild/database/models/revolution/grants/Grants";

export const getInitiativesOptions = async (revolutionId: string) => {
  const grants = await Grants().getAll(revolutionId);

  return grants
    .filter(g => !g.isApplication && !g.isApplicable && g.isApproved)
    .map(g => ({ value: g.alloProfileId, label: g.title }));
};
