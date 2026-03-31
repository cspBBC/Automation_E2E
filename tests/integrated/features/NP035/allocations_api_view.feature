@allocation-api @smoke
Feature: Duty Allocation View via API

  Background:
    Given user 'systemAdmin' is authenticated

 @view
  Scenario: View allocation with default parameters
    When the system admin hits mark-action.php to view allocation with 'allocation-view-default' parameters
    Then verify the view endpoint returned success
