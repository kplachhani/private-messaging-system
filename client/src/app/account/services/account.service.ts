import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { User } from '../models/user';
import { distinctUntilChanged } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private authUserSubject = new BehaviorSubject<User>({} as User);
  public authUser = this.authUserSubject.asObservable().pipe(distinctUntilChanged());

  //private isAuthenticatedSubject = new ReplaySubject<boolean>(0);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor() { }

  setAuth(user: User) {
    // Set current user data into observable
    this.authUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }


}
