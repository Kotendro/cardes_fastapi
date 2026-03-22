// screen:
// formMode:
// currentId:
// shortById: 
// detailById: 

export function createStore(initialState) {
    let state = initialState
    const listeners = []

    return {
        getState() {
            return state
        },
        setState(update) {
            if (typeof update === "function") {
                state = update(state)
            } 
            else {
                state = { ...state, ...update }
            }
            listeners.forEach(fn => fn(state))
        },
        subscribe(fn) {
            listeners.push(fn)
        }
    }
}