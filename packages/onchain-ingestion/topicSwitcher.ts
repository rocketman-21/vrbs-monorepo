import { AbiItem, getEventSelector } from "viem";

type AbiEventParameter = {
  type: string;
  indexed: boolean;
  name: string;
};

type AbiEvent = {
  type: "event";
  anonymous?: boolean;
  inputs: readonly AbiEventParameter[];
  name: string;
};

type ExtractEventNames<T> = T extends AbiEvent ? T["name"] : never;

type Topic0Switcher<Abi extends readonly AbiItem[]> = {
  [K in ExtractEventNames<Abi[number]>]: `0x${string}`;
};

type EventName<Abi> = Abi extends readonly { name: infer N }[] ? N : never;

// Type guard to check if an Abi item is an AbiEvent
function isAbiEvent(item: any): item is AbiEvent {
  return item.type === "event";
}

const getEventInfo = (abi: readonly AbiItem[], eventName: string) => {
  const abiItem = abi.find(item => isAbiEvent(item) && item.name === eventName);
  if (!(abiItem as any).inputs) {
    throw new Error("No inputs for abi item");
  }
  if (abiItem) {
    const eventSelector = getEventSelector({
      type: "event",
      name: eventName,
      inputs: (abiItem as any).inputs,
    });
    return { [eventName]: eventSelector };
  }
  return {};
};

//refactor above
export const createTopic0Switcher = <Abi extends readonly AbiItem[]>(
  abi: readonly AbiItem[],
): { [K in ExtractEventNames<Abi[number]>]: `0x${string}` } => {
  return abi.reduce((acc, item) => {
    if (isAbiEvent(item)) {
      const eventName = item.name as EventName<Abi>;
      return { ...acc, ...getEventInfo(abi, eventName as string) };
    }
    return acc;
  }, {} as Topic0Switcher<Abi>);
};
