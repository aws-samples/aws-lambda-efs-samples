/*
  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const outputFile = process.env.OUTPUT_FILE
const efsPath = process.env.EFS_PATH

const fs = require('fs')
const archiver = require('archiver')

// The Lambda handler
exports.handler = function (eventObject, context) {
	// create a file to stream archive data to.
	const output = fs.createWriteStream(`${efsPath}/${outputFile}`)
	const archive = archiver('zip', {
		zlib: { level: 9 } // Sets the compression level.
	})
	
	// listen for all archive data to be written
	// 'close' event is fired only when a file descriptor is involved
	output.on('close', function() {
		console.log(archive.pointer() + ' total bytes')
		console.log('archiver has been finalized and the output file descriptor has closed.')
	})
	
	// This event is fired when the data source is drained no matter what was the data source.
	// It is not part of this library but rather from the NodeJS Stream API.
	// @see: https://nodejs.org/api/stream.html#stream_event_end
	output.on('end', function() {
		console.log('Data has been drained');
	})
	
	// good practice to catch warnings (ie stat failures and other non-blocking errors)
	archive.on('warning', function(err) {
		if (err.code === 'ENOENT') {
			// log warning
		} else {
			// throw error
			throw err
		}
	})
	
	// good practice to catch this error explicitly
	archive.on('error', function(err) {
		throw err
	})

		// pipe archive data to the file
	archive.pipe(output);
	
	// append files from a glob pattern
	archive.glob(`${efsPath}/*.jpg`)
	
	// finalize the archive (ie we are done appending files but streams have to finish yet)
	// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
	archive.finalize()
}

