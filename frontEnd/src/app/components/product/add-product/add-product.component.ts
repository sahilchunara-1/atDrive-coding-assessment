import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})

export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  loading = false;
  productId: string = '';
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder, private productService: ProductService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';

    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    });
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.productForm.value;

    if (this.isEditMode) {
      this.productService
        .updateProduct(this.productId, payload)
        .subscribe({
          next: () => {
            this.loading = false;
            alert('Product updated successfully');
            this.router.navigate(['']);
          },
          error: (err) => {
            this.loading = false;
            console.log(err);
          },
        });
    } else {
      this.productService
        .addProduct(payload)
        .subscribe({
          next: () => {
            this.loading = false;
            alert('Product created successfully');
            this.router.navigate(['']);
          },
          error: (err) => {
            this.loading = false;
            console.log(err);
          },
        });
    }
  }

  loadProduct() {
    this.productService
      .getProductById(this.productId)
      .subscribe({
        next: (res: any) => {
          this.productForm.patchValue({
            name: res.data.name,
            price: res.data.price,
            description: res.data.description,
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

}
