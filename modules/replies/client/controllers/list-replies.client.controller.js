(function () {
  'use strict';

  angular
    .module('replies')
    .controller('RepliesListController', RepliesListController);

  RepliesListController.$inject = ['RepliesService'];

  function RepliesListController(RepliesService) {
    var vm = this;

    vm.replies = RepliesService.query();
  }
})();
