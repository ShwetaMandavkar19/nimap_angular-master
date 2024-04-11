import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Users } from '../users';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: Users[] = [];

  constructor(private ss: ServerService) {}

  ngOnInit(): void {
    this.ss.getUser().subscribe((u) => {
      this.user = u as Users[];
    });
  }

  onDelete(id: string) {
    console.log(id);
    this.ss.deleteDetails(id).subscribe(() => {
      this.ss.getUser().subscribe((u) => {
        this.user = u as Users[];
      });
    });
  }
}
