export function selectCurrentCard(state) {
    return state.cardsById[state.currentId]
}
