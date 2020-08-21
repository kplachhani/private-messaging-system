import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }


  public get(key: string): string {
    return localStorage.getItem(key);
  }

  public set(payload: { key: string, value: string }): void {
    localStorage.setItem(payload.key, payload.value);
  }

  public deleteToken(key: string): void {
    localStorage.removeItem(key);
  }


}
