import { expect, Page } from '@playwright/test';
import { FormField } from '@feildtypes/formField';
import { fillForm } from '@helpers/formFiller';
import { readJSON } from '@helpers/readJson';
import { assert } from 'node:console';

export class ScheduledGroupPage {
  private formData?: Record<string, FormField>; // store JSON once

  constructor(private page: Page) { }

  // Open Scheduling Group page
  async open() {
    await this.page.goto('/mvc-app/admin/scheduling-group');
  }

  // Store formData and fill form
  async fill(formData: Record<string, FormField>) {
    this.formData = formData;
    await fillForm(this.page, formData);
  }

  // Create Scheduling Group using JSON data
  async createScheduledGroup(filename: string = 'schdGroupData') {

    // Click Add New
    await this.page.getByRole('button', { name: 'Add Scheduling Group' }).click();

    // Wait for modal/dialog
    await this.page.locator('#facebox').waitFor({ state: 'visible' });

    // Load JSON
    const jsonPath = `workflows/schedulingGroup/data/${filename}.json`;
    const jsonData = await readJSON(jsonPath);

    // Generate unique group name for each execution (01-99)
    const randomNum = Math.floor(Math.random() * 99) + 1;
    const formattedNum = String(randomNum).padStart(2, '0');
    jsonData['group_name'].value = `Test Scheduling Group_${formattedNum}`;

    // Fill form
    await this.fill(jsonData);

  }


