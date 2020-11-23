import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable()
export class PushService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(messaging => {
      messaging.onMessage = messaging.onMessage.bind(messaging);
      messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    });
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(token => {
      console.log(token);
    }, err => {
      console.error('Unable to get permission to notify.', err);
    });
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(payload => {
      this.currentMessage.next(payload);
    });
    this.messageReceived();
  }

  messageReceived(): Observable<any> {
    return this.currentMessage.asObservable();
  }

}
