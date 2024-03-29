import {Component, Inject, OnInit} from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {Promotion} from '../shared/promotion';
import {PromotionService} from '../services/promotion.service';
import {Leader} from '../shared/leader';
import {LeaderService} from '../services/leader.service';
import {expand, flyInOut} from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  leaderErrMess: string;
  promotionErrMess: string;

  constructor(private dishService: DishService, private promotionService: PromotionService,
              private leaderService: LeaderService, @Inject('BaseURL') private BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish().subscribe(dish => this.dish = dish, errmess => this.dishErrMess = errmess as any );
    this.promotionService.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion, errmess => this.promotionErrMess = errmess as any );
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader, errmess => this.leaderErrMess = errmess as any );
  }

}
