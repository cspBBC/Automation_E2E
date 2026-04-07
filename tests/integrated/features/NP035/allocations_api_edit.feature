@allocation-api @smoke
Feature: Duty Allocation API Operations

    @post @create @edit
    Scenario Outline: Create and Edit duty with different parameters for <user>
        Given user '<user>' is authenticated

        # CREATE DUTY STEP
        When the user creates a duty from testDataFile "<testDataFile>" with parameters:
            | key                | value                |
            | DutyName           | <DutyName>           |
            | DutyID             | <DutyID>             |
            | ID                 | <ID>                 |
            | allocationsSchPer  | <allocationsSchPer>  |
            | SchedulingPersonID | <SchedulingPersonID> |
            | SchedulingTeamID   | <SchedulingTeamID>   |
            | DutyDate           | <DutyDate>           |
            | allocationsDate    | <allocationsDate>    |

        And verify duty operation completed in database

        # EDIT DUTY STEP
        When the user edits the duty from testDataFile "<testDataFile>" with parameters:
            | key                 | value                 |
            | editDutyName        | <editDutyName>        |
            | editStartTime       | <editStartTime>       |
            | editEndTime         | <editEndTime>         |
            | editdutyColorId     | <editdutyColorId>     |
            | editbreakTimeHour   | <editbreakTimeHour>   |
            | editbreakTimeMinute | <editbreakTimeMinute> |
            | editcurrDurationVal | <editcurrDurationVal> |

        And verify duty operation completed in database
        Then verify the edit operation is recorded in duty history with change details
        And verify the edit field changes are reflected in database

        Examples:
            | user        | testDataFile                  | DutyName        | DutyID | ID    | allocationsSchPer | SchedulingPersonID | SchedulingTeamID | DutyDate   | allocationsDate | editDutyName     | editStartTime | editEndTime | editdutyColorId | editbreakTimeHour | editbreakTimeMinute | editcurrDurationVal |
            | systemAdmin | allocationApi_PostParams.json | U_API_Create_P1 | 35386  | 35386 | 8577              | 8577               | 275              | 2026-04-04 | 2026-04-04      | U_API_Edit_P1_v2 | 10:00         | 11:30       | 5               | 0                 | 30                  | 00:30               |
