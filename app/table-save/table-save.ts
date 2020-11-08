import {Component, ViewChild, Output, EventEmitter,OnInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {MatDialog} from '@angular/material';
import {DialogBox} from '../dialog-box/dialog-box';
import {UsersService} from '../users.service';
import {UserData} from '../userdata';
import {DialogChanges} from '../dialog-changes/dialog-changes.component';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'table-save',
  styleUrls: ['table-save.css'],
  templateUrl: 'table-save.html',
  providers: [],
})
export class TableSave implements OnInit{
  displayedColumns = ['id', 'name', 'progress', 'color', 'action'];
  dataSource: MatTableDataSource<UserData>;
  dataSaved: MatTableDataSource<UserData>;
  changedData: UserData[] = [];
  isUnchanged: boolean = true;

  isSaving = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() messageEvent = new EventEmitter<UserData[]>();

  constructor(public dialog: MatDialog, private userService: UsersService) {
    // Create users
    /*const users: UserData[] = [];
    for (let i = 1; i <= 5; i++) { users.push(createNewUser(i)); }
    const usersSaved: UserData[] = [].concat(users);*/
    const usersSaved: UserData[] = userService.getUsers();
    const users: UserData[] = [].concat(usersSaved);

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.dataSaved = new MatTableDataSource(usersSaved);
  }

  ngOnInit() {
      this.userService.isSaving.subscribe( value => {
      if (value === true) {
        console.log("saving");
        this.isSaving = true;
        /*
        let el = document.getElementsByClassName("change-notification")[0];
        el.style.display = "inline";*/
      }
      else {
        console.log("saved"); 
        this.isSaving = false;
/*
        let el = document.getElementsByClassName("change-notification")[0];
        el.style.display = "none";*/
      }
    });
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

  showChanges() {
    const dialogRef = this.dialog.open(DialogChanges,
      {data: this.userService.getChanges()});
  }

  addRowData(row_obj){
    let data = this.dataSource.data;
    let newId = parseInt(data[data.length-1].id) + 1;
    //let user = createNewUser(lastId + 1);
    let user = {
          id: newId.toString(),
          name: row_obj.name,
          progress: Math.round(Math.random() * 100).toString(),
          color: 'red',
          action: 'Add'
    }
    data.push(user);
    this.changedData.push(user);
    //this.dataSource = new MatTableDataSource(data);
    this.isUnchanged = false;
    this.refreshTable();
  }

  deleteRowData(row_obj){
    let data = this.dataSource.data;
    for (let i = 0; i < data.length; i++) 
    {
      if (data[i].id == row_obj.id)
      {
        //Add user to changes
        let user = {...data[i]};
        //user.name = '';
        user.action = 'Delete';
        this.changedData.push(user);

        data.splice(i, 1);
        break;
      }
    }
    //this.dataSource = new MatTableDataSource(data);
    this.isUnchanged = false;
    this.refreshTable();
  }

  startSave(){
    //wait while showing a spinner
    let spinner = document.getElementsByClassName("spinner-bg")[0];
    spinner.style.display = "inline";
    this.userService.isSaving.next(true);
    setTimeout(() => this.afterSave(spinner), 2000);
  }

  afterSave(spinner: Element){
    this.userService.updateData(this.dataSource.data);
    this.userService.isSaving.next(false);
    spinner.style.display = "none";
    this.isUnchanged = true;
  }

  onSaveClick(){
    //this.startSave();
    this.userService.applyChanges(this.changedData);
    this.changedData.splice(0, this.changedData.length);
    this.isUnchanged = true;
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

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */