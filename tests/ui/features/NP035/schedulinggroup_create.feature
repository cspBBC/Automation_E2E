@schdTeamUI @smoke @ui
Feature: Scheduling Group CRUD

  Scenario: Sys Admin creates and manages a scheduling group
    Given user 'systemAdmin' is on Show Scheduled Group page
    When user creates a new scheduling group using test data from "schdGroupData"
    Then the scheduling group should be visible in the list