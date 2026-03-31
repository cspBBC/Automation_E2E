@allocation-api @smoke
Feature: Duty Allocation Edit via API

  Background:
    Given user 'systemAdmin' is authenticated

  @priority-high
  Scenario: Hit PHP developer's allocation edit endpoint
    When the system admin hits the mark-action.php endpoint with duty allocation parameters
    Then verify the endpoint is working
