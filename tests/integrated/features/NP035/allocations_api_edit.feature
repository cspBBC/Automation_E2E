@allocation-api @smoke
Feature: Duty Allocation API Operations

    @post @edit 
    Scenario Outline: Verify template-based edit with captured AllocationsDutyID for <testDataFile>
        Given user '<user>' is authenticated
        When the user hits mark-action.php with "<testDataFile>" and "new_duty_create" parameters
        And verify duty operation completed with "<testDataFile>" and "new_duty_create" parameters in database
        When the user edits the duty with "<testDataFile>" and "edit_duty_update" parameters using captured AllocationsDutyID
        Then verify the edit captured AllocationsDutyID successfully
        And verify the edit operation is recorded in duty history with change details

        Examples:
            | user        | testDataFile                  |
            | systemAdmin | allocationApi_PostParams.json |

