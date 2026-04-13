@schdGroupCreateUI @smoke @ui
Feature: Scheduling Group CRUD - Create

  # COVERAGE: NP035.01 (View list) | NP035.02 (Create/Add)
  # VALIDATES: AreaAdmin and SystemAdmin create permissions, data persistence

  Scenario Outline: <role> creates a scheduling group
    Given user '<role>' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    When the user clicks the Delete button for the scheduling group
    Then the delete confirmation popup appears with title "Delete Scheduling Group"
    And the user approves the deletion
    Then the scheduling group is no longer visible in the list

    Examples:
      | role           | testDataFile                         |
      | areaAdmin_News | schdGroupCreate_AreaAdminNews_UIdata |
      | systemAdmin    | schdGroupCreate_SystemAdmin_UIdata   |
