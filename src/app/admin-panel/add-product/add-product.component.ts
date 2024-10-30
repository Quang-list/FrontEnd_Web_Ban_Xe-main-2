import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  registerMessage: string | null = null; // Thông báo sau khi tạo sản phẩm

  apiBase = 'https://localhost:5001/api/products'; // Địa chỉ API cho sản phẩm

  constructor(private http: HttpClient, private router: Router) {
    this.productForm = new FormGroup({
      productName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      priceHasDecreased: new FormControl('', [Validators.required, Validators.min(0)]),
      quantity: new FormControl('', [Validators.required, Validators.min(0)]),
      brandId: new FormControl('', Validators.required),
      typeId: new FormControl('', Validators.required),
      colors: new FormControl('', Validators.required),
      image: new FormControl(null, Validators.required), // Thêm trường hình ảnh
    });
  }

  ngOnInit(): void { }

  onCreate(): void {
    if (this.productForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const formData = new FormData();

    // Thêm các trường vào FormData
    for (const key in this.productForm.value) {
      formData.append(key, this.productForm.value[key]);
    }

    this.http.post(`${this.apiBase}/create`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe(
      (response: any) => {
        if (response.success) {
          this.registerMessage = 'Tạo sản phẩm thành công.';
          this.productForm.reset(); // Reset form sau khi thành công
        } else {
          this.registerMessage = 'Tạo sản phẩm thất bại.';
        }
      },
      (error) => {
        console.error('Error creating product', error);
        this.registerMessage = 'Tạo sản phẩm thất bại.';
      }
    );
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onLogout() {
    localStorage.removeItem('token'); // Xóa token khỏi local storage
    this.router.navigate(['/admin-login']); // Chuyển hướng về trang đăng nhập
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.productForm.patchValue({ image: file });
  }
}
