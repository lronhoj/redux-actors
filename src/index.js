export function subscribe(store, actor) {
    store.subscribe(() => {
        actor(store.getState(), store.dispatch);
    });
}

export function combineActors(actors) {
    const actorKeys = Object.keys(actors);
    const finalActors = {};
    for (let i = 0; i < actorKeys.length; i++) {
        const key = actorKeys[i];
        if (typeof actors[key] === 'function') {
            finalActors[key] = actors[key];
        }
    }
    var finalActorKeys = Object.keys(finalActors);

    return function combination(state, dispatch) {
        for (let i = 0; i < finalActorKeys.length; i++) {
            const key = finalActorKeys[i];
            const actor = finalActors[key];
            const previousStateForKey = state[key];
            actor(previousStateForKey, dispatch);
        }
    };
}
