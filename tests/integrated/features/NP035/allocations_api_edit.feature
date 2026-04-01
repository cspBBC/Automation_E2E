@allocation-api @smoke
Feature: Duty Allocation Edit via API

    @post
    Scenario Outline: Edit allocation with <user> user, <testDataFile> and <scenario> parameters
        Given user '<user>' is authenticated
        When the user hits mark-action.php to edit allocation with "<testDataFile>" and "<scenario>" parameters
        Then verify the edit endpoint returned expected response

        Examples:
            | user          | testDataFile               | scenario                |
            | systemAdmin   | allocationApi_PostParams.json | allocation-edit-default |

