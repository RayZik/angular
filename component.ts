import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../../services/data.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ShareExperienceComponent } from '../share-experience/share-experience.component';
import { ShareexpwithothersComponent } from '../shareexpwithothers/shareexpwithothers.component'
import { UserfirstshareComponent } from '../userfirstshare/userfirstshare.component'
import { UploadMessageComponent } from '../upload-message/upload-message.component';
import { UploadCallLogsComponent } from '../upload-call-logs/upload-call-logs.component';
import { UploadImageComponent } from '../upload-image/upload-image.component';
import { UploadVoicemailComponent } from '../upload-voicemail/upload-voicemail.component';
import { UploadVoiceRecordComponent } from '../upload-voice-record/upload-voice-record.component';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../../auth/store/reducers';
import { UploadRingdoorComponent } from '../upload-ringdoor/upload-ringdoor.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';

export interface IUserList {
  _id: string;
  invited_by: any;
}

@Component({
  selector: 'app-view-experience',
  templateUrl: './view-experience.component.html',
  styleUrls: ['./view-experience.component.css']
})



export class ViewExperienceComponent implements OnInit {

  object: { [key: number]: string } =
    { 2: 'Angular keyvalue Pipe', 1: 'Angular ngFor' };

  map = new Map([[2, 'Angular keyvalue Pipe'], [1, 'Angular ngFor']]);

  array = ["Angular keyvalue Pipe", "Angular ngFor"]

  experienceDetail: any = [];
  experienceId: String = '';
  emailId: String = '';
  imageList: any = [];
  tagList: any = [];
  voiceRecList: any = [];
  ringDoorList: any = [];
  voiceMailList: any = [];
  emailList: any = [];
  messageList: any = [];
  callLogList: any = [];
  pageNo: Number = 1; //List page no Initial 1
  type: any = 'all'

  audio = new Audio();
  isPlaying: Boolean = false;
  isPaused: Boolean = false;
  userList: Array<any> = []
  totalCount: Number = 0;
  status: any = 'all'
  searchKey: String = "";
  user_id: any;
  vicRecIndex: number = -1;
  curPlayTime: String = '';
  userListRequest: Subscription
  userType: String = "";
  invited_by: any[];
  // export
  // interface Array<T> {
  //   invited_by: any[];
  // }




  constructor(
    public store: Store<fromAuth.State>,
    private route: ActivatedRoute,
    public location: Location,
    private ds: DataService,
    private router: Router,
    private matDialog: MatDialog,
    private dataService: DataService,
    private authSer: AuthService,
  ) { }

  ngOnInit() {

    this.userType = this.authSer.userData && this.authSer.userData.user_type ? this.authSer.userData.user_type : '';

    const detail = this.route.snapshot.data['experience_inner_page'];
    this.experienceDetail = detail.data
    this.experienceId = this.experienceDetail._id;
    this.initData();
    this.getUserData();
  }

  initData() {

    this.imageList = this.experienceDetail.images && this.experienceDetail.images.length > 0 ? this.experienceDetail.images : []

    this.tagList = this.experienceDetail.tages && this.experienceDetail.tages.length > 0 ? this.experienceDetail.tages : []

    this.voiceRecList = this.experienceDetail.voice_recording && this.experienceDetail.voice_recording.length > 0 ? this.experienceDetail.voice_recording : []

    this.ringDoorList = this.experienceDetail.ring_door_file && this.experienceDetail.ring_door_file.length > 0 ? this.experienceDetail.ring_door_file : []

    this.callLogList = this.experienceDetail.call_logs && this.experienceDetail.call_logs.length > 0 ? this.experienceDetail.call_logs : []

    this.emailList = this.experienceDetail.emails && this.experienceDetail.emails.length > 0 ? this.experienceDetail.emails : []

    this.messageList = this.experienceDetail.messages && this.experienceDetail.messages.length > 0 ? this.experienceDetail.messages : [];

    this.voiceMailList = this.experienceDetail.voice_mails && this.experienceDetail.voice_mails.length > 0 ? this.experienceDetail.voice_mails : []


    // this.userList = this.userList.invited_by
  }



