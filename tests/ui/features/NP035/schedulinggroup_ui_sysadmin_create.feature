@schdGroupCreateSystemAdminUI @smoke @ui
Feature: Scheduling Group CRUD

  Scenario: systemAdmin creates a scheduling group and areaAdmin_News cannot see it in the list

    Given user 'systemAdmin' is on Show Scheduled Group page
    When user creates a new scheduling group using test data from "schdGroupCreate_SystemAdmin_UIdata"
    Then the scheduling group should be visible in the list
    Given user 'areaAdmin_News' is on Show Scheduled Group page
    Then the scheduling group created by 'systemAdmin' should not be visible in the list
