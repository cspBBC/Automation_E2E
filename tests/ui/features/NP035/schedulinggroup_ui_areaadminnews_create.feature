@schdGroupCreateAreaAdminNewsUI @smoke1 @ui
Feature: Scheduling Group CRUD

  Scenario: areaAdmin_News creates a scheduling group successfully and systemAdmin can see it in the list
    Given user 'areaAdmin_News' is on Show "Scheduled Group" page
    When user creates a new scheduling group using test data from "schdGroupCreate_AreaAdminNews_UIdata"
    Then the scheduling group should be visible in the list
    Given user 'systemAdmin' is on Show "Scheduled Group" page
    Then the scheduling group created by 'areaAdmin_News' should be visible in the list

  #