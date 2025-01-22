import { Component } from '@angular/core';

@Component({
  selector: 'app-player-details-page',
  standalone: true,
  imports: [],
  templateUrl: './player-details-page.component.html',
})
export class PlayerDetailsPageComponent {
    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data: IUpdatePlayerResolverData = resolverData[RESOLVER_DATA_KEY];
            this.id = data.id;
            this.player = data.player;

            this.form.patchValue(this.initialData);
        });
    }
}
