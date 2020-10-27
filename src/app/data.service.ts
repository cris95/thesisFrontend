import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(API_URL + 'login' + '?username=' + username, password, httpOptions);
  }

  getUserDashboards(userId: number): Observable<any[]> {
    const params = new HttpParams().set('userId', userId + '');
    return this.http.get<any[]>(API_URL + 'getUserDashboards', { params });
  }

  getDashboard(id: string): Observable<any> {
    const params = new HttpParams().set('id', id + '');
    return this.http.get<any>(API_URL + 'getDashboard', { params });
  }

  createDashboard(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId + '');
    return this.http.get<any>(API_URL + 'createDashboard', { params });
  }

  saveDashboard(dashboard: any): Observable<any> {
    return this.http.post<any>(API_URL + 'saveDashboard', JSON.stringify(dashboard), httpOptions);
  }

  deleteDashboard(id: number): Observable<any> {
    const params = new HttpParams().set('id', id + '');
    return this.http.get<any>(API_URL + 'deleteDashboard', { params });
  }

  getAllWidgets(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'getAllWidgets');
  }

  getTemperature(id: number): Observable<any> {
    const params = new HttpParams().set('id', id + '');
    return this.http.get<any>(API_URL + 'getTemperature', { params });
  }

  switch(id: number, value: boolean): Observable<any> {
    const params = new HttpParams().set('id', id + '').set('value', value + '');
    return this.http.get<any>(API_URL + 'switchValue', { params });
  }

  getButtonWidget(templateId: number){
    const params = new HttpParams().set('templateId', templateId + '');
    return this.http.get<any>(API_URL + 'getButtonWidget', {params});
  }

  getAlertWidget(templateId: number){
    const params = new HttpParams().set('templateId', templateId + '');
    return this.http.get<any>(API_URL + 'getAlertWidget', {params});
  }

  getData(id: number){
    const params = new HttpParams().set('id', id + '');
    return this.http.get<any>(API_URL + 'getData', {params});
  }


}
