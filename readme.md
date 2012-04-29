# dominode FileReader

As suggested by Max Ogden's
[dominode](https://github.com/maxogden/dominode/), this is the HTML5
[FileReader
API](http://www.w3.org/TR/FileAPI/#FileReader-interface) implemented as a
node stream. See the dominode readme for more details about why this is
cool. If you're still not convinced that streams are awesome, you should
probably [read this, too.](http://maxogden.com/node-streams).

For more info on how to read local files in the browser checkout [this article on
HTML5 Rocks](http://www.html5rocks.com/en/tutorials/file/dndfiles/).

# Example

    // Pass a FileList or a File object.
    var fstream = new FileStream( file );

    // Pipe it to any readable stream - data events are fired on all
    // progress and load events from FileReader
    fstream.pipe( readableStream );

    // Or, just bind a `data` event handler directly to the stream. The
    // handler is passed a FileReader ProgressEvent
    fstream.on('data', function(data){
      console.log(data.loaded);
    });


