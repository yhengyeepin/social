'use strict';

describe('Channels E2E Tests:', function () {
  describe('Test Channels page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/channels');
      expect(element.all(by.repeater('channel in channels')).count()).toEqual(0);
    });
  });
});
