import { Component, Input, OnInit } from '@angular/core';
import { InitDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import { PhotoAlbum } from 'src/app/models/media';
import { Photo } from 'src/app/models/photo';
import { PhotosService } from 'src/app/services/photos.service';
import lgZoom from 'lightgallery/plugins/zoom'
import lgAutoplay from 'lightgallery/plugins/autoplay'

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.component.html',
  styleUrls: ['./photo-album.component.scss']
})
export class PhotoAlbumComponent implements OnInit {
  photos: Photo[] = new Array<Photo>();
  private lightGallery: LightGallery;
  @Input() album: PhotoAlbum;
  needsRefresh: any;
  
  constructor(
    private photoService: PhotosService
  ) { }

  ngOnInit(): void {
    this.album.photos.forEach(
      (photoId: string) => {
        this.photoService.getPhotoById(photoId).subscribe(
          (photo: Photo) => {
            if (photo.id) {
              this.photos.push(photo);
              this.needsRefresh = true;
            }
          }
        );
      }
    );
  }

  ngAfterViewChecked(): void {
    if (this.needsRefresh) {
        this.lightGallery.refresh();
        this.needsRefresh = false;
    }
  }

  onLightGalleryInit = (detail: InitDetail): void => {
    this.lightGallery = detail.instance;
  };
  
  lightGallerySettings = {
    plugins: [lgZoom, lgAutoplay],
    counter: true,
    thumbnail: true,
    showZoomInOutIcons: true,
    autoplay: true,
    progressBar: true,
    showCloseIcon: true
  };
}
