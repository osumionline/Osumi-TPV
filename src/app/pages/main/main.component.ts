import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ApiService }        from '../../services/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './html/main.component.html',
  styleUrls: ['./css/main.component.css']
})
export class MainComponent implements OnInit {
  loading: boolean = true;
  selectedOption: string = 'sales';
  constructor(private as: ApiService, private router: Router) {}

  ngOnInit() {
    const d = new Date();
    const date = d.getFullYear() + '-' + (((d.getMonth()+1)<10) ? '0'+(d.getMonth()+1) : (d.getMonth()+1)) + '-' + ((d.getDate()<10) ? '0'+d.getDate() : d.getDate());
    this.as.checkStart(date).subscribe(result => {
      if (result.appData===null){
        this.router.navigate(['/installation']);
      }
      this.loading = false;
    });
  }
  
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