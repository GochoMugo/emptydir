
# emptydir [![Build Status](https://travis-ci.org/GochoMugo/emptydir.svg?branch=master)](https://travis-ci.org/GochoMugo/emptydir)



You now get to delete files recursively while preserving the directories from [NodeJs][nodejs].

## installation ##

You require [npm][npm] to install/download this module.

`npm install emptydir`

If you wish to install it globally on your machine:

`npm install -g emptydir`

## usage ##

```js

var emptydir = require('emptydir');

/* 
* Assuming the variable 'my_path' holds a path to
* a folder on your machine
*/

/*
* errs will be an array with all the errors that occurred
* Otherwise null on success
*/
emptydir.emptyDir(my_path, function (errs) {
    if (errs) {
        errs.forEach(function (err) {
            console.log(err.path + " failed due to " + err.code);
        });
    }
});

/*
* callback is called per file(and not directory) being worked on.
* err is null on success
*/
emptydir.emptyDirs(my_path, function (err, path) {
    if (err) {
        console.log("Failed: " + path);
    }
    console.log("Success: " + path);
});

/*
* Synchronous. Returns an array of all the errors that occurred while
* working on the files in the directory.
* On success, returns an empty array. Thus it is safe to immediately
* loop through the errors in the array.
*/
errs = emptydir.emptyDirsSync(my_path);
errs.forEach(function () {
    console.log(err.path + " failed due to " + err.code);
});
```

## notes ##

> By saying **working on a file**, we mean to try and remove it.

**All** of the methods:

1. If the path passed is a file, it is simply deleted. It's '**not** amust the path points to a directory.
2. Symbolic links are not dereferenced. They are deleted equally as files.

Any of the **Asynchronous** methods:

1. If a callback is **not** passed, the methods will complete as would have if callback was passed.

<hr>

**emptydir.emptyDir(path [, callback])**

1. Callback is called only **once** after the working on the files is complete.
2. On error, a list of **all** errors occurred during the recursive removal is passed to the callback.
3. On success, error will be `null`

<hr>

**emptydir.emptyDirs(path [, callback])**

1. The callback is called **each** time a file is worked on.
2. **path** of the file worked on is **always** passed as the second argument to the callback on both success and error.

<hr>

**emptydir.emptyDirsSync(path)**

1. The return value will always be an array. Thus no need to test for that.

> **Note:** The idea of the methods is to keep going even when an error is encountered. This ensures we remove as much files as possible.

## version info ##

|Aspect|Detail|
|------|------:|
|version|0.0.0-alpha|
|nodejs|0.10.\*, 0.8.\*|
|dependencies|none|
|last updated|23rd July, 2014|

<!-- > A different [version][version]?-->

## contribution ##

[Fork][fork] this repo, hack it and send a Pull Request.

If you encounter a bug, even if you could fix it yourself (*a pull request would be better in this case*), please create an [issue].

Also some geek talk is appreciated at [@MUGO_GOCHO][tweet].

## license #

This source code is licensed under the [MIT][MIT] license.

[nodejs]:https://nodejs.org "NodeJs Homepage"
[npm]:https://npmjs.org "Node Package Manager"
<!--[version]:https://github.com/GochoMugo/emptydir "All Versions"-->
[fork]:https://github.com/GochoMugo/emptydir "Fork this repo"
[issue]:https://github.com/GochoMugo/emptydir/issues "Create an issue"
[tweet]:https://twitter.com/MUGO_GOCHO "Tweet me"
[MIT]:https://github.com/GochoMugo/emptydir/blob/master/LICENSE  "Read the License"
