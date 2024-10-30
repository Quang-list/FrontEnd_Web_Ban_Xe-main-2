import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/ProductService';
import { Product } from '../../models/Product';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  productId!: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      priceHasDecreased: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      quantity: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      create: new FormControl(''),
      brandId: new FormControl('', [Validators.required]),
      typeId: new FormControl('', [Validators.required]),
      colors: new FormControl(''),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProduct(this.productId);
    });
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(
      (data: Product) => {
        this.productForm.patchValue({
          productName: data.productName,
          price: data.price,
          priceHasDecreased: data.priceHasDecreased,
          description: data.description,
          quantity: data.quantity,
          image: data.image,
          create: data.create,
          brandId: data.brandId,
          typeId: data.typeId,
          colors: data.colors,
          status: data.status
        });
      },
      (error) => {
        console.error('Error fetching product', error);
      }
    );
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const formData = new FormData();

      formData.append('productName', this.productForm.get('productName')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('priceHasDecreased', this.productForm.get('priceHasDecreased')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('quantity', this.productForm.get('quantity')?.value);
      formData.append('brandId', this.productForm.get('brandId')?.value);
      formData.append('typeId', this.productForm.get('typeId')?.value);
      formData.append('colors', this.productForm.get('colors')?.value);
      formData.append('status', this.productForm.get('status')?.value);

      // Check if image exists and append to formData
      if (this.productForm.get('image')?.value) {
        formData.append('image', this.productForm.get('image')?.value);
      }

      this.productService.updateProduct(this.productId, formData).subscribe(
        () => {
          alert('Cập nhật sản phẩm thành công!');
        },
        (error) => {
          console.error('Error updating product', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/product-list']); // Điều hướng đến trang danh sách sản phẩm
  }
}
