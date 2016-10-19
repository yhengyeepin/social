(function() {
  'use strict';

  // Articles controller
  angular.module('articles').controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$window','$stateParams', '$location', 'Authentication', 'Users', 'Articles', 'FollowedArticles', 'RepliesService', 'dashData', 'replyResolve'];

  function ArticlesController($scope, $window, $stateParams, $location, Authentication, Users, Articles, FollowedArticles, Replies, dashData, reply) {
    var vm = this;
    vm.dashData = dashData;
    vm.replies = {};

    if (typeof vm.dashData.channel === 'undefined') {
      vm.dashData.channel = {};
      vm.dashData.channel.name = 'General';
    }

    //$scope.channel = channel;

    $scope.authentication = Authentication;
    vm.reply = reply;
    //vm.error = null;
    //vm.form = {};
    vm.save = save;

    // Save Reply
    function save(isValid, article) {
      console.log('article to be save '+article.title);
      //if (!isValid) {
      //  $scope.$broadcast('show-errors-check-validity', 'vm.form.replyForm');
      //  return false;
      //}
      // Create new Reply object
      var newReply = new Replies({
        name: article.newreply.name,
        articleId: article._id,
      });
      console.log('saving'+article.newreply.name);

      newReply.$save(successCallback, errorCallback);
      // TODO: move create/update logic to service
      /*if (vm.reply._id) {
        vm.reply.$update(successCallback, errorCallback);
      } else {
        vm.reply.$save(successCallback, errorCallback);
      }*/

      function successCallback(res) {
        console.log('save reply successfully');
        article.newreply.name = '';
        $scope.findReplies(article);
      }

      function errorCallback(res) {
        console.log('save reply in error');
        //vm.error = res.data.message;
      }
    }

    $scope.initFollowStatus = function(user, article) {
      if ($scope.hasBeenFollowed(user)) {
        article.followedOrNot = 'Unfollow';
      } else {
        article.followedOrNot = 'Follow';
      }
    };

    //check if a user has been followed
    $scope.hasBeenFollowed = function(user) {
      if ($scope.authentication.user.following.indexOf(user._id) > -1) {
        return true;
      } else {
        return false;
      }
    };

    //follow a user
    $scope.toggleFollow = function(user, article) {
      //get current user
      //console.log('current user'+$scope.authentication.user.displayName);
      //console.log('following user'+user.displayName);
      var updatedUser = new Users($scope.authentication.user);
      var index = $scope.authentication.user.following.indexOf(user._id);

      //check if the user has already been followed
      if (index > -1) {
        updatedUser.following.splice(index, 1);
        article.followedOrNot = 'Follow';
      } else {
        updatedUser.following.push(user._id);
        article.followedOrNot = 'Unfollow';
      }


      //user.following.push(user._id);
      //add to following list
      //save user
      updatedUser.$update(function (response) {
        Authentication.user = response;
      }, function (response) {
        console.log('Error in following user: '+response.data.message);
      });

      $window.location.reload();
    };

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content,
        channelName: vm.dashData.channel.name
      });

      // Redirect after save
      article.$save(function (response) {
        //$location.path('articles/' + response._id);
        //$scope.articles = Articles.query();
        vm.dashData.articles = FollowedArticles.query({ user:Authentication.user._id, channelName: vm.dashData.channel.name });
        // Clear form fields
        $scope.title = '';
        $scope.content = '';

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find a list of followed Articles
    $scope.findFollowed = function () {
      $scope.articles = FollowedArticles.query({ user:$scope.authentication.user._id });
      console.log('dash '+dashData);
      dashData.articles = $scope.articles;
    };

    // Find a list of followed Articles
    $scope.findFollowedByChannel = function () {
      console.log('init find followed by channel:'+vm.dashData.channel);
      vm.dashData.articles = FollowedArticles.query({ user:$scope.authentication.user._id, channelName: vm.dashData.channel.name });
    };

    $scope.findReplies = function(article) {
      console.log('init replies:'+article.title+'  '+article._id);
      //console.log('vm replies:'+vm.replies[article._id]);
      //if (typeof vm.dashData.channel === 'undefined') {
      //  vm.dashData.channel = {};
      //  vm.dashData.channel.name = 'General';
      //}

      //vm.replies[article._id] = Replies.query({articleId: article._id});
      //vm.dashData.articles
      article.replies = Replies.query({ articleId: article._id });
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }

})();
