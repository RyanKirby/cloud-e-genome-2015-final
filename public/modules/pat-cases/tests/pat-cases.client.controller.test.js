'use strict';

(function() {
	// Pat cases Controller Spec
	describe('Pat cases Controller Tests', function() {
		// Initialize global variables
		var PatCasesController,
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

			// Initialize the Pat cases controller.
			PatCasesController = $controller('PatCasesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pat case object fetched from XHR', inject(function(PatCases) {
			// Create sample Pat case using the Pat cases service
			var samplePatCase = new PatCases({
				name: 'New Pat case'
			});

			// Create a sample Pat cases array that includes the new Pat case
			var samplePatCases = [samplePatCase];

			// Set GET response
			$httpBackend.expectGET('pat-cases').respond(samplePatCases);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patCases).toEqualData(samplePatCases);
		}));

		it('$scope.findOne() should create an array with one Pat case object fetched from XHR using a patCaseId URL parameter', inject(function(PatCases) {
			// Define a sample Pat case object
			var samplePatCase = new PatCases({
				name: 'New Pat case'
			});

			// Set the URL parameter
			$stateParams.patCaseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pat-cases\/([0-9a-fA-F]{24})$/).respond(samplePatCase);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patCase).toEqualData(samplePatCase);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PatCases) {
			// Create a sample Pat case object
			var samplePatCasePostData = new PatCases({
				name: 'New Pat case'
			});

			// Create a sample Pat case response
			var samplePatCaseResponse = new PatCases({
				_id: '525cf20451979dea2c000001',
				name: 'New Pat case'
			});

			// Fixture mock form input values
			scope.name = 'New Pat case';

			// Set POST response
			$httpBackend.expectPOST('pat-cases', samplePatCasePostData).respond(samplePatCaseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pat case was created
			expect($location.path()).toBe('/pat-cases/' + samplePatCaseResponse._id);
		}));

		it('$scope.update() should update a valid Pat case', inject(function(PatCases) {
			// Define a sample Pat case put data
			var samplePatCasePutData = new PatCases({
				_id: '525cf20451979dea2c000001',
				name: 'New Pat case'
			});

			// Mock Pat case in scope
			scope.patCase = samplePatCasePutData;

			// Set PUT response
			$httpBackend.expectPUT(/pat-cases\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pat-cases/' + samplePatCasePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid patCaseId and remove the Pat case from the scope', inject(function(PatCases) {
			// Create new Pat case object
			var samplePatCase = new PatCases({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pat cases array and include the Pat case
			scope.patCases = [samplePatCase];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pat-cases\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePatCase);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.patCases.length).toBe(0);
		}));
	});
}());