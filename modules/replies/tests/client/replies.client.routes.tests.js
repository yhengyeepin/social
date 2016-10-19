(function () {
  'use strict';

  describe('Replies Route Tests', function () {
    // Initialize global variables
    var $scope,
      RepliesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RepliesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RepliesService = _RepliesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('replies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/replies');
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
          RepliesController,
          mockReply;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('replies.view');
          $templateCache.put('modules/replies/client/views/view-reply.client.view.html', '');

          // create mock Reply
          mockReply = new RepliesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reply Name'
          });

          //Initialize Controller
          RepliesController = $controller('RepliesController as vm', {
            $scope: $scope,
            replyResolve: mockReply
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:replyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.replyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            replyId: 1
          })).toEqual('/replies/1');
        }));

        it('should attach an Reply to the controller scope', function () {
          expect($scope.vm.reply._id).toBe(mockReply._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/replies/client/views/view-reply.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RepliesController,
          mockReply;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('replies.create');
          $templateCache.put('modules/replies/client/views/form-reply.client.view.html', '');

          // create mock Reply
          mockReply = new RepliesService();

          //Initialize Controller
          RepliesController = $controller('RepliesController as vm', {
            $scope: $scope,
            replyResolve: mockReply
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.replyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/replies/create');
        }));

        it('should attach an Reply to the controller scope', function () {
          expect($scope.vm.reply._id).toBe(mockReply._id);
          expect($scope.vm.reply._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/replies/client/views/form-reply.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RepliesController,
          mockReply;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('replies.edit');
          $templateCache.put('modules/replies/client/views/form-reply.client.view.html', '');

          // create mock Reply
          mockReply = new RepliesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reply Name'
          });

          //Initialize Controller
          RepliesController = $controller('RepliesController as vm', {
            $scope: $scope,
            replyResolve: mockReply
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:replyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.replyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            replyId: 1
          })).toEqual('/replies/1/edit');
        }));

        it('should attach an Reply to the controller scope', function () {
          expect($scope.vm.reply._id).toBe(mockReply._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/replies/client/views/form-reply.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
