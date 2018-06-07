//Pacchetti e classi che servono per utilizzare i vari metodi
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import * as md5 from 'md5';

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthServiceProvider {
  currentUser: User;

  constructor(private storage: Storage){};

//Metodo per accedere alla homepage se l'utente è registrato
  public login(credentials) {
    if (credentials.email == null || credentials.password == null) {
      return Observable.throw("Please insert credentials");
    }
    else {
      return Observable.create(observer => {
        this.storage.get(credentials.email)
        .then(pass => {
          if (pass == md5(credentials.password)){
            observer.next(true);
          }
          else {
            observer.next(false);
          }
          observer.complete();
        });
      });
    }
  }

//Metodo per registrare l'utente al sito
  public register(credentials) {
  if (credentials.email === null || credentials.password === null) {
    return Observable.throw("Please insert credentials");
  } else {
    return Observable.create(async observer => {
      let newEmail: boolean = await this.storage.get(credentials.email)
        .then(pass => pass == undefined);

      if(newEmail){
        this.storage.set(credentials.email, md5(credentials.password));
        observer.next(true);
      }
      else {
        observer.next(false);
      }
      observer.complete();
    });
  }
}







  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
