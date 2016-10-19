//Channels service used to communicate Channels REST endpoints
(function () {
  'use strict';

  angular
    .module('channels')
    .factory('ChannelsService', ChannelsService);

  ChannelsService.$inject = ['$resource'];

  function ChannelsService($resource) {
    return $resource('api/channels/:channelId', {
      channelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
