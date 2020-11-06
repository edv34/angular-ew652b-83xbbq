import {Component, ViewChild, Output, EventEmitter,OnInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog } from '@angular/material';
import { DialogBox } from '../dialog-box/dialog-box'

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'table-save',
  styleUrls: ['table-save.css'],
  templateUrl: 'table-save.html'
})
export class TableSave implements OnInit{
  displayedColumns = ['id', 'name', 'progress', 'color', 'action'];
  dataSource: MatTableDataSource<UserData>;
  dataSaved: MatTableDataSource<UserData>;
  isUnchanged: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() messageEvent = new EventEmitter<UserData[]>();

  constructor(public dialog: MatDialog) {
    // Create users
    const users: UserData[] = [];
    for (let i = 1; i <= 5; i++) { users.push(createNewUser(i)); }
    const usersSaved: UserData[] = [].concat(users);

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.dataSaved = new MatTableDataSource(usersSaved);
  }

  ngOnInit() {
    this.sendData();
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBox, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj){
    let data = this.dataSource.data;
    let lastId = parseInt(data[data.length-1].id);
    let user = createNewUser(lastId + 1);
    user.name = row_obj.name;
    data.push(user);
    //this.dataSource = new MatTableDataSource(data);
    this.isUnchanged = false;
    this.refreshTable();
  }

  deleteRowData(row_obj){
    let data = this.dataSource.data;
    for (let i = 0; i < data.length; i++) 
    {
      if (data[i].id == row_obj.id)
        data.splice(i, 1);
    }
    //this.dataSource = new MatTableDataSource(data);
    this.isUnchanged = false;
    this.refreshTable();
  }

  startSave(){
    //wait while showing a spinner
    let spinner = document.getElementsByClassName("spinner-bg")[0];
    spinner.style.display = "inline";
    setTimeout(() => this.afterSave(spinner), 15000);
  }

  afterSave(spinner: Element){
    let data = this.dataSaved.data;
    data = [].concat(this.dataSource.data);
    this.dataSaved = new MatTableDataSource(data);
    this.sendData();
    //let spinner = document.getElementsByClassName("spinner-bg")[0];
    spinner.style.display = "none";
    this.isUnchanged = true;
  }

  onSaveClick(){
    this.startSave();
  }

  onCancelClick(){
    let data = this.dataSource.data;
    data = [].concat(this.dataSaved.data);
    this.dataSource = new MatTableDataSource(data);
    this.isUnchanged = true;
    this.refreshTable();
  }

  refreshTable(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //Send to parent (tab-nav), which then sends it down to table-overview
  sendData(){
    this.messageEvent.emit(this.dataSaved.data);
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */