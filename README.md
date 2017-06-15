This module provides ability to define actors with Redux. Actors are functions that handle changes in state and perform actions, including dispatching another Action.

Install
=======
`npm install --save redux-actors` or `yarn add redux-actors`

Usage
=====
```
import { createStore } from 'redux'
import subscribe from 'redux-actors'

const myStore = createStore(reducer)

let actors = (state, dispatch) => {
    if (state.field) {
        dispatch(SOME_ACTION)
    }
}

const actorFunction = (state, dispatch) => {
    // handle state and do something
}

actors = {
    statePart (state, dispatch) {
        // handle state
    }
    anotherStatePart: actorFunction
}

const unsibscribe = subscribe(store, actors)
```

LICENSE
=======
MIT
© [Arosii A/S](http://www.arosii.com/)
© [Alexey Shildyakov](mailto:ashl1future@gmail.com)
