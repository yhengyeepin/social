(function () {
  'use strict';

  // Replies controller
  angular
    .module('replies')
    .controller('RepliesController', RepliesController);

  RepliesController.$inject = ['$scope', '$state', 'Authentication', 'replyResolve'];

  function RepliesController ($scope, $state, Authentication, reply) {
    var vm = this;

    vm.authentication = Authentication;
    vm.reply = reply;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Reply
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.reply.$remove($state.go('replies.list'));
      }
    }

    // Save Reply
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.replyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.reply._id) {
        vm.reply.$update(successCallback, errorCallback);
      } else {
        vm.reply.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('replies.view', {
          replyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
