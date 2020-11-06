import { Injectable } from '@angular/core';
import {UserData} from './userdata';

@Injectable()
export class UsersService {
  users: UserData[] = [];

  constructor() {
    for (let i = 1; i <= 5; i++) { 
      this.users.push(createNewUser(i)); 
    }
  }

  getUsers(): UserData[]
  {
    return this.users;
  }

  updateData(userData: UserData[])
  {
    this.users = [].concat(userData);
  }

  addUser()
  {
    let i = this.users.length+1;
    this.users.push(createNewUser(i));
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
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}

const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];