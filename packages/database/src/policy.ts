import { db } from ".";
import { PolicyStatus } from "@prisma/client";

/**
 * Creates a new policy
 * @param companyId 
 * @param threadId 
 * @param content 
 * @param sections 
 * @returns The created policy
 */
export async function createPolicy(companyId: string, threadId: string, content: string, sections: any) {
    const policy = await db.policy.create({
        data: {
            companyId,
            threadId,
            content,
            sections,
            version: 1,
        }
    });
    return policy;
}

/**
 * Retrieves the latest policy for a given thread, along with its version history
 * @param threadId 
 * @returns The current policy and its previous versions
 */
export async function getPoliciesByCompany(threadId: string) {
    const policies = await db.policy.findMany({
        where: {
            threadId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (policies.length === 0) {
        throw new Error("No policies found for this thread");
    }
    // Get the latest version of policy in the thread
    const latestPolicy = policies[0];
    return {
        current: latestPolicy,
        versions: policies.slice(1), // All previous versions
    };
}

/**
 * Updates an existing policy with a new status and optional change note
 * @param policyId 
 * @param status 
 * @param changeNote 
 * @returns The updated policy
 */
export async function updatePolicy(
    policyId: string,
    status: PolicyStatus,
    changeNote?: string
) {
    const policy = await db.policy.update({
        where: {
            id: policyId,
        },
        data: {
            status,
            ...(changeNote && changeNote.length > 0
                ? { changeNote }
                : {}),
        },
    });

    return policy;
}

/**
 * Updates the content of an existing policy by creating a new version with the updated content and sections. The previous version is retained for history.
 * @param threadId 
 * @param content 
 * @param sections 
 * @param changeNote 
 * @returns The updated policy
 */
export async function updatePolicyContent(
    threadId: string,
    content: string,
    sections: any,
    changeNote: string
) {
    const latestPolicy = await db.policy.findFirst({
        where: {
            threadId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (!latestPolicy) {
        throw new Error("No existing policy found for this thread");
    }

    const updatedPolicy = await db.policy.create({
        data: {
            companyId: latestPolicy.companyId,
            threadId,
            content,
            sections,
            version: latestPolicy.version + 1,
            changeNote,
        },
    });

    return updatedPolicy;
}