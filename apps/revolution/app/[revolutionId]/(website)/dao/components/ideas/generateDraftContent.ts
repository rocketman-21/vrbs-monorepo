"use server";

import { Proposals } from "@cobuild/database/models/governance/Proposals";
import { Revolutions } from "@cobuild/database/models/revolution/revolutions/Revolutions";
import { Posts } from "@cobuild/database/models/social/Posts";
import { IPost, Idea } from "@cobuild/database/types";
import { openai } from "@cobuild/libs/openai/client";
import { getRevolutionConfig } from "@cobuild/libs/revolution/config";
import { getUser } from "@cobuild/libs/user/server";
import { recordUserUsage } from "@cobuild/libs/user/usage-limiter";
import { nonNullable } from "@cobuild/libs/utils/data";
import { truncateString } from "@cobuild/libs/utils/text";
import { ChatCompletionMessage } from "openai/resources";

export async function generateDraftContent(idea: Idea, revolutionId: string) {
  const { dao } = getRevolutionConfig(revolutionId);

  const user = await getUser(revolutionId);
  if (!user) throw new Error("Unauthorized");

  const messages: ChatCompletionMessage[] = [
    await getBaseInstructions(revolutionId),
    await getProposalExamples(dao?.entityId),
    await getUserIdea(idea),
  ].filter(nonNullable);

  console.debug(`Prompt for AI is ready. Instruction has ${messages.length} messages.`, messages);

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages,
  });

  recordUserUsage(user, "openai");

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Couldn't get response from AI.");

  const [title, ...rest] = content.split("\n");
  return { title: title.replaceAll("#", "").trim(), body: rest.join("\n").trim() };
}

async function getBaseInstructions(revolutionId: string) {
  const { dao, defaultSeo, name } = getRevolutionConfig(revolutionId);
  const description = dao?.description || defaultSeo.description || "";

  const revolution = await Revolutions().getById(revolutionId);
  if (!revolution) return null;

  const treasuryBalance = revolution.treasury?.[0]?.balance || 0;

  return {
    role: "assistant",
    content: `You will be provided with an idea for a new proposal within ${name} community.
      Your task is to generate the draft proposal, based on the submitted idea. Please use markdown format. Do not include any images. For titles & subtitles use h2 (##) or h3 (###). Do not use other markdown headings (like h4 or h5).
      The first line should contain just the title of the proposal. Do not use word "proposal" or "title" in the title. Do not use markdown for title - let it be just a plain text. 
      Here is the description of the community: ${description}. The community operates in form of DAO (Decentralized Autonomous Organization).
      It has its own treasury and people can submit their proposals how to spend it and then vote on them. Here is an example proposal guideline template, make sure to include the tax reporting section.      
      Proposal Best Practices for DAOs
      This document serves as suggested guidelines to help your DAO members have enough information and context on proposals to make an educated decision.
      Descriptive Title
      A brief but descriptive title that summarizes the heart of the proposal.
      Summary
      What are the key asks of the proposal? What do you intend to build? This should be brief - 1-2 sentences.
      Issue/Context (Optional but helpful)
      The context in which you are asking for the funding. Is there a problem you are solving or a specific reason for the ask? If the proposal is a follow-up to a prior proposal or DAO action, please include that history.
      Proposal (The Ask)
      What are you asking for and how will you tackle the execution? This ought to be sufficiently detailed so voters understand what specifically is being requested, for what purpose, and what actions will be taken to achieve the stated purpose.
      North Star Check
      How does your proposal further the mission/vision of the DAO or the call for proposals?
      How will DAO resources being requested be utilized in furtherance of the DAO’s mission? There should be clear alignment between the resources being requested/actions being taken and the DAO’s mission/vision.
      Accountability
      If funds are being requested, how is the funding going to be spent? Provide a somewhat detailed budget.
      How long do you estimate it will take to complete the proposal: Provide a timeline.
      What does success look like? What are the goals or end result of the proposal? This should include specific, quantifiable metrics where possible so, in review, the DAO can judge whether objectives were met, especially where further funding or support is requested.
      Are you willing to provide ongoing status updates or spend time with members that ask questions? Such commitments are strongly encouraged to demonstrate respect and good faith to your fellow members.
      Treasury Impact
      The treasury impact should summarize the total amount being requested as well as provide DAO members the total percentage of funds being requested from the treasury providing the funding. The impact should be denominated in ETH so the proposer does not need to account for ETH/USD price adjustments.
      Transparency
      Include any potential conflicts of interest or other disclosures.
      Example: I am requesting funding for the company I founded to do X, I may be personally enriched by receiving funds.
      Example: I have a personal relationship (we’re married) with the Community Lead of the DAO.
      Include any prior funding given to the team or entity by the DAO (link out to proposals) and summarize the outcome. Was it successful? Did it take longer than anticipated?
      Author
      Who are the authors of the proposal?
      Tax Information
      Who will be the responsible party for tax reporting?
      Optional (but helpful)
      Are you an accomplished builder in the web3 ecosystem? Sharing bio blurbs and other successfully executed projects can help let members know that you have the talent and ability to execute your vision.
      It's very common to include in proposals the following sections: "Introduction", "Budget", "Plan" (roadmap, schedule) and "Author" (or "Team").
      If you don't know what to put in each section, feel free to leave them empty and threat them as placeholders. The draft you'll create is not final and will be reviewed and edited by the author before publishing. Be precise and concise. Do not mention blockchain technology or any buzzwords. If you are talking about putting something "on the blockchain", do not say that. Say putting it "onchain" instead. Speak in the language and prose of the community so it feels natural.
      ${
        treasuryBalance > 0
          ? `Current treasury balance is ${treasuryBalance} ETH. Take these numbers into account.`
          : ""
      }
    `,
  } satisfies ChatCompletionMessage;
}

