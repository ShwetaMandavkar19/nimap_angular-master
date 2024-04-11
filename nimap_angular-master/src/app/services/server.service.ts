import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  addUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, formData);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getUserWithid(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

  updateUser(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, updatedData);
  }

  deleteDetails(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
  uploadProfileImage(userId: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
  
    return this.http.post(`/api/users/${userId}/profileImage`, formData);
  }
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post('${this.baseUrl}/users', formData);
  }
}
