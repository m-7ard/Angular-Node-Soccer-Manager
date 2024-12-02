import { AfterViewInit, Directive, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { ModalComponent } from "./modal.component";


@Directive()
export abstract class AbstractModalDirective implements AfterViewInit, OnChanges {
    ngOnChanges(changes: SimpleChanges): void {
        console.log("modal directive changes: ", changes)
    }

    @ViewChild(ModalComponent) modalComponent!: ModalComponent;
    public afterInit: (modalComponent: ModalComponent) => void = null!;

    ngAfterViewInit(): void {
        this.afterInit(this.modalComponent);
    }
}