@schd-group @smoke @scheduling-groups @api_db
Feature: NP035.02 - Create Scheduling Group

  Scenario: System Admin creates a new Scheduling Group in any area
    Given user 'systemAdmin' is authenticated
  #   When the user submits a POST request to create a Scheduling Group with default payload
  #   Then the response status code should be 201
  #   And the Scheduling Group should be created in the database

  # Scenario: Area Admin creates in assigned area
  #   Given user 'areaAdminCandidate' is authenticated
  #   When the user submits a POST request to create a Scheduling Group with default payload
  #   Then the response status code should be 201
  #   And the Scheduling Group should be created in the database

  # Scenario: Area Admin cannot create outside assigned area
  #   Given user 'areaAdminCandidate' is authenticated
  #   When the user submits a POST request to create in area 20
  #   Then the response status code should be 403