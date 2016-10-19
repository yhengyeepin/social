(function () {
  'use strict';

  angular
    .module('replies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('replies', {
        abstract: true,
        url: '/replies',
        template: '<ui-view/>'
      })
      .state('replies.list', {
        url: '',
        templateUrl: 'modules/replies/client/views/list-replies.client.view.html',
        controller: 'RepliesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Replies List'
        }
      })
      .state('replies.create', {
        url: '/create',
        templateUrl: 'modules/replies/client/views/form-reply.client.view.html',
        controller: 'RepliesController',
        controllerAs: 'vm',
        resolve: {
          replyResolve: newReply
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Replies Create'
        }
      })
      .state('replies.edit', {
        url: '/:replyId/edit',
        templateUrl: 'modules/replies/client/views/form-reply.client.view.html',
        controller: 'RepliesController',
        controllerAs: 'vm',
        resolve: {
          replyResolve: getReply
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Reply {{ replyResolve.name }}'
        }
      })
      .state('replies.view', {
        url: '/:replyId',
        templateUrl: 'modules/replies/client/views/view-reply.client.view.html',
        controller: 'RepliesController',
        controllerAs: 'vm',
        resolve: {
          replyResolve: getReply
        },
        data:{
          pageTitle: 'Reply {{ articleResolve.name }}'
        }
      });
  }

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
})();
