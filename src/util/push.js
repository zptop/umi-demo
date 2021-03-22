export default function routerPush() {
    let str = window.location.search.substr(1);
    let arr = str.split('&');
    for (let i = 0; i < arr.length; i++) {
      var brr = arr[i].split('=');
      if (brr[0] === 'url') {
          return brr[1];
      }
    }
  }