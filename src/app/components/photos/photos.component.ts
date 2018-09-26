import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { PhotosService, Photo } from './photos.service'

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploads: any[];
  allPercentage: Observable<any>;
  photos: Photo[];
  url: string;
  
  constructor(
    private storage: AngularFireStorage,
    private photosService: PhotosService
    // public afs: AngularFirestore,
    ) { }

  ngOnInit() {
    this.photosService.photosObservable.subscribe(photos => {
      this.photos = photos;
    })
  }

  addPhotos(event) {
    for (let file of event.currentTarget.files) {
      this.photosService.addPhotos(file)
    }
  }

  onScroll () {
    console.log('scrolled!!')
    this.photosService.getPhotos().valueChanges().subscribe(
      (photos: Photo[]) => {
        this.photos = photos;
      }

    );
  }

  // upload(event) {
  //   const id = Math.random().toString(36).substring(2);
  //   this.ref = this.afStorage.ref(id);
  //   this.task = this.ref.put(event.target.files[0]);
  // }

  // importImages(event) {
  //   // reset the array 
  //   this.uploads = [];
  //   const filelist = event.target.files;
  //   const allPercentage: Observable<number>[] = [];

  //   for (const file of filelist) {

  //     const path = `files/${file.name}`;
  //     const ref = this.storage.ref(path);
  //     const task = this.storage.upload(path, file);
  //     const _percentage$ = task.percentageChanges();
  //     allPercentage.push(_percentage$);

  //     // create composed object with different information. ADAPT THIS ACCORDING YOUR NEED
  //     const uploadTrack = {
  //       fileName: file.name,
  //       percentage: _percentage$
  //     }

  //     // push each upload into the array
  //     this.uploads.push(uploadTrack);

  //     // for every upload do whatever you want in firestore with the uploaded file
  //     const _t = task.then((f) => {
  //       return f.ref.getDownloadURL().then((url) => {
  //         return this.afs.collection('files').add({
  //           name: f.metadata.name,
  //           url: url
  //         });
  //       })
  //     })

  //   }


}
