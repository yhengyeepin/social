(function () {
  'use strict';

  angular
    .module('channels')
    .controller('ChannelsListController', ChannelsListController);

  ChannelsListController.$inject = ['ChannelsService'];

  function ChannelsListController(ChannelsService) {
    var vm = this;

    vm.channels = ChannelsService.query();
  }
})();
