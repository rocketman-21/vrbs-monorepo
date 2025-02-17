import { database } from "../..";
import { transformCast } from "./Cast";

export function Casts() {
  return {
    getForChannel,
  };
}

const getForChannel = async (channelId: string, take = 20) => {
  const casts = await database.cast.findMany({
    where: { channel: { is: { id: channelId } } },
    take,
  });

  return casts.map(transformCast);
};
