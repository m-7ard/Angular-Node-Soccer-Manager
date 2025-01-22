import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentGridDirectivesModule } from '../content-grid/content-grid.directive.module';
import { DividerComponent } from '../divider/divider.component';

export type HeaderNavbarButtons = Array<{ label: string; url: string }>;

@Component({
    selector: 'app-header-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, ContentGridDirectivesModule, DividerComponent],
    template: `
        <section appContentGrid class="token-nav-section">
            <nav [appContentGridTrack]="{ contentGridTrack: 'base' }" class="flex flex-row overflow-x-auto">
                <ng-container *ngFor="let button of buttons; let i = index">
                    <div>
                        <button
                            class="token-nav-section-button"
                            [routerLink]="button.url"
                            routerLinkActive="active"
                            [routerLinkActiveOptions]="{ exact: true }"
                            ariaCurrentWhenActive="page"
                        >
                            {{ button.label }}
                        </button>
                    </div>
                    <app-divider [isVertical]="true" *ngIf="i === buttons.length - 1" />
                </ng-container>
            </nav>
        </section>
    `,
})
export class FormFieldComponent {
    @Input() buttons!: HeaderNavbarButtons;
}
