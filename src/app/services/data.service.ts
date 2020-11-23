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

  deleteWidget(id: number): Observable<any> {
    const params = new HttpParams().set('templateId', id + '');
    return this.http.get<any>(API_URL + 'deleteWidget', { params });
  }

  saveWidget(widget: any){
    return this.http.post<any>(API_URL + 'saveWidget', widget, httpOptions);
  }

  saveAlertWidget(widget: any): Observable<any> {
    return this.http.post<any>(API_URL + 'saveAlertWidget', widget, httpOptions);
  }

  saveButtonWidget(widget: any): Observable<any> {
    return this.http.post<any>(API_URL + 'saveButtonWidget', widget, httpOptions);
  }

  saveChartWidget(widget: any): Observable<any> {
    return this.http.post<any>(API_URL + 'saveChartWidget', widget, httpOptions);
  }

  saveSliderWidget(widget: any): Observable<any> {
    return this.http.post<any>(API_URL + 'saveSliderWidget', widget, httpOptions);
  }

  saveSwitchWidget(widget: any): Observable<any> {
    return this.http.post<any>(API_URL + 'saveSwitchWidget', widget, httpOptions);
  }

  getAllWidgetTemplates(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'getAllWidgetTemplates');
  }

  getAllEditWidgetMetadata(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'getAllEditWidgetMetadata');
  }

  getWidgetsData(templatesId: number[]): Observable<any[]> {
    const params = new HttpParams().set('ids', templatesId.toString());
    return this.http.get<any[]>(API_URL + 'getWidgetsData', { params });
  }

  getWidgets(ids: number[]) {
    const params = new HttpParams().set('ids', ids + '');
    return this.http.get<any>(API_URL + 'getWidgets', { params });
  }

  getWidget(templateId: number, type: string) {
    const params = new HttpParams().set('templateId', templateId + '').set('type', type);
    return this.http.get<any>(API_URL + 'getWidget', { params });
  }

  switch(id: number, value: boolean): Observable<any> {
    const params = new HttpParams().set('id', id + '').set('value', value + '');
    return this.http.get<any>(API_URL + 'switchValue', { params });
  }

  clickButtonWidget(id: number): Observable<any> {
    const params = new HttpParams().set('id', id + '');
    return this.http.get<any>(API_URL + 'clickButtonWidget', { params });
  }

  changeSliderValue(id: number, value: number): Observable<any> {
    const params = new HttpParams().set('id', id + '').set('value', value + '');
    return this.http.get<any>(API_URL + 'changeSliderValue', { params });
  }
}
