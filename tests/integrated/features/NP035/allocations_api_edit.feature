@allocation-api @smoke
Feature: Duty Allocation Edit via API

  Background:
    Given user 'systemAdmin' is authenticated

  @priority-high @method-post
  Scenario: Edit allocation with default parameters
    When the system admin hits mark-action.php to edit allocation with 'allocation-edit-default' parameters
    Then verify the edit endpoint returned expected response

