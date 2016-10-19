(function () {
  'use strict';

  angular
    .module('replies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Replies',
      state: 'replies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'replies', {
      title: 'List Replies',
      state: 'replies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'replies', {
      title: 'Create Reply',
      state: 'replies.create',
      roles: ['user']
    });
  }
})();
