@schdGroupPermissionBoundaryUI @ui
Feature: Scheduling Group CRUD - Permission Boundary

  # COVERAGE: NP035.01 - Permission Boundary Testing
  # VALIDATES: Strict role-based access control, area isolation for AreaAdmin, cross-area access for SystemAdmin

  Scenario Outline: AreaAdmin cannot view scheduling groups outside their area
    Given user 'systemAdmin' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible to 'systemAdmin'

    When user '<areaAdminRole>' navigates to the "Scheduled Group" page
    Then the scheduling group created by 'systemAdmin' is not visible

    Examples:
      | areaAdminRole  | testDataFile              |
      | areaAdmin_News | schdGroupCreate_Sysadmin_UIdata |


  Scenario Outline: AreaAdmin cannot edit/delete scheduling groups outside their area
    Given user 'systemAdmin' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    When user '<areaAdminRole>' navigates to the "Scheduled Group" page
    Then the scheduling group created by 'systemAdmin' is not visible
    And Edit and Delete actions are not available for '<areaAdminRole>'

    Examples:
      | areaAdminRole  | testDataFile              |
      | areaAdmin_News | schdGroupCreate_Sysadmin_UIdata |


  Scenario Outline: SystemAdmin can view/edit/delete all scheduling groups across areas
    Given user '<areaAdminRole>' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    When user 'systemAdmin' navigates to the "Scheduled Group" page
    Then the scheduling group created by '<areaAdminRole>' is visible
    And Edit and Delete actions are available for 'systemAdmin'

    Examples:
      | areaAdminRole  | testDataFile                   |
      | areaAdmin_News | schdGroupCreate_AreaAdmin_UIdata |
