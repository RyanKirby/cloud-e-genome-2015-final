'use strict';

(function() {
	// Clinvars Controller Spec
	describe('Clinvars Controller Tests', function() {
		// Initialize global variables
		var ClinvarsController,
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

			// Initialize the Clinvars controller.
			ClinvarsController = $controller('ClinvarsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Clinvar object fetched from XHR', inject(function(Clinvars) {
			// Create sample Clinvar using the Clinvars service
			var sampleClinvar = new Clinvars({
				name: 'New Clinvar'
			});

			// Create a sample Clinvars array that includes the new Clinvar
			var sampleClinvars = [sampleClinvar];

			// Set GET response
			$httpBackend.expectGET('clinvars').respond(sampleClinvars);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clinvars).toEqualData(sampleClinvars);
		}));

		it('$scope.findOne() should create an array with one Clinvar object fetched from XHR using a clinvarId URL parameter', inject(function(Clinvars) {
			// Define a sample Clinvar object
			var sampleClinvar = new Clinvars({
				name: 'New Clinvar'
			});

			// Set the URL parameter
			$stateParams.clinvarId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/clinvars\/([0-9a-fA-F]{24})$/).respond(sampleClinvar);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clinvar).toEqualData(sampleClinvar);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Clinvars) {
			// Create a sample Clinvar object
			var sampleClinvarPostData = new Clinvars({
				name: 'New Clinvar'
			});

			// Create a sample Clinvar response
			var sampleClinvarResponse = new Clinvars({
				_id: '525cf20451979dea2c000001',
				name: 'New Clinvar'
			});

			// Fixture mock form input values
			scope.name = 'New Clinvar';

			// Set POST response
			$httpBackend.expectPOST('clinvars', sampleClinvarPostData).respond(sampleClinvarResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Clinvar was created
			expect($location.path()).toBe('/clinvars/' + sampleClinvarResponse._id);
		}));

		it('$scope.update() should update a valid Clinvar', inject(function(Clinvars) {
			// Define a sample Clinvar put data
			var sampleClinvarPutData = new Clinvars({
				_id: '525cf20451979dea2c000001',
				name: 'New Clinvar'
			});

			// Mock Clinvar in scope
			scope.clinvar = sampleClinvarPutData;

			// Set PUT response
			$httpBackend.expectPUT(/clinvars\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/clinvars/' + sampleClinvarPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid clinvarId and remove the Clinvar from the scope', inject(function(Clinvars) {
			// Create new Clinvar object
			var sampleClinvar = new Clinvars({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Clinvars array and include the Clinvar
			scope.clinvars = [sampleClinvar];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/clinvars\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleClinvar);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.clinvars.length).toBe(0);
		}));
	});
}());