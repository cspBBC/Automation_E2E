@smoke
Feature: Facility CRUD

  Scenario: create facility as system admin
    Given user is on facility catalogue page
    When user creates a new facility using test data from "facilityFormData"
    Then the facility should be created successfully
