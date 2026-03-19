@schdGroupHistoryUI @ui
Feature: Scheduling Group CRUD - History

  # COVERAGE: NP035.05 (View History of Changes)
  # VALIDATES: History access for all roles, audit trail, change tracking, all column modifications

  Scenario Outline: <role> views history of changes to a scheduling group
    Given user '<role>' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    When the user clicks the Edit button for the scheduling group
    And the user updates the scheduling group name to "<updatedName>"
    And the user clicks the Update scheduling group button
    And the user clicks the History option for the scheduling group
    Then the history popup displays with all historical changes
    And history shows timestamps of each modification
    And history shows user names who made each change
    And history displays changes for Name, Notes, and other column modifications
    And the user can close the history popup

    Examples:
      | role           | testDataFile                   | updatedName            |
      | systemAdmin    | schdGroupCreate_Sysadmin_UIdata | Updated_History_Test   |
      | areaAdmin_News | schdGroupCreate_AreaAdmin_UIdata | AreaAdmin_History_Test |
