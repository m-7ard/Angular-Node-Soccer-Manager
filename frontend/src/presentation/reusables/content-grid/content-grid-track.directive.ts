import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[appContentGridTrack]',
    standalone: true,
})
export class ContentGridTrackDirective {
    @Input() contentGridTrack: 'base' | 'full' | 'sm' | 'lg' = 'base';

    @HostBinding('attr.data-track')
    get dataTrack(): string | null {
        return this.contentGridTrack;
    }
}
