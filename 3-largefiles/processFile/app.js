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

const os = require('os')

const inputFile = process.env.INPUT_FILE
const efsPath = process.env.EFS_PATH

const { exec } = require('child_process')

const execPromise = async (command) => {
	console.log(command)
	return new Promise((resolve, reject) => {
		const ls = exec(command, function (error, stdout, stderr) {
		  if (error) {
		    console.log('Error: ', error)
		    reject(error)
		  }
		  console.log('stdout: ', stdout);
		  console.log('stderr: ' ,stderr);
		})
		
		ls.on('exit', function (code) {
		  console.log('Finished: ', code);
		  resolve()
		})
	})
}

// The Lambda handler
exports.handler = async function (eventObject, context) {
	await execPromise(`/opt/bin/ffmpeg -loglevel error -i ${efsPath}/${inputFile} -s 240x135 -vf fps=1 ${efsPath}/%d.jpg`)
}