  navigateToFoo() {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.pageNo
      },
      //queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      //skipLocationChange: true,
      // do not trigger navigation
      replaceUrl: true
    });
  }



  deleteExp() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = '30%';
    const dialogRef = this.matDialog.open(DeleteDialogComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      if (value.isDelete) {
        this.ds.getDeleteExperience(this.experienceId).subscribe((result) => {

          this.router.navigate(['/experience'], { replaceUrl: true })
        });
      } else {
        //Do Nothing
      }
    });

  }

  shareExp() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = {
      data: "Share Experience",
    }
    matDialogConfig.width = '33%';
    const dialogRef = this.matDialog.open(ShareExperienceComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      if (value.isShare) {
        this.ds.shareExperience(this.experienceId).subscribe((result) => {
          this.router.navigate(['/experience'], { replaceUrl: true })
        });
      } else {
        //Do Nothing 
      }
    });
  }


  getUserData() {

    if (Number(this.route.snapshot.queryParamMap.get('page')) != this.pageNo) {
      this.navigateToFoo();
    }
    if(this.userListRequest){
      this.userListRequest.unsubscribe();
    }

   this.userListRequest= this.dataService.getUserData().subscribe((data) => {
    const userData = data.data ? data.data : [];
    this.totalCount = userData.totalRecords ? userData.totalRecords : 0;
    this.userList = userData && userData.list && userData.list.length ? userData.list : []
    console.log(this.userList,'DD');
      

    })
  }

  shareExpOthers() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = {
      data: "Share Experience",
    }
    matDialogConfig.width = '33%';
    const dialogRef = this.matDialog.open(ShareexpwithothersComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      // console.log(value.user_id, "--UserId fetched from DialogComponent");

      if (value.isShare) {
        this.ds.shareExpWithOthers(this.experienceId, value.user_id).subscribe((result) => {
          this.router.navigate(['/experience'], { replaceUrl: true })
        });
      } else {

      }
    });
  }


  firstShare() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = {
      data: "Share Experience",
    }
    matDialogConfig.width = '33%';
    const dialogRef = this.matDialog.open(UserfirstshareComponent, matDialogConfig);


  }

  viewMedia(mediaType) {

    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = '80%'
    matDialogConfig.height = '80%'

    switch (mediaType) {
      case 'image':
        matDialogConfig.data = {
          is_view: true,
          is_add: false,
          id: this.experienceId,
          list: this.imageList
        }
        this.matDialog.open(UploadImageComponent, matDialogConfig)
        break;

      case 'message':
        matDialogConfig.data = {
          is_view: true,
          is_add: false,
          id: this.experienceId,
          list: this.messageList
        }
        this.matDialog.open(UploadMessageComponent, matDialogConfig)
        break;

      case 'call_logs':
        matDialogConfig.data = {
          is_view: true,
          is_add: false,
          id: this.experienceId,
          list: this.callLogList
        }
        this.matDialog.open(UploadCallLogsComponent, matDialogConfig)
        break;

      case 'voice_mail':
        matDialogConfig.data = {
          is_view: true,
          is_add: false,
          id: this.experienceId,
          list: this.voiceMailList
        }
        this.matDialog.open(UploadVoicemailComponent, matDialogConfig)
        break;

      case 'voice_record':
        matDialogConfig.data = {
          is_view: true,
          is_add: false,
          id: this.experienceId,
          list: this.voiceRecList
        }
        this.matDialog.open(UploadVoiceRecordComponent, matDialogConfig)
        break;

      case 'ringdoor':
        matDialogConfig.data = {
          is_view: true,
          is_add: false,
          id: this.experienceId,
          list: this.ringDoorList
        }
        this.matDialog.open(UploadRingdoorComponent, matDialogConfig)
        break;

      default:

        break;
    }
  }

  playorPauseAudio(media_url, index) {

    if (this.vicRecIndex !== index) {
      this.isPaused = false;
      this.isPlaying = false;
      this.audio.removeEventListener('playing', (event: Event) => {

      })
      this.audio.removeEventListener('ended', (event: Event) => {

      })
      this.audio.removeEventListener('pause', (event: Event) => {

      })
      this.audio.removeEventListener("timeupdate", (currentTime: Event) => {

      });
      this.curPlayTime = '00:00'
    }
    this.vicRecIndex = index;
    if (!this.isPlaying) {
      this.audio.src = media_url
      this.audio.load();

      this.audio.play();
      this.audio.addEventListener('playing', (event: Event) => {
        this.isPlaying = true;
      })
      this.audio.addEventListener('ended', (event: Event) => {

        this.isPlaying = false;
        this.isPaused = false;
        this.vicRecIndex = -1;
        this.curPlayTime = '00:00'
      })
      this.audio.addEventListener('error', (event: Event) => {

        this.isPlaying = false;
        this.isPaused = false;
        this.vicRecIndex = -1;
        this.curPlayTime = '00:00'
      })
      this.audio.addEventListener('pause', (event: Event) => {

      })
      this.audio.addEventListener("timeupdate", (currentTime: Event) => {

        this.hhmmss(Math.round(this.audio.currentTime), false);
      });
    } else {
      if (!this.isPaused) {
        this.isPaused = true;
        this.audio.pause()
      } else {
        this.isPaused = false;
        this.audio.play()
      }
    }
  }

  hhmmss(secs, fromHtml) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    let crtTime = ''
    if (hours === 0) {
      crtTime = `${this.pad(minutes)}:${this.pad(secs)}`;
    } else {
      crtTime = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
    }
    if (fromHtml) {
      return crtTime
    } else {
      this.curPlayTime = crtTime
    }
  }

  pad(num) {
    return ("0" + num).slice(-2);
  }
}
