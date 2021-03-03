import { Injectable } from '@angular/core';
//import { Http, Headers, Response } from '@angular/http';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import { Subject } from 'rxjs/Subject';

import { CompareData } from './compare-data.model';
import { AuthService } from '../user/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../shared/services/http/http.service';

@Injectable()
export class CompareService extends ApiService {
  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  dataLoaded = new Subject<CompareData[]>();
  dataLoadFailed = new Subject<boolean>();
  userData: CompareData;
  url = '/compare-yourself'
  constructor(protected http:HttpService,private authService:AuthService) {
                super(http);
  }

  onStoreData(data: CompareData) {
    this.url ='/compare-yourself'
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);
    this.dataEdited.next(false);
    this.userData = data;
    this.authService.getAuthenticatedUser().getSession((err,session)=>{
      if(err){
        return;
      }
      /*this.create('https://y1g8leas7i.execute-api.us-east-2.amazonaws.com/dev', data, {
        headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
      })*/
      this.create(data).subscribe(
          (result) => {
            this.dataLoadFailed.next(false);
            this.dataIsLoading.next(false);
            this.dataEdited.next(true);
          },
          (error) => {
            this.dataIsLoading.next(false);
            this.dataLoadFailed.next(true);
            this.dataEdited.next(false);
          }
        );
    })
      
  }
  onRetrieveData(all = true) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);
      let queryParam = '?accessToken='+localStorage.getItem('tokenAcc');
      this.url = '/all'+queryParam;
      if (!all) {
        this.url = '/single'+queryParam;
      }
      /*this.http.get('https://API_ID.execute-api.REGION.amazonaws.com/dev/' + urlParam + queryParam, {
        headers: new Headers({'Authorization': 'XXX'})
      })*/
      this.getAll()
        /*.map(
          (response: Response) => response.json()
        )*/
        .subscribe(
          (data) => {
            if (all) {
              this.dataLoaded.next(data);
            } else {
              console.log(data);
              if (!data) {
                this.dataLoadFailed.next(true);
                return;
              }
              this.userData = data[0];
              this.dataEdited.next(true);
            }
          },
          (error) => {
            this.dataLoadFailed.next(true);
            this.dataLoaded.next(null);
          }
        );
  }
  onDeleteData() {
    this.dataLoadFailed.next(false);
    let queryParam = '?accessToken='+localStorage.getItem('tokenAcc');
    this.url = '/compare-yourself'+queryParam;
      /*this.http.delete('https://API_ID.execute-api.REGION.amazonaws.com/dev/', {
        headers: new Headers({'Authorization': 'XXX'})
      })*/
      this.deleteTk()
        .subscribe(
          (data) => {
            console.log(data);
          },
          (error) => this.dataLoadFailed.next(true)
        );
  }
}
