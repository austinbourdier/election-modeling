interface Window {
  Release: any;
};

declare var jQuery: any;

window.Release = function() {
  var sha1 = '35328efb8ce673e1a75c00d39c44b4d1628b7de9';
  console.info(`Front-end: ${sha1}`);

  jQuery.get('/sha1', function( data: string ) {
    console.info(`Back-end: ${data}`);
  });
};
