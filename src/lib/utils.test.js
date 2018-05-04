import * as utils from './utils';

describe('utils', () => {
  describe('getDisplayName', () => {
    let WrappedComponent = {};

    afterEach(() => {
      WrappedComponent = {};
    });

    describe('Component has a displayName', () => {
      beforeEach(() => {
        WrappedComponent.displayName = 'Hello World';
      });

      test('it should return the displayName', () => {
        const expected = 'Hello World';
        const result = utils.getDisplayName(WrappedComponent);

        expect(result).toEqual(expected);
      });
    });

    describe('Component has a name', () => {
      beforeEach(() => {
        WrappedComponent.name = 'Hello World 2';
      });

      test('it should return the name', () => {
        const expected = 'Hello World 2';
        const result = utils.getDisplayName(WrappedComponent);

        expect(result).toEqual(expected);
      });
    });

    describe('Component does not have a displayName or name', () => {
      beforeEach(() => {
        WrappedComponent = {};
      });

      test('it should return \'Component\'', () => {
        const expected = 'Component';
        const result = utils.getDisplayName(WrappedComponent);

        expect(result).toEqual(expected);
      });
    });
  });
});