export function normalizeById(items) {
    const byId = {}

    for (const item of items) {
        byId[item.id] = item
    }
    return byId
}