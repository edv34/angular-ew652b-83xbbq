import { Component, NgZone,  OnDestroy,    OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogChanges } from '../dialog-changes/dialog-changes.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  isSaving = false;
  isSavingSub: any;

  constructor(private userService: UsersService, public dialog: MatDialog, public zone: NgZone) { }

  ngOnInit() {
    this.isSavingSub = this.userService.isSaving.subscribe( value => {
      if (value === true) {
        console.log("saving"); 
        this.zone.run(() => this.isSaving = true);
      }
      else {
        console.log("saved"); 
        this.zone.run(() => this.isSaving = false);
      }
    });
  }

  ngOnDestroy() {
    this.isSavingSub.unsubscribe();
  }

  showChanges() {
    const dialogRef = this.dialog.open(DialogChanges,
      {data: this.userService.getChanges()});
  }
}