  async verifyScheduledGroupExists() {

    if (!this.formData) throw new Error('Form data not loaded');
    const groupName = this.formData['group_name'].value as string;

    /* <table id="scheduling-list-table" class="display tablesmall dataTable" style="width: 100%;"><colgroup><col data-dt-column="0" style="width: 112.05px;"><col data-dt-column="1" style="width: 158.938px;"><col data-dt-column="2" style="width: 252.913px;"><col data-dt-column="3" style="width: 230.588px;"><col data-dt-column="4" style="width: 153.075px;"><col data-dt-column="5" style="width: 247.238px;"><col data-dt-column="6" style="width: 154.913px;"><col data-dt-column="7" style="width: 169.488px;"></colgroup>
            <thead>
                <tr><th style="text-align: center" data-dt-column="0" rowspan="1" colspan="1" class="dt-orderable-none"><div class="dt-column-header"><span class="dt-column-title">Actions</span><span class="dt-column-order"></span></div></th><th data-dt-column="1" rowspan="1" colspan="1" class="dt-orderable-asc dt-orderable-desc"><div class="dt-column-header"><span class="dt-column-title">Area Name</span><span class="dt-column-order" role="button" aria-label="Area Name: Activate to sort" tabindex="0"></span></div><div id="yadcf-filter-wrapper-scheduling-list-table-1" class="yadcf-filter-wrapper"><input type="text" id="yadcf-filter-scheduling-list-table-1" class="yadcf-filter " placeholder="Type to filter" filter_match_mode="contains"><button type="button" id="yadcf-filter-scheduling-list-table-1-reset" class="yadcf-filter-reset-button ">x</button></div></th><th data-dt-column="2" rowspan="1" colspan="1" class="dt-orderable-asc dt-orderable-desc"><div class="dt-column-header"><span class="dt-column-title">Scheduling Group Name</span><span class="dt-column-order" role="button" aria-label="Scheduling Group Name: Activate to sort" tabindex="0"></span></div><div id="yadcf-filter-wrapper-scheduling-list-table-2" class="yadcf-filter-wrapper"><input type="text" id="yadcf-filter-scheduling-list-table-2" class="yadcf-filter " placeholder="Type to filter" filter_match_mode="contains"><button type="button" id="yadcf-filter-scheduling-list-table-2-reset" class="yadcf-filter-reset-button ">x</button></div></th><th data-dt-column="3" rowspan="1" colspan="1" class="dt-orderable-asc dt-orderable-desc"><div class="dt-column-header"><span class="dt-column-title">Associated Scheduling Team</span><span class="dt-column-order" role="button" aria-label="Associated Scheduling Team: Activate to sort" tabindex="0"></span></div><div id="yadcf-filter-wrapper-scheduling-list-table-3" class="yadcf-filter-wrapper"><input type="text" id="yadcf-filter-scheduling-list-table-3" class="yadcf-filter " placeholder="Type to filter" filter_match_mode="contains"><button type="button" id="yadcf-filter-scheduling-list-table-3-reset" class="yadcf-filter-reset-button ">x</button></div></th><th data-dt-column="4" rowspan="1" colspan="1" class="dt-orderable-asc dt-orderable-desc"><div class="dt-column-header"><span class="dt-column-title">Allocations Menu</span><span class="dt-column-order" role="button" aria-label="Allocations Menu: Activate to sort" tabindex="0"></span></div><div id="yadcf-filter-wrapper-scheduling-list-table-4" class="yadcf-filter-wrapper"><input type="text" id="yadcf-filter-scheduling-list-table-4" class="yadcf-filter " placeholder="Type to filter" filter_match_mode="contains"><button type="button" id="yadcf-filter-scheduling-list-table-4-reset" class="yadcf-filter-reset-button ">x</button></div></th><th style="line-height:28px;" data-dt-column="5" rowspan="1" colspan="1" class="dt-orderable-asc dt-orderable-desc"><div class="dt-column-header"><span class="dt-column-title">Notes</span><span class="dt-column-order" role="button" aria-label="Notes: Activate to sort" tabindex="0"></span></div><div id="yadcf-filter-wrapper-scheduling-list-table-5" class="yadcf-filter-wrapper"><input type="text" id="yadcf-filter-scheduling-list-table-5" class="yadcf-filter " placeholder="Type to filter" filter_match_mode="contains"><button type="button" id="yadcf-filter-scheduling-list-table-5-reset" class="yadcf-filter-reset-button ">x</button></div></th><th data-dt-column="6" rowspan="1" colspan="1" class="dt-orderable-asc dt-orderable-desc"><div class="dt-column-header"><span class="dt-column-title">Last Amended By</span><span class="dt-column-order" role="button" aria-label="Last Amended By: Activate to sort" tabindex="0"></span></div><div id="yadcf-filter-wrapper-scheduling-list-table-6" class="yadcf-filter-wrapper"><input type="text" id="yadcf-filter-scheduling-list-table-6" class="yadcf-filter " placeholder="Type to filter" filter_match_mode="contains"><button type="button" id="yadcf-filter-scheduling-list-table-6-reset" class="yadcf-filter-reset-button ">x</button></div></th><th data-dt-column="7" rowspan="1" colspan="1" class="dt-orderable-asc dt-orderable-desc"><div class="dt-column-header"><span class="dt-column-title">Last Amended Date</span><span class="dt-column-order" role="button" aria-label="Last Amended Date: Activate to sort" tabindex="0"></span></div></th></tr>
            </thead>
            <tbody><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="31" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="31" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="31" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>News</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="31">saDAda</td>
                        <td>None</td>
                        <td>Yes</td>
                        <td>AdaDAd</td>
                        <td>Sameer Patan</td>
                        <td>06/03/2026 04:35</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="30" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="30" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="30" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>Media Operations</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="30">Test Scheduling Group_46</td>
                        <td>None</td>
                        <td>No</td>
                        <td></td>
                        <td>Sameer Patan</td>
                        <td>06/03/2026 04:32</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="29" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="29" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="29" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>Media Operations</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="29">haghsgahgdsjhaGD</td>
                        <td>None</td>
                        <td>Yes</td>
                        <td>SGAJHGDJHAgjdaDFGA</td>
                        <td>Sameer Patan</td>
                        <td>06/03/2026 04:26</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="28" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="28" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="28" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>Media Operations</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="28">Test Scheduling Group_62</td>
                        <td>None</td>
                        <td>Yes</td>
                        <td>yu</td>
                        <td>Sameer Patan</td>
                        <td>06/03/2026 04:21</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="27" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="27" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="27" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>Automation</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="27">SP_AutoTestAutomationSchedul12356</td>
                        <td>None</td>
                        <td>No</td>
                        <td>Automation SG for automation area</td>
                        <td>Sameer Patan</td>
                        <td>05/03/2026 08:27</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="9" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="9" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="9" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>News</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="9">asdasdas@3#</td>
                        <td>None</td>
                        <td>Yes</td>
                        <td>12</td>
                        <td>Sameer Patan</td>
                        <td>03/03/2026 14:33</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="8" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="8" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="8" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>News</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="8">#adsasdaasdasd</td>
                        <td>None</td>
                        <td>Yes</td>
                        <td>asdasd</td>
                        <td>Ghanshyam</td>
                        <td>27/02/2026 09:28</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="7" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="7" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="7" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>News</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="7">H Scheduling Group</td>
                        <td>None</td>
                        <td>Yes</td>
                        <td>Group created on 25 Feb</td>
                        <td>Hari xxxx</td>
                        <td>25/02/2026 09:40</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="6" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="6" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="6" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>News</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="6">Scheduling Group 1</td>
                        <td>SP_STNewsArea</td>
                        <td>Yes</td>
                        <td>this is testing group</td>
                        <td>Santoshkumar</td>
                        <td>19/02/2026 13:10</td>
                    </tr><tr>
                        <td style="text-align: center">
                            <div style="width: 90px">
                                <i class="fa fa-hourglass-end history-scheduling-group-icon" data-scheduling-group-id="5" role="button" aria-label="View scheduling group history" tabindex="0"></i>
                                <i class="fas fa-edit edit-scheduling-group-icon" data-scheduling-group-id="5" role="button" aria-label="Edit scheduling group" tabindex="0"></i>
                                <i class="fas fa-trash-alt delete-scheduling-group-icon" data-scheduling-group-id="5" role="button" aria-label="Delete scheduling group" tabindex="0"></i>
                            </div>
                        </td>
                        <td>Automation</td>
                        <td class="scheduling-group-name" data-scheduling-group-id="5">SGroup2 AutoTest1</td>
                        <td>SP_STAutoArea</td>
                        <td>Yes</td>
                        <td>Sgroup2 created for automation area</td>
                        <td>Sameer Patan</td>
                        <td>24/02/2026 05:06</td>
                    </tr></tbody>
        <tfoot></tfoot></table>*/

    assert(groupName, 'Group name is required for verification');
    const groupRow = this.page.locator('table#scheduling-list-table tbody tr').filter({
      has: this.page.locator(`td.scheduling-group-name:has-text("${groupName}")`)
    });

    await expect(groupRow).toHaveCount(1);
    console.log(`Verified presence of scheduling group: ${groupName}`);
  }


}