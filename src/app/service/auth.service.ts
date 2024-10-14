import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http'; // Nhập HttpClient
import { Observable } from 'rxjs'; // Nhập Observable

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { } // Thêm HttpClient vào constructor

  // Hàm lấy tên người dùng từ token
  getUserNameFromToken(): string {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      return '';  // Nếu không có token, trả về chuỗi rỗng
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    console.log(decodedToken)
    return decodedToken?.Name || '';  // Giả sử tên người dùng được lưu trong trường 'name'
  }

  // Hàm kiểm tra xem người dùng có đăng nhập không
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);  // Kiểm tra token có hợp lệ không
  }

  // Phương thức để lấy thông tin người dùng từ API
  getUserInfo(): Observable<any> {
    return this.http.get('/api/user-info'); // Cập nhật URL API theo ứng dụng của bạn
  }
}
