import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ModalTriggerDirective } from '../reusables/modal/modal-trigger.directive';
import { DrawerModalComponent } from '../reusables/modal/example.component';
import { MixinStyledButtonDirective } from '../ui-mixins/mixin-styled-button-directive/mixin-styled-button.directive';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { MixinStyledCardDirective } from '../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../reusables/styled-card/styled-card-section.directive';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule, ModalTriggerDirective, MixinStyledButtonDirective, CommonModule, MixinStyledCardDirective, MixinStyledCardSectionDirective],
    templateUrl: './app.component.html',
    host: {
        class: 'flex flex-col h-full',
    },
})
export class AppComponent implements OnInit {
    title = 'frontend';
    exampleModal = DrawerModalComponent;
    otherTitle = '0';
    isAuthenticated: boolean = null!;

    constructor(
        readonly authService: AuthService,
        private readonly router: Router,
    ) {
        // setInterval(() => {
        //     this.otherTitle = (parseInt(this.otherTitle) + 1).toString();
        //     console.log("new title: ", this.otherTitle)
        // }, 1000);
    }

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                console.log("test")
                this.authService.loadCurrentUser().subscribe();
            }
        });

        this.authService.isAuthenticated$.subscribe(value => {
            this.isAuthenticated = value;
        })
    }
}
