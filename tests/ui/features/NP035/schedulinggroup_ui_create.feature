@schdGroupCreateUI @smoke @ui
Feature: Scheduling Group CRUD - Create

  # COVERAGE: NP035.01 (View list) | NP035.02 (Create/Add)
  # VALIDATES: AreaAdmin and SystemAdmin create permissions, data persistence

  Scenario Outline: <role> creates a scheduling group
    Given user '<role>' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    Examples:
      | role           | testDataFile                   |
      | areaAdmin_News | schdGroupCreate_AreaAdmin_UIdata |
      | systemAdmin    | schdGroupCreate_Sysadmin_UIdata  |
