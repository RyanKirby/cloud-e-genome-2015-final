'use strict';

(function() {
	// Hpos Controller Spec
	describe('Hpos Controller Tests', function() {
		// Initialize global variables
		var HposController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Hpos controller.
			HposController = $controller('HposController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hpo object fetched from XHR', inject(function(Hpos) {
			// Create sample Hpo using the Hpos service
			var sampleHpo = new Hpos({
				name: 'New Hpo'
			});

			// Create a sample Hpos array that includes the new Hpo
			var sampleHpos = [sampleHpo];

			// Set GET response
			$httpBackend.expectGET('hpos').respond(sampleHpos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hpos).toEqualData(sampleHpos);
		}));

		it('$scope.findOne() should create an array with one Hpo object fetched from XHR using a hpoId URL parameter', inject(function(Hpos) {
			// Define a sample Hpo object
			var sampleHpo = new Hpos({
				name: 'New Hpo'
			});

			// Set the URL parameter
			$stateParams.hpoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hpos\/([0-9a-fA-F]{24})$/).respond(sampleHpo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hpo).toEqualData(sampleHpo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Hpos) {
			// Create a sample Hpo object
			var sampleHpoPostData = new Hpos({
				name: 'New Hpo'
			});

			// Create a sample Hpo response
			var sampleHpoResponse = new Hpos({
				_id: '525cf20451979dea2c000001',
				name: 'New Hpo'
			});

			// Fixture mock form input values
			scope.name = 'New Hpo';

			// Set POST response
			$httpBackend.expectPOST('hpos', sampleHpoPostData).respond(sampleHpoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hpo was created
			expect($location.path()).toBe('/hpos/' + sampleHpoResponse._id);
		}));

		it('$scope.update() should update a valid Hpo', inject(function(Hpos) {
			// Define a sample Hpo put data
			var sampleHpoPutData = new Hpos({
				_id: '525cf20451979dea2c000001',
				name: 'New Hpo'
			});

			// Mock Hpo in scope
			scope.hpo = sampleHpoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hpos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hpos/' + sampleHpoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid hpoId and remove the Hpo from the scope', inject(function(Hpos) {
			// Create new Hpo object
			var sampleHpo = new Hpos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hpos array and include the Hpo
			scope.hpos = [sampleHpo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hpos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHpo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hpos.length).toBe(0);
		}));
	});
}());