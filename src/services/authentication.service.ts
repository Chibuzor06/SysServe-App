import { GlobalConstants } from './../global.constants';
import { Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) {}

  login(username: string, password: string, deviceId: string) {
    const query = GlobalConstants.url + '/mobile/Login.do?user.email=' +
    username + '&user.password=' + password + '&deviceId=' + deviceId;
    console.log(query);
    return this.http.get(query)
      .map((response: Response) => {
        return response.json();
      });
  }

  forgotPassword(email: string) {
    return this.http.get(GlobalConstants.url+ '/activation/ForgotPassword.do?user.type=mobile' +
      '&user.email=' + email);
  }

  createNewUser(firstName: string, lastName: string, email: string, phone: number, clientCode: string) {
    const query: string = GlobalConstants.url + '/mobile/CreateOrUpdateUser.do?user.firstName='
    + firstName +'&user.lastName=' + lastName
    + '&user.email=' + email + '&user.phone=' + (!phone? '': phone)
    + '&user.type=mobile&user.clientCode=' + (!clientCode? '': clientCode);
    console.log(query);
    return this.http.get(query);
  }
}
