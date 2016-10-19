(function () {
  'use strict';

  describe('Channels Controller Tests', function () {
    // Initialize global variables
    var ChannelsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ChannelsService,
      mockChannel;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ChannelsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ChannelsService = _ChannelsService_;

      // create mock Channel
      mockChannel = new ChannelsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Channel Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Channels controller.
      ChannelsController = $controller('ChannelsController as vm', {
        $scope: $scope,
        channelResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleChannelPostData;

      beforeEach(function () {
        // Create a sample Channel object
        sampleChannelPostData = new ChannelsService({
          name: 'Channel Name'
        });

        $scope.vm.channel = sampleChannelPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ChannelsService) {
        // Set POST response
        $httpBackend.expectPOST('api/channels', sampleChannelPostData).respond(mockChannel);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Channel was created
        expect($state.go).toHaveBeenCalledWith('channels.view', {
          channelId: mockChannel._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/channels', sampleChannelPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Channel in $scope
        $scope.vm.channel = mockChannel;
      });

      it('should update a valid Channel', inject(function (ChannelsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/channels\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('channels.view', {
          channelId: mockChannel._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ChannelsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/channels\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Channels
        $scope.vm.channel = mockChannel;
      });

      it('should delete the Channel and redirect to Channels', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/channels\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('channels.list');
      });

      it('should should not delete the Channel and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
