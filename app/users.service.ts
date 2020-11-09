import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {UserData} from './userdata';

@Injectable()
export class UsersService {
  private users: UserData[] = [];
  private changes: UserData[] = [];
  isSaving: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //isSaving: Subject<boolean> = new Subject<boolean>();

  constructor() {
    for (let i = 1; i <= 5; i++) { 
      this.users.push(createNewUser(i)); 
    }
  }

  getUsers(): UserData[]
  {
    return this.users;
  }

  getChanges(): UserData[]
  {
    return this.changes;
  }
  //Receive array of changes and apply them with a delay
  async applyChanges(userData: UserData[])
  {
    this.changes = [].concat(userData);
    this.isSaving.next(true);
    console.log("Applying changes:");
    console.log(userData);
    //Delay
    await new Promise(r => setTimeout(r, 5000));

    for (let i = 0; i < this.changes.length; i++)
    {
      //let user = this.users.find(x => x.id === this.changes[i].id);
      let index = this.users.findIndex(x => x.id === this.changes[i].id);
      //Add if new id
      if (index == -1)
      {
        this.users.push(this.changes[i]);
      }
      //Remove
      else if (this.changes[i].action == 'Delete')
      {
        this.users.splice(index, 1);
      }
      //Update otherwise
      else
      {
        this.users[index] = this.changes[i];
      }
    }
    this.isSaving.next(false);
    this.changes = [];
  }

  updateData(userData: UserData[])
  {
    this.users = [].concat(userData);
  }
}

function createNewUser(id: number): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
    action: ""
  };
}

export const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];