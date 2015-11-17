'use strict';

(function() {
	// Investigations Controller Spec
	describe('Investigations Controller Tests', function() {
		// Initialize global variables
		var InvestigationsController,
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

			// Initialize the Investigations controller.
			InvestigationsController = $controller('InvestigationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Investigation object fetched from XHR', inject(function(Investigations) {
			// Create sample Investigation using the Investigations service
			var sampleInvestigation = new Investigations({
				name: 'New Investigation'
			});

			// Create a sample Investigations array that includes the new Investigation
			var sampleInvestigations = [sampleInvestigation];

			// Set GET response
			$httpBackend.expectGET('investigations').respond(sampleInvestigations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.investigations).toEqualData(sampleInvestigations);
		}));

		it('$scope.findOne() should create an array with one Investigation object fetched from XHR using a investigationId URL parameter', inject(function(Investigations) {
			// Define a sample Investigation object
			var sampleInvestigation = new Investigations({
				name: 'New Investigation'
			});

			// Set the URL parameter
			$stateParams.investigationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/investigations\/([0-9a-fA-F]{24})$/).respond(sampleInvestigation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.investigation).toEqualData(sampleInvestigation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Investigations) {
			// Create a sample Investigation object
			var sampleInvestigationPostData = new Investigations({
				name: 'New Investigation'
			});

			// Create a sample Investigation response
			var sampleInvestigationResponse = new Investigations({
				_id: '525cf20451979dea2c000001',
				name: 'New Investigation'
			});

			// Fixture mock form input values
			scope.name = 'New Investigation';

			// Set POST response
			$httpBackend.expectPOST('investigations', sampleInvestigationPostData).respond(sampleInvestigationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Investigation was created
			expect($location.path()).toBe('/investigations/' + sampleInvestigationResponse._id);
		}));

		it('$scope.update() should update a valid Investigation', inject(function(Investigations) {
			// Define a sample Investigation put data
			var sampleInvestigationPutData = new Investigations({
				_id: '525cf20451979dea2c000001',
				name: 'New Investigation'
			});

			// Mock Investigation in scope
			scope.investigation = sampleInvestigationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/investigations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/investigations/' + sampleInvestigationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid investigationId and remove the Investigation from the scope', inject(function(Investigations) {
			// Create new Investigation object
			var sampleInvestigation = new Investigations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Investigations array and include the Investigation
			scope.investigations = [sampleInvestigation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/investigations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInvestigation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.investigations.length).toBe(0);
		}));
	});
}());