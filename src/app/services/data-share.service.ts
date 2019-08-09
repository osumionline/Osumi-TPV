import { Injectable } from '@angular/core';

@Injectable()
export class DataShareService {

  saveLocalStorage = true;
  globals = {};

  constructor() { }
  
  setSaveLocalStorage(mode){
	  this.saveLocalStorage = mode;
  }

  setGlobal(key: string, value: any){
    this.globals[key] = value;
    if (this.saveLocalStorage){
      const d = new Date();
      const obj = {
        key: key,
        type: typeof value,
        value: value,
        date: d.getTime()
      };
      switch (obj.key){
        case 'number':
        case 'boolean': { obj.value = value.toString(); }
        break;
        case 'object': { obj.value = JSON.stringify(value); }
        break;
      }
      localStorage.setItem(key, JSON.stringify(obj));
    }
  }
  
  getGlobal(key:string){
    if (!this.saveLocalStorage){
      if (!this.globals[key]){
        return null;
      }
      return this.globals[key];
    }
    else{
      if (this.globals[key]){
        return this.globals[key];
	    }
      const obj = JSON.parse(localStorage.getItem(key));
      if (!obj){
        return null;
	    }
	    if (!obj.date){
  	    localStorage.removeItem(key);
  	    return null;
	    }
	    const d = new Date();
	    if (d.getTime() > (obj.date + (1000 * 60 * 60 * 24 * 2))){
  	    localStorage.removeItem(key);
  	    return null;
	    }
      this.globals[key] = obj.value;
      return this.globals[key];
    }
  }
  
  removeGlobal(key:string){
    if (this.globals[key]){
		  delete this.globals[key];
  	}
  	if (this.saveLocalStorage){
      localStorage.removeItem(key);
    }
  }
  
  resetGlobals(){
    this.globals = {};
    if (this.saveLocalStorage){
      localStorage.clear();
    }
  }
}