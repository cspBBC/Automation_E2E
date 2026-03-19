@schdGroupDeleteUI @ui
Feature: Scheduling Group CRUD - Delete

  # COVERAGE: NP035.04 (Delete Scheduling Group)
  # VALIDATES: Delete permission for all roles, confirmation dialog, record removal, data persistence

  Scenario Outline: <role> deletes a scheduling group
    Given user '<role>' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    When the user clicks the Delete button for the scheduling group
    Then the delete confirmation popup appears with title "Delete Scheduling Group"
    And the confirmation message displays "Are you sure you want to delete"
    When the user approves the deletion
    Then the scheduling group is no longer visible in the list

    Examples:
      | role           | testDataFile                        |
      | systemAdmin    | schdGroupCreate_SystemAdmin_UIdata  |
      | areaAdmin_News | schdGroupCreate_AreaAdminNews_UIdata |
