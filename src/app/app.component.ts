import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'inventual';

  isRTL = false;

  isSettingsAreaActive = false;

  toggleSettingsArea() {
    this.isSettingsAreaActive = !this.isSettingsAreaActive;
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    // Retrieve the direction from local storage on component initialization
    const storedDirection = localStorage.getItem('direction');
    this.isRTL = storedDirection === 'rtl';
    this.setDocumentDirection();
  }

  setDirection(direction: 'rtl' | 'ltr') {
    // Set the direction based on the parameter
    this.isRTL = direction === 'rtl';

    // Save the direction to local storage
    localStorage.setItem('direction', this.isRTL ? 'rtl' : 'ltr');

    // Apply the new direction to the document
    this.setDocumentDirection();
}

  private setDocumentDirection() {
    const direction = this.isRTL ? 'rtl' : 'ltr';
    this.renderer.setAttribute(this.el.nativeElement.ownerDocument.documentElement, 'dir', direction);
  }
}
