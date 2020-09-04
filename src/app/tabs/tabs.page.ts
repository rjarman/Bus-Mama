import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { createAnimation, Animation } from '@ionic/core';
import { ChatService } from './chat/chat.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  private userName: string;
  private email: string;
  private photo: string;

  constructor(
    private authService: AuthService,
    private chatService: ChatService
    ) { }

  ngOnInit() {

    this.chatService.toggleSelection.subscribe(status => {
      if (status) {
        this.disableToggle('true');
        this.selectionAnimation(0, 55);
      }
    });

    // this.tabService.getUserDrawerData().subscribe(
      //   response => {
        //     this.userName = response.body['data'].userName;
        //     this.email = response.body['data'].email;
        //     this.photo = response.body['data'].photo;
        //     document.getElementById('menu-background').style.setProperty(
          //       '--background',
          //       "url(" + response.body['data'].coverPhoto + ")"
          //       );
          //   }
          // )

        }

        private selectionAnimation(from: number, to: number) {

          const selectMessageId = document.getElementById('selectMessage');
          const animation = createAnimation()
          .addElement(selectMessageId)
          .duration(50)
          .iterations(1)
          .keyframes([
            { offset: 0, transform: `translateY(${from}px)` },
            { offset: 1, transform: `translateY(${to}px)` }
          ]);

          animation.play();
        }

        private disableToggle(status: string) {
          document.getElementById('searchBar').querySelector('ion-menu-button').setAttribute('disabled', status);
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
