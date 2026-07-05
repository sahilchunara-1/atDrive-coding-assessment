import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

   private API_URL = 'http://localhost:3000/api/weather/';

  constructor(private _http: HttpClient) { }

  getWeather(lat: number, lon: number) {
    return this._http.get(
      `${this.API_URL}?lat=${lat}&lon=${lon}`
    );
  }

}
