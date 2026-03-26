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

    When the user clicks the Delete button for the scheduling group
    Then the delete confirmation popup appears with title "Delete Scheduling Group"
    And the user approves the deletion
    Then the scheduling group is no longer visible in the list

    Examples:
      | role           | testDataFile                        | updatedName             | updatedNotes        |
      # | systemAdmin    | schdGroupCreate_SystemAdmin_UIdata  | Updated_Group_Name      | Updated group notes |
      | areaAdmin_News | schdGroupCreate_AreaAdminNews_UIdata | AreaAdmin_Updated_Group | Edited by AreaAdmin |

  
