@schdGroupPermissionBoundaryUI @ui
Feature: Scheduling Group CRUD - Permission Boundary

  # COVERAGE: NP035.01 - Permission Boundary Testing
  # VALIDATES: Strict role-based access control, area isolation for AreaAdmin, cross-area access for SystemAdmin

  Scenario Outline: AreaAdmin cannot view scheduling groups outside their area and SystemAdmin can delete
    # Step 1: SystemAdmin creates a scheduling group
    Given user 'systemAdmin' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible to 'systemAdmin'

    # Step 2: AreaAdmin verifies permission boundary - cannot see the group
    When user '<areaAdminRole>' navigates to the "Scheduled Group" page
    Then the scheduling group created by 'systemAdmin' is not visible
    And Edit and Delete actions are not available for '<areaAdminRole>'

    # Step 3: SystemAdmin logs back in and deletes the created group
    When user 'systemAdmin' navigates to the "Scheduled Group" page
    Then the scheduling group is visible
    When the user clicks the Delete button for the scheduling group
    When the user approves the deletion
    Then the scheduling group is no longer visible in the list

    Examples:
      | areaAdminRole  | testDataFile              |
      | areaAdmin_News | schdGroupCreate_SystemAdmin_UIdata |