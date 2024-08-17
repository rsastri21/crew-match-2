import { db } from "@/db";
import { Role, roles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createRole(
    roleName: string,
    production: string,
    productionId: number,
    candidateId?: number
) {
    const [role] = await db
        .insert(roles)
        .values({
            role: roleName,
            production,
            productionId,
            candidateId,
        })
        .returning();
    return role;
}

export async function updateRole(roleId: number, updatedRole: Partial<Role>) {
    const [role] = await db
        .update(roles)
        .set(updatedRole)
        .where(eq(roles.id, roleId))
        .returning();
    return role;
}

export async function getRolesByProduction(productionId: number) {
    const productionRoles = await db.query.roles.findMany({
        where: eq(roles.productionId, productionId),
    });
    return productionRoles;
}

export async function deleteRole(roleId: number) {
    await db.delete(roles).where(eq(roles.id, roleId));
}
