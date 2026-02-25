@schd-group @smoke @scheduling-groups
Feature: NP035.01 - View Scheduling Groups List

  Scenario: System Admin can view all Scheduling Groups from any area
    Given user 'systemAdmin' is authenticated
    When the system admin requests to view all Scheduling Groups
    Then the response status code should be 200
    And the response should contain Scheduling Group with ID 19
    And the response should contain Scheduling Group with ID 24
    And the Scheduling Groups list should be retrieved from database
