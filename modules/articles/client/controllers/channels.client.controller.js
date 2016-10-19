(function() {
  'use strict';
  angular
    .module('articles')
    .controller('ChannelFeedController', ChannelFeedController);

  ChannelFeedController.$inject = ['$window', '$scope', '$state', 'ChannelsService', 'Authentication', 'FollowedArticles', 'Articles', 'channelResolve', 'dashData'];

  function ChannelFeedController($window, $scope, $state, ChannelsService, Authentication, FollowedArticles, Articles, channel, dashData) {
    console.log('init channel dashData'+dashData);
    var vm = this;
    vm.channels = ChannelsService.query();

    init();

    function init() {
    }

    vm.authentication = Authentication;
    vm.channel = channel;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.select = select;

    function select(selectedChannel) {
      console.log('selected channel'+selectedChannel.name);

      dashData.channel = selectedChannel;
      if (selectedChannel.name === 'General') {
        console.log('Loading General');
        dashData.articles = Articles.query({ user:Authentication.user._id, channelName: selectedChannel.name });
      } else {
        dashData.articles = FollowedArticles.query({ user:Authentication.user._id, channelName: selectedChannel.name });
      }
      console.log('select dashData'+dashData.articles);
    }

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
        $window.location.reload();
        /*$state.go('channels.view', {
          channelId: res._id
        });*/
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }

})();
