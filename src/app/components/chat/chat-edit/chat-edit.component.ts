import { Component, OnInit, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { Message } from 'src/app/components/chat/message';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { ChatService } from 'src/app/components/chat/chat.service';

@Component({
  selector: 'app-chat-edit',
  templateUrl: './chat-edit.component.html',
  styleUrls: ['./chat-edit.component.scss']
})
export class ChatEditComponent implements OnInit {
  @Input() message: Message;
  @Input() parent: Message;
  @Output() updateParentEvent = new EventEmitter;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private chatService: ChatService,
  ) { }

  ngOnInit() {
  }

  saveMessage(message: Message) {
    message.editable = false;
    if (message.isReply && this.parent) {
      this.parent.replies.push(message);
      this.updateParent();
    } else if (!message.id) {
      this.chatService.addMessage(message);
    } else {
      this.chatService.updateMessage(message);
    }
}

  updateParent() {
    console.log(this.message);
    this.updateParentEvent.emit(this.message);
  }

}
