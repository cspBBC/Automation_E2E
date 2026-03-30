@schd-groupapi @smoke 
Feature: NP035.01 - View Scheduling Groups List

  Scenario: System Admin can view all Scheduling Groups from any area
    Given user 'systemAdmin' is authenticated
    When the system admin requests to view all Scheduling Groups
    Then the response status code should be 200
    
