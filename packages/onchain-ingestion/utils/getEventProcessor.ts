import { TrackerType } from "prisma-database";
import { processNounsAuctionEvent } from "../entityIngestion/auctions/nouns-dao/versions/NounsAuctionHouse";
import { processGnarsAuctionEvent } from "../entityIngestion/auctions/nouns-dao/versions/GnarsAuctionHouse";
import { processCultureIndexEvents } from "../entityIngestion/revolution/culture-index/CultureIndexV1";
import { processRevolutionAuctionEvent } from "../entityIngestion/auctions/nouns-dao/versions/RevolutionAuctionHouseV1";
import { processRevolutionDAOLogicV1Event } from "../entityIngestion/governance/revolution/versions/dao-logic-v1/RevolutionDAOLogicV1";
import { processNounsV1Event } from "../entityIngestion/governance/nouns-dao/versions/v1/NounsDAOV1";
import { processNounsV2Event } from "../entityIngestion/governance/nouns-dao/versions/v2/NounsDAOV2";
import { processNounsV3Event } from "../entityIngestion/governance/nouns-dao/versions/v3/NounsDAOV3";
import { processBuilderGovernorV1Event } from "../entityIngestion/governance/nouns-dao/versions/nounsbuilder/v1/GovernorV1";
import { EventProcessor } from "../events/types";
import { processPointsEmitterEvents } from "../entityIngestion/revolution/points-emitter/PointsEmitter";
import { processSplitMainEvents } from "../entityIngestion/revolution/splits/SplitMain";
import { processRevolutionBuilderEvents } from "../entityIngestion/revolution/revolution-builder/RevolutionBuilder";
import { processContestBuilderEvents } from "../entityIngestion/revolution/contest-builder/ContestBuilder";

export const getEventProcessorByTrackerType = (trackerType: TrackerType): EventProcessor => {
  let eventProcessor: EventProcessor | null = null;

  switch (trackerType) {
    case "contest_builder":
      eventProcessor = processContestBuilderEvents;
      break;
    case "nouns_auction":
      eventProcessor = processNounsAuctionEvent;
      break;
    case "gnars_auction":
      eventProcessor = processGnarsAuctionEvent;
      break;
    case "revolution_builder":
      eventProcessor = processRevolutionBuilderEvents;
      break;
    case "revolution_split":
      eventProcessor = processSplitMainEvents;
      break;
    case "culture_index":
      eventProcessor = processCultureIndexEvents;
      break;
    case "points_emitter":
      eventProcessor = processPointsEmitterEvents;
      break;
    case "revolution_auction":
      eventProcessor = processRevolutionAuctionEvent;
      break;
    case "revolution_dao_v1":
      eventProcessor = processRevolutionDAOLogicV1Event;
      break;
    case "nouns_dao_v1":
      eventProcessor = processNounsV1Event;
      break;
    case "nouns_dao_v2":
      eventProcessor = processNounsV2Event;
      break;
    case "nouns_dao_v3":
      eventProcessor = processNounsV3Event;
      break;
    case "nounsbuilder_v1":
      eventProcessor = processBuilderGovernorV1Event;
      break;
  }

  if (!eventProcessor) {
    throw new Error(`No event processor found for ${trackerType}`);
  }

  return eventProcessor;
};
