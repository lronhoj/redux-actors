import _ from 'lodash'

export default function subscribe(store, actor) {
    if (typeof actor !== 'function') {
        return store.subscribe(combineActors(actor, store))
    } else {
        return store.subscribe(createActing(actor, state => state, store))
    }
}

const createActing  = (actor, select, store) => {
  let currentState;
  return () => {
      const nextState = select(store.getState())
      if (!_.isEqual(currentState, nextState)) {
          currentState = nextState;
          actor(currentState, store.dispatch);
      }
  }
}

function combineActors(actors, store) {
    const actorKeys = Object.keys(actors);
    const finalActors = [];
    for (let i = 0; i < actorKeys.length; i++) {
        const key = actorKeys[i];
        if (typeof actors[key] === 'function') {
            finalActors.push(createActing(actors[key], state => state[key], store));
        }
    }
    return function combination() {
        finalActors.forEach((actor) => {
            actor()
        })
    };
}
