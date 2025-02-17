import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { getAccessToken } from "../user/access-token";
import NextCacheAddon from "./next-cache-addon";

export const localApi = () =>
  wretch().auth(`Bearer ${getAccessToken()}`).addon(QueryStringAddon).addon(NextCacheAddon);
