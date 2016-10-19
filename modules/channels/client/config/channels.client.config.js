(function () {
  'use strict';

  angular
    .module('channels')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Channels',
      state: 'channels',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'channels', {
      title: 'List Channels',
      state: 'channels.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'channels', {
      title: 'Create Channel',
      state: 'channels.create',
      roles: ['user']
    });
  }
})();
