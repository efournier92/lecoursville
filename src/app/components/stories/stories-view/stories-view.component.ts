import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Message, Like } from 'src/app/components/chat/message';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { User } from '../../auth/user';
import { HighlightService } from '../highlight.service';
import { Highlight } from '../highlight';

@Component({
  selector: 'app-stories-view',
  templateUrl: './stories-view.component.html',
  styleUrls: ['./stories-view.component.scss']
})
export class StoriesViewComponent implements OnInit {
  user: User;
  highlights: Highlight = new Highlight();
  likers: string[] = new Array<string>();
  @Input() message: Message;
  @Input() parent: Message;
  @Output() updateParentEvent = new EventEmitter();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(
    public auth: AuthService,
    public highlightService: HighlightService,
  ) { }

  ngOnInit(): void {
    this.auth.userObservable.subscribe(
      (user: User) => this.user = user
    );
    this.likers = this.getLikers();
    if (!this.message.likes)
      this.message.likes = new Array<Like>();
    if (this.message.replies)
      this.sortReplies();
  }

  compareReplies(a, b): any {
    if (!a.likes)
      a.likes = [];
    if (!b.likes)
      b.likes = [];
    return b.likes.length - a.likes.length;
  }

  sortReplies(): void {
    this.message.replies.sort(this.compareReplies);
  }

  likeMessage(): void {
    if (!this.message.likes)
      this.message.likes = new Array<Like>();
    for (let like of this.message.likes) {
      if (like.userId == this.user.id) {
        this.trigger.openMenu();
        return;
      }
    }
    this.message.likes.push(new Like(this.user));
    this.trigger.openMenu();
    this.trigger.menuClosed.subscribe(
      () => this.updateParent()
    );
    this.likers = this.getLikers();
  }

  getLikers(): Array<string> {
    let likers: string[] = new Array<string>();
    if (!this.message.likes)
      return likers;
    for (const liker of this.message.likes) {
      likers.push(liker.userName);
    }
    return likers;
  }

  replyMessage(): void {
    let authorId: string = this.auth.user.id;
    let authorName: string = this.auth.user.name;
    let replyLevel: number = this.message.replyLevel + 1;
    if (!this.message.replies)
      this.message.replies = new Array<Message>();
    this.message.replies.unshift(new Message('', '', '', authorId, authorName, true, true, replyLevel));
  }

  updateParent(): void {
    this.updateParentEvent.emit(this.message);
  }

  isMessageAuthor(message: Message): boolean {
    if (message.authorId === this.user.id) {
      return true;
    } else {
      return false;
    }
  }

  highlightElement(element: string, value: boolean): void {
    this.highlights = this.highlightService.highlightElement(this.highlights, element, value);
  }

  getLikes(): number {
    if (!this.message.likes)
      return 0;
    return this.message.likes.length;
  }

  editMessage(): void {
    this.message.isEditable = true;
  }
}
