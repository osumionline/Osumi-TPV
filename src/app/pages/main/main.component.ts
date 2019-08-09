import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './html/main.component.html',
  styleUrls: ['./css/main.component.css']
})
export class MainComponent implements OnInit {
  selectedOption: string = 'sales';
  constructor() {}

  ngOnInit() {}
  
  selectOptionSales(){
    this.selectOption('sales');
  }
  
  selectOptionItems(){
    this.selectOption('items');
  }
  
  selectOptionOrders(){
    this.selectOption('orders');
  }
  
  selectOption(option: string){
    this.selectedOption = option;
  }
}