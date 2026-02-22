@schd-group @smoke @scheduling-groups @api_db
Feature: NP035.02 - Create Scheduling Group
  Background:
    Given the test database is seeded with areas, users, and teams
    And the following test users are available:
      | UserId | Role       | Area     | Description              |
      | 1001   | SystemAdmin | N/A      | Can create in all areas  |
      | 1002   | AreaAdmin  | Area 10  | Can create in Area 10    |
      | 1003   | AreaAdmin  | Area 20  | Can create in Area 20    |
      | 1004   | User       | N/A      | No admin permissions     |

  # ============================================
  # POSITIVE TEST SCENARIOS
  # ============================================

  Scenario: System Admin creates a new Scheduling Group in any area
    Given user 1001 (System Admin) is authenticated
    When the user submits a POST request to create a Scheduling Group with:
      | Field               | Value                          |
      | name                | SG_SystemAdmin_Test_<timestamp>|
      | area                | 10                             |
      | allocations_menu    | true                           |
      | notes               | Created by System Admin test   |
    Then the response status code should be 201
    And the response should contain the created Scheduling Group ID
    And the Scheduling Group should be created in the database with:
      | Field               | Expected Value             |
      | scheduling_group_name | SG_SystemAdmin_Test_<timestamp> |
      | area                | 10                         |
      | allocations_menu    | 1 (true)                   |
      | notes               | Created by System Admin test |
      | last_amended_by     | 1001                       |

  # Scenario: Area Admin creates a Scheduling Group in their assigned area
  #   Given user 1002 (Area Admin Area 10) is authenticated
  #   When the user submits a POST request to create a Scheduling Group with:
  #     | Field               | Value                        |
  #     | name                | SG_AreaAdmin_Area10_<timestamp> |
  #     | area                | 10                           |
  #     | allocations_menu    | false                        |
  #     | notes               | Created by Area Admin test   |
  #   Then the response status code should be 201
  #   And the response should contain the created Scheduling Group ID
  #   And the Scheduling Group should be created in the database with:
  #     | Field               | Expected Value           |
  #     | scheduling_group_name | SG_AreaAdmin_Area10_<timestamp> |
  #     | area                | 10                       |
  #     | allocations_menu    | 0 (false)                |
  #     | notes               | Created by Area Admin test |
  #     | last_amended_by     | 1002                     |