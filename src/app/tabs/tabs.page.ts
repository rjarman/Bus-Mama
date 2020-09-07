import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { createAnimation } from '@ionic/core';
import { ChatService } from './chat/chat.service';
import { ServerService } from '../server.service';
import { AlertController, MenuController } from '@ionic/angular';
import { URL, DOCUMENT } from 'src/app/config';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  userInfo: { email: string; name: string; image: string } = {
    email: '',
    name: '',
    image: '',
  };

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private serverService: ServerService,
    private alertController: AlertController,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.chatService.toggleSelection.subscribe((status) => {
      if (status) {
        this.disableToggle('true');
        this.selectionAnimation(0, 55);
      }
    });

    this.serverService.getUserData.subscribe((data) => {
      this.userInfo = data.body['data'][0];
    });
  }

  async showAbout() {
    const about = await this.alertController.create({
      header: 'Bus-Mama',
      message: 'Bus-Mama',
    });
    const headerID = document
      .getElementsByClassName('alert-head')[0]
      .getElementsByTagName('h2')[0].id;
    const msgID = document.getElementsByClassName('alert-message')[0].id;
    document.getElementById(headerID).style.textAlign = 'center';
    document.getElementById(headerID).innerHTML = `
    <img src="../../assets/icon/main-icon.png" alt="logo" width="50px" height="50px">
    <p style="font-family: 'Courier New', Courier, monospace;margin-top: -5px;"><strong><em>Bus-Mama</em></strong></p>
    <p style="font-size: 12px;font-family: 'Courier New', Courier, monospace;margin-top: -20px;">v1.9.7a Beta</p>
    <hr style="border-top: 1px solid #B0B3B5;">`;

    document.getElementById(msgID).innerHTML = `
    <div style="text-align: center;margin-top: -10px;">
        <p style="font-size: 14px;">
            ${DOCUMENT.ABOUT}
        </p>
        <p style="font-size: 12px; color: #B0B3B5;">Follow me on social media</p>
        <img id="facebook" src="../../assets/icon/facebook-brands.svg" alt="facebook" width="25px" height="25px" style="margin-right: 5px;">
        <img id="blog" src="../../assets/icon/blog-solid.svg" alt="blog" width="25px" height="25px" style="margin-right: 5px;">
        <img id="github" src="../../assets/icon/github-brands.svg" alt="git" width="25px" height="25px" style="margin-right: 5px;">
        <img id="linkedin" src="../../assets/icon/linkedin-brands.svg" alt="linkedin" width="25px" height="25px">
    </div>`;
    this.menuController.close();
    this.setSocialListeners();
    await about.present();
  }

  private setSocialListeners() {
    document
      .getElementById('facebook')
      .addEventListener('click', (e: Event) => {
        window.open(URL.SOCIAL.FACEBOOK);
        this.alertController.dismiss();
      });
    document.getElementById('blog').addEventListener('click', (e: Event) => {
      window.open(URL.SOCIAL.BLOG);
      this.alertController.dismiss();
    });
    document.getElementById('github').addEventListener('click', (e: Event) => {
      window.open(URL.SOCIAL.GIT);
      this.alertController.dismiss();
    });
    document
      .getElementById('linkedin')
      .addEventListener('click', (e: Event) => {
        window.open(URL.SOCIAL.LINKEDIN);
        this.alertController.dismiss();
      });
  }

  private selectionAnimation(from: number, to: number) {
    const selectMessageId = document.getElementById('selectMessage');
    const animation = createAnimation()
      .addElement(selectMessageId)
      .duration(50)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: `translateY(${from}px)` },
        { offset: 1, transform: `translateY(${to}px)` },
      ]);

    animation.play();
  }

  private disableToggle(status: string) {
    document
      .getElementById('searchBar')
      .querySelector('ion-menu-button')
      .setAttribute('disabled', status);
    document.getElementById('searchBar').setAttribute('disabled', status);
    document.getElementById('selectMessage').style.display = '';
  }

  deselect() {
    this.chatService.deselectPressed.next(true);
    this.disableToggle('false');
    document.getElementById('messageHolder').setAttribute('disabled', 'false');
    document.getElementById('selectMessage').style.display = 'none';
  }

  selectAll() {
    this.chatService.selectAllPressed.next(true);
  }

  onClick() {
    console.log('settings');
  }

  logout() {
    this.authService.logout();
  }
}
