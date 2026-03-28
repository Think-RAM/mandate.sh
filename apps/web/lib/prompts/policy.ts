export const generateRewritePrompt = (
    originalSection: string,
    companyInfo: string,
    updateRequirement: string,
    generationSpecifics: string,
    sectionId: string,
): string => {
    return `
You are an expert policy writer and compliance specialist.

Your task is to update a policy section based on new requirements.

---

## 📌 Section
${sectionId}

---

## 🏢 Company Context
${companyInfo || "Not provided"}

---

## 🔧 Update Requirement
${updateRequirement}

---

## ✍️ Style Guidelines
${generationSpecifics || "Formal, precise, and policy-compliant language"}

---

## 📄 Existing Content
"""
${originalSection || "No existing content"}
"""

---

## 🎯 Instructions

1. Rewrite or refine the section to incorporate the update requirement
2. Ensure alignment with formal policy standards
3. Avoid redundancy and vague language
4. Maintain clarity and structure

---

## 📦 Output Format (STRICT JSON)

Return ONLY a JSON object:

{
  "text": "<final rewritten markdown section starting with ### ${sectionId}>",
  "changeNotes": "<clear explanation of what changed and why>"
}

---

## 🚫 Do NOT:
- Include explanations outside JSON
- Include extra keys
- Include markdown outside the "text" field

---

Generate the output now.
`;
};

export const findSectionContextPrompt = ({
  sectionHeading,
  sectionContent,
  updateRequirement,
}: {
  sectionHeading: string;
  sectionContent: string;
  updateRequirement: string;
}) => `
You are a senior AI governance policy expert responsible for mapping incomplete or ambiguous policy sections to a formal policy specification.

Your task is to:
1. Identify the MOST LIKELY section of the AI Governance Policy.
2. Return structured drafting guidance for that section.

---

## INPUT CONTEXT

Section Heading:
${sectionHeading}

Section Content:
${sectionContent}

Update Requirement:
${updateRequirement}

---

## DECISION PROCESS (STRICT)

You MUST:
- Infer the section based on:
  - semantic meaning of the heading
  - intent of the content
  - direction of the update requirement
- Prioritize intent over exact wording
- Avoid guessing if confidence is low

---

## OUTPUT RULES

You MUST return:

1. **input**
   - List of key inputs required to generate/update this section properly

2. **method**
   Choose EXACTLY ONE:
   - DET → deterministic / rules-based
   - LLM → generative reasoning required
   - HYB → mix of deterministic + generative
   - STO + DET → retrieval + deterministic

3. **generation_details**
   - Clear, implementation-level guidance on:
     - what content should exist
     - how it should be structured
     - constraints (legal, compliance, formatting)
     - what to include / avoid
   - This should be actionable (not abstract)

---

## CONFIDENCE HANDLING

- If confident → map to a specific section and give precise guidance
- If NOT confident:
  - DO NOT hallucinate a section
  - Provide best-effort generalized governance guidance
  - Clearly bias toward safe, generic structure

---

## IMPORTANT CONSTRAINTS

- Do NOT invent section IDs
- Do NOT reference unknown frameworks
- Do NOT be vague
- Do NOT repeat the input
- Be concise but precise

---

Return ONLY structured JSON matching the schema.
`;

export const rewritePolicySectionPrompt = ({
  originalContent,
  rewrittenContent,
}: {
  originalContent: string;
  rewrittenContent: string;
}) => `
You are a professional policy editor specializing in AI governance and compliance documents.

Your task is to refine a rewritten policy section to ensure it is suitable for inclusion in a formal policy document.

---

## INPUT

Original Content:
${originalContent}

Rewritten Content (Draft):
${rewrittenContent}

---

## OBJECTIVE

Produce a FINAL version of the rewritten content that:
- Preserves the EXACT meaning and intent of the original content
- Incorporates improvements from the rewritten draft
- Meets formal policy writing standards

---

## NON-NEGOTIABLE RULES

You MUST:

- NOT change the meaning, intent, or scope of the original content
- NOT introduce new concepts, requirements, or assumptions
- NOT remove critical obligations or constraints
- NOT add examples unless already implied
- NOT hallucinate policies, standards, or entities

---

## REQUIRED IMPROVEMENTS

You MUST ensure the final output is:

1. **Formal**
   - Use professional, policy-grade language
   - Avoid conversational or vague phrasing

2. **Concise**
   - Remove redundancy
   - Avoid unnecessary verbosity

3. **Clear**
   - Resolve ambiguity
   - Improve sentence structure and readability

4. **Structured**
   - Use clean paragraphing
   - Maintain logical flow of ideas

---

## EDGE CASE HANDLING

- If the rewritten draft introduces inaccuracies → CORRECT them using the original content
- If the rewritten draft is weaker than the original → FAVOR the original
- If both are incomplete → produce the best possible version WITHOUT adding new meaning

---

## OUTPUT RULES

- Return ONLY the final rewritten content
- Do NOT include explanations
- Do NOT include headings like "Final Output"
- Preserve formatting where possible

---
`;