import { Component, ViewChild } from '@angular/core';
import { FoodTrucks } from 'src/app/model/food-trucks.model';
import { HttpDbService } from 'src/app/service/http-db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  constructor(private foodTrucksService: HttpDbService, private snackBar: MatSnackBar) { }
  
  fTruckDataForm: FoodTrucks = { } as FoodTrucks;
  @ViewChild('fTruckForm', { static: false}) fTruckForm!: NgForm;

  cancelForm() {
    this.fTruckDataForm = { } as FoodTrucks;
  }

  dataJSON: any;  

  checkDuplicateBrandAndEmail(): Promise<boolean> {
    const brandName = this.fTruckDataForm.brandName;
    const email = this.fTruckDataForm.email;
    
    return new Promise<boolean>((resolve, reject) => {
      this.foodTrucksService.getFoodTrucks().toPromise().then((dataJSON: any) => {
        const duplicateFoodTruck = dataJSON.find((ft: any) => ft.brandName === brandName && ft.email === email);
        resolve(!!duplicateFoodTruck);
      }).catch((error) => {
        console.log('An error occurred while finding the food truck in the JSON file:', error);
        reject(error);
      });
    });
  }

  async checkForm() {
    if(this.fTruckForm.form.valid) {
      if(await this.checkDuplicateBrandAndEmail()) {
        this.snackBar.open('DOES NOT PROCEED BRAND NAME AND EMAIL ALREADY EXIST!', '', { duration: 5000 });
      }
      else {
        this.foodTrucksService.createFoodTrucks(this.fTruckDataForm).subscribe(() => {
          console.log('The new food truck was successfully added to the JSON file.');
          this.fTruckDataForm = { } as FoodTrucks;
          this.snackBar.open('FOOD TRUCK - ADDED SUCCESSFULLY', '', { duration: 3000 });
        }, 
        (error) => { console.log('An error occurred while adding the new food truck to the JSON file:', error); }); 
      }
    }
    else { console.log('Invalid Data'); }
  }

  onSubmit() {
    this.checkForm();
  }
}
