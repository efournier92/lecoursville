import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages: AngularFireList<Message>;
  messageCount: number = 0;
  increment: number = 8;

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private auth: AuthService,
  ) {
    this.auth.userObservable.subscribe(
      (user: User) => {
        if (user) {
          this.getMessages().valueChanges().subscribe(
            (messages: Message[]) => {
              this.updateMessagesEvent(messages);
            }
          );
        }
      }
    )
  }

  getYears(): number[] {
    let years: number[] = Array<number>();
    for (let i = 1880; i <= 2000; i++) {
      years.push(i);
    }
    return years;
  }

  private messagesSource: BehaviorSubject<Message[]> = new BehaviorSubject([]);
  chatObservable: Observable<Message[]> = this.messagesSource.asObservable();

  updateMessagesEvent(messages: Message[]): void {
    this.messagesSource.next(messages);
  }

  getMessages(): AngularFireList<Message> {
    this.messageCount = this.messageCount + this.increment;
    this.messages = this.db.list('messages', ref => ref.limitToFirst(this.messageCount));
    return this.messages;
  }

  updateMessages(messages) {
    this.messages = messages;
  }

  createMessage(message: Message): void {
    message.id = this.db.createPushId();
    this.messages.update(message.id, message);
  }

  updateMessage(message: Message): void {
    this.messages.update(message.id, message);
  }

  deleteMessage(message: Message): void {
    this.messages.remove(message.id);
  }
}
