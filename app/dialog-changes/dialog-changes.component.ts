import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogBox } from '../dialog-box/dialog-box';
import { UserData } from '../userdata';

@Component({
  selector: 'app-dialog-changes',
  templateUrl: './dialog-changes.component.html',
  styleUrls: ['./dialog-changes.component.css']
})

export class DialogChanges {
  changedData: UserData[];

  constructor(public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: UserData[]) {
    this.changedData = [].concat(data);
  }

}