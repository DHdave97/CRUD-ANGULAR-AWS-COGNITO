import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './http/http.service';
import { DateFormatter } from '../helpers/date-formatter';
import { PrintOptions } from 'src/app/shared/models/print-options.model';
import { PrintType } from 'src/app/shared/enums';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {
  public url: string;
  urlApi = ''
  constructor(protected http: HttpService,
    protected _http?: HttpClient) {
    this.urlApi = environment.apiUrl
  }

  /**
   * Gets a list of paginated items
   * @param params
   * @param responseType
   * @returns {Observable<any>} 
   */
  list(params?: any, responseType?: any): Observable<any> {
    if (!params) {
      return this.http.get(this.url);
    }
    params = this.serialize(params);
    return this.http.get(this.url, {
      params: this.object2Params(params),
      responseType: responseType
    });
  }

  /**
   * Gets the item with the given id
   * @param id
   */
  getById(id: string | number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  /**
   * Gets all posible results
   * @param params
   */
  getAll(params?: any): Observable<any> {
    if (!params) {
      return this.http.get(`${this.url}`);
    }
    params = this.serialize(params);
    return this.http.get(`${this.url}`, { params: this.object2Params(params) });
  }
  async getAllAsync(params?:any){

    try {
      let response = await this._http.get<any>(this.urlApi + this.url,{params}).toPromise();
      return response.results;
     } catch (error) {
       return []
     }

  }
  /**
   * Creates a new item
   * @param resource
   * @returns {Observable<any>}
   */
  create(resource?: any): Observable<any> {
    resource = this.serialize(resource);
    return this.http.post(this.url, resource);
  }
  /**
   * Creates a new item
   * @param resource
   * @returns {Observable<any>}
   */
  register(resource?: any): Observable<any> {
    resource = this.serialize(resource);
    return this.http.post(`${this.url}/register`, resource);
  }

  /**
   * Updates the item with given id
   * @param resource
   * @returns {Observable<any>}
   */
  update(resource: any): Observable<any> {
    const id = resource.id;
    const codigo = resource.codigo;
    //resource.id = null;
    resource = this.serialize(resource);
    if(!resource.id){
      return this.http.put(`${this.url}/${codigo}`, resource);
    }else{
      return this.http.put(`${this.url}/${id}`, resource);
    }
  }

  /**
   * Deletes the item with given id
   * @param {string | number} id
   * @param resource
   * @returns {Observable<any>}
   */
  delete(id: string | number, resource?: any): Observable<any> {
    if (!resource) {
      return this.http.delete(`${this.url}/${id}`);
    } else {
      return this.http.delete(`${this.url}/${id}`, { body: resource });
    }
  }

    /**
   * Deletes the item token
   * @param {string | number} id
   * @param resource
   * @returns {Observable<any>}
   */
  deleteTk(resource?: any): Observable<any> {
    if (!resource) {
      return this.http.delete(`${this.url}`);
    } else {
      return this.http.delete(`${this.url}`, { body: resource });
    }
  }
  /**
   * Delete several records at once.
   *
   * @param ids The ids of the elements to delete.
   */
  deleteMany(ids: string[] | number[]): Observable<any> {
    return this.http.delete(this.url, {
      params: this.object2Params({ids})
    });
  }

  /**
   * Print records of a resource.
   *
   * @param printOptions The print options.
   * @param ids The ids of the records to print. Is not necessary for printing all records.
   */
  print(printOptions: PrintOptions, ids?: number[] | string[]) {
    const params = {
      resultadosPorPagina: printOptions.resultsPerPage,
      detalles: printOptions.details
    };

    if (printOptions.type !== PrintType.ALL) {
      if (!ids) {
        throw Error('The \'ids\' argument is required.');
      }

      if (ids.length < 1) {
        throw Error('The \'ids\' argument is required to have at least one element.');
      }

      params['ids'] = ids;
    }

    return this.http.get(`${this.url}/print`, {
      params: this.object2Params(params)
    });
  }

  /**
   * Gets the data ready for being sent to the API.
   * Converts boolean params into binary params attributes.
   * Formats dates params.
   *
   * @param data The data to serialize
   * @returns {any} The serialized data.
   */
  protected serialize(data: any) {
    const serializedData = {};
    Object.getOwnPropertyNames(data).forEach(attr => {
      if (isNullOrUndefined(data[attr])) {
        // Does not include it if null or undefined
      } else if (typeof data[attr] === 'boolean') {
        // Converts boolean params into binary int.
        serializedData[attr] = data[attr] ? 1 : 0;
      } else if (typeof data[attr] === 'number' && data[attr] === -10) {
      } else if (data[attr] instanceof Date) {
        serializedData[attr] = DateFormatter.dateToString(data[attr]);
      } else if (data[attr] instanceof Object) {
        if (!this.isEmpty(data[attr])) {
          serializedData[attr] = this.serialize(data[attr]);
        }
      } else {
        // Leaves it as is.
        serializedData[attr] = data[attr];
      }
    });
    return serializedData;
  }

  /**
   * Takes an object with params and transforms it into
   * a query params string to pass to an http request.
   *
   * @param object The object with the params.
   * @returns {string} The query params string.
   */
  protected object2Params(object: any): any {
    const params = new HttpParams({ fromObject: object });
    return params;
  }

  /**
   * Checks if object is empty
   * @param obj
   * @returns {boolean}
   */
  protected isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !isNullOrUndefined(obj[key])) {
        return false;
      }
    }
    return true;
  }
}
