'use strict';

(function() {
	// Omims Controller Spec
	describe('Omims Controller Tests', function() {
		// Initialize global variables
		var OmimsController,
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

			// Initialize the Omims controller.
			OmimsController = $controller('OmimsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Omim object fetched from XHR', inject(function(Omims) {
			// Create sample Omim using the Omims service
			var sampleOmim = new Omims({
				name: 'New Omim'
			});

			// Create a sample Omims array that includes the new Omim
			var sampleOmims = [sampleOmim];

			// Set GET response
			$httpBackend.expectGET('omims').respond(sampleOmims);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.omims).toEqualData(sampleOmims);
		}));

		it('$scope.findOne() should create an array with one Omim object fetched from XHR using a omimId URL parameter', inject(function(Omims) {
			// Define a sample Omim object
			var sampleOmim = new Omims({
				name: 'New Omim'
			});

			// Set the URL parameter
			$stateParams.omimId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/omims\/([0-9a-fA-F]{24})$/).respond(sampleOmim);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.omim).toEqualData(sampleOmim);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Omims) {
			// Create a sample Omim object
			var sampleOmimPostData = new Omims({
				name: 'New Omim'
			});

			// Create a sample Omim response
			var sampleOmimResponse = new Omims({
				_id: '525cf20451979dea2c000001',
				name: 'New Omim'
			});

			// Fixture mock form input values
			scope.name = 'New Omim';

			// Set POST response
			$httpBackend.expectPOST('omims', sampleOmimPostData).respond(sampleOmimResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Omim was created
			expect($location.path()).toBe('/omims/' + sampleOmimResponse._id);
		}));

		it('$scope.update() should update a valid Omim', inject(function(Omims) {
			// Define a sample Omim put data
			var sampleOmimPutData = new Omims({
				_id: '525cf20451979dea2c000001',
				name: 'New Omim'
			});

			// Mock Omim in scope
			scope.omim = sampleOmimPutData;

			// Set PUT response
			$httpBackend.expectPUT(/omims\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/omims/' + sampleOmimPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid omimId and remove the Omim from the scope', inject(function(Omims) {
			// Create new Omim object
			var sampleOmim = new Omims({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Omims array and include the Omim
			scope.omims = [sampleOmim];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/omims\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOmim);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.omims.length).toBe(0);
		}));
	});
}());