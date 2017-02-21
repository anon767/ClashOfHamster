// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// This lib is part of the lz-string project.
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/index.html
//
// Base64 compression / decompression for already compressed content (gif, png, jpg, mp3, ...)
// version 1.4.1
var Base64String = {

    compressToUTF16 : function (input) {
        var output = [],
            i,c,
            current,
            status = 0;

        input = this.compress(input);

        for (i=0 ; i<input.length ; i++) {
            c = input.charCodeAt(i);
            switch (status++) {
                case 0:
                    output.push(String.fromCharCode((c >> 1)+32));
                    current = (c & 1) << 14;
                    break;
                case 1:
                    output.push(String.fromCharCode((current + (c >> 2))+32));
                    current = (c & 3) << 13;
                    break;
                case 2:
                    output.push(String.fromCharCode((current + (c >> 3))+32));
                    current = (c & 7) << 12;
                    break;
                case 3:
                    output.push(String.fromCharCode((current + (c >> 4))+32));
                    current = (c & 15) << 11;
                    break;
                case 4:
                    output.push(String.fromCharCode((current + (c >> 5))+32));
                    current = (c & 31) << 10;
                    break;
                case 5:
                    output.push(String.fromCharCode((current + (c >> 6))+32));
                    current = (c & 63) << 9;
                    break;
                case 6:
                    output.push(String.fromCharCode((current + (c >> 7))+32));
                    current = (c & 127) << 8;
                    break;
                case 7:
                    output.push(String.fromCharCode((current + (c >> 8))+32));
                    current = (c & 255) << 7;
                    break;
                case 8:
                    output.push(String.fromCharCode((current + (c >> 9))+32));
                    current = (c & 511) << 6;
                    break;
                case 9:
                    output.push(String.fromCharCode((current + (c >> 10))+32));
                    current = (c & 1023) << 5;
                    break;
                case 10:
                    output.push(String.fromCharCode((current + (c >> 11))+32));
                    current = (c & 2047) << 4;
                    break;
                case 11:
                    output.push(String.fromCharCode((current + (c >> 12))+32));
                    current = (c & 4095) << 3;
                    break;
                case 12:
                    output.push(String.fromCharCode((current + (c >> 13))+32));
                    current = (c & 8191) << 2;
                    break;
                case 13:
                    output.push(String.fromCharCode((current + (c >> 14))+32));
                    current = (c & 16383) << 1;
                    break;
                case 14:
                    output.push(String.fromCharCode((current + (c >> 15))+32, (c & 32767)+32));
                    status = 0;
                    break;
            }
        }
        output.push(String.fromCharCode(current + 32));
        return output.join('');
    },


    decompressFromUTF16 : function (input) {
        var output = [],
            current,c,
            status=0,
            i = 0;

        while (i < input.length) {
            c = input.charCodeAt(i) - 32;

            switch (status++) {
                case 0:
                    current = c << 1;
                    break;
                case 1:
                    output.push(String.fromCharCode(current | (c >> 14)));
                    current = (c&16383) << 2;
                    break;
                case 2:
                    output.push(String.fromCharCode(current | (c >> 13)));
                    current = (c&8191) << 3;
                    break;
                case 3:
                    output.push(String.fromCharCode(current | (c >> 12)));
                    current = (c&4095) << 4;
                    break;
                case 4:
                    output.push(String.fromCharCode(current | (c >> 11)));
                    current = (c&2047) << 5;
                    break;
                case 5:
                    output.push(String.fromCharCode(current | (c >> 10)));
                    current = (c&1023) << 6;
                    break;
                case 6:
                    output.push(String.fromCharCode(current | (c >> 9)));
                    current = (c&511) << 7;
                    break;
                case 7:
                    output.push(String.fromCharCode(current | (c >> 8)));
                    current = (c&255) << 8;
                    break;
                case 8:
                    output.push(String.fromCharCode(current | (c >> 7)));
                    current = (c&127) << 9;
                    break;
                case 9:
                    output.push(String.fromCharCode(current | (c >> 6)));
                    current = (c&63) << 10;
                    break;
                case 10:
                    output.push(String.fromCharCode(current | (c >> 5)));
                    current = (c&31) << 11;
                    break;
                case 11:
                    output.push(String.fromCharCode(current | (c >> 4)));
                    current = (c&15) << 12;
                    break;
                case 12:
                    output.push(String.fromCharCode(current | (c >> 3)));
                    current = (c&7) << 13;
                    break;
                case 13:
                    output.push(String.fromCharCode(current | (c >> 2)));
                    current = (c&3) << 14;
                    break;
                case 14:
                    output.push(String.fromCharCode(current | (c >> 1)));
                    current = (c&1) << 15;
                    break;
                case 15:
                    output.push(String.fromCharCode(current | c));
                    status=0;
                    break;
            }


            i++;
        }

        return this.decompress(output.join(''));
        //return output;

    },


    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    decompress : function (input) {
        var output = [];
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 1;
        var odd = input.charCodeAt(0) >> 8;

        while (i < input.length*2 && (i < input.length*2-1 || odd==0)) {

            if (i%2==0) {
                chr1 = input.charCodeAt(i/2) >> 8;
                chr2 = input.charCodeAt(i/2) & 255;
                if (i/2+1 < input.length)
                    chr3 = input.charCodeAt(i/2+1) >> 8;
                else
                    chr3 = NaN;
            } else {
                chr1 = input.charCodeAt((i-1)/2) & 255;
                if ((i+1)/2 < input.length) {
                    chr2 = input.charCodeAt((i+1)/2) >> 8;
                    chr3 = input.charCodeAt((i+1)/2) & 255;
                } else
                    chr2=chr3=NaN;
            }
            i+=3;

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2) || (i==input.length*2+1 && odd)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3) || (i==input.length*2 && odd)) {
                enc4 = 64;
            }

            output.push(this._keyStr.charAt(enc1));
            output.push(this._keyStr.charAt(enc2));
            output.push(this._keyStr.charAt(enc3));
            output.push(this._keyStr.charAt(enc4));
        }

        return output.join('');
    },

    compress : function (input) {
        var output = [],
            ol = 1,
            output_,
            chr1, chr2, chr3,
            enc1, enc2, enc3, enc4,
            i = 0, flush=false;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            if (ol%2==0) {
                output_ = chr1 << 8;
                flush = true;

                if (enc3 != 64) {
                    output.push(String.fromCharCode(output_ | chr2));
                    flush = false;
                }
                if (enc4 != 64) {
                    output_ = chr3 << 8;
                    flush = true;
                }
            } else {
                output.push(String.fromCharCode(output_ | chr1));
                flush = false;

                if (enc3 != 64) {
                    output_ = chr2 << 8;
                    flush = true;
                }
                if (enc4 != 64) {
                    output.push(String.fromCharCode(output_ | chr3));
                    flush = false;
                }
            }
            ol+=3;
        }

        if (flush) {
            output.push(String.fromCharCode(output_));
            output = output.join('');
            output = String.fromCharCode(output.charCodeAt(0)|256) + output.substring(1);
        } else {
            output = output.join('');
        }

        return output;

    }
}

var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);