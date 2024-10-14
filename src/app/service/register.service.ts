import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const api = 'https://localhost:5001/api/User';

@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    constructor(private http: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.http.post(`${api}/Create`, userData);
    }
}
