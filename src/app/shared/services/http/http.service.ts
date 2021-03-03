import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpService {
  api_url:any
  urlApi = ''
  constructor(protected http: HttpClient) {
    this.api_url = environment.apiUrl
   }
  /**
   * Shorthand method to make a GET request to the API using the given url.
   * Usually used to read data from the API
   *
   * @param url The url to request.
   * @param options The options of the request.
   * @returns {Observable<Response>} The response observable.
   */
  get(url: string, options?): Observable<any> {
    return this.http.get(this.api_url + url, options);
  }

  getWithoutAuthHeader(url: string, options?): Observable<any> {
    return this.http.get(this.api_url + url, options);
  }

  /**
   * Shorthand method to make a POST request to the API using the given url.
   * Usually used to send new data to the API.
   *
   * @param url The url to request.
   * @param body The request's body.
   * @param options The options of the request.
   * @returns {Observable<Response>} The response observable.
   */
  post(url: string, body: any, options?): Observable<any> {
    return this.http.post(this.api_url + url, body, options);
  }
  postCustom(url: string, body: any, options?): Observable<any> {
    return this.http.post( this.urlApi + url, body, options);
  }
  /**
   * Shorthand method to make a PUT request to the API using the given url.
   * Usually used to change data in the API.
   *
   * @param url The url to request.
   * @param body The request's body.
   * @param options The options of the request.
   * @returns {Observable<any>} The response observable.
   */
  put(url: string, body: any, options?): Observable<any> {
    return this.http.put(this.api_url + url, body, options);
  }
  patch(url: string, body: any, options?): Observable<any> {
    return this.http.patch(this.api_url + url, body, options);
  }
  /**
   * Shorthand method to make a DELETE request to the Api using the given url.
   * Used to delete data from the API.
   *
   * @param url The url to request.
   * @param options The options of the request.
   * @returns {Observable<Response>} The response observable.
   */ 
  delete(url: string, options?: any): Observable<any> {
    return this.http.delete(this.api_url + url, options);
  }

  singUp(body):Observable<any>{
   
    let params = body;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(`${this.api_url }oauth2/token`, params, {headers:headers});

  }
  login(usuario) {
    let params = usuario;
    return this.http.post<any>(`${this.api_url}oauth2/token`,  params)
        .pipe(map(token => {
            // login successful if there's a jwt token in the response
            if (token && token.token) {
                localStorage.setItem('identity', JSON.stringify({token:token.token}));
            }

            return token;
        }));
}
}
