import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  postDetail: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.postDetail = this.router.getCurrentNavigation().extras.state.postDetail;
        console.log(this.postDetail);
      }
    });
  }

  ngOnInit() {
  }

}
