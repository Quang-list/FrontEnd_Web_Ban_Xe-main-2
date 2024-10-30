import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'https://localhost:5001/api/Products'; // Adjust to your API base URL

    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<any> {
        return this.http.get(`${this.apiUrl}/GetAllProduct`);
    }

    getProductById(productId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/product/${productId}`);
    }

    updateProduct(id: number, formData: FormData): Observable<any> {
        return this.http.put(`https://localhost:5001/api/Products/Update/${id}`, formData);
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`https://localhost:5001/api/Products/Delete/${id}`);
    }

}
