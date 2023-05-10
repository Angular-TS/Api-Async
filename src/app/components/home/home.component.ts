import { Component } from '@angular/core';
import { FoodTrucks } from 'src/app/model/food-trucks.model';
import { HttpDbService } from 'src/app/service/http-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  foodTrucks: FoodTrucks[] = [];

  constructor(private httpDbService: HttpDbService) { }

  ngOnInit() {
    this.showFoodTrucks();
  }

  showFoodTrucks() {
    this.httpDbService.getFoodTrucks().subscribe((db: any) => {
      this.foodTrucks = db.sort((a: FoodTrucks, b: FoodTrucks) => b.id - a.id);
    });
  }

  trackByKey(key: any): number { return key.id; }
}
