(function () {
  'use strict';

  angular
    .module('channels')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('channels', {
        abstract: true,
        url: '/channels',
        template: '<ui-view/>'
      })
      .state('channels.list', {
        url: '',
        templateUrl: 'modules/channels/client/views/list-channels.client.view.html',
        controller: 'ChannelsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Channels List'
        }
      })
      .state('channels.create', {
        url: '/create',
        templateUrl: 'modules/channels/client/views/form-channel.client.view.html',
        controller: 'ChannelsController',
        controllerAs: 'vm',
        resolve: {
          channelResolve: newChannel
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Channels Create'
        }
      })
      .state('channels.edit', {
        url: '/:channelId/edit',
        templateUrl: 'modules/channels/client/views/form-channel.client.view.html',
        controller: 'ChannelsController',
        controllerAs: 'vm',
        resolve: {
          channelResolve: getChannel
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Channel {{ channelResolve.name }}'
        }
      })
      .state('channels.view', {
        url: '/:channelId',
        templateUrl: 'modules/channels/client/views/view-channel.client.view.html',
        controller: 'ChannelsController',
        controllerAs: 'vm',
        resolve: {
          channelResolve: getChannel
        },
        data:{
          pageTitle: 'Channel {{ channelResolve.name }}'
        }
      });
  }

  getChannel.$inject = ['$stateParams', 'ChannelsService'];

  function getChannel($stateParams, ChannelsService) {
    return ChannelsService.get({
      channelId: $stateParams.channelId
    }).$promise;
  }

  newChannel.$inject = ['ChannelsService'];

  function newChannel(ChannelsService) {
    return new ChannelsService();
  }
})();
