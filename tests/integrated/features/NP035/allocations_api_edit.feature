@allocation-api @smoke
Feature: Duty Allocation API Operations

    @post @create @edit
    Scenario Outline: Create and Edit duty with different parameters for <user>
        Given user '<user>' is authenticated

        # CREATE DUTY STEP
        When the user creates a duty from testDataFile "<testDataFile>" with parameters:
            | key                | value                |
            | dutyName           | <dutyName>           |
            | DutyID             | <DutyID>             |
            | ID                 | <ID>                 |
            | allocationsSchPer  | <allocationsSchPer>  |
            | SchedulingPersonID | <SchedulingPersonID> |
            | SchedulingTeamID   | <SchedulingTeamID>   |
            | dutyDate           | <dutyDate>           |
            | allocationsDate    | <allocationsDate>    |

        And verify duty operation completed in database

        # EDIT DUTY STEP - AllocationsDutyID from CREATE is used automatically in template
        When the user edits the duty from testDataFile "<testDataFile>" with parameters:
            | key                 | value                 |
            | editDutyName        | <editDutyName>        |
            | editStartTime       | <editStartTime>       |
            | editEndTime         | <editEndTime>         |
            | editDutyColorId     | <editDutyColorId>     |
            | editBreakTimeHour   | <editBreakTimeHour>   |
            | editBreakTimeMinute | <editBreakTimeMinute> |
            | editCurrDurationVal | <editCurrDurationVal> |

        And verify duty operation completed in database
        Then verify the edit operation is recorded in duty history with change details
        And verify the edit field changes are reflected in database

        Examples:
            | user        | testDataFile                  | dutyName        | DutyID | ID    | allocationsSchPer | SchedulingPersonID | SchedulingTeamID | dutyDate   | allocationsDate | editStartTime | editEndTime | editDutyColorId | editBreakTimeHour | editBreakTimeMinute | editDutyName     | editCurrDurationVal |
            | systemAdmin | allocationApi_PostParams.json | U_API_Create_P1 | 35386  | 35386 | 8577              | 8577               | 275              | 2026-04-04 | 2026-04-04      | 10:00         | 11:30       | 5               | 0                 | 30                  | U_API_Edit_P1_v2 | 00:30               |
