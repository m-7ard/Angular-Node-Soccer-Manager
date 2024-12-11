import { Component } from '@angular/core';

@Component({
    selector: 'internal-server-error-page',
    standalone: true,
    imports: [],
    template: `
        <div class="mixin-page-like mixin-page-base mixin-content-grid flex flex-col grow">
            <main class="flex flex-col gap-2 items-center justify-center grow text-center" data-track="base">
                <div class="text-4xl font-bold">
                    Internal Server Error
                </div>
                <div class="text-xl">
                    Internal Server Error
                </div>
            </main>
        </div>
    `,
    host: {
        class: 'flex flex-col grow',
    },
})
export class InternalServerErrorPageComponent {}
