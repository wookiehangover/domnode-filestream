(function(){

"use strict";

var stream = require('stream');
var util = require('util');

function FileStream( files, type ){

  if( !(this instanceof FileStream) ){
    throw new Error("FileStream is a constructor. Try using `new`");
  }

  stream.Stream.call( this );
  this.readable  = true;
  this.type = type;
  this.encodings = {
    binary:  'readAsBinaryString',

    buffer:  'readAsArrayBuffer',

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

  // Or just pass a File
  } else if( files ){
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

  if( ! (file instanceof File || file instanceof Blob) )
    err = 'You must provide a valid File object';

  if( err )
    throw new Error( err );

  var reader       = new FileReader();
  var dataHandler      = this.data.bind(this);
  var errorHandler = this.error.bind(this);

  reader.onprogress  = dataHandler;
  reader.onload      = dataHandler;
  reader.onloadstart = dataHandler;

  reader.onerror = errorHandler;
  reader.onabort = errorHandler;

  reader.onloadend = this.end.bind(this);

  return reader[ encoding ]( file );
};

FileStream.prototype.error = function( data ){
  this.emit('error', data);
};

FileStream.prototype.data = function( data ){
  this.emit('data', data);
};

FileStream.prototype.end = function( data ){
  this.emit('data', data);
  this.emit('end', data);
};

// TODO figure out the best way (in terms of FileList iteration, etc), to emit
// an `end` event.

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = FileStream;
  }
  exports = FileStream;
} else {
  window.FileStream = FileStream;
}

})();
