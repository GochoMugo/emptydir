var assert = require('assert'),
       fs = require('fs'),
       emptydir = require('../emptydir'),
       cli = require('../cli');

var test_folder = './test';
var dirs = [
    test_folder,
    test_folder + '/dirA',
    test_folder + '/dirB',
    test_folder + '/dirB/dirC'
];
dirs.forEach(function (dir) {
    fs.mkdirSync(dir)
});

// Recreate the files
var original_file = './try_file';
file = fs.openSync(original_file, 'w');
fs.closeSync(file);
var files = [
    test_folder + '/file1',
    test_folder + '/dirA/file2',
    test_folder + '/dirB/dirC/file3'
];
beforeEach(function () {
    files.forEach(function (file) {
        fs.linkSync(original_file, file);
    });
});


/*Creates a super folder that wiill raise excepton if tried to be deleted from*/
var super_folder = './delete_me';
if (!fs.existsSync(super_folder)) fs.mkdirSync(super_folder, 000);

describe('emptyDir', function () {
    it('should call callback once with err as null', function (done) {
        var calls = 0;
        emptydir.emptyDir(test_folder, function (errs) {
            calls++;
            assert.equal(1, calls, 'called more than once');
            assert.equal(null, errs, 'some unexpected error occurred');
            done();
        });
    });
    it('should pass an array of errs', function (done) {
        emptydir.emptyDir(super_folder, function (errs) {
            assert.ok(errs.length, 'error failed to be passed');
            done();
        });
    });
});


describe('emptyDirs', function () {
    it('should be called per file and always pass path, no error should be passed to callback here', function (done) {
        var calls = 0;
        emptydir.emptyDirs(test_folder, function(err, path) {
            calls++;
            assert.equal(null, err, 'some error was passed');
            assert(path, 'path not passed to callback');
            if (calls === 3) done();
        });
    });
    it('should get an err', function (done) {
        emptydir.emptyDirs(super_folder, function (err, path) {
            assert(err, 'Error did not get passed');
            done();
        });
    });
});


describe('emptyDirsSync', function () {
    it('should return an empty array here', function () {
        errs = emptydir.emptyDirsSync(test_folder);
        assert.equal(0, errs.length);
    });
    it('should return an array with one error', function () {
        errs = emptydir.emptyDirsSync(super_folder);
        assert.equal(1, errs.length);
    });
});

describe('Command Line Runner', function () {
    it('should realize missing operand', function () {
        missing_operand = cli.run(['node', 'emptydir'], {missing_operand: 0});
        assert.equal(0, missing_operand, 'did not realize missing operand');
        missing_operand = cli.run(['node', 'emptydir', '--help'], {missing_operand: 0});
        assert.equal(0, missing_operand, 'did not realize missing operand');
    });
    it('should show help', function () {
        help_info = cli.run(['node', 'emptydir', '--help'], '', {help_info: 0});
        assert.equal(0, help_info, 'did not get help');
    });
    it('should show version info', function () {
        version_info = cli.run(['node', 'emptydir', '--version'], {version_info: 0});
        assert.equal(0, version_info, 'did not show version info');
    });
    it('should realize invalid option', function () {
        invalid_option = cli.run(['node', 'emptydir', '-ghj'], {invalid_option: 0});
        assert.equal(0, invalid_option, 'did not catch invalid option');
    });
    it('should continue even when non-existent directories is given', function () {
        assert.doesNotThrow(
            function () {
                cli.run(['node', 'emptydir', 'non-existing-dir']);
            },
            "exception raised when non-existant directories encountered in cli");
    });
});


// Destroy all files
afterEach(function () {
    files.forEach(function (file) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
});

// Destroy all Direcotories
after(function () {
    dirs = dirs.reverse();
    dirs.forEach(function (dir) {
        fs.rmdirSync(dir);
    });
});
