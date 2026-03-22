export function selectCurrentDetail(state) {
    return state.detailById[state.currentId]
}

export function selectCurrentShort(state) {
    return state.shortById[state.currentId]
}
