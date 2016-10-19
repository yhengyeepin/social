(function () {
  'use strict';

  // Channels controller
  angular
    .module('channels')
    .controller('ChannelsController', ChannelsController);

  ChannelsController.$inject = ['$scope', '$state', 'Authentication', 'channelResolve'];

  function ChannelsController ($scope, $state, Authentication, channel) {
    var vm = this;

    vm.authentication = Authentication;
    vm.channel = channel;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Channel
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.channel.$remove($state.go('channels.list'));
      }
    }

    // Save Channel
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.channelForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.channel._id) {
        vm.channel.$update(successCallback, errorCallback);
      } else {
        vm.channel.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('channels.view', {
          channelId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
