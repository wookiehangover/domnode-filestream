;(function(){

var stream = require('stream');
var util = require('util');

function FileStream( files, type ){

  stream.Stream.call( this );

  this.readable  = true;

  this.type = type;

  this.encodings = {
    binary:  'readAsBinaryString',

    buffer:  'readAsArrayBuffer',
    blob:    'readAsArrayBuffer',

    url:     'readAsDataURL',
    dataUrl: 'readAsDataURL',
    dataURL: 'readAsDataURL',

    string:  'readAsText',
    text:    'readAsText'
  };

  // Iterate over FileLists
  if( files instanceof FileList ){

    for( var i = 0; i < files.length; i++ ){
      this.read( files[i] );
    }

  } else if( files instanceof File ){

    this.read( files );

  }

}

util.inherits(FileStream, stream.Stream);

FileStream.prototype.read = function( file ){

  var type = this.type || 'string';

  var encoding = this.encodings[ type ];


  // some basic error handling
  var err = false;

  if( encoding === undefined )
    err = '`'+ type +'` is not a valid encoding.';

  if( !( file instanceof File ) )
    err = 'You must provide a valid File object';

  if( err )
    throw new Error( err );


  // cache a references to the class instance and reader instance
  var _this = this;
  var reader = new FileReader();

  var handler = this.handle.bind(this);

  reader.onprogress = handler;
  reader.onload     = handler;

  reader.onerror = function( data ){
    _this.emit('error', data);
  };

  reader[ encoding ]( file );

};

FileStream.prototype.handle = function( data ){
  this.emit('data', data);
};


if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = FileStream;
  }
  exports = FileStream;
} else {
  window.FileStream = FileStream;
}

})();
