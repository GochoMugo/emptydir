/*
* EMPTYDIR (GRACEFUL, RECURSIVE REMOVAL)
*    Deletes all files recursively leaving directories.
* AUTHOR:     GOCHO MUGO <https://github.com/GochoMugo>
* LICENSE:     MIT
*/
module.exports = {
    emptyDirs: emptyDirs,
    emptyDirsSync: emptyDirsSync,
    emptyDir: emptyDir
};

var fs = require("fs"),
      Path = require("path"),
      child_process = require("child_process");

/*
* STRATEGY:
*    A file: just delete it.
*    A directory: read its contents and delete all files inside.
*    Use recursion for directories within directories.
*/

/*
* ASYNCHRONOUS - VERBOSE
*
* Calls the callback every time on success/err of removing a file
*
* CALLBACK:
*    (err, path)
*        err - error that occurred. null if successful.
*        path - file that was been worked on.
* ERRORS:
*    Path given does not exist. :: Error is passed to callback and halts
*    Permission denied while deleting files. ::
*        If node has no permission to execute a directory, it is ignored.
*        No files underneath it will be removed.
*        Files and Directories we can not delete we pass the err to the
*        callback
*/
function emptyDirs(path, callback) {
    if (!callback) {
        callback = function (){};
        if (process.send) {
            callback = function (err, path) {
                if (err) process.send(err);
            }
        }
    }
    fs.lstat(path, function(err, stats) {
        if (err) {
            callback(err, path);
            return;
        }
        if (stats.isDirectory()) {
            fs.readdir(path, function (err, files) {
                files.forEach(function (file) {
                    file_path = Path.join(path, file);
                    emptyDirs(file_path, callback);
                });
            });
        } else if (stats.isFile() || stats.isSymbolicLink()) {
            fs.unlink(path, function  (err) {
                if (err) {
                    callback(err, path);
                    return;
                }
                callback(null, path);
            });
        }
    });
}


/*
* ASYNCHRONOUS - SILENT
*
* Calls the callback after finishing the whole process.
*
* CALLBACK:
*    (err)
*        - on success, err is null
*        - on error, err is a list of all the errors that have occurred
*/
function emptyDir(path, callback) {
    var results = [];
    if (!callback) {
        callback = function (){};
    }
    child = child_process.fork(__filename, [path]);
    child.on('message', function (data) {
        results.push(data);
    });
    child.on('close', function () {
        if (results.length == 0) results = null
        callback(results);
    });
}


/*
* SYNCHRONOUS
* 
* On success, returns an empty list
* On Error, returns a list of all the errors that occurred.
*
* The idea is to NOT stop until we delete the maximum number of files
* we can.
*/
function emptyDirsSync(path) {
    var results = [];
    empty(path);
    function empty(path) {
        try {
            stats = fs.lstatSync(path);
            if (stats.isDirectory()) {
                files = fs.readdirSync(path);
                files.forEach(function (file) {
                    file_path = Path.join(path, file);
                    empty(file_path);
                });
            } else if (stats.isFile() || stats.isSymbolicLink()) {
                try {
                    fs.unlinkSync(path)
                } catch (err) {
                    results.push(err);
                }
            }
        }
        catch (err) {
            results.push(err);
        }
    }
    return results;
}

/*
* This handles process running this module and passing arguments to it.
*/
if (process.argv.length > 2) {
    emptyDirs(process.argv[2]);
}
