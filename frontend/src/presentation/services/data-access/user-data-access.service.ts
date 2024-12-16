import { Injectable } from '@angular/core';
import ILoginUserRequestDTO from '../../contracts/users/login/ILoginUserRequestDTO';
import IRegisterUserRequestDTO from '../../contracts/users/register/IRegisterUserRequestDTO';
import IRegisterUserResponseDTO from '../../contracts/users/register/IRegisterUserResponseDTO';
import ILoginUserResponseDTO from '../../contracts/users/login/ILoginUserResponseDTO';
import ICurrentUserResponseDTO from '../../contracts/users/get-current/ICurrentUserResponseDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UserDataAccessService {
    private readonly _baseUrl = `http://127.0.0.1:3000/api/users`;
    constructor(private http: HttpClient) {}

    register(request: IRegisterUserRequestDTO) {
        return this.http.post<IRegisterUserResponseDTO>(`${this._baseUrl}/register`, request);
    }

    login(request: ILoginUserRequestDTO) {
        return this.http.post<ILoginUserResponseDTO>(`${this._baseUrl}/login`, request);
    }

    getCurrentUser() {
        return this.http.get<ICurrentUserResponseDTO>(`${this._baseUrl}/current`);
    }
}
