'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
function ($stateProvider) {

  // Articles state routing
  $stateProvider
  .state('articles', {
    abstract: true,
    url: '/articles',
    template: '<ui-view/>'
  })
  .state('mainview', {
    url: '/channels',
    resolve: {
      channelResolve: newChannel,
      dashData: function() {
        return {};
      },
      replyResolve: newReply
    },
    views : {
      '' : {
        templateUrl: 'modules/articles/client/views/list-channels.client.view.html',
        controller: 'ChannelFeedController',
        controllerAs: 'vm',
      },
      'feeds@mainview':{
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm'
      }
    }
  }).state('articles.list', {
    url: '',
    controller: 'ArticlesController',
    controllerAs: 'vm',
    resolve: {
      channelResolve: newChannel,
      dashData: function() {
        return {};
      },
      replyResolve: newReply
    },
    templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
  })
  .state('articles.create', {
    url: '/create',
    templateUrl: 'modules/articles/client/views/create-article.client.view.html',
    data: {
      roles: ['user', 'admin']
    }
  })
  .state('articles.view', {
    url: '/:articleId',
    templateUrl: 'modules/articles/client/views/view-article.client.view.html',
    controller: 'ArticlesController',
    controllerAs: 'vm',
    resolve: {
      channelResolve: newChannel,
      dashData: function() {
        return {};
      },
      replyResolve: newReply
    }
  })
  .state('articles.edit', {
    url: '/:articleId/edit',
    templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
    data: {
      roles: ['user', 'admin']
    }
  });
}

]);

getReply.$inject = ['$stateParams', 'RepliesService'];

function getReply($stateParams, RepliesService) {
  return RepliesService.get({
    replyId: $stateParams.replyId
  }).$promise;
}

newReply.$inject = ['RepliesService'];

function newReply(RepliesService) {
  return new RepliesService();
}

newChannel.$inject = ['ChannelsService'];

function getChannel($stateParams, ChannelsService) {
  console.log('get channel');
  return ChannelsService.get({
    channelId: $stateParams.channelId
  }).$promise;
}

function newChannel(ChannelsService) {
  console.log('new channel');
  return new ChannelsService();
}
