export const parseBackendDrafts = (drafts: Record<string, string>) => {
  const parsed: Record<string, string> = {};

  const fullText = Object.values(drafts)
    .filter(Boolean)
    .join("\n\n")
    .replace(/```markdown/gi, "")
    .replace(/```/g, "");

  const extract = (key: string, regex: RegExp) => {
    const match = fullText.match(regex);
    if (match?.[1]) parsed[key] = match[1].trim();
  };

  extract("purpose", /##\s*(?:\d+\.\s*)?Purpose.*?Scope([\s\S]*?)(?=##|$)/i);
  extract("inventory", /##\s*(?:\d+\.\s*)?(?:AI\s*System\s*)?Inventory([\s\S]*?)(?=##|$)/i);
  extract("governance", /##\s*(?:\d+\.\s*)?Governance.*?Structure([\s\S]*?)(?=##|$)/i);
  extract("roles", /##\s*(?:\d+\.\s*)?Roles.*?Responsibilities([\s\S]*?)(?=##|$)/i);
  extract("regulations", /##\s*(?:\d+\.\s*)?Applicable.*?Regulations([\s\S]*?)(?=##|$)/i);
  extract("risk", /##\s*(?:\d+\.\s*)?Risk.*?Appetite([\s\S]*?)(?=##|$)/i);

  return parsed;
};