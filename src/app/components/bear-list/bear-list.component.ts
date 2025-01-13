import { Component, OnInit } from '@angular/core';
import { BearService } from '../../services/bear-data.service';
import { Bear } from '../../models/bear.model';

@Component({
  selector: 'app-bear-list',
  templateUrl: './bear-list.component.html',
  styleUrls: ['./bear-list.component.scss'],
})
export class BearListComponent implements OnInit {
  bears: Bear[] = [];
  errorMessage = '';

  constructor(private bearService: BearService) {}

  ngOnInit(): void {
    this.bearService.fetchBearData().subscribe({
      next: (wikiText: string) => {
        this.bearService.extractBearData(wikiText).subscribe({
          next: (allBears: Bear[]) => {
            this.bears = allBears;
          },
          error: (err: Error) => {
            console.error('Error extracting bear data:', err);
            this.errorMessage = 'Error extracting bear data.';
          },
        });
      },
      error: (err: Error) => {
        console.error('Error fetching wikitext:', err);
        this.errorMessage = 'Error fetching data from Wikipedia.';
      },
    });
  }
}
