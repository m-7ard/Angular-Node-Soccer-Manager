import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MixinStyledButtonDirective } from '../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../reusables/styled-card/styled-card.module';
import { PanelDirectivesModule } from '../../reusables/panel/panel.directive.module';

@Component({
    selector: 'app-exception-notice-popover',
    standalone: true,
    imports: [MixinStyledCardDirectivesModule, MixinStyledButtonDirective, PanelDirectivesModule],
    template: `
        <div
            [appPanelDirective]="{ panelSize: 'mixin-panel-base', panelTheme: 'theme-panel-generic-white', panelHasShadow: true, panelHasBorder: true }"
            class="h-fit my-16 pointer-events-auto"
        >
            <main appMixinStyledCardSection>
                <div class="token-card--header--primary-text">
                    {{ error.name }}
                </div>
                <div class="token-card--header--secondary-text">An Exception has Occured</div>
            </main>
            <main appMixinStyledCardSection>
                <div class="token-card--default-text">{{ error.message }}</div>
            </main>
            <footer appMixinStyledCardSection class="flex flex-row justify-end">
                <button
                    [appMixinStyledButton]="{
                        size: 'mixin-Sbutton-base',
                        theme: 'theme-Sbutton-generic-white'
                    }"
                    (mouseup)="dismiss.emit()"
                >
                    Dismiss
                </button>
            </footer>
        </div>
    `,
    host: {
        class: 'fixed inset-0 flex flex-row justify-center pointer-events-none',
    },
})
export class ExceptionNoticePopover {
    @Input() error!: Error;
    @Output() dismiss: EventEmitter<void> = new EventEmitter();
}
