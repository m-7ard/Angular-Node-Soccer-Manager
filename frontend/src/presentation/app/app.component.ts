import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ModalTriggerDirective } from '../reusables/modal/modal-trigger.directive';
import { DrawerModalComponent } from '../reusables/modal/example.component';
import { MixinStyledButtonDirective } from '../reusables/styled-button/styled-button.directive';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { ExceptionNoticeService } from '../services/exception-notice.service';
import { ExceptionNoticePopover } from './other/exception-notice-popover.component';
import { DividerComponent } from '../reusables/divider/divider.component';
import { ContentGridDirectivesModule } from '../reusables/content-grid/content-grid.directive.module';
import { PageDirectivesModule } from '../reusables/page/page.directive.module';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterModule,
        ModalTriggerDirective,
        MixinStyledButtonDirective,
        CommonModule,
        ExceptionNoticePopover,
        DividerComponent,
        ContentGridDirectivesModule,
        PageDirectivesModule,
    ],
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
    error: Error | null = null;
    @Input() topBarTemplate!: TemplateRef<any>;

    // BreadCrumb
    // ----------------------------------------------
    breadcrumbs: Array<{ label: string; url: string }> = [];

    private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
        const children = route.children;

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
            const fullURL = routeURL ? `${url}/${routeURL}` : url;

            if (child.snapshot.data['breadcrumb']) {
                let label = child.snapshot.data['breadcrumb'];

                if (label == null) {
                    continue;
                }

                // Replace placeholders with actual parameters
                if (child.snapshot.params) {
                    Object.keys(child.snapshot.params).forEach((key) => {
                        label = label.replace(`:${key}`, child.snapshot.params[key]);
                    });
                }

                breadcrumbs.push({ label, url: fullURL });
            }

            // Recurse into child routes
            return this.createBreadcrumbs(child, fullURL, breadcrumbs);
        }

        return breadcrumbs;
    }
    // ----------------------------------------------

    constructor(
        readonly authService: AuthService,
        readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.router.events.subscribe(() => {
            this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        });
    }

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.authService.loadCurrentUser().subscribe();
            }
        });

        this.authService.isAuthenticated$.subscribe((value) => {
            this.isAuthenticated = value;
        });

        this.exceptionNoticeService.error$.subscribe((value) => {
            this.error = value;
        });
    }
}
