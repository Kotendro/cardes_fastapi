export function createStore(initialState) {
    let state = initialState
    const listeners = []

    return {
        getState() {
            return state
        },
        setState(patch) {
            state = { ...state, ...patch }
            listeners.forEach(fn => fn(state))
        },
        subscribe(fn) {
            listeners.push(fn)
        }
    }
}