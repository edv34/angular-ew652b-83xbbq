import {Component, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { AppSettings } from './appsettings';
import { AppSettingsService } from './appsettingsservice';
import {TableOverviewExample} from './table-overview/table-overview-example';
import {UserData} from './table-save/table-save'

@Component({
  selector: 'tab-navigation',
  styleUrls: ['tab-navigation.css'],
  templateUrl: 'tab-navigation.html',
  providers: [AppSettingsService],
})
export class TabNavigation {
  @ViewChild(TableOverviewExample) table: TableOverviewExample;

  receiveMessage(id: number ,$event) {
    this.table.updateSource(id, $event);
  }
}