async function getProposalExamples(entityId?: string) {
  if (!entityId) return null;

  const proposals = await Proposals().search({ entityId, take: 3, sort: "Most favored" });
  if (proposals.length === 0) return null;

  return {
    role: "assistant",
    content: `Here are some examples of past proposals. Don't follow the same structure, just get inspired by them:\n\n
      ${proposals
        .map(
          p => `Title: ${p.title}
            Budget: ${p.budget.amount} ${p.budget.unit}
            Votes for: ${p.votesCount.for}
            Votes against: ${p.votesCount.against}
            Body: ${truncateString(p.description, 350, "words")}`,
        )
        .join("\n\n")}`,
  } satisfies ChatCompletionMessage;
}

async function getUserIdea(idea: Idea) {
  const commentsMessage = idea.commentsCount > 0 ? await getIdeaComments(idea.ideaId) : "";

  return {
    role: "assistant",
    content: `My username is ${idea.profile?.username || idea.creator} and here is my idea: ${
      idea.body
    }\n
    ${idea.imageUrl ? `Here is the image I have for the idea: ${idea.imageUrl} \n Please do include it in a proposal body (use this syntax: ![](${idea.imageUrl}) - it's important to not use ALT text, as it breaks markdown editor I'm using). Place it somewhere at the top of the proposal body, near the summary or introduction.\n` : ""}
    \n
    ${commentsMessage}`,
  } satisfies ChatCompletionMessage;
}

async function getIdeaComments(ideaId: string) {
  const comments = await Posts().getForScope(ideaId);
  return (
    `Take into account these comments (community voice is very important), preferring my conclusions:\n\n` +
    comments.map(getIdeaComment).join("-- \n\n")
  );
}

function getIdeaComment(post: IPost) {
  const { markdown, profile, address, upvoteCount, childrenCount, children } = post;
  const username = profile?.username || address;

  let message = `${username} wrote (${upvoteCount} upvotes):\n${markdown}`;
  if (childrenCount > 0 && children?.length) {
    message += `\n${childrenCount} replies to this comment:\n
                ${children.map(getIdeaComment).join("\n")}`;
  }

  return message;
}
