import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() { }
  public handleError(error: HttpErrorResponse | any): Observable<never> {
    let errMsg: string;

    if (error.error instanceof ErrorEvent){
      errMsg = error.error.msg;
    }
    else {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
    }
    return throwError(errMsg);
  }
}
