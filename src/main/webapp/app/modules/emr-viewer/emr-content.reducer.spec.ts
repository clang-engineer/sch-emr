import reducer, { addHtmlSet, clearHtmlSets, removeHtmlSet, setHtmlSets } from './emr-content.reducer';

describe('Emr content reducer tests', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual({ items: [] });
  });

  it('should add html set', () => {
    const state = reducer(undefined, addHtmlSet({ id: 'set-1', html: '<div>One</div>' }));
    expect(state.items).toEqual([{ id: 'set-1', html: '<div>One</div>' }]);
  });

  it('should remove html set', () => {
    const startState = {
      items: [
        { id: 'set-1', html: '<div>One</div>' },
        { id: 'set-2', html: '<div>Two</div>' },
      ],
    };
    const state = reducer(startState, removeHtmlSet('set-1'));
    expect(state.items).toEqual([{ id: 'set-2', html: '<div>Two</div>' }]);
  });

  it('should set html sets', () => {
    const state = reducer(undefined, setHtmlSets([{ id: 'set-1', html: '<div>One</div>' }]));
    expect(state.items).toEqual([{ id: 'set-1', html: '<div>One</div>' }]);
  });

  it('should clear html sets', () => {
    const startState = {
      items: [{ id: 'set-1', html: '<div>One</div>' }],
    };
    const state = reducer(startState, clearHtmlSets());
    expect(state.items).toEqual([]);
  });
});
