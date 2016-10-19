//Replies service used to communicate Replies REST endpoints
(function () {
  'use strict';

  angular
    .module('replies')
    .factory('RepliesService', RepliesService);

  RepliesService.$inject = ['$resource'];

  function RepliesService($resource) {
    return $resource('api/replies/:replyId', {
      replyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
