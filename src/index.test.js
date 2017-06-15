import { createStore } from 'redux'
import subscribe from './index'

const initialState = {
    action1_field: undefined,
    action2_field: undefined
};
const ACTION1 = {type: 'action1'};
const ACTION2 = {type: 'action2'};
const reducer = (state, action) => ({
    ...state,
    [action.type + '_field']: true
});

const onlyRequiredSimpleActors = (myStore, actorsCreator, res) => {
  subscribe(myStore, {
      action1_field: actorsCreator('action1'),
      action2_field: actorsCreator('action2'),
      action3_field: actorsCreator('action3')
  });
  expect(res.action1).toBe(undefined);
  expect(res.action2).toBe(undefined);
  expect(res.action3).toBe(undefined);

  myStore.dispatch(ACTION1);

  expect(res.action1).toBe(true);
  expect(res.action2).toBe(undefined);
  expect(res.action3).toBe(undefined);

  myStore.dispatch(ACTION2);

  expect(res.action1).toBe(true);
  expect(res.action2).toBe(true);
  expect(res.action3).toBe(undefined);
}

it("handle one simple actor", () => {
    const myStore = createStore(reducer, initialState);
    let resVar = false
    const myActor = (state, dispatch) => {
        expect(state.action1_field).toBe(true);
        resVar = true;
    }
    subscribe(myStore, myActor);
    myStore.dispatch(ACTION1);
    expect(resVar).toBe(true);
    expect(myStore.getState()['action1_field']).toBe(true);
})

it("handle one actor with nested and different changes", () => {
    const myStore = createStore(reducer, initialState);
    let resVar = 0
    const myActor = (state, dispatch) => {
        if (state.action1_field && !state.action2_field) {
          resVar += 1;
        }
        if (state.action2_field) {
          resVar += 10;
        }
        dispatch(ACTION2)
    }
    subscribe(myStore, myActor);
    myStore.dispatch(ACTION1);
    expect(resVar).toBe(11);
    expect(myStore.getState()['action1_field']).toBe(true);
})

it("handle one nested actor", () => {
    const myStore = createStore(reducer, initialState);
    const myActor = (state, dispatch) => {
        expect(state.action1_field).toBe(true)
        dispatch(ACTION2);
    }
    subscribe(myStore, myActor);
    myStore.dispatch(ACTION1);
    expect(myStore.getState().action1_field).toBe(true);
    expect(myStore.getState().action2_field).toBe(true);
})

it("handle only required simple actors with primitive objects", () => {
  const myStore = createStore(reducer, initialState);
  const res = {};
  const actorsCreator = (key) => (state, dispatch) => {
      expect(state).toBe(true)
      expect(myStore.getState()[key+'_field']).toBe(true)
      res[key] = true;
  }
  onlyRequiredSimpleActors(myStore, actorsCreator, res)
})

it("handle only required simple actors with complex objects", () => {
  const reducerComplex = (state, action) => ({
      ...state,
      [action.type + '_field']: {
        myComplexValue: {
          nestedComplexValue: true
        }
      }
  });
  const myStore = createStore(reducerComplex, initialState);
  const res = {};
  const actorsCreator = (key) => (state, dispatch) => {
      expect(state.myComplexValue.nestedComplexValue).toBe(true)
      expect(myStore.getState()[key+'_field'].myComplexValue.nestedComplexValue).toBe(true)
      res[key] = true;
  }
  onlyRequiredSimpleActors(myStore, actorsCreator, res)
})

it("handle only required nested simple actors", () => {
    const myStore = createStore(reducer, initialState);
    const res = {}
    const actorsCreator = (key) => (state, dispatch) => {
        res[key] = true;
    }
    subscribe(myStore, {
        action1_field (state, dispatch) {
            myStore.dispatch(ACTION2)
            res['actor1'] = true;
        },
        action2_field: (state, dispatch) => {
            res['actor2'] = true;
        }
    });
    expect(myStore.getState().action1_field).toBe(undefined);
    expect(myStore.getState().action2_field).toBe(undefined);

    myStore.dispatch(ACTION1);

    expect(res.actor1).toBe(true);
    expect(res.actor2).toBe(true);
    expect(myStore.getState().action1_field).toBe(true);
    expect(myStore.getState().action2_field).toBe(true);
})
