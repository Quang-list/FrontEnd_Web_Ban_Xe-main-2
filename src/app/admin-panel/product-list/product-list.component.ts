import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/ProductService';
import { Product } from '../../models/Product';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  editForm: FormGroup; // FormGroup để chỉnh sửa sản phẩm
  currentProductId: number | null = null; // ID của sản phẩm đang chỉnh sửa

  constructor(private productService: ProductService, private router: Router) {
    // Khởi tạo FormGroup
    this.editForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),

    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (data: any) => {
        this.products = data.data; // Adjust based on the structure of the API response
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }



  saveChanges(): void {
    if (this.currentProductId !== null && this.editForm.valid) {
      const formData = new FormData();
      formData.append('id', this.currentProductId.toString());
      formData.append('productName', this.editForm.value.productName);
      formData.append('price', this.editForm.value.price.toString());
      formData.append('priceHasDecreased', this.editForm.value.priceHasDecreased.toString());
      formData.append('description', this.editForm.value.description);
      formData.append('quantity', this.editForm.value.quantity.toString());
      if (this.editForm.value.image) {
        formData.append('image', this.editForm.value.image);
      }
      formData.append('create', this.editForm.value.create.toISOString());
      formData.append('status', this.editForm.value.status);

      this.productService.updateProduct(this.currentProductId, formData).subscribe(
        () => {
          this.loadProducts();
          this.currentProductId = null;
          this.editForm.reset();
        },
        (error) => {
          console.error('Error updating product', error);
        }
      );
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.loadProducts(); // Reload the products after deletion
        },
        (error) => {
          console.error('Error deleting product', error);
        }
      );
    }
  }
  navigateToAdminPanel(): void {
    this.router.navigate(['admin-panel']); // Điều hướng đến admin-panel
  }
  onLogout() {
    localStorage.removeItem('token'); // Xóa token khỏi local storage
    this.router.navigate(['/admin-login']); // Chuyển hướng về trang đăng nhập
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  cancelEdit(): void {
    this.currentProductId = null;
    this.editForm.reset();
  }
  editProduct(id: number): void {
    this.router.navigate(['/admin-panel/update-product', id]);
  }
}