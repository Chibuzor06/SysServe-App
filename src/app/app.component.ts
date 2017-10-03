import { TripsService } from './../services/trips.service';
import { UserService } from './../services/user.service';
import { SegmentService } from './../services/segment.service';
import { Component, ViewChild} from '@angular/core';
import { Platform, MenuController, NavController, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp{
  rootPage: any;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private menuCtrl: MenuController, private segmentSrvc: SegmentService, private tripsService: TripsService,
    private userSrvc: UserService, private loadingCtrl: LoadingController, private alertCtrl: AlertController
  ) {
    this.userSrvc.loggedIn()
    .then( data => {
      if (data.accessedStorage && data.user) {
        this.rootPage = 'HomePage';
      } else if (data.accessedStorage && !data.user) {
        this.rootPage = 'LoginPage';
      } else {
        console.log('Error in accessing storage');
      }
    })
    .catch(
      err => {
        console.log(err);
      }
    );
    console.log(this.rootPage);
    console.log('Constructor');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  // ngOnInit() {
  //   console.log('OnInit');

  // }

  onLoadPage(page: any) {
    this.nav.push(page);
    this.menuCtrl.close();
  }

  onViewMessages() {
    // WelcomePage.segment = 'messages';
    this.segmentSrvc.setCurrentSegment('messages');
    this.menuCtrl.close();
    this.nav.setRoot('HomePage');
  }

  onLogout() {
    // this.authService.logout();
    this.menuCtrl.close();
    const loader = this.loadingCtrl.create({
      content: 'Logging you out...'
    });
    loader.present();
    this.userSrvc.clearUser()
      .then(
        success => {
          if (success) {
            this.tripsService.clearTrips();
            loader.dismiss();
            this.nav.setRoot('LoginPage');
          } else {
            loader.dismiss();
            const toast = this.alertCtrl.create({
              message: 'Error when logging out'
            });
            toast.present();
          }
        }
      )
      .catch(
        err => {
          console.log('Logout error', err);
          loader.dismiss();
        }
      );


  }
}

