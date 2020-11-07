import { Component, Inject, Optional } from '@angular/core';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {UserData} from '../userdata'

@Component({
  selector: 'dialog-box',
  templateUrl: './dialog-box.html',
  styleUrls: ['./dialog-box.css']
})
export class DialogBox {

  action:string;
  local_data:any;

  constructor(
    public dialogRef: MatDialogRef<DialogBox>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UserData) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}