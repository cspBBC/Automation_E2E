@schdGroupEditUI @ui
Feature: Scheduling Group CRUD - Edit

  # COVERAGE: NP035.03 (Edit Scheduling Group)
  # VALIDATES: Edit permission for all roles, Group name & notes update, Last Amended tracking

  Scenario Outline: <role> successfully edits scheduling group name and notes
    Given user '<role>' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    When the user clicks the Edit button for the scheduling group
    And the user updates the scheduling group name to "<updatedName>"
    And the user updates the notes to "<updatedNotes>"
    And the user clicks the Update scheduling group button
    Then the scheduling group name is updated to "<updatedName>"
    And the notes are updated to "<updatedNotes>"
    And the Last Amended By displays current user

    Examples:
      | role           | testDataFile                        | updatedName             | updatedNotes        |
      # | systemAdmin    | schdGroupCreate_SystemAdmin_UIdata  | Updated_Group_Name      | Updated group notes |
      | areaAdmin_News | schdGroupCreate_AreaAdminNews_UIdata | AreaAdmin_Updated_Group | Edited by AreaAdmin |

  Scenario Outline: <role> can edit multiple fields of a scheduling group independently
    Given user '<role>' is on the "Scheduled Group" page
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    When the user clicks the Edit button for the scheduling group
    And the user updates the scheduling group name to "<updatedName1>"
    And the user clicks the Update scheduling group button
    Then the scheduling group name is updated to "<updatedName1>"

    When the user clicks the Edit button for the scheduling group
    And the user updates the notes to "<updatedNotes1>"
    And the user clicks the Update scheduling group button
    Then the notes are updated to "<updatedNotes1>"
    And the Last Amended By displays current user

    Examples:
      | role           | testDataFile                        | updatedName1        | updatedNotes1           |
      | areaAdmin_News | schdGroupCreate_AreaAdminNews_UIdata | Updated_Name_Step1  | Notes updated in step 1 |
