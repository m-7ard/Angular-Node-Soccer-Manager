import { Component, inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import { CommonModule } from '@angular/common';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { PrimeNgPopoverDirective } from '../../../reusables/prime-ng-popover/prime-ng-popover.directive';
import { Popover, PopoverModule } from 'primeng/popover';
import { Dialog } from '@angular/cdk/dialog';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [RouterModule, CommonModule, ContentGridDirectivesModule, PageDirectivesModule, PrimeNgPopoverDirective, PopoverModule],
    templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
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

    breadcrumbs: Array<{ label: string; url: string }> = [];

    navigate(url: string) {
        this.router.navigate([url]);
        this.op.hide();
    }

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

    @ViewChild('op') op!: Popover;
    private dialog = inject(Dialog);
}
