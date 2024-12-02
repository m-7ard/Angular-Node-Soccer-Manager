import { Component } from '@angular/core';

@Component({
    selector: 'test-popover',
    template: `
        <div class="popover">
            <h3>Popover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover TitlePopover Title</h3>
            <p>Youre</p>
        </div>
    `,
    host: {
        class: "fixed"
    },
    styles: [`
        .popover {
            padding: 1rem;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    `],
    standalone: true
})
export class TestPopver {}