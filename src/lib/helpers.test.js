import * as Helpers from './helpers';

describe('Helpers', () => {
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
        const result = Helpers.getDisplayName(WrappedComponent);

        expect(result).toEqual(expected);
      });
    });

    describe('Component has a name', () => {
      beforeEach(() => {
        WrappedComponent.name = 'Hello World 2';
      });

      test('it should return the name', () => {
        const expected = 'Hello World 2';
        const result = Helpers.getDisplayName(WrappedComponent);

        expect(result).toEqual(expected);
      });
    });

    describe('Component does not have a displayName or name', () => {
      beforeEach(() => {
        WrappedComponent = {};
      });

      test('it should return \'Component\'', () => {
        const expected = 'Component';
        const result = Helpers.getDisplayName(WrappedComponent);

        expect(result).toEqual(expected);
      });
    });
  });
});