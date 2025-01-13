import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'WebEngineeringAng';
  @ViewChild('transcript', { static: false })
  transcript!: ElementRef<HTMLDivElement>;
  @ViewChild('transcriptToggle', { static: false })
  toggleButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('liveRegion', { static: false })
  liveRegion!: ElementRef<HTMLDivElement>;

  toggleTranscript(): void {
    if (!this.transcript || !this.toggleButton) {
      console.error('Transcript or toggle button is not found.');
      return;
    }

    const isExpanded =
      this.toggleButton.nativeElement.getAttribute('aria-expanded') === 'true';
    this.toggleButton.nativeElement.setAttribute(
      'aria-expanded',
      (!isExpanded).toString()
    );
    this.transcript.nativeElement.hidden = isExpanded;
    this.toggleButton.nativeElement.textContent = isExpanded
      ? 'Show Transcript'
      : 'Hide Transcript';

    // Announce state change to the live region
    if (this.liveRegion) {
      this.liveRegion.nativeElement.textContent = isExpanded
        ? 'Transcript closed.'
        : 'Transcript opened. Use arrow keys to read the content.';
    }
  }

  ngAfterViewInit(): void {
    this.toggleButton.nativeElement.addEventListener('click', () =>
      this.toggleTranscript()
    );
  }
}
