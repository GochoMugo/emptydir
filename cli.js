#! /usr/bin/env node

/*
* This is the Command Line Implementation of the `emptydir` module
*
* Command Line Argument Processing
*   emptydir  dirA dirB   - empties the directories
*   emptydir --version  - show version
*   emptydir --help       - show this help message
*   emptydir -v             - be verbose in emptying the directory
*/

module.exports.run = run;

var emptydir = require('./emptydir'),
       Path = require('path'),
       version =  require('./package.json').version;


// Prints sucess and error messages
function print(path, error) {
    if (error) {
        process.stdout.write('FAIL\t' + path + '\t->' + error.code + '\n');
        return;
    }
    process.stdout.write('OKAY\t' + path + '\n');
}

// Missing operand
var missing_operand = [
    'emptydir: missing operand',
    'Try \'emptydir --help\' for more information',
    '\n'
];
// Invalid Options
var invalid_option = [
    'emptydir: invalid_option',
    'Try \'emptydir --help\' for more information',
    '\n'
];

// Help Information
var help_info = [
    'emptydir\n',
    'Lets you recursively delete files in directories while maintaining the the directory structure\n',
    ' --help \t\t Show this help message',
    ' --version \t\t Show version information',
    ' -v, --verbose \t\t Be verbose while deleting',
    '\nExample:\n\n\temptydir -v my_dir/ old_file',
    '\n'
]

// Commandline runner
function run(args, options){
    args = args || [];
    if (!options) options = {};
    missing_operand = options['missing_operand'] || '';
    help_info = options['help_info'] || '';
    version_info = options['version_info'] || '';
    invalid_option = options['invalid_option'] || '';

    // Shift twice to remove the node executable and filename
    args.shift();
    args.shift();

    if (args.length == 0) {
        process.stdout.write(missing_operand);
        return missing_operand;
    } else{
        // 1 option commands
        if (args.length == 1) {
            if (args[0] == '--version') {
                process.stdout.write(version_info);
                return help_info;
            } else if (args[0] == '--help') {
                process.stdout.write(help_info);
                return help_info;
            }
        }

        // Are we verbose?
        var verbose = false;
        var new_args = [];
        args.forEach(function (arg) {
            if (arg == '--verbose' || arg == '-v') {
                verbose = true;
            } else{
                new_args.push(arg);
            }
        });
        args = new_args;

        if (args.length == 0) {
            process.stdout.write(missing_operand);
            return missing_operand;
        }

        // Invalid option?
        args_string = args.toString();
        if (args_string.match(/^-/) || args_string.match(/,-/)) {
            process.stdout.write(invalid_option);
            return invalid_option;
        }

        // Lets get to Work
        if (verbose) {
            args.forEach(function (path) {
                 emptydir.emptyDirs('./' + path, function (error, w_path) {
                    if (error) {
                        print(w_path, error);
                        return;
                    }
                    print(w_path);
                });
            });
        } else {
            args.forEach(function (path) {
                emptydir.emptyDir('./' + path, function (errors, w_path) {
                    if (errors) {
                        errors.forEach(function (error) {
                            print(error.path, error);
                        });
                    }
                });
            });
        }
    }
}

// Calls function and passes parameters
run(
    process.argv,
    {
        'missing_operand': missing_operand.join('\n'),
        'help_info': help_info.join('\n'),
        'version_info': 'emptydir ' + version + '\n',
        'invalid_option': invalid_option.join('\n')
    }
);

/*
* NOTES FOR PROGRAMMER:
*   This CLI should be as independent as possible, without requiring any
*  external module
*
*   Using emptydir.emptyDirs() causes an error when verbose is turned off.
*   This is not Fixed yet. Try fix this behavior.
*/
