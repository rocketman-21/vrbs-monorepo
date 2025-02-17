import OpenAI from "openai";

export const openai = new OpenAI({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  apiKey: process.env.OPENAI_API_KEY,
  organization: "",
});
