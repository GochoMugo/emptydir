# emptydir #

You now get to delete files recursively while preserving the directories.

## installation ##

`npm install emptydir`

If you wish to install it globally on your machine:

`npm install -g emptydir`

## usage ##

```js

    var emptydir = require('emptydir');

    /* 
    * Assuming the variable 'my_path' holds a path to
    * a folder on your machine
    * /
    emptydir.emptyDir(my_path, function (errs) {
        /*errs will be an array with all the errors that occurred*/
        if (errs) {
            errs.forEach(function (err) {
                console.log(err.path + " failed due to " + err.code);
            });
        }
    });
    emptydir.emptyDirs(my_path, function (err, path) {
        /*callback is called per file being worked on. err is null on success*/
        if (err) {
            console.log("Failed: " + path);
        }
        console.log("Success: " + path);
    });

    /*Synchronous*/
    errs = emptydir.emptyDirsSync(my_path);
    errs.forEach(function () {
        console.log(err.path + " failed due to " + err.code);
    });
```

## notes ##

By saying working on a file, we mean to try and remove it.

Any of the **Asynchronous** methods:

1. If the path passed is a file, it is simply deleted. **Not** amust it be a directory.
2. If a callback is **not** passed, the methods will complete as would have if callback was passed.

**emptydir.emptyDir(path [, callback])**

1. Callback is called only **once** after the workig on the files is complete.
2. On error, a list of **all** errors occurred during the recursive removal is passed to the callback.
3. On success, error will be `null`

**emptydir.emptyDirs(path [, callback])**

1. The callback is called **each** time a file is worked on.
2. **path** of the file worked on is **always** passed as the second argument to the callback on both success and error.


**emptydir.emptyDirsSync(path)**

1. The return value will always be an array. Thus no need to test for that.

> **Note:** The idea of the methods is to keep going even when an error is encountered. This ensures we remove as much files as possible.

## version info ##

|Aspect|Detail|
|------|------:|
|version|0.0.0-alpha|
|node|*|
|dependencies|none|
|last updated|21st July, 2014|

> A different [version][version]?

## contribution ##

[Fork][fork] this repo, hack it and send a Pull Request and we will get on it soon.

Also some geek talk is appreciated at [@MUGO_GOCHO][tweet].

## license #

This source code is licensed under the [MIT][MIT] license.

[version]:https://github.com/GochoMugo/emptydir "All Versions"
[fork]:https://github.com/GochoMugo/emptydir "Fork this repo"
[tweet]:https://twitter.com/MUGO_GOCHO "Tweet me"
[MIT]:https://blahblah.com "Read the License"
