import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {
	constructor() { }
  
	urldecode(str: string): string{
		if (!str){ return ''; }
		return decodeURIComponent( str.replace( /\+/g, '%20' ).replace( /\%21/g, '!' ).replace( /\%27/g, "'" ).replace( /\%28/g, '(' ).replace( /\%29/g, ')' ).replace( /\%2A/g, '*' ).replace( /\%7E/g, '~' ) );
	}
  
	urlencode(str: string): string{
		return encodeURIComponent( str ).replace( /\%20/g, '+' ).replace( /!/g, '%21' ).replace( /'/g, '%27' ).replace( /\(/g, '%28' ).replace( /\)/g, '%29' ).replace( /\*/g, '%2A' ).replace( /\~/g, '%7E' );
	}
}