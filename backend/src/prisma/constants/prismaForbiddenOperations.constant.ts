export const prismaForbiddenOperations = new Set<string>([
    "create",
    "createMany",
    "delete",
    "update",
    "deleteMany",
    "updateMany",
    "upsert",
]);
