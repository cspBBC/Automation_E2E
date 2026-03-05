@schdTeamUI @smoke @ui
Feature: Scheduling Team CRUD

  Scenario: Area Admin creates and manages a scheduling team
    Given user 'areaAdmin_News' is on Show Scheduled Team page
    When user creates a new scheduling team using test data from "schdTeamData"
    # Then the scheduling team "teat auto" should be visible in the list
   