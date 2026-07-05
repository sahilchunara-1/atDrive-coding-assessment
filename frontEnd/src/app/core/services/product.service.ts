import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private _http: HttpClient) { }
  private API_URL = 'http://localhost:3000/api/products/';

  getAllProducts() {
    return this._http.get(`${this.API_URL}getAllProducts`)
  }
  addProduct(product: Product) {
    return this._http.post(`${this.API_URL}addProduct`, product)
  }
  updateProduct(productId: string, product: Product) {
    return this._http.put(`${this.API_URL}updateProduct/${productId}`, product)
  }
  getProductById(productId: string) {
    return this._http.get(`${this.API_URL}getProductById/${productId}`)
  }
  deleteProduct(productId: string) {
    return this._http.delete(`${this.API_URL}deleteProduct/${productId}`)
  }
}
