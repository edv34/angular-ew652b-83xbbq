import {Component, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AppSettings} from '../appsettings';
import {AppSettingsService} from '../appsettingsservice';
import {HttpClient} from "@angular/common/http";
import {UsersService} from '../users.service';
import {UserData} from '../userdata';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'table-overview-example',
  styleUrls: ['table-overview-example.css'],
  templateUrl: 'table-overview-example.html',
  providers: [AppSettingsService],
})
export class TableOverviewExample {
  displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private settings: AppSettings;

  constructor(private appSettingsService: AppSettingsService, private http: HttpClient, private userService: UsersService) {
    /*
    const users: UserData[] = [];
    for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }
    this.dataSource = new MatTableDataSource(users);*/
    this.dataSource = new MatTableDataSource(userService.getUsers());

    // Custom filter
    this.dataSource.filterPredicate = 
      (data: UserData, filter: string) => {
        var regexpId = new RegExp('id(>|>=|<|<=|==)([0-9]+)');
        var regexpName = new RegExp('name like [\'\"](.+)[\'\"]');
        var res = true;
        //Split the query on 'or' and then on 'and'
        //If an 'or' substring is true after processing and combining all 'and' substrings, break and return true
        var splitOr = filter.split(" or ");
        for (let i in splitOr)
        {
          res = true;
          var splitAnd = splitOr[i].split(" and ");
          for (let j in splitAnd)
          {
            var matchName = splitAnd[j].match(regexpName);
            var matchId = splitAnd[j].match(regexpId);
            if (matchId != null)
            {
              res = res && eval(data.id.toString() + matchId[1] + matchId[2]);
            }
            else if (matchName != null)
            {
              let name = matchName[1];
              if (name.startsWith('/') && name.endsWith('/'))
              {
                let rgx = new RegExp(name.substr(1, name.length-2));
                res = res && rgx.test(data.name.toLowerCase());
              }
              else
                res = res && (data.name.toLowerCase().includes(matchName[1]));
            }
            else
            {
              res = false;
              break;
            }
          }
          if (res == true)
            break;
        }
        return res;
      }
  }

  ngOnInit(): void {
    this.appSettingsService.getSettings()
      .subscribe(settings => this.settings = settings,
        () => null,
        () => {
          console.log(this.settings.defaultFilter);
        });
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //Can't load appsetting.json on stackblitz
    //document.getElementById("Filter").value = this.settings.defaultFilter;

    //Get filter from url
    //var url = this.settings.defaultSavePath;
    /*var url = "https://mockbin.org/bin/8023d488-a89a-45db-aba6-502414a9c523";
    this.http.get(url, {responseType: 'text'}).subscribe(data => {
      document.getElementById("Filter").value = data;
    })*/
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

	onClickSave() {
    var data = document.getElementById("Filter").value;
    var blob = new Blob([data], {type: 'text/plain'});

    //Upload 
    //this.http.post(this.settings.defaultSavePath, blob);

    //Save locally, since can't really upload anything to here
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "Filter.txt";
    document.body.appendChild(link);
    link.click();
  }

  onClickExport() {
    //There's a mat-table-exporter package that supports multiple formats
    //But can't get it to work, so just save as json
    var data = JSON.stringify(this.dataSource.filteredData);
    var blob = new Blob([data], {type: 'text/plain'});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "Data.json";
    document.body.appendChild(link);
    link.click();
  }

  onFileSelected() {
    //Load a file, parse as json and use it as datasource
    let file = document.getElementById("file").files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = (e) => {
      const data = JSON.parse(reader.result.toString());
      this.dataSource = new MatTableDataSource(data);
    };
  }

}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */