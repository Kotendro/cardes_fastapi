// screen:
// formMode:
// currentId:
// cardsById: 

export function createStore(initialState) {
    let state = initialState
    const listeners = []

    return {
        getState() {
            return state
        },
        setState(update) {
            state = { ...state, ...update }
            listeners.forEach(fn => fn(state))
        },
        subscribe(fn) {
            listeners.push(fn)
        }
    }
}