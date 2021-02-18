import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Comment} from '../shared/comment';
import {expand, flyInOut, visibility} from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  errMess: string;
  @ViewChild('cform') commentFormDirective;
  dishcopy: Dish;
  visibility = 'shown';

  formErrors = {
    rating: 0,
    comment: '',
    author: ''
  };

  validationMessages = {
    rating: {
      required: 'Rating is required.',
    },
    comment: {
      required: 'Say something.',
    },
    author: {
      required: 'Author name is required.',
      minlength: 'Author name must be at least 2 characters long.',
      maxlength: 'Author name cannot be more than 25 characters long.'
    }
  };

  constructor(private dishService: DishService, private route: ActivatedRoute, private location: Location, private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {
      this.visibility = 'hidden';
      return this.dishService.getDish(params.id);
    }))
      .subscribe(dish => {
        this.dish = dish;
        this.dishcopy = dish;
        this.setPrevNext(dish.id);
        this.visibility = 'shown';
      }, errmess => this.errMess = errmess as any);
  }

  createForm(): void {
    this.commentForm = this.fb.group({
      rating: [5, Validators.required],
      comment: ['', [Validators.required, Validators.minLength(1)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });
    this.commentForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any): void {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors){
      if (this.formErrors.hasOwnProperty(field)){
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string): void {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

  onSubmit(): void{
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy).subscribe(dish => {
      this.dish = dish;
      this.dishcopy = dish;
    },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = errmess as any; });
    console.log(this.comment);
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      rating: 5,
      comment: '',
      author: ''
    });
  }
}
