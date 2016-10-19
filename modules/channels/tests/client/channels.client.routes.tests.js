(function () {
  'use strict';

  describe('Channels Route Tests', function () {
    // Initialize global variables
    var $scope,
      ChannelsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ChannelsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ChannelsService = _ChannelsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('channels');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/channels');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ChannelsController,
          mockChannel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('channels.view');
          $templateCache.put('modules/channels/client/views/view-channel.client.view.html', '');

          // create mock Channel
          mockChannel = new ChannelsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Channel Name'
          });

          //Initialize Controller
          ChannelsController = $controller('ChannelsController as vm', {
            $scope: $scope,
            channelResolve: mockChannel
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:channelId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.channelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            channelId: 1
          })).toEqual('/channels/1');
        }));

        it('should attach an Channel to the controller scope', function () {
          expect($scope.vm.channel._id).toBe(mockChannel._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/channels/client/views/view-channel.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ChannelsController,
          mockChannel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('channels.create');
          $templateCache.put('modules/channels/client/views/form-channel.client.view.html', '');

          // create mock Channel
          mockChannel = new ChannelsService();

          //Initialize Controller
          ChannelsController = $controller('ChannelsController as vm', {
            $scope: $scope,
            channelResolve: mockChannel
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.channelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/channels/create');
        }));

        it('should attach an Channel to the controller scope', function () {
          expect($scope.vm.channel._id).toBe(mockChannel._id);
          expect($scope.vm.channel._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/channels/client/views/form-channel.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ChannelsController,
          mockChannel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('channels.edit');
          $templateCache.put('modules/channels/client/views/form-channel.client.view.html', '');

          // create mock Channel
          mockChannel = new ChannelsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Channel Name'
          });

          //Initialize Controller
          ChannelsController = $controller('ChannelsController as vm', {
            $scope: $scope,
            channelResolve: mockChannel
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:channelId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.channelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            channelId: 1
          })).toEqual('/channels/1/edit');
        }));

        it('should attach an Channel to the controller scope', function () {
          expect($scope.vm.channel._id).toBe(mockChannel._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/channels/client/views/form-channel.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
