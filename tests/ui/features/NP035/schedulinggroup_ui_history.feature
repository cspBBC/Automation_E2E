@schdGroupHistoryUI @ui
Feature: Scheduling Group CRUD - History

  # COVERAGE: NP035.05 (View History of Changes)
  # VALIDATES: History access for all roles, audit trail, change tracking, all column modifications

  Scenario Outline: <role> performs complete CRUD operations and verifies history at each step
    Given user '<role>' is on the "Scheduled Group" page
    
    # Step 1: Create
    When the user creates a new scheduling group using "<testDataFile>"
    Then the scheduling group is visible

    # Step 2: Check History after creation
    When the user clicks the History option for the scheduling group
    Then the history popup displays with all historical changes
    And history shows timestamps of each modification
    And history shows user names who made each change
    And the user can close the history popup

    # Step 3: Edit
    When the user clicks the Edit button for the scheduling group
    And the user updates the scheduling group name to "<updatedName>"
    And the user updates the notes to "<updatedNotes>"
    And the user clicks the Update scheduling group button
    Then the scheduling group is updated in the table with the new name and notes

    # Step 4: Check History after edit
    When the user clicks the History option for the scheduling group
    Then the history popup displays with all historical changes
    And history shows timestamps of each modification
    And history shows user names who made each change
    And history displays changes for Name, Notes, and other column modifications
    And the user can close the history popup

    # Step 5: Delete
    When the user clicks the Delete button for the scheduling group
    Then the delete confirmation popup appears with title "Delete Scheduling Group"
    And the user approves the deletion
    Then the scheduling group is no longer visible in the list

    Examples:
      | role           | testDataFile                        | updatedName | updatedNotes |
      | areaAdmin_News | schdGroupCreate_AreaAdminNews_UIdata | RANDOM_NAME | RANDOM_NOTES |
