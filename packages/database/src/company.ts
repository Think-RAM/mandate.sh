import { db } from ".";

export async function saveAdditionalData(companyId: string, threadId: string, additionalData: any) {
    const existingCompany = await db.company.findUnique({
        where: { id: companyId },
    });
    if (!existingCompany) {
        throw new Error("Company not found");
    }
    const updatedCompany = await db.company.update({
        where: { id: companyId },
        data: {
            additionalInfo: {
                ...(existingCompany.additionalInfo as Record<string, any> ?? {}),
                [threadId]: additionalData,
            },
        },
    });

    return updatedCompany;
}