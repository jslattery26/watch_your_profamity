require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 4229:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const localList = (__nccwpck_require__(9602)/* .words */ .z);
const baseList = (__nccwpck_require__(8976).array);

class Filter {

  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   * @param {string} options.splitRegex - Regular expression used to split a string into words.
   */
  constructor(options = {}) {
    Object.assign(this, {
      list: options.emptyList && [] || Array.prototype.concat.apply(localList, [baseList, options.list || []]),
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /\b/,
      placeHolder: options.placeHolder || '*',
      regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
      replaceRegex: options.replaceRegex || /\w/g
    })
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    return this.list
      .filter((word) => {
        const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
        return !this.exclude.includes(word.toLowerCase()) && wordExp.test(string);
      })
      .length > 0 || false;
  }

  /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
  replaceWord(string) {
    return string
      .replace(this.regex, '')
      .replace(this.replaceRegex, this.placeHolder);
  }

  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
  clean(string) {
    return string.split(this.splitRegex).map((word) => {
      return this.isProfane(word) ? this.replaceWord(word) : word;
    }).join(this.splitRegex.exec(string)[0]);
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
  addWords() {
    let words = Array.from(arguments);

    this.list.push(...words);

    words
      .map(word => word.toLowerCase())
      .forEach((word) => {
        if (this.exclude.includes(word)) {
          this.exclude.splice(this.exclude.indexOf(word), 1);
        }
      });
  }

  /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
  removeWords() {
    this.exclude.push(...Array.from(arguments).map(word => word.toLowerCase()));
  }
}

module.exports = Filter;

/***/ }),

/***/ 852:
/***/ ((module) => {

module.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];

/***/ }),

/***/ 8976:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = {
  object: __nccwpck_require__(4052),
  array: __nccwpck_require__(852),
  regex: __nccwpck_require__(9011)
};

/***/ }),

/***/ 4052:
/***/ ((module) => {

module.exports = {"4r5e": 1, "5h1t": 1, "5hit": 1, "a55": 1, "anal": 1, "anus": 1, "ar5e": 1, "arrse": 1, "arse": 1, "ass": 1, "ass-fucker": 1, "asses": 1, "assfucker": 1, "assfukka": 1, "asshole": 1, "assholes": 1, "asswhole": 1, "a_s_s": 1, "b!tch": 1, "b00bs": 1, "b17ch": 1, "b1tch": 1, "ballbag": 1, "balls": 1, "ballsack": 1, "bastard": 1, "beastial": 1, "beastiality": 1, "bellend": 1, "bestial": 1, "bestiality": 1, "bi+ch": 1, "biatch": 1, "bitch": 1, "bitcher": 1, "bitchers": 1, "bitches": 1, "bitchin": 1, "bitching": 1, "bloody": 1, "blow job": 1, "blowjob": 1, "blowjobs": 1, "boiolas": 1, "bollock": 1, "bollok": 1, "boner": 1, "boob": 1, "boobs": 1, "booobs": 1, "boooobs": 1, "booooobs": 1, "booooooobs": 1, "breasts": 1, "buceta": 1, "bugger": 1, "bum": 1, "bunny fucker": 1, "butt": 1, "butthole": 1, "buttmuch": 1, "buttplug": 1, "c0ck": 1, "c0cksucker": 1, "carpet muncher": 1, "cawk": 1, "chink": 1, "cipa": 1, "cl1t": 1, "clit": 1, "clitoris": 1, "clits": 1, "cnut": 1, "cock": 1, "cock-sucker": 1, "cockface": 1, "cockhead": 1, "cockmunch": 1, "cockmuncher": 1, "cocks": 1, "cocksuck": 1, "cocksucked": 1, "cocksucker": 1, "cocksucking": 1, "cocksucks": 1, "cocksuka": 1, "cocksukka": 1, "cok": 1, "cokmuncher": 1, "coksucka": 1, "coon": 1, "cox": 1, "crap": 1, "cum": 1, "cummer": 1, "cumming": 1, "cums": 1, "cumshot": 1, "cunilingus": 1, "cunillingus": 1, "cunnilingus": 1, "cunt": 1, "cuntlick": 1, "cuntlicker": 1, "cuntlicking": 1, "cunts": 1, "cyalis": 1, "cyberfuc": 1, "cyberfuck": 1, "cyberfucked": 1, "cyberfucker": 1, "cyberfuckers": 1, "cyberfucking": 1, "d1ck": 1, "damn": 1, "dick": 1, "dickhead": 1, "dildo": 1, "dildos": 1, "dink": 1, "dinks": 1, "dirsa": 1, "dlck": 1, "dog-fucker": 1, "doggin": 1, "dogging": 1, "donkeyribber": 1, "doosh": 1, "duche": 1, "dyke": 1, "ejaculate": 1, "ejaculated": 1, "ejaculates": 1, "ejaculating": 1, "ejaculatings": 1, "ejaculation": 1, "ejakulate": 1, "f u c k": 1, "f u c k e r": 1, "f4nny": 1, "fag": 1, "fagging": 1, "faggitt": 1, "faggot": 1, "faggs": 1, "fagot": 1, "fagots": 1, "fags": 1, "fanny": 1, "fannyflaps": 1, "fannyfucker": 1, "fanyy": 1, "fatass": 1, "fcuk": 1, "fcuker": 1, "fcuking": 1, "feck": 1, "fecker": 1, "felching": 1, "fellate": 1, "fellatio": 1, "fingerfuck": 1, "fingerfucked": 1, "fingerfucker": 1, "fingerfuckers": 1, "fingerfucking": 1, "fingerfucks": 1, "fistfuck": 1, "fistfucked": 1, "fistfucker": 1, "fistfuckers": 1, "fistfucking": 1, "fistfuckings": 1, "fistfucks": 1, "flange": 1, "fook": 1, "fooker": 1, "fuck": 1, "fucka": 1, "fucked": 1, "fucker": 1, "fuckers": 1, "fuckhead": 1, "fuckheads": 1, "fuckin": 1, "fucking": 1, "fuckings": 1, "fuckingshitmotherfucker": 1, "fuckme": 1, "fucks": 1, "fuckwhit": 1, "fuckwit": 1, "fudge packer": 1, "fudgepacker": 1, "fuk": 1, "fuker": 1, "fukker": 1, "fukkin": 1, "fuks": 1, "fukwhit": 1, "fukwit": 1, "fux": 1, "fux0r": 1, "f_u_c_k": 1, "gangbang": 1, "gangbanged": 1, "gangbangs": 1, "gaylord": 1, "gaysex": 1, "goatse": 1, "God": 1, "god-dam": 1, "god-damned": 1, "goddamn": 1, "goddamned": 1, "hardcoresex": 1, "hell": 1, "heshe": 1, "hoar": 1, "hoare": 1, "hoer": 1, "homo": 1, "hore": 1, "horniest": 1, "horny": 1, "hotsex": 1, "jack-off": 1, "jackoff": 1, "jap": 1, "jerk-off": 1, "jism": 1, "jiz": 1, "jizm": 1, "jizz": 1, "kawk": 1, "knob": 1, "knobead": 1, "knobed": 1, "knobend": 1, "knobhead": 1, "knobjocky": 1, "knobjokey": 1, "kock": 1, "kondum": 1, "kondums": 1, "kum": 1, "kummer": 1, "kumming": 1, "kums": 1, "kunilingus": 1, "l3i+ch": 1, "l3itch": 1, "labia": 1, "lust": 1, "lusting": 1, "m0f0": 1, "m0fo": 1, "m45terbate": 1, "ma5terb8": 1, "ma5terbate": 1, "masochist": 1, "master-bate": 1, "masterb8": 1, "masterbat*": 1, "masterbat3": 1, "masterbate": 1, "masterbation": 1, "masterbations": 1, "masturbate": 1, "mo-fo": 1, "mof0": 1, "mofo": 1, "mothafuck": 1, "mothafucka": 1, "mothafuckas": 1, "mothafuckaz": 1, "mothafucked": 1, "mothafucker": 1, "mothafuckers": 1, "mothafuckin": 1, "mothafucking": 1, "mothafuckings": 1, "mothafucks": 1, "mother fucker": 1, "motherfuck": 1, "motherfucked": 1, "motherfucker": 1, "motherfuckers": 1, "motherfuckin": 1, "motherfucking": 1, "motherfuckings": 1, "motherfuckka": 1, "motherfucks": 1, "muff": 1, "mutha": 1, "muthafecker": 1, "muthafuckker": 1, "muther": 1, "mutherfucker": 1, "n1gga": 1, "n1gger": 1, "nazi": 1, "nigg3r": 1, "nigg4h": 1, "nigga": 1, "niggah": 1, "niggas": 1, "niggaz": 1, "nigger": 1, "niggers": 1, "nob": 1, "nob jokey": 1, "nobhead": 1, "nobjocky": 1, "nobjokey": 1, "numbnuts": 1, "nutsack": 1, "orgasim": 1, "orgasims": 1, "orgasm": 1, "orgasms": 1, "p0rn": 1, "pawn": 1, "pecker": 1, "penis": 1, "penisfucker": 1, "phonesex": 1, "phuck": 1, "phuk": 1, "phuked": 1, "phuking": 1, "phukked": 1, "phukking": 1, "phuks": 1, "phuq": 1, "pigfucker": 1, "pimpis": 1, "piss": 1, "pissed": 1, "pisser": 1, "pissers": 1, "pisses": 1, "pissflaps": 1, "pissin": 1, "pissing": 1, "pissoff": 1, "poop": 1, "porn": 1, "porno": 1, "pornography": 1, "pornos": 1, "prick": 1, "pricks": 1, "pron": 1, "pube": 1, "pusse": 1, "pussi": 1, "pussies": 1, "pussy": 1, "pussys": 1, "rectum": 1, "retard": 1, "rimjaw": 1, "rimming": 1, "s hit": 1, "s.o.b.": 1, "sadist": 1, "schlong": 1, "screwing": 1, "scroat": 1, "scrote": 1, "scrotum": 1, "semen": 1, "sex": 1, "sh!+": 1, "sh!t": 1, "sh1t": 1, "shag": 1, "shagger": 1, "shaggin": 1, "shagging": 1, "shemale": 1, "shi+": 1, "shit": 1, "shitdick": 1, "shite": 1, "shited": 1, "shitey": 1, "shitfuck": 1, "shitfull": 1, "shithead": 1, "shiting": 1, "shitings": 1, "shits": 1, "shitted": 1, "shitter": 1, "shitters": 1, "shitting": 1, "shittings": 1, "shitty": 1, "skank": 1, "slut": 1, "sluts": 1, "smegma": 1, "smut": 1, "snatch": 1, "son-of-a-bitch": 1, "spac": 1, "spunk": 1, "s_h_i_t": 1, "t1tt1e5": 1, "t1tties": 1, "teets": 1, "teez": 1, "testical": 1, "testicle": 1, "tit": 1, "titfuck": 1, "tits": 1, "titt": 1, "tittie5": 1, "tittiefucker": 1, "titties": 1, "tittyfuck": 1, "tittywank": 1, "titwank": 1, "tosser": 1, "turd": 1, "tw4t": 1, "twat": 1, "twathead": 1, "twatty": 1, "twunt": 1, "twunter": 1, "v14gra": 1, "v1gra": 1, "vagina": 1, "viagra": 1, "vulva": 1, "w00se": 1, "wang": 1, "wank": 1, "wanker": 1, "wanky": 1, "whoar": 1, "whore": 1, "willies": 1, "willy": 1, "xrated": 1, "xxx": 1};

/***/ }),

/***/ 9011:
/***/ ((module) => {

module.exports = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;

/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 1046:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m) return [str];

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  if (/\$$/.test(m.pre)) {    
    for (var k = 0; k < post.length; k++) {
      var expansion = pre+ '{' + m.body + '}' + post[k];
      expansions.push(expansion);
    }
  } else {
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(',') >= 0;
    if (!isSequence && !isOptions) {
      // {a},b}
      if (m.post.match(/,.*\}/)) {
        str = m.pre + '{' + m.body + escClose + m.post;
        return expand(str);
      }
      return [str];
    }

    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        // x{{a,b}}y ==> x{a}y x{b}y
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) {
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }

    // at this point, n is the parts, and we know it's not a comma set
    // with a single entry.
    var N;

    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length)
      var incr = n.length == 3
        ? Math.abs(numeric(n[2]))
        : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);

      N = [];

      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === '\\')
            c = '';
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join('0');
              if (i < 0)
                c = '-' + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];

      for (var j = 0; j < n.length; j++) {
        N.push.apply(N, expand(n[j], false));
      }
    }

    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
  }

  return expansions;
}



/***/ }),

/***/ 1077:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

const proc =
  typeof process === 'object' && process
    ? process
    : {
        stdout: null,
        stderr: null,
      }
const EE = __nccwpck_require__(2361)
const Stream = __nccwpck_require__(2781)
const stringdecoder = __nccwpck_require__(1576)
const SD = stringdecoder.StringDecoder

const EOF = Symbol('EOF')
const MAYBE_EMIT_END = Symbol('maybeEmitEnd')
const EMITTED_END = Symbol('emittedEnd')
const EMITTING_END = Symbol('emittingEnd')
const EMITTED_ERROR = Symbol('emittedError')
const CLOSED = Symbol('closed')
const READ = Symbol('read')
const FLUSH = Symbol('flush')
const FLUSHCHUNK = Symbol('flushChunk')
const ENCODING = Symbol('encoding')
const DECODER = Symbol('decoder')
const FLOWING = Symbol('flowing')
const PAUSED = Symbol('paused')
const RESUME = Symbol('resume')
const BUFFER = Symbol('buffer')
const PIPES = Symbol('pipes')
const BUFFERLENGTH = Symbol('bufferLength')
const BUFFERPUSH = Symbol('bufferPush')
const BUFFERSHIFT = Symbol('bufferShift')
const OBJECTMODE = Symbol('objectMode')
// internal event when stream is destroyed
const DESTROYED = Symbol('destroyed')
// internal event when stream has an error
const ERROR = Symbol('error')
const EMITDATA = Symbol('emitData')
const EMITEND = Symbol('emitEnd')
const EMITEND2 = Symbol('emitEnd2')
const ASYNC = Symbol('async')
const ABORT = Symbol('abort')
const ABORTED = Symbol('aborted')
const SIGNAL = Symbol('signal')

const defer = fn => Promise.resolve().then(fn)

// TODO remove when Node v8 support drops
const doIter = global._MP_NO_ITERATOR_SYMBOLS_ !== '1'
const ASYNCITERATOR =
  (doIter && Symbol.asyncIterator) || Symbol('asyncIterator not implemented')
const ITERATOR =
  (doIter && Symbol.iterator) || Symbol('iterator not implemented')

// events that mean 'the stream is over'
// these are treated specially, and re-emitted
// if they are listened for after emitting.
const isEndish = ev => ev === 'end' || ev === 'finish' || ev === 'prefinish'

const isArrayBuffer = b =>
  b instanceof ArrayBuffer ||
  (typeof b === 'object' &&
    b.constructor &&
    b.constructor.name === 'ArrayBuffer' &&
    b.byteLength >= 0)

const isArrayBufferView = b => !Buffer.isBuffer(b) && ArrayBuffer.isView(b)

class Pipe {
  constructor(src, dest, opts) {
    this.src = src
    this.dest = dest
    this.opts = opts
    this.ondrain = () => src[RESUME]()
    dest.on('drain', this.ondrain)
  }
  unpipe() {
    this.dest.removeListener('drain', this.ondrain)
  }
  // istanbul ignore next - only here for the prototype
  proxyErrors() {}
  end() {
    this.unpipe()
    if (this.opts.end) this.dest.end()
  }
}

class PipeProxyErrors extends Pipe {
  unpipe() {
    this.src.removeListener('error', this.proxyErrors)
    super.unpipe()
  }
  constructor(src, dest, opts) {
    super(src, dest, opts)
    this.proxyErrors = er => dest.emit('error', er)
    src.on('error', this.proxyErrors)
  }
}

class Minipass extends Stream {
  constructor(options) {
    super()
    this[FLOWING] = false
    // whether we're explicitly paused
    this[PAUSED] = false
    this[PIPES] = []
    this[BUFFER] = []
    this[OBJECTMODE] = (options && options.objectMode) || false
    if (this[OBJECTMODE]) this[ENCODING] = null
    else this[ENCODING] = (options && options.encoding) || null
    if (this[ENCODING] === 'buffer') this[ENCODING] = null
    this[ASYNC] = (options && !!options.async) || false
    this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null
    this[EOF] = false
    this[EMITTED_END] = false
    this[EMITTING_END] = false
    this[CLOSED] = false
    this[EMITTED_ERROR] = null
    this.writable = true
    this.readable = true
    this[BUFFERLENGTH] = 0
    this[DESTROYED] = false
    if (options && options.debugExposeBuffer === true) {
      Object.defineProperty(this, 'buffer', { get: () => this[BUFFER] })
    }
    if (options && options.debugExposePipes === true) {
      Object.defineProperty(this, 'pipes', { get: () => this[PIPES] })
    }
    this[SIGNAL] = options && options.signal
    this[ABORTED] = false
    if (this[SIGNAL]) {
      this[SIGNAL].addEventListener('abort', () => this[ABORT]())
      if (this[SIGNAL].aborted) {
        this[ABORT]()
      }
    }
  }

  get bufferLength() {
    return this[BUFFERLENGTH]
  }

  get encoding() {
    return this[ENCODING]
  }
  set encoding(enc) {
    if (this[OBJECTMODE]) throw new Error('cannot set encoding in objectMode')

    if (
      this[ENCODING] &&
      enc !== this[ENCODING] &&
      ((this[DECODER] && this[DECODER].lastNeed) || this[BUFFERLENGTH])
    )
      throw new Error('cannot change encoding')

    if (this[ENCODING] !== enc) {
      this[DECODER] = enc ? new SD(enc) : null
      if (this[BUFFER].length)
        this[BUFFER] = this[BUFFER].map(chunk => this[DECODER].write(chunk))
    }

    this[ENCODING] = enc
  }

  setEncoding(enc) {
    this.encoding = enc
  }

  get objectMode() {
    return this[OBJECTMODE]
  }
  set objectMode(om) {
    this[OBJECTMODE] = this[OBJECTMODE] || !!om
  }

  get ['async']() {
    return this[ASYNC]
  }
  set ['async'](a) {
    this[ASYNC] = this[ASYNC] || !!a
  }

  // drop everything and get out of the flow completely
  [ABORT]() {
    this[ABORTED] = true
    this.emit('abort', this[SIGNAL].reason)
    this.destroy(this[SIGNAL].reason)
  }

  get aborted() {
    return this[ABORTED]
  }
  set aborted(_) {}

  write(chunk, encoding, cb) {
    if (this[ABORTED]) return false
    if (this[EOF]) throw new Error('write after end')

    if (this[DESTROYED]) {
      this.emit(
        'error',
        Object.assign(
          new Error('Cannot call write after a stream was destroyed'),
          { code: 'ERR_STREAM_DESTROYED' }
        )
      )
      return true
    }

    if (typeof encoding === 'function') (cb = encoding), (encoding = 'utf8')

    if (!encoding) encoding = 'utf8'

    const fn = this[ASYNC] ? defer : f => f()

    // convert array buffers and typed array views into buffers
    // at some point in the future, we may want to do the opposite!
    // leave strings and buffers as-is
    // anything else switches us into object mode
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView(chunk))
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
      else if (isArrayBuffer(chunk)) chunk = Buffer.from(chunk)
      else if (typeof chunk !== 'string')
        // use the setter so we throw if we have encoding set
        this.objectMode = true
    }

    // handle object mode up front, since it's simpler
    // this yields better performance, fewer checks later.
    if (this[OBJECTMODE]) {
      /* istanbul ignore if - maybe impossible? */
      if (this.flowing && this[BUFFERLENGTH] !== 0) this[FLUSH](true)

      if (this.flowing) this.emit('data', chunk)
      else this[BUFFERPUSH](chunk)

      if (this[BUFFERLENGTH] !== 0) this.emit('readable')

      if (cb) fn(cb)

      return this.flowing
    }

    // at this point the chunk is a buffer or string
    // don't buffer it up or send it to the decoder
    if (!chunk.length) {
      if (this[BUFFERLENGTH] !== 0) this.emit('readable')
      if (cb) fn(cb)
      return this.flowing
    }

    // fast-path writing strings of same encoding to a stream with
    // an empty buffer, skipping the buffer/decoder dance
    if (
      typeof chunk === 'string' &&
      // unless it is a string already ready for us to use
      !(encoding === this[ENCODING] && !this[DECODER].lastNeed)
    ) {
      chunk = Buffer.from(chunk, encoding)
    }

    if (Buffer.isBuffer(chunk) && this[ENCODING])
      chunk = this[DECODER].write(chunk)

    // Note: flushing CAN potentially switch us into not-flowing mode
    if (this.flowing && this[BUFFERLENGTH] !== 0) this[FLUSH](true)

    if (this.flowing) this.emit('data', chunk)
    else this[BUFFERPUSH](chunk)

    if (this[BUFFERLENGTH] !== 0) this.emit('readable')

    if (cb) fn(cb)

    return this.flowing
  }

  read(n) {
    if (this[DESTROYED]) return null

    if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH]) {
      this[MAYBE_EMIT_END]()
      return null
    }

    if (this[OBJECTMODE]) n = null

    if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
      if (this.encoding) this[BUFFER] = [this[BUFFER].join('')]
      else this[BUFFER] = [Buffer.concat(this[BUFFER], this[BUFFERLENGTH])]
    }

    const ret = this[READ](n || null, this[BUFFER][0])
    this[MAYBE_EMIT_END]()
    return ret
  }

  [READ](n, chunk) {
    if (n === chunk.length || n === null) this[BUFFERSHIFT]()
    else {
      this[BUFFER][0] = chunk.slice(n)
      chunk = chunk.slice(0, n)
      this[BUFFERLENGTH] -= n
    }

    this.emit('data', chunk)

    if (!this[BUFFER].length && !this[EOF]) this.emit('drain')

    return chunk
  }

  end(chunk, encoding, cb) {
    if (typeof chunk === 'function') (cb = chunk), (chunk = null)
    if (typeof encoding === 'function') (cb = encoding), (encoding = 'utf8')
    if (chunk) this.write(chunk, encoding)
    if (cb) this.once('end', cb)
    this[EOF] = true
    this.writable = false

    // if we haven't written anything, then go ahead and emit,
    // even if we're not reading.
    // we'll re-emit if a new 'end' listener is added anyway.
    // This makes MP more suitable to write-only use cases.
    if (this.flowing || !this[PAUSED]) this[MAYBE_EMIT_END]()
    return this
  }

  // don't let the internal resume be overwritten
  [RESUME]() {
    if (this[DESTROYED]) return

    this[PAUSED] = false
    this[FLOWING] = true
    this.emit('resume')
    if (this[BUFFER].length) this[FLUSH]()
    else if (this[EOF]) this[MAYBE_EMIT_END]()
    else this.emit('drain')
  }

  resume() {
    return this[RESUME]()
  }

  pause() {
    this[FLOWING] = false
    this[PAUSED] = true
  }

  get destroyed() {
    return this[DESTROYED]
  }

  get flowing() {
    return this[FLOWING]
  }

  get paused() {
    return this[PAUSED]
  }

  [BUFFERPUSH](chunk) {
    if (this[OBJECTMODE]) this[BUFFERLENGTH] += 1
    else this[BUFFERLENGTH] += chunk.length
    this[BUFFER].push(chunk)
  }

  [BUFFERSHIFT]() {
    if (this[OBJECTMODE]) this[BUFFERLENGTH] -= 1
    else this[BUFFERLENGTH] -= this[BUFFER][0].length
    return this[BUFFER].shift()
  }

  [FLUSH](noDrain) {
    do {} while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length)

    if (!noDrain && !this[BUFFER].length && !this[EOF]) this.emit('drain')
  }

  [FLUSHCHUNK](chunk) {
    this.emit('data', chunk)
    return this.flowing
  }

  pipe(dest, opts) {
    if (this[DESTROYED]) return

    const ended = this[EMITTED_END]
    opts = opts || {}
    if (dest === proc.stdout || dest === proc.stderr) opts.end = false
    else opts.end = opts.end !== false
    opts.proxyErrors = !!opts.proxyErrors

    // piping an ended stream ends immediately
    if (ended) {
      if (opts.end) dest.end()
    } else {
      this[PIPES].push(
        !opts.proxyErrors
          ? new Pipe(this, dest, opts)
          : new PipeProxyErrors(this, dest, opts)
      )
      if (this[ASYNC]) defer(() => this[RESUME]())
      else this[RESUME]()
    }

    return dest
  }

  unpipe(dest) {
    const p = this[PIPES].find(p => p.dest === dest)
    if (p) {
      this[PIPES].splice(this[PIPES].indexOf(p), 1)
      p.unpipe()
    }
  }

  addListener(ev, fn) {
    return this.on(ev, fn)
  }

  on(ev, fn) {
    const ret = super.on(ev, fn)
    if (ev === 'data' && !this[PIPES].length && !this.flowing) this[RESUME]()
    else if (ev === 'readable' && this[BUFFERLENGTH] !== 0)
      super.emit('readable')
    else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev)
      this.removeAllListeners(ev)
    } else if (ev === 'error' && this[EMITTED_ERROR]) {
      if (this[ASYNC]) defer(() => fn.call(this, this[EMITTED_ERROR]))
      else fn.call(this, this[EMITTED_ERROR])
    }
    return ret
  }

  get emittedEnd() {
    return this[EMITTED_END]
  }

  [MAYBE_EMIT_END]() {
    if (
      !this[EMITTING_END] &&
      !this[EMITTED_END] &&
      !this[DESTROYED] &&
      this[BUFFER].length === 0 &&
      this[EOF]
    ) {
      this[EMITTING_END] = true
      this.emit('end')
      this.emit('prefinish')
      this.emit('finish')
      if (this[CLOSED]) this.emit('close')
      this[EMITTING_END] = false
    }
  }

  emit(ev, data, ...extra) {
    // error and close are only events allowed after calling destroy()
    if (ev !== 'error' && ev !== 'close' && ev !== DESTROYED && this[DESTROYED])
      return
    else if (ev === 'data') {
      return !this[OBJECTMODE] && !data
        ? false
        : this[ASYNC]
        ? defer(() => this[EMITDATA](data))
        : this[EMITDATA](data)
    } else if (ev === 'end') {
      return this[EMITEND]()
    } else if (ev === 'close') {
      this[CLOSED] = true
      // don't emit close before 'end' and 'finish'
      if (!this[EMITTED_END] && !this[DESTROYED]) return
      const ret = super.emit('close')
      this.removeAllListeners('close')
      return ret
    } else if (ev === 'error') {
      this[EMITTED_ERROR] = data
      super.emit(ERROR, data)
      const ret =
        !this[SIGNAL] || this.listeners('error').length
          ? super.emit('error', data)
          : false
      this[MAYBE_EMIT_END]()
      return ret
    } else if (ev === 'resume') {
      const ret = super.emit('resume')
      this[MAYBE_EMIT_END]()
      return ret
    } else if (ev === 'finish' || ev === 'prefinish') {
      const ret = super.emit(ev)
      this.removeAllListeners(ev)
      return ret
    }

    // Some other unknown event
    const ret = super.emit(ev, data, ...extra)
    this[MAYBE_EMIT_END]()
    return ret
  }

  [EMITDATA](data) {
    for (const p of this[PIPES]) {
      if (p.dest.write(data) === false) this.pause()
    }
    const ret = super.emit('data', data)
    this[MAYBE_EMIT_END]()
    return ret
  }

  [EMITEND]() {
    if (this[EMITTED_END]) return

    this[EMITTED_END] = true
    this.readable = false
    if (this[ASYNC]) defer(() => this[EMITEND2]())
    else this[EMITEND2]()
  }

  [EMITEND2]() {
    if (this[DECODER]) {
      const data = this[DECODER].end()
      if (data) {
        for (const p of this[PIPES]) {
          p.dest.write(data)
        }
        super.emit('data', data)
      }
    }

    for (const p of this[PIPES]) {
      p.end()
    }
    const ret = super.emit('end')
    this.removeAllListeners('end')
    return ret
  }

  // const all = await stream.collect()
  collect() {
    const buf = []
    if (!this[OBJECTMODE]) buf.dataLength = 0
    // set the promise first, in case an error is raised
    // by triggering the flow here.
    const p = this.promise()
    this.on('data', c => {
      buf.push(c)
      if (!this[OBJECTMODE]) buf.dataLength += c.length
    })
    return p.then(() => buf)
  }

  // const data = await stream.concat()
  concat() {
    return this[OBJECTMODE]
      ? Promise.reject(new Error('cannot concat in objectMode'))
      : this.collect().then(buf =>
          this[OBJECTMODE]
            ? Promise.reject(new Error('cannot concat in objectMode'))
            : this[ENCODING]
            ? buf.join('')
            : Buffer.concat(buf, buf.dataLength)
        )
  }

  // stream.promise().then(() => done, er => emitted error)
  promise() {
    return new Promise((resolve, reject) => {
      this.on(DESTROYED, () => reject(new Error('stream destroyed')))
      this.on('error', er => reject(er))
      this.on('end', () => resolve())
    })
  }

  // for await (let chunk of stream)
  [ASYNCITERATOR]() {
    let stopped = false
    const stop = () => {
      this.pause()
      stopped = true
      return Promise.resolve({ done: true })
    }
    const next = () => {
      if (stopped) return stop()
      const res = this.read()
      if (res !== null) return Promise.resolve({ done: false, value: res })

      if (this[EOF]) return stop()

      let resolve = null
      let reject = null
      const onerr = er => {
        this.removeListener('data', ondata)
        this.removeListener('end', onend)
        this.removeListener(DESTROYED, ondestroy)
        stop()
        reject(er)
      }
      const ondata = value => {
        this.removeListener('error', onerr)
        this.removeListener('end', onend)
        this.removeListener(DESTROYED, ondestroy)
        this.pause()
        resolve({ value: value, done: !!this[EOF] })
      }
      const onend = () => {
        this.removeListener('error', onerr)
        this.removeListener('data', ondata)
        this.removeListener(DESTROYED, ondestroy)
        stop()
        resolve({ done: true })
      }
      const ondestroy = () => onerr(new Error('stream destroyed'))
      return new Promise((res, rej) => {
        reject = rej
        resolve = res
        this.once(DESTROYED, ondestroy)
        this.once('error', onerr)
        this.once('end', onend)
        this.once('data', ondata)
      })
    }

    return {
      next,
      throw: stop,
      return: stop,
      [ASYNCITERATOR]() {
        return this
      },
    }
  }

  // for (let chunk of stream)
  [ITERATOR]() {
    let stopped = false
    const stop = () => {
      this.pause()
      this.removeListener(ERROR, stop)
      this.removeListener(DESTROYED, stop)
      this.removeListener('end', stop)
      stopped = true
      return { done: true }
    }

    const next = () => {
      if (stopped) return stop()
      const value = this.read()
      return value === null ? stop() : { value }
    }
    this.once('end', stop)
    this.once(ERROR, stop)
    this.once(DESTROYED, stop)

    return {
      next,
      throw: stop,
      return: stop,
      [ITERATOR]() {
        return this
      },
    }
  }

  destroy(er) {
    if (this[DESTROYED]) {
      if (er) this.emit('error', er)
      else this.emit(DESTROYED)
      return this
    }

    this[DESTROYED] = true

    // throw away all buffered data, it's never coming out
    this[BUFFER].length = 0
    this[BUFFERLENGTH] = 0

    if (typeof this.close === 'function' && !this[CLOSED]) this.close()

    if (er) this.emit('error', er)
    // if no error to emit, still reject pending promises
    else this.emit(DESTROYED)

    return this
  }

  static isStream(s) {
    return (
      !!s &&
      (s instanceof Minipass ||
        s instanceof Stream ||
        (s instanceof EE &&
          // readable
          (typeof s.pipe === 'function' ||
            // writable
            (typeof s.write === 'function' && typeof s.end === 'function'))))
    )
  }
}

exports.Minipass = Minipass


/***/ }),

/***/ 2478:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.randomCharFromSetCensorStrategy = exports.fixedCharCensorStrategy = exports.fixedPhraseCensorStrategy = exports.grawlixCensorStrategy = exports.asteriskCensorStrategy = exports.keepEndCensorStrategy = exports.keepStartCensorStrategy = void 0;
const Char_1 = __nccwpck_require__(8861);
/**
 * A text censoring strategy that extends another strategy, adding the first
 * character matched at the start of the generated string.
 *
 * @example
 * ```typescript
 * const strategy = keepStartCensorStrategy(grawlixCensorStrategy());
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you'
 * // After: 'f$@* you'
 * ```
 *
 * @example
 * ```typescript
 * // Since keepEndCensorStrategy() returns another text censoring strategy, you can use it
 * // as the base strategy to pass to keepStartCensorStrategy().
 * const strategy = keepStartCensorStrategy(keepEndCensorStrategy(asteriskCensorStrategy()));
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you'
 * // After: 'f**k you'
 * ```
 *
 * @param baseStrategy - Strategy to extend. It will be used to produce the end of
 * the generated string.
 * @returns A [[TextCensorStrategy]] for use with the [[TextCensor]].
 */
function keepStartCensorStrategy(baseStrategy) {
    return (ctx) => {
        if (ctx.overlapsAtStart)
            return baseStrategy(ctx);
        const firstChar = String.fromCodePoint(ctx.input.codePointAt(ctx.startIndex));
        return firstChar + baseStrategy({ ...ctx, matchLength: ctx.matchLength - 1 });
    };
}
exports.keepStartCensorStrategy = keepStartCensorStrategy;
/**
 * A text censoring strategy that extends another strategy, adding the last
 * character matched at the end of the generated string.
 *
 * @example
 * ```typescript
 * const strategy = keepEndCensorStrategy(asteriskCensorStrategy());
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you'
 * // After: '***k you'
 * ```
 *
 * @param baseStrategy - Strategy to extend. It will be used to produce the start
 * of the generated string.
 * @returns A [[TextCensorStrategy]] for use with the [[TextCensor]].
 */
function keepEndCensorStrategy(baseStrategy) {
    return (ctx) => {
        if (ctx.overlapsAtEnd)
            return baseStrategy(ctx);
        const lastChar = String.fromCodePoint(ctx.input.codePointAt(ctx.endIndex));
        return baseStrategy({ ...ctx, matchLength: ctx.matchLength - 1 }) + lastChar;
    };
}
exports.keepEndCensorStrategy = keepEndCensorStrategy;
/**
 * A text censoring strategy that generates strings made up of asterisks (`*`).
 *
 * @example
 * ```typescript
 * const strategy = asteriskCensorStrategy();
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you'
 * // After: '**** you'
 * ```
 *
 * @returns A [[TextCensorStrategy]] for use with the [[TextCensor]].
 */
function asteriskCensorStrategy() {
    return fixedCharCensorStrategy('*');
}
exports.asteriskCensorStrategy = asteriskCensorStrategy;
/**
 * A text censoring strategy that generates
 * [grawlix](https://www.merriam-webster.com/words-at-play/grawlix-symbols-swearing-comic-strips),
 * i.e. strings that contain the characters `%`, `@`, `$`, `&`, and `*`.
 *
 * @example
 * ```typescript
 * const strategy = grawlixCensorStrategy();
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you'
 * // After: '%@&* you'
 * ```
 *
 * @returns A [[TextCensorStrategy]] for use with the [[TextCensor]].
 */
function grawlixCensorStrategy() {
    return randomCharFromSetCensorStrategy('%@$&*');
}
exports.grawlixCensorStrategy = grawlixCensorStrategy;
/**
 * A text censoring strategy that returns a fixed string.
 *
 * @example
 * ```typescript
 * // The replacement phrase '' effectively removes all matched regions
 * // from the string.
 * const strategy = fixedPhraseCensorStrategy('');
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you'
 * // After: ' you'
 * ```
 *
 * @example
 * ```typescript
 * const strategy = fixedPhraseCensorStrategy('fudge');
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you'
 * // After: 'fudge you'
 * ```
 *
 * @param phrase - Replacement phrase to use.
 * @returns A [[TextCensorStrategy]] for use with the [[TextCensor]].
 */
function fixedPhraseCensorStrategy(phrase) {
    return () => phrase;
}
exports.fixedPhraseCensorStrategy = fixedPhraseCensorStrategy;
/**
 * A text censoring strategy that generates replacement strings that are made up
 * of the character given, repeated as many times as needed.

 * @example
 * ```typescript
 * const strategy = fixedCharCensorStrategy('*');
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you'
 * // After: '**** you'.
 * ```
 *
 * @param char - String that represents the code point which should be used when
 * generating the replacement string. Must be exactly one code point in length.
 * @returns A [[TextCensorStrategy]] for use with the [[TextCensor]].
 */
function fixedCharCensorStrategy(char) {
    // Make sure the input character is one code point in length.
    Char_1.getAndAssertSingleCodePoint(char);
    return (ctx) => char.repeat(ctx.matchLength);
}
exports.fixedCharCensorStrategy = fixedCharCensorStrategy;
/**
 * A text censoring strategy that generates replacement strings made up of
 * random characters from the set of characters provided.
 *
 * @example
 * ```typescript
 * const strategy = randomCharFromSetCensorStrategy('$#!');
 * const censor = new TextCensor().setStrategy(strategy);
 * // Before: 'fuck you!'
 * // After: '!##$ you!'
 * ```
 *
 * @param charset - Set of characters from which the replacement string should
 * be constructed. Must not be empty.
 * @returns A [[TextCensorStrategy]] for use with the [[TextCensor]].
 */
function randomCharFromSetCensorStrategy(charset) {
    const chars = [...charset];
    if (chars.length === 0)
        throw new Error('The character set passed must not be empty.');
    return (ctx) => {
        let censored = '';
        for (let i = 0; i < ctx.matchLength; i++)
            censored += chars[Math.floor(Math.random() * chars.length)];
        return censored;
    };
}
exports.randomCharFromSetCensorStrategy = randomCharFromSetCensorStrategy;


/***/ }),

/***/ 3297:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextCensor = void 0;
const MatchPayload_1 = __nccwpck_require__(7857);
const BuiltinStrategies_1 = __nccwpck_require__(2478);
/**
 * Censors regions of text matched by a [[Matcher]], supporting flexible
 * [[TextCensorStrategy | censoring strategies]].
 */
class TextCensor {
    constructor() {
        this.strategy = BuiltinStrategies_1.grawlixCensorStrategy();
    }
    /**
     * Sets the censoring strategy, which is responsible for generating
     * replacement text for regions of the text that should be censored.
     *
     * The default censoring strategy is the [[grawlixCensorStrategy]],
     * generating text like `$%@*`. There are several other built-in strategies
     * available:
     * - [[keepStartCensorStrategy]] - extends another strategy and keeps the
     *   first character matched, e.g. `f***`.
     * - [[keepEndCensorStrategy]] - extends another strategy and keeps the last
     *   character matched, e.g. `***k`.
     * - [[asteriskCensorStrategy]] - replaces the text with asterisks, e.g.
     *   `****`.
     * - [[grawlixCensorStrategy]] - the default strategy, discussed earlier.
     *
     * Note that since censoring strategies are just functions (see the
     * documentation for [[TextCensorStrategy]]), it is relatively simple to
     * create your own.
     *
     * To ease creation of common censoring strategies, we provide a number of
     * utility functions:
     * - [[fixedPhraseCensorStrategy]] - generates a fixed phrase, e.g. `fudge`.
     * - [[fixedCharCensorStrategy]] - generates replacement strings constructed
     *   from the character given, repeated as many times as needed.
     * - [[randomCharFromSetCensorStrategy]] - generates replacement strings
     *   made up of random characters from the set of characters provided.
     *
     * @param strategy - Text censoring strategy to use.
     */
    setStrategy(strategy) {
        this.strategy = strategy;
        return this;
    }
    /**
     * Applies the censoring strategy to the text, returning the censored text.
     *
     * **Overlapping regions**
     *
     * Overlapping regions are an annoying edge case to deal with when censoring
     * text. There is no single best way to handle them, but the implementation
     * of this method guarantees that overlapping regions will always be
     * replaced, following the rules below:
     *
     * - Replacement text for matched regions will be generated in the order
     *   specified by [[compareMatchByPositionAndId]];
     * - When generating replacements for regions that overlap at the start with
     *   some other region, the start index of the censor context passed to the
     *   censoring strategy will be the end index of the first region, plus one.
     *
     * @param input - Input text.
     * @param matches - A list of matches.
     * @returns The censored text.
     */
    applyTo(input, matches) {
        if (matches.length === 0)
            return input;
        const sorted = [...matches].sort(MatchPayload_1.compareMatchByPositionAndId);
        let censored = '';
        let lastIndex = 0; // end index of last match, plus one
        for (let i = 0; i < sorted.length; i++) {
            const match = sorted[i];
            if (lastIndex > match.endIndex)
                continue; // completely contained in the previous span
            const overlapsAtStart = match.startIndex < lastIndex;
            // Add the chunk of text between the end of the last match and the
            // start of the current match.
            if (!overlapsAtStart)
                censored += input.slice(lastIndex, match.startIndex);
            const actualStartIndex = Math.max(lastIndex, match.startIndex);
            const overlapsAtEnd = i < sorted.length - 1 && // not the last match
                match.endIndex >= sorted[i + 1].startIndex && // end index of this match and start index of next one overlap
                match.endIndex < sorted[i + 1].endIndex; // doesn't completely contain next match
            censored += this.strategy({ ...match, startIndex: actualStartIndex, input, overlapsAtStart, overlapsAtEnd });
            lastIndex = match.endIndex + 1;
        }
        censored += input.slice(lastIndex);
        return censored;
    }
}
exports.TextCensor = TextCensor;


/***/ }),

/***/ 2537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhraseBuilder = exports.DataSet = void 0;
const BlacklistedTerm_1 = __nccwpck_require__(3531);
/**
 * Holds phrases (groups of patterns and whitelisted terms), optionally
 * associating metadata with them.
 *
 * @typeParam MetadataType - Metadata type for phrases. Note that the metadata
 * type is implicitly nullable.
 */
class DataSet {
    constructor() {
        this.containers = [];
        this.patternCount = 0;
        this.patternIdToPhraseContainer = new Map(); // pattern ID => index of its container
    }
    /**
     * Adds all the phrases from the dataset provided to this one.
     *
     * @example
     * ```typescript
     * const customDataset = new DataSet().addAll(englishDataset);
     * ```
     *
     * @param other - Other dataset.
     */
    addAll(other) {
        for (const container of other.containers)
            this.registerContainer(container);
        return this;
    }
    /**
     * Removes phrases that match the predicate given.
     *
     * @example
     * ```typescript
     * const customDataset = new DataSet<{ originalWord: string }>()
     * 	.addAll(englishDataset)
     * 	.removePhrasesIf((phrase) => phrase.metadata.originalWord === 'fuck');
     * ```
     *
     * @param predicate - A predicate that determines whether or not a phrase should be removed.
     * Return `true` to remove, `false` to keep.
     */
    removePhrasesIf(predicate) {
        // Clear the internal state, then gradually rebuild it by adding the
        // containers that should be kept.
        this.patternCount = 0;
        this.patternIdToPhraseContainer.clear();
        const containers = this.containers.splice(0);
        for (const container of containers) {
            const remove = predicate(container);
            if (!remove)
                this.registerContainer(container);
        }
        return this;
    }
    /**
     * Adds a phrase to this dataset.
     *
     * @example
     * ```typescript
     * const data = new DataSet<{ originalWord: string }>()
     * 	.addPhrase((phrase) => phrase.setMetadata({ originalWord: 'fuck' })
     * 		.addPattern(pattern`fuck`)
     * 		.addPattern(pattern`f[?]ck`)
     * 		.addWhitelistedTerm('Afck'))
     * 	.build();
     * ```
     *
     * @param fn - A function that takes a [[PhraseBuilder]], adds
     * patterns/whitelisted terms/metadata to it, and returns it.
     */
    addPhrase(fn) {
        const container = fn(new PhraseBuilder()).build();
        this.registerContainer(container);
        return this;
    }
    /**
     * Retrieves the phrase metadata associated with a pattern and returns a
     * copy of the match payload with said metadata attached to it.
     *
     * @example
     * ```typescript
     * const matches = matcher.getAllMatches(input);
     * const matchesWithPhraseMetadata = matches.map((match) => dataset.getPayloadWithPhraseMetadata(match));
     * // Now we can access the 'phraseMetadata' property:
     * const phraseMetadata = matchesWithPhraseMetadata[0].phraseMetadata;
     * ```
     *
     * @param payload - Original match payload.
     */
    getPayloadWithPhraseMetadata(payload) {
        const offset = this.patternIdToPhraseContainer.get(payload.termId);
        if (offset === undefined) {
            throw new Error(`The pattern with ID ${payload.termId} does not exist in this dataset.`);
        }
        return {
            ...payload,
            phraseMetadata: this.containers[offset].metadata,
        };
    }
    /**
     * Returns the dataset in a format suitable for usage with the [[RegExpMatcher]]
     * or the [[NfaMatcher]].
     *
     * @example
     * ```typescript
     * // With the RegExpMatcher:
     * const matcher = new RegExpMatcher({
     * 	...dataset.build(),
     * 	// additional options here
     * });
     * ```
     *
     * @example
     * ```typescript
     * // With the NfaMatcher:
     * const matcher = new NfaMatcher({
     * 	...dataset.build(),
     * 	// additional options here
     * });
     * ```
     */
    build() {
        return {
            blacklistedTerms: BlacklistedTerm_1.assignIncrementingIds(this.containers.flatMap((p) => p.patterns)),
            whitelistedTerms: this.containers.flatMap((p) => p.whitelistedTerms),
        };
    }
    registerContainer(container) {
        const offset = this.containers.push(container) - 1;
        for (let i = 0, phraseId = this.patternCount; i < container.patterns.length; i++, phraseId++) {
            this.patternIdToPhraseContainer.set(phraseId, offset);
            this.patternCount++;
        }
    }
}
exports.DataSet = DataSet;
/**
 * Builder for phrases.
 */
class PhraseBuilder {
    constructor() {
        this.patterns = [];
        this.whitelistedTerms = [];
    }
    /**
     * Associates a pattern with this phrase.
     *
     * @param pattern - Pattern to add.
     */
    addPattern(pattern) {
        this.patterns.push(pattern);
        return this;
    }
    /**
     * Associates a whitelisted pattern with this phrase.
     *
     * @param term - Whitelisted term to add.
     */
    addWhitelistedTerm(term) {
        this.whitelistedTerms.push(term);
        return this;
    }
    /**
     * Associates some metadata with this phrase.
     *
     * @param metadata - Metadata to use.
     */
    setMetadata(metadata) {
        this.metadata = metadata;
        return this;
    }
    /**
     * Builds the phrase, returning a [[PhraseContainer]] for use with the
     * [[DataSet]].
     */
    build() {
        return {
            patterns: this.patterns,
            whitelistedTerms: this.whitelistedTerms,
            metadata: this.metadata,
        };
    }
}
exports.PhraseBuilder = PhraseBuilder;


/***/ }),

/***/ 8795:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.version = void 0;
__exportStar(__nccwpck_require__(2478), exports);
__exportStar(__nccwpck_require__(3297), exports);
__exportStar(__nccwpck_require__(2537), exports);
__exportStar(__nccwpck_require__(3001), exports);
__exportStar(__nccwpck_require__(6319), exports);
__exportStar(__nccwpck_require__(3531), exports);
__exportStar(__nccwpck_require__(7857), exports);
__exportStar(__nccwpck_require__(312), exports);
__exportStar(__nccwpck_require__(5069), exports);
__exportStar(__nccwpck_require__(3403), exports);
__exportStar(__nccwpck_require__(7148), exports);
__exportStar(__nccwpck_require__(1660), exports);
__exportStar(__nccwpck_require__(5674), exports);
__exportStar(__nccwpck_require__(5859), exports);
__exportStar(__nccwpck_require__(474), exports);
__exportStar(__nccwpck_require__(2633), exports);
__exportStar(__nccwpck_require__(6458), exports);
__exportStar(__nccwpck_require__(6336), exports);
/**
 * The current version of the library, formatted as `MAJOR.MINOR.PATCH`.
 */
exports.version = '0.1.0';


/***/ }),

/***/ 3531:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assignIncrementingIds = void 0;
/**
 * Assigns incrementing IDs to the patterns provided, starting with 0. It is
 * useful if you have a list of patterns to match against but don't care about
 * identifying which pattern matched.
 *
 * @example
 * ```typescript
 * const matcher = new RegExpMatcher({
 *  ...,
 *  blacklistedTerms: assignIncrementingIds([
 *      pattern`f?uck`,
 *      pattern`|shit|`,
 *  ]),
 * });
 * ```
 *
 * @param patterns - List of parsed patterns.
 * @returns A list of blacklisted terms with valid IDs which can then be passed
 * to the [[RegExpMatcher]] or [[NfaMatcher]].
 */
function assignIncrementingIds(patterns) {
    let currentId = 0;
    return patterns.map((pattern) => ({ id: currentId++, pattern }));
}
exports.assignIncrementingIds = assignIncrementingIds;


/***/ }),

/***/ 9071:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IntervalCollection = void 0;
class IntervalCollection {
    constructor() {
        this.dirty = false;
        this.intervals = [];
    }
    insert(lowerBound, upperBound) {
        this.intervals.push([lowerBound, upperBound]);
        this.dirty = true;
    }
    query(lowerBound, upperBound) {
        if (this.intervals.length === 0)
            return false;
        if (this.dirty) {
            this.dirty = false;
            // Sort by lower bound.
            this.intervals.sort(
            /* istanbul ignore next: not possible to write a robust test for this */
            (a, b) => (a[0] < b[0] ? -1 : b[0] < a[0] ? 1 : 0));
        }
        for (const interval of this.intervals) {
            // Since the intervals are sorted by lower bound, if we see an
            // interval with a lower bound greater than the target, we can skip
            // checking all the ones after it as it's impossible that they fully
            // contain the target interval.
            if (interval[0] > lowerBound)
                break;
            if (interval[0] <= lowerBound && upperBound <= interval[1])
                return true;
        }
        return false;
    }
    values() {
        return this.intervals.values();
    }
    [Symbol.iterator]() {
        return this.values();
    }
}
exports.IntervalCollection = IntervalCollection;


/***/ }),

/***/ 7857:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compareMatchByPositionAndId = void 0;
const Interval_1 = __nccwpck_require__(2990);
/**
 * Compares two match payloads.
 *
 * * If the first match payload's start index is less than the second's, `-1` is
 *   returned;
 * * If the second match payload's start index is less than the first's, `1` is
 *   returned;
 * * If the first match payload's end index is less than the second's, `-1` is
 *   returned;
 * * If the second match payload's end index is less than the first's, `1` is
 *   returned;
 * * If the first match payload's term ID is less than the second's, `-1` is
 *   returned;
 * * If the first match payload's term ID is equal to the second's, `0` is
 *   returned;
 * * Otherwise, `1` is returned.
 *
 * @param a - First match payload.
 * @param b - Second match payload.
 * @returns The result of the comparison: -1 if the first should sort lower than
 * the second, 0 if they are the same, and 1 if the second should sort lower
 * than the first.
 */
function compareMatchByPositionAndId(a, b) {
    const result = Interval_1.compareIntervals(a.startIndex, a.endIndex, b.startIndex, b.endIndex);
    if (result !== 0)
        return result;
    return a.termId === b.termId ? 0 : a.termId < b.termId ? -1 : 1;
}
exports.compareMatchByPositionAndId = compareMatchByPositionAndId;


/***/ }),

/***/ 312:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 6319:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NfaMatcher = void 0;
const Nodes_1 = __nccwpck_require__(5069);
const Simplifier_1 = __nccwpck_require__(3596);
const Util_1 = __nccwpck_require__(3025);
const TransformerSet_1 = __nccwpck_require__(1690);
const Char_1 = __nccwpck_require__(8861);
const CharacterIterator_1 = __nccwpck_require__(8460);
const CircularBuffer_1 = __nccwpck_require__(5376);
const Queue_1 = __nccwpck_require__(8844);
const IntervalCollection_1 = __nccwpck_require__(9071);
const MatchPayload_1 = __nccwpck_require__(7857);
const BlacklistTrieNode_1 = __nccwpck_require__(2144);
const WhitelistedTermMatcher_1 = __nccwpck_require__(2712);
/**
 * An implementation of the [[Matcher]] interface using finite automata
 * techniques.
 *
 * It is theoretically faster than the [[RegExpMatcher]]: the `hasMatch()` and
 * `getAllMatches()` execute in time proportional only to that of the length of
 * the input text and the number of matches. In other words, it _theoretically_
 * should not degrade in performance as you add more terms - matching with 100
 * and 1000 patterns should have the same performance. It achieves this by
 * building a heavily modified [Aho-Corasick
 * automaton](https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm) from
 * the input patterns.
 *
 * In practice, its high constant factors make it slower than the
 * [[RegExpMatcher]] until about ~100 patterns, at which point both
 * implementations have approximately the same performance.
 *
 * The regular-expression matcher should be preferred to this one if at all
 * possible, as it uses more memory and is only marginally faster at the scale
 * most users of this package are expected to use it at. However, it may be
 * appropriate if:
 *
 * - You have a large number of patterns (> 100);
 * - You expect to be matching on long text;
 * - You have benchmarked the implementations and found the [[NfaMatcher]] to be
 *   noticeably faster.
 */
class NfaMatcher {
    /**
     * Creates a new [[NfaMatcher]] with the options given.
     *
     * @example
     * ```typescript
     * // Use the options provided by the English preset.
     * const matcher = new NfaMatcher({
     * 	...englishDataset.build(),
     * 	...englishRecommendedTransformers,
     * });
     * ```
     *
     * @example
     * ```typescript
     * // Simple matcher that only has blacklisted patterns.
     * const matcher = new NfaMatcher({
     *  blacklistedTerms: assignIncrementingIds([
     *      pattern`fuck`,
     *      pattern`f?uck`, // wildcards (?)
     *      pattern`bitch`,
     *      pattern`b[i]tch` // optionals ([i] matches either "i" or "")
     *  ]),
     * });
     *
     * // Check whether some string matches any of the patterns.
     * const doesMatch = matcher.hasMatch('fuck you bitch');
     * ```
     *
     * @example
     * ```typescript
     * // A more advanced example, with transformers and whitelisted terms.
     * const matcher = new NfaMatcher({
     *  blacklistedTerms: [
     *      { id: 1, pattern: pattern`penis` },
     *      { id: 2, pattern: pattern`fuck` },
     *  ],
     *  whitelistedTerms: ['pen is'],
     *  blacklistMatcherTransformers: [
     *      resolveConfusablesTransformer(), // '🅰' => 'a'
     *      resolveLeetSpeakTransformer(), // '$' => 's'
     *      foldAsciiCharCaseTransformer(), // case insensitive matching
     * 	    skipNonAlphabeticTransformer(), // 'f.u...c.k' => 'fuck'
     *      collapseDuplicatesTransformer(), // 'aaaa' => 'a'
     *  ],
     * });
     *
     * // Output all matches.
     * console.log(matcher.getAllMatches('fu.....uuuuCK the pen is mightier than the sword!'));
     * ```
     *
     * @param options - Options to use.
     */
    constructor({ blacklistedTerms, whitelistedTerms = [], blacklistMatcherTransformers = [], whitelistMatcherTransformers = [], }) {
        this.rootNode = new BlacklistTrieNode_1.BlacklistTrieNode();
        this.originalIds = []; // originalIds[i] is the term ID of the the pattern with ID i
        this.matchLengths = []; // matchLengths[i] is the match length of the pattern with ID i
        this.partialMatchStepCounts = new Map(); // partialMatchStepCounts[i] is the total number of steps of the pattern with ID i. Only applies to partial matches.
        this.wildcardOnlyPatterns = [];
        // Maximum number of trailing wildcards.
        //
        // x x x ? y y ? ? ? ?
        //             ^^^^^^^
        //        4 trailing wildcards
        this.maxTrailingWildcardCount = 0;
        // Maximum distance between the start of a partial pattern and the end of the partial pattern following it.
        //
        // x x x ? ? ? y y y y
        // 0 1 2 3 4 5 6 7 8 9
        // ^^^^^^^^^^^^^^^^^^^
        //    distance of 10
        //
        // This value is equal to how long we need to keep partial matches around.
        this.maxPartialPatternDistance = 0;
        this.maxMatchLength = 0; // Maximum match length of any pattern, equal to how many indices to the left of the current position we need to track.
        this.currentId = 0; // Current generated pattern ID.
        // Use two iterators: one fast, and one slow. The fast iterator will
        // constantly be |maxTrailingWildcardCount| positions head of the slow
        // iterator.
        this.slowIter = new CharacterIterator_1.CharacterIterator();
        this.fastIter = new CharacterIterator_1.CharacterIterator();
        this.matches = [];
        this.currentNode = this.rootNode;
        this.whitelistedIntervals = new IntervalCollection_1.IntervalCollection();
        this.whitelistedTermMatcher = new WhitelistedTermMatcher_1.WhitelistedTermMatcher({
            terms: whitelistedTerms,
            transformers: whitelistMatcherTransformers,
        });
        this.slowTransformers = new TransformerSet_1.TransformerSet(blacklistMatcherTransformers);
        this.fastTransformers = new TransformerSet_1.TransformerSet(blacklistMatcherTransformers);
        this.ensureNoDuplicateIds(blacklistedTerms);
        this.buildTrie(blacklistedTerms);
        this.constructLinks();
        this.useUnderlyingEdgeCollectionImplementation(this.rootNode);
        // Sort wildcard-only patterns by the number of wildcards they have.
        this.wildcardOnlyPatterns.sort((a, b) => 
        /* istanbul ignore next: not really possible to write a robust test for this */
        a.wildcardCount < b.wildcardCount ? -1 : b.wildcardCount < a.wildcardCount ? 1 : 0);
        this.usedIndices = new CircularBuffer_1.CircularBuffer(this.maxMatchLength);
        this.futureIndices = new CircularBuffer_1.CircularBuffer(this.maxTrailingWildcardCount);
        this.partialMatches = new CircularBuffer_1.CircularBuffer(this.maxPartialPatternDistance);
    }
    hasMatch(input) {
        this.setInput(input);
        const hasMatch = this.run(true);
        return hasMatch;
    }
    getAllMatches(input, sorted = false) {
        this.setInput(input);
        this.run();
        if (sorted)
            this.matches.sort(MatchPayload_1.compareMatchByPositionAndId);
        return this.matches;
    }
    setInput(input) {
        this.slowIter.setInput(input);
        this.fastIter.setInput(input);
        this.whitelistedIntervals = this.whitelistedTermMatcher.getMatches(input);
        this.currentNode = this.rootNode;
        this.slowTransformers.resetAll();
        this.fastTransformers.resetAll();
        this.usedIndices.clear();
        this.futureIndices.clear();
        this.partialMatches.clear();
        this.matches = [];
    }
    run(breakAfterFirstMatch = false) {
        // Fill the future index buffer by advancing the fast iterator forward.
        while (this.futureIndices.length < this.futureIndices.capacity) {
            const char = this.fastIter.next().value;
            if (char === undefined) {
                // Iterator is done.
                this.futureIndices.push(undefined);
            }
            else {
                const transformed = this.fastTransformers.applyTo(char);
                // Only add the position if the character didn't become
                // undefined after transformation.
                if (transformed !== undefined)
                    this.futureIndices.push(this.fastIter.position);
            }
        }
        for (const char of this.slowIter) {
            const transformed = this.slowTransformers.applyTo(char);
            if (transformed === undefined)
                continue;
            // Advance the index window forward.
            // 	1 3 4 5 7 8 9
            // becomes
            // 	3 4 5 7 8 9 10 (if 10 is the current position)
            this.usedIndices.push(this.slowIter.position);
            // Advance the partial matches buffer forward.
            this.partialMatches.push(undefined);
            // Find next usable character for the fast iterator.
            if (this.maxTrailingWildcardCount > 0) {
                let found = false;
                while (!this.fastIter.done && !found) {
                    found = this.fastTransformers.applyTo(this.fastIter.next().value) !== undefined;
                    if (found)
                        this.futureIndices.push(this.fastIter.position);
                }
                if (!found)
                    this.futureIndices.push(undefined);
            }
            // Follow failure links until we find a node that has a transition for the current character.
            while (this.currentNode !== this.rootNode && !this.currentNode.edges.get(transformed)) {
                this.currentNode = this.currentNode.failureLink;
            }
            this.currentNode = this.currentNode.edges.get(transformed) ?? this.rootNode;
            // Emit matches for wildcard-only patterns. Patterns of the form
            // ?^N ('?' repeated N times) always have a match ending at the
            // current index if the number of characters seen is
            // >= N.
            for (const data of this.wildcardOnlyPatterns) {
                if (data.wildcardCount > this.usedIndices.length)
                    break;
                const matchLength = this.matchLengths[data.id];
                const startIndex = this.usedIndices.get(this.usedIndices.length - matchLength);
                const matched = this.emitMatch(data.id, data.flags, startIndex, this.slowIter.position + this.slowIter.lastWidth - 1, matchLength);
                if (matched && breakAfterFirstMatch)
                    return true;
            }
            // Emit matches for the current node, then follow its output links.
            if (this.currentNode.flags & 4 /* MatchLeaf */) {
                const matchLength = this.matchLengths[this.currentNode.termId];
                const startIndex = this.usedIndices.get(this.usedIndices.length - matchLength);
                const matched = this.emitMatch(this.currentNode.termId, this.currentNode.flags, startIndex, this.slowIter.position + this.slowIter.lastWidth - 1, matchLength);
                if (matched && breakAfterFirstMatch)
                    return true;
            }
            if (this.currentNode.flags & 8 /* PartialMatchLeaf */) {
                for (const partialMatch of this.currentNode.partialMatches) {
                    if (this.emitPartialMatch(partialMatch) && breakAfterFirstMatch)
                        return true;
                }
            }
            let outputLink = this.currentNode.outputLink;
            while (outputLink) {
                if (outputLink.flags & 8 /* PartialMatchLeaf */) {
                    for (const partialMatch of outputLink.partialMatches) {
                        if (this.emitPartialMatch(partialMatch) && breakAfterFirstMatch)
                            return true;
                    }
                }
                if (outputLink.flags & 4 /* MatchLeaf */) {
                    const matchLength = this.matchLengths[outputLink.termId];
                    const startIndex = this.usedIndices.get(this.usedIndices.length - matchLength);
                    const matched = this.emitMatch(outputLink.termId, outputLink.flags, startIndex, this.slowIter.position + this.slowIter.lastWidth - 1, matchLength);
                    if (matched && breakAfterFirstMatch)
                        return true;
                }
                outputLink = outputLink.outputLink;
            }
        }
        return this.matches.length > 0;
    }
    emitPartialMatch(data) {
        // ??xxxxx
        // If we have a match for 'xxxxx', the whole pattern matches if the
        // number of characters seen is greater than the number of leading
        // wildcards (in this case 2).
        const hasSufficientCharactersBefore = data.leadingWildcardCount + data.matchLength <= this.usedIndices.length;
        if (!hasSufficientCharactersBefore)
            return false;
        // 	x x ? ? y y y y y
        // 	0 1 2 3 4 5 5 6 7
        //
        // If we have a match for 'yyyyy', the whole pattern matches if we have
        // a match for 'xx' ending 7 characters before (length of 'yyyyy', plus
        // two wildcards, plus one).
        const hasMatchForPreviousStep = 
        // First step has no match before it.
        data.step === 1 ||
            (this.partialMatches
                .get(this.partialMatches.length - data.leadingWildcardCount - data.matchLength - 1)
                ?.has(BlacklistTrieNode_1.hashPartialMatch(data.step - 1, data.termId)) ??
                false);
        if (!hasMatchForPreviousStep)
            return false;
        if (data.step === this.partialMatchStepCounts.get(data.termId)) {
            // Say the pattern is 'xx???yyyyy'.
            // We're currently on 'yyyyy' and we know that the steps before
            // match. We can safely emit a match if there are no trailing
            // wildcards.
            if (data.trailingWildcardCount === 0) {
                const matchLength = this.matchLengths[data.termId];
                const startIndex = this.usedIndices.get(this.usedIndices.length - matchLength);
                return this.emitMatch(data.termId, data.flags, startIndex, this.slowIter.position + this.slowIter.lastWidth - 1, matchLength);
            }
            // Say the pattern is 'xx??yy??'.
            // This pattern matches if there are at least two characters that are
            // usable to the right of the current position.
            let endIndex = this.futureIndices.get(data.trailingWildcardCount - 1);
            if (endIndex === undefined)
                return false;
            // Adjust for surrogate pairs.
            if (
            // not the last character
            endIndex < this.slowIter.input.length - 1 &&
                // character is a high surrogate
                Char_1.isHighSurrogate(this.slowIter.input.charCodeAt(endIndex)) &&
                // next character is a low surrogate
                Char_1.isLowSurrogate(this.slowIter.input.charCodeAt(endIndex + 1))) {
                endIndex++;
            }
            const matchLength = this.matchLengths[data.termId];
            const startIndex = this.usedIndices.get(this.usedIndices.length - matchLength + data.trailingWildcardCount);
            return this.emitMatch(data.termId, data.flags, startIndex, endIndex, matchLength);
        }
        // Otherwise, add a partial match.
        let hashes = this.partialMatches.get(this.partialMatches.length - 1);
        if (!hashes)
            this.partialMatches.set(this.partialMatches.length - 1, (hashes = new Set()));
        hashes.add(BlacklistTrieNode_1.hashPartialMatch(data.step, data.termId));
        return false;
    }
    emitMatch(id, flags, startIndex, endIndex, matchLength) {
        const startBoundaryOk = !(flags & 1 /* RequireWordBoundaryAtStart */) || // doesn't require word boundary at the start
            startIndex === 0 || // first character
            !Char_1.isWordChar(this.slowIter.input.charCodeAt(startIndex - 1)); // character before isn't a word char
        const endBoundaryOk = !(flags & 2 /* RequireWordBoundaryAtEnd */) || // doesn't require word boundary at the end
            endIndex === this.slowIter.input.length - 1 || // last character
            !Char_1.isWordChar(this.slowIter.input.charCodeAt(endIndex + 1)); // character after isn't a word char
        if (!startBoundaryOk || !endBoundaryOk)
            return false;
        const termId = this.originalIds[id];
        if (this.whitelistedIntervals.query(startIndex, endIndex))
            return false;
        this.matches.push({ termId, matchLength, startIndex, endIndex });
        return true;
    }
    ensureNoDuplicateIds(terms) {
        const seen = new Set();
        for (const term of terms) {
            if (seen.has(term.id))
                throw new Error(`Found duplicate blacklisted term ID ${term.id}.`);
            seen.add(term.id);
        }
    }
    buildTrie(patterns) {
        for (const pattern of patterns)
            this.registerTerm(pattern);
    }
    registerTerm(term) {
        if (Util_1.potentiallyMatchesEmptyString(term.pattern)) {
            throw new Error(`Pattern with ID ${term.id} potentially matches empty string; this is unsupported.`);
        }
        const simplifiedPatterns = Simplifier_1.simplify(term.pattern.nodes);
        for (const pattern of simplifiedPatterns) {
            // Each pattern may actually correspond to several simplified
            // patterns, so use an incrementing numerical ID internally.
            const id = this.currentId++;
            this.originalIds.push(term.id);
            if (pattern.every((node) => node.kind === Nodes_1.SyntaxKind.Literal)) {
                this.registerPatternWithOnlyLiterals(id, pattern, term);
            }
            else if (pattern.every((node) => node.kind === Nodes_1.SyntaxKind.Wildcard)) {
                this.registerPatternWithOnlyWildcards(id, pattern, term);
            }
            else {
                this.registerPatternWithWildcardsAndLiterals(id, pattern, term);
            }
        }
    }
    registerPatternWithOnlyLiterals(id, pattern, term) {
        const matchLength = Util_1.computePatternMatchLength(pattern);
        this.matchLengths[id] = matchLength;
        this.maxMatchLength = Math.max(this.maxMatchLength, matchLength);
        const endNode = this.extendTrie(pattern[0].chars);
        endNode.flags |= 4 /* MatchLeaf */;
        endNode.termId = id;
        if (term.pattern.requireWordBoundaryAtStart)
            endNode.flags |= 1 /* RequireWordBoundaryAtStart */;
        if (term.pattern.requireWordBoundaryAtEnd)
            endNode.flags |= 2 /* RequireWordBoundaryAtEnd */;
    }
    registerPatternWithOnlyWildcards(id, pattern, term) {
        const matchLength = Util_1.computePatternMatchLength(pattern);
        this.matchLengths[id] = matchLength;
        this.maxMatchLength = Math.max(this.maxMatchLength, matchLength);
        const data = {
            id: id,
            flags: 0,
            wildcardCount: matchLength,
        };
        if (term.pattern.requireWordBoundaryAtStart)
            data.flags |= 1 /* RequireWordBoundaryAtStart */;
        if (term.pattern.requireWordBoundaryAtEnd)
            data.flags |= 2 /* RequireWordBoundaryAtEnd */;
        this.wildcardOnlyPatterns.push(data);
    }
    registerPatternWithWildcardsAndLiterals(id, pattern, term) {
        const matchLength = Util_1.computePatternMatchLength(pattern);
        this.matchLengths[id] = matchLength;
        this.maxMatchLength = Math.max(this.maxMatchLength, matchLength);
        // If a pattern has a wildcard in addition to at least one literal, we
        // will split the pattern at its wildcards, resulting in a number of
        // partial patterns. For example, given 'l1 w1 l2 w2' where l1, l2 are
        // literals and w1, w2 are wildcards, we would have 2 partial patterns:
        // l1 and l2.
        //
        // We will then assign each partial pattern a step: l1 would be tep 1
        // and l2 step 2. Then, we will extend the trie with l1 and l2. After
        // that is done, we will decorate the leaf nodes at the leaf nodes of
        // each pattern with some additional metadata to indicate that they are
        // the leaf node of a partial match.
        //
        // So how does this help us match wildcards?
        //
        // Let's say that we find the pattern l1 in the text. Since it is the
        // first step, we will hash it and add it to the set of partial matches
        // ending at that position. Now, let's say that we find pattern l2 in
        // the text. We can combine the partial matches l1 and l2 iff l1 was
        // found in the text 1 position before the start position of where l2
        // matched. (1 is the number of wildcards separating l1 and l2 in the
        // original pattern).
        //
        // Since l2 is the last partial pattern, we add it to a stack of pending
        // partial matches. (Note that if there was no wildcard after l2, we
        // could emit it immediately. However, as there are wildcards after l2,
        // we have to wait until we are sure that we have an adequate number of
        // characters to satisfy the required number of wildcards).
        const groups = Util_1.groupByNodeType(pattern);
        let step = 1;
        const startsWithLiteral = groups[0].isLiteralGroup;
        for (let i = startsWithLiteral ? 0 : 1; i < groups.length; i += 2, step++) {
            // Count the number of trailing and leading wildcards
            // before/after the current literal segment.
            const lastLiteralGroupLength = i < 2 ? 0 : groups[i - 2].literals.reduce((a, b) => a + b.chars.length, 0);
            const leadingWildcardCount = i === 0 ? 0 : groups[i - 1].wildcardCount;
            const trailingWildcardCount = i === groups.length - 1 ? 0 : groups[i + 1].wildcardCount;
            // Extend the trie with the characters of the literal.
            const chars = groups[i].literals.flatMap((node) => node.chars);
            const endNode = this.extendTrie(chars);
            // Add some additional metadata to the leaf node.
            const data = {
                step,
                termId: id,
                flags: 0,
                leadingWildcardCount,
                trailingWildcardCount,
                matchLength: chars.length,
            };
            if (term.pattern.requireWordBoundaryAtStart)
                data.flags |= 1 /* RequireWordBoundaryAtStart */;
            if (term.pattern.requireWordBoundaryAtEnd)
                data.flags |= 2 /* RequireWordBoundaryAtEnd */;
            (endNode.partialMatches ?? (endNode.partialMatches = [])).push(data);
            endNode.flags |= 8 /* PartialMatchLeaf */;
            this.maxPartialPatternDistance = Math.max(this.maxPartialPatternDistance, lastLiteralGroupLength + leadingWildcardCount + chars.length);
            if (i >= groups.length - 2) {
                // Last group of literals.
                this.maxTrailingWildcardCount = Math.max(this.maxTrailingWildcardCount, trailingWildcardCount);
            }
        }
        this.partialMatchStepCounts.set(id, step - 1);
    }
    extendTrie(chars) {
        let currentNode = this.rootNode;
        for (const char of chars) {
            const nextNode = currentNode.edges.get(char);
            if (nextNode) {
                currentNode = nextNode;
            }
            else {
                const newNode = new BlacklistTrieNode_1.BlacklistTrieNode();
                currentNode.edges.set(char, newNode);
                currentNode = newNode;
            }
        }
        return currentNode;
    }
    constructLinks() {
        // Compute the failure and output functions for the trie. This
        // implementation is fairly straightforward and is essentially the exact
        // same as that detailed in Aho and Corasick's original paper. Refer to
        // section 3 in said paper for more details.
        this.rootNode.failureLink = this.rootNode;
        const queue = new Queue_1.Queue();
        for (const node of this.rootNode.edges.values()) {
            node.failureLink = this.rootNode;
            queue.push(node);
        }
        while (queue.length > 0) {
            const node = queue.shift();
            for (const [char, childNode] of node.edges) {
                let cur = node.failureLink;
                while (!cur.edges.get(char) && cur !== this.rootNode)
                    cur = cur.failureLink;
                const failureLink = cur.edges.get(char) ?? this.rootNode;
                childNode.failureLink = failureLink;
                queue.push(childNode);
            }
            node.outputLink =
                node.failureLink.flags & 4 /* MatchLeaf */ || node.failureLink.flags & 8 /* PartialMatchLeaf */
                    ? node.failureLink
                    : node.failureLink.outputLink;
        }
    }
    useUnderlyingEdgeCollectionImplementation(node) {
        node.edges = node.edges.underlyingImplementation;
        for (const childNode of node.edges.values())
            this.useUnderlyingEdgeCollectionImplementation(childNode);
    }
}
exports.NfaMatcher = NfaMatcher;


/***/ }),

/***/ 2712:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhitelistedTermMatcher = void 0;
const TransformerSet_1 = __nccwpck_require__(1690);
const CharacterIterator_1 = __nccwpck_require__(8460);
const CircularBuffer_1 = __nccwpck_require__(5376);
const Queue_1 = __nccwpck_require__(8844);
const IntervalCollection_1 = __nccwpck_require__(9071);
const WhitelistTrieNode_1 = __nccwpck_require__(2201);
class WhitelistedTermMatcher {
    constructor({ terms, transformers = [] }) {
        this.rootNode = new WhitelistTrieNode_1.WhitelistTrieNode();
        this.currentId = 0;
        this.matchLengths = new Map(); // term ID -> match length
        this.maxMatchLength = 0;
        this.transformers = new TransformerSet_1.TransformerSet(transformers);
        for (const term of terms)
            this.registerTerm(term);
        this.constructLinks();
        this.useUnderlyingEdgeCollectionImplementation(this.rootNode);
    }
    getMatches(text) {
        if (this.rootNode.edges.size === 0)
            return new IntervalCollection_1.IntervalCollection();
        const usedIndices = new CircularBuffer_1.CircularBuffer(this.maxMatchLength);
        const matches = new IntervalCollection_1.IntervalCollection();
        let currentNode = this.rootNode;
        const iter = new CharacterIterator_1.CharacterIterator(text);
        for (const char of iter) {
            const transformed = this.transformers.applyTo(char);
            if (transformed === undefined)
                continue; // Returning undefined from a transformer skips that character.
            // Mark the current position as one used for matching.
            usedIndices.push(iter.position);
            // Follow failure links until we find a node that has a transition for the current character.
            while (currentNode !== this.rootNode && !currentNode.edges.get(transformed)) {
                currentNode = currentNode.failureLink;
            }
            currentNode = currentNode.edges.get(transformed) ?? this.rootNode;
            // Report matches as needed.
            if (currentNode.isOutputNode) {
                const matchLength = this.matchLengths.get(currentNode.termId);
                const startIndex = usedIndices.get(usedIndices.length - matchLength);
                // Adjust the end index by iter.lastWidth - 1 to account for surrogate pairs.
                matches.insert(startIndex, iter.position + iter.lastWidth - 1);
            }
            let linkedNode = currentNode.outputLink;
            while (linkedNode) {
                const matchLength = this.matchLengths.get(linkedNode.termId);
                const startIndex = usedIndices.get(usedIndices.length - matchLength);
                // Similar.
                matches.insert(startIndex, iter.position + iter.lastWidth - 1);
                linkedNode = linkedNode.outputLink;
            }
        }
        this.transformers.resetAll();
        return matches;
    }
    registerTerm(term) {
        if (term.length === 0)
            throw new Error('Unexpected empty whitelisted term.');
        const id = this.currentId++;
        // Track the match length of this term.
        const chars = [...new CharacterIterator_1.CharacterIterator(term)];
        const matchLength = chars.length;
        this.matchLengths.set(id, matchLength);
        if (matchLength > this.maxMatchLength)
            this.maxMatchLength = matchLength;
        let currentNode = this.rootNode;
        for (const char of chars) {
            const nextNode = currentNode.edges.get(char);
            if (nextNode) {
                currentNode = nextNode;
            }
            else {
                const newNode = new WhitelistTrieNode_1.WhitelistTrieNode();
                currentNode.edges.set(char, newNode);
                currentNode = newNode;
            }
        }
        currentNode.isOutputNode = true;
        currentNode.termId = id;
    }
    constructLinks() {
        // Compute the failure and output functions for the trie. This
        // implementation is fairly straightforward and is essentially the exact
        // same as that detailed in Aho and Corasick's original paper. Refer to
        // section 3 in said paper for more details.
        this.rootNode.failureLink = this.rootNode;
        const queue = new Queue_1.Queue();
        for (const node of this.rootNode.edges.values()) {
            node.failureLink = this.rootNode;
            queue.push(node);
        }
        while (queue.length > 0) {
            const node = queue.shift();
            for (const [char, childNode] of node.edges) {
                let cur = node.failureLink;
                while (!cur.edges.get(char) && cur !== this.rootNode)
                    cur = cur.failureLink;
                childNode.failureLink = cur.edges.get(char) ?? this.rootNode;
                queue.push(childNode);
            }
            node.outputLink = node.failureLink.isOutputNode ? node.failureLink : node.failureLink.outputLink;
        }
    }
    useUnderlyingEdgeCollectionImplementation(node) {
        node.edges = node.edges.underlyingImplementation;
        for (const childNode of node.edges.values())
            this.useUnderlyingEdgeCollectionImplementation(childNode);
    }
}
exports.WhitelistedTermMatcher = WhitelistedTermMatcher;


/***/ }),

/***/ 2144:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashPartialMatch = exports.BlacklistTrieNode = void 0;
const ForwardingEdgeCollection_1 = __nccwpck_require__(6164);
class BlacklistTrieNode {
    constructor() {
        this.edges = new ForwardingEdgeCollection_1.ForwardingEdgeCollection();
        this.termId = -1;
        this.flags = 0;
    }
}
exports.BlacklistTrieNode = BlacklistTrieNode;
function hashPartialMatch(step, termId) {
    return `${step}-${termId}`;
}
exports.hashPartialMatch = hashPartialMatch;


/***/ }),

/***/ 2201:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhitelistTrieNode = void 0;
const ForwardingEdgeCollection_1 = __nccwpck_require__(6164);
class WhitelistTrieNode {
    constructor() {
        this.edges = new ForwardingEdgeCollection_1.ForwardingEdgeCollection();
        this.termId = -1;
        this.isOutputNode = false;
    }
}
exports.WhitelistTrieNode = WhitelistTrieNode;


/***/ }),

/***/ 5809:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArrayEdgeCollection = void 0;
class ArrayEdgeCollection {
    constructor() {
        this.edges = [];
        this.dirty = false;
    }
    set(char, node) {
        // Prefer overwriting an existing edge.
        const index = this.edges.findIndex((edge) => edge[0] === char);
        if (index === -1) {
            this.edges.push([char, node]);
            this.dirty = true;
        }
        else {
            this.edges[index][1] = node;
        }
    }
    get(char) {
        if (this.edges.length <= ArrayEdgeCollection.binarySearchThreshold) {
            for (const edge of this.edges) {
                if (edge[0] === char)
                    return edge[1];
            }
            return;
        }
        if (this.dirty) {
            // Sort by character value.
            this.edges.sort(
            /* istanbul ignore next: not possible to write a robust test for this */
            (a, b) => (a[0] < b[0] ? -1 : b[0] < a[0] ? 1 : 0));
            this.dirty = false;
        }
        let low = 0;
        let high = this.edges.length - 1;
        while (low <= high) {
            const mid = (low + high) >>> 1;
            const edge = this.edges[mid];
            if (edge[0] > char)
                high = mid - 1;
            else if (edge[0] === char)
                return edge[1];
            else
                low = mid + 1;
        }
    }
    get size() {
        return this.edges.length;
    }
    keys() {
        return this.edges.map((edge) => edge[0]).values();
    }
    values() {
        return this.edges.map((edge) => edge[1]).values();
    }
    [Symbol.iterator]() {
        return this.edges.values();
    }
}
exports.ArrayEdgeCollection = ArrayEdgeCollection;
// Crossover point at which binary search becomes faster than a linear
// search. Somewhat arbitrary as benchmarking get() is hard (both linear
// search and binary search execute in less than one-tenth of a millisecond
// at the scale we're looking at) but micro-benchmarks seem to point to 8-12
// being a crossover point.
ArrayEdgeCollection.binarySearchThreshold = 10;


/***/ }),

/***/ 5067:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BucketEdgeCollection = void 0;
class BucketEdgeCollection {
    constructor() {
        this._size = 0;
        this.buckets = new Array(26);
    }
    set(char, node) {
        const k = char - 97 /* LowerA */;
        // Only increment the size if we didn't already have a node corresponding to it.
        if (!this.buckets[k])
            this._size++;
        this.buckets[k] = node;
    }
    get(char) {
        const k = char - 97 /* LowerA */;
        if (k >= 0 && k < 26)
            return this.buckets[k];
    }
    get size() {
        return this._size;
    }
    *keys() {
        for (let i = 0; i < 26; i++) {
            if (this.buckets[i] !== undefined)
                yield i + 97 /* LowerA */;
        }
    }
    *values() {
        for (let i = 0; i < 26; i++) {
            if (this.buckets[i] !== undefined)
                yield this.buckets[i];
        }
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < 26; i++) {
            if (this.buckets[i] !== undefined)
                yield [i + 97 /* LowerA */, this.buckets[i]];
        }
    }
}
exports.BucketEdgeCollection = BucketEdgeCollection;


/***/ }),

/***/ 6164:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForwardingEdgeCollection = void 0;
const Char_1 = __nccwpck_require__(8861);
const ArrayEdgeCollection_1 = __nccwpck_require__(5809);
const BucketEdgeCollection_1 = __nccwpck_require__(5067);
class ForwardingEdgeCollection {
    constructor() {
        this._underlyingImplementation = new ArrayEdgeCollection_1.ArrayEdgeCollection();
        this.implementation = 0 /* Array */;
        this.areKeysAllLowerCase = true;
    }
    set(char, node) {
        this.areKeysAllLowerCase && (this.areKeysAllLowerCase = Char_1.isLowerCase(char));
        if (!this.areKeysAllLowerCase && this.implementation === 1 /* Bucket */) {
            this.useImplementation(this.selectImplementation());
        }
        this._underlyingImplementation.set(char, node);
        this.useImplementation(this.selectImplementation());
    }
    get(char) {
        return this._underlyingImplementation.get(char);
    }
    get size() {
        return this._underlyingImplementation.size;
    }
    keys() {
        return this._underlyingImplementation.keys();
    }
    values() {
        return this._underlyingImplementation.values();
    }
    get underlyingImplementation() {
        return this._underlyingImplementation;
    }
    [Symbol.iterator]() {
        return this._underlyingImplementation[Symbol.iterator]();
    }
    selectImplementation() {
        // These thresholds are all somewhat arbitrary as all implementations
        // execute in less than one-tenth of a millisecond at the scale we're at
        // here. However, micro-benchmarks point to the bucket implementation
        // always being faster when it's applicable (lower-case ASCII
        // characters). As it's not very memory-efficient for small numbers of
        // edges, we use the array implementation if the size is less than 10
        // and the bucket implementation otherwise.
        //
        // When the bucket implementation is not available we choose between the
        // array and map implementation. Both are fairly fast; though the map is
        // fastest, the difference is not noticeable until ~50-60 edges are
        // being stored. Thus, as the array implementation uses less memory, we
        // choose it for medium sized collections and use the map implementation
        // in all other cases.
        if (this.size <= 10)
            return 0 /* Array */;
        if (this.areKeysAllLowerCase)
            return 1 /* Bucket */;
        if (this.size <= 35)
            return 0 /* Array */;
        return 2 /* Map */;
    }
    useImplementation(newImplementation) {
        if (this.implementation === newImplementation)
            return;
        const newCollection = this.instantiateImplementation(newImplementation);
        for (const [k, v] of this._underlyingImplementation)
            newCollection.set(k, v);
        this._underlyingImplementation = newCollection;
        this.implementation = newImplementation;
    }
    instantiateImplementation(implementation) {
        switch (implementation) {
            case 0 /* Array */:
                /* istanbul ignore next: instantiateImplementation() should never be called with Array */
                return new ArrayEdgeCollection_1.ArrayEdgeCollection();
            case 1 /* Bucket */:
                return new BucketEdgeCollection_1.BucketEdgeCollection();
            case 2 /* Map */:
                return new Map();
        }
    }
}
exports.ForwardingEdgeCollection = ForwardingEdgeCollection;


/***/ }),

/***/ 3001:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegExpMatcher = void 0;
const Util_1 = __nccwpck_require__(3025);
const TransformerSet_1 = __nccwpck_require__(1690);
const Char_1 = __nccwpck_require__(8861);
const CharacterIterator_1 = __nccwpck_require__(8460);
const IntervalCollection_1 = __nccwpck_require__(9071);
const MatchPayload_1 = __nccwpck_require__(7857);
/**
 * An implementation of the [[Matcher]] interface using regular expressions and
 * string searching methods.
 *
 * It should be the default choice for users of this package, as though it is
 * theoretically slower than the more complex [[NfaMatcher]], it uses much less
 * memory and is more efficient for low/medium numbers of patterns.
 *
 * Refer to the documentation of the [[NfaMatcher]] class for further discussion
 * on when to choose that implementation over this one.
 */
class RegExpMatcher {
    /**
     * Creates a new [[RegExpMatcher]] with the options given.
     *
     * @example
     * ```typescript
     * // Use the options provided by the English preset.
     * const matcher = new RegExpMatcher({
     * 	...englishDataset.build(),
     * 	...englishRecommendedTransformers,
     * });
     * ```
     *
     * @example
     * ```typescript
     * // Simple matcher that only has blacklisted patterns.
     * const matcher = new RegExpMatcher({
     *  blacklistedTerms: assignIncrementingIds([
     *      pattern`fuck`,
     *      pattern`f?uck`, // wildcards (?)
     *      pattern`bitch`,
     *      pattern`b[i]tch` // optionals ([i] matches either "i" or "")
     *  ]),
     * });
     *
     * // Check whether some string matches any of the patterns.
     * const doesMatch = matcher.hasMatch('fuck you bitch');
     * ```
     *
     * @example
     * ```typescript
     * // A more advanced example, with transformers and whitelisted terms.
     * const matcher = new RegExpMatcher({
     *  blacklistedTerms: [
     *      { id: 1, pattern: pattern`penis` },
     *      { id: 2, pattern: pattern`fuck` },
     *  ],
     *  whitelistedTerms: ['pen is'],
     *  blacklistMatcherTransformers: [
     *      resolveConfusablesTransformer(), // '🅰' => 'a'
     *      resolveLeetSpeakTransformer(), // '$' => 's'
     *      foldAsciiCharCaseTransformer(), // case insensitive matching
     *      skipNonAlphabeticTransformer(), // 'f.u...c.k' => 'fuck'
     *      collapseDuplicatesTransformer(), // 'aaaa' => 'a'
     *  ],
     * });
     *
     * // Output all matches.
     * console.log(matcher.getAllMatches('fu.....uuuuCK the pen is mightier than the sword!'));
     * ```
     *
     * @param options - Options to use.
     */
    constructor({ blacklistedTerms, whitelistedTerms = [], blacklistMatcherTransformers = [], whitelistMatcherTransformers = [], }) {
        this.blacklistedTerms = this.compileTerms(blacklistedTerms);
        this.whitelistedTerms = whitelistedTerms;
        this.blacklistMatcherTransformers = new TransformerSet_1.TransformerSet(blacklistMatcherTransformers);
        this.whitelistMatcherTransformers = new TransformerSet_1.TransformerSet(whitelistMatcherTransformers);
    }
    getAllMatches(input, sorted = false) {
        const whitelistedIntervals = this.getWhitelistedIntervals(input);
        const [indices, transformed] = this.applyTransformers(input, this.blacklistMatcherTransformers);
        const matches = [];
        for (const blacklistedTerm of this.blacklistedTerms) {
            for (const match of transformed.matchAll(blacklistedTerm.regExp)) {
                const matchLength = [...match[0]].length; // spread so we count code points, not code units
                const startIndex = indices[match.index];
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                let endIndex = indices[match.index + matchLength - 1];
                // Adjust the end index if needed.
                if (endIndex < transformed.length - 1 && // not the last character
                    Char_1.isHighSurrogate(transformed.charCodeAt(endIndex)) && // character is a high surrogate
                    Char_1.isLowSurrogate(transformed.charCodeAt(endIndex + 1)) // next character is a low surrogate
                ) {
                    endIndex++;
                }
                if (!whitelistedIntervals.query(startIndex, endIndex)) {
                    matches.push({ termId: blacklistedTerm.id, startIndex, endIndex, matchLength });
                }
            }
        }
        if (sorted)
            matches.sort(MatchPayload_1.compareMatchByPositionAndId);
        return matches;
    }
    hasMatch(input) {
        const whitelistedIntervals = this.getWhitelistedIntervals(input);
        const [indices, transformed] = this.applyTransformers(input, this.blacklistMatcherTransformers);
        for (const blacklistedTerm of this.blacklistedTerms) {
            for (const match of transformed.matchAll(blacklistedTerm.regExp)) {
                const matchLength = [...match[0]].length; // spread so we count code points, not code units
                const startIndex = indices[match.index];
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                let endIndex = indices[match.index + matchLength - 1];
                // Adjust the end index if needed.
                if (endIndex < transformed.length - 1 && // not the last character
                    Char_1.isHighSurrogate(transformed.charCodeAt(endIndex)) && // character is a high surrogate
                    Char_1.isLowSurrogate(transformed.charCodeAt(endIndex + 1)) // next character is a low surrogate
                ) {
                    endIndex++;
                }
                if (!whitelistedIntervals.query(startIndex, endIndex))
                    return true;
            }
        }
        return false;
    }
    getWhitelistedIntervals(input) {
        const matches = new IntervalCollection_1.IntervalCollection();
        const [indices, transformed] = this.applyTransformers(input, this.whitelistMatcherTransformers);
        for (const whitelistedTerm of this.whitelistedTerms) {
            const length = [...whitelistedTerm].length;
            let lastEnd = 0;
            for (let startIndex = transformed.indexOf(whitelistedTerm, lastEnd); startIndex !== -1; startIndex = transformed.indexOf(whitelistedTerm, lastEnd)) {
                let endIndex = indices[startIndex + length - 1];
                // Adjust the end index if needed.
                if (endIndex < transformed.length - 1 && // not the last character
                    Char_1.isHighSurrogate(transformed.charCodeAt(endIndex)) && // character is a high surrogate
                    Char_1.isLowSurrogate(transformed.charCodeAt(endIndex + 1)) // next character is a low surrogate
                ) {
                    endIndex++;
                }
                matches.insert(indices[startIndex], endIndex);
                lastEnd = endIndex + 1;
            }
        }
        return matches;
    }
    applyTransformers(input, transformers) {
        const indices = [];
        let transformed = '';
        const iter = new CharacterIterator_1.CharacterIterator(input);
        for (const char of iter) {
            const transformedChar = transformers.applyTo(char);
            if (transformedChar !== undefined) {
                indices.push(iter.position);
                transformed += String.fromCodePoint(transformedChar);
            }
        }
        transformers.resetAll();
        return [indices, transformed];
    }
    compileTerms(terms) {
        const compiled = [];
        const seenIds = new Set();
        for (const term of terms) {
            if (seenIds.has(term.id))
                throw new Error(`Duplicate blacklisted term ID ${term.id}.`);
            if (Util_1.potentiallyMatchesEmptyString(term.pattern)) {
                throw new Error(`Pattern with ID ${term.id} potentially matches empty string; this is unsupported.`);
            }
            compiled.push({
                id: term.id,
                regExp: Util_1.compilePatternToRegExp(term.pattern),
            });
            seenIds.add(term.id);
        }
        return compiled;
    }
}
exports.RegExpMatcher = RegExpMatcher;


/***/ }),

/***/ 5069:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyntaxKind = void 0;
/**
 * An enumeration of the kinds of nodes there are.
 */
var SyntaxKind;
(function (SyntaxKind) {
    SyntaxKind[SyntaxKind["Optional"] = 0] = "Optional";
    SyntaxKind[SyntaxKind["Wildcard"] = 1] = "Wildcard";
    SyntaxKind[SyntaxKind["Literal"] = 2] = "Literal";
    SyntaxKind[SyntaxKind["BoundaryAssertion"] = 3] = "BoundaryAssertion";
})(SyntaxKind = exports.SyntaxKind || (exports.SyntaxKind = {}));


/***/ }),

/***/ 6966:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parser = void 0;
const Char_1 = __nccwpck_require__(8861);
const CharacterIterator_1 = __nccwpck_require__(8460);
const Nodes_1 = __nccwpck_require__(5069);
const ParserError_1 = __nccwpck_require__(3403);
const supportsEscaping = [
    92 /* Backslash */,
    91 /* LeftSquareBracket */,
    93 /* RightSquareBracket */,
    63 /* QuestionMark */,
    124 /* VerticalBar */,
];
const supportsEscapingList = supportsEscaping.map((char) => `'${String.fromCodePoint(char)}'`).join(', ');
const eof = -1;
class Parser {
    constructor() {
        this.input = '';
        this.line = 1;
        this.column = 1;
        this.position = 0;
        this.lastColumn = 1;
        this.lastWidth = 0;
    }
    parse(input) {
        this.setInput(input);
        const nodes = [];
        const firstNode = this.nextNode();
        const requireWordBoundaryAtStart = firstNode?.kind === Nodes_1.SyntaxKind.BoundaryAssertion;
        if (firstNode && !requireWordBoundaryAtStart)
            nodes.push(firstNode);
        let requireWordBoundaryAtEnd = false;
        while (!this.done) {
            const pos = this.mark();
            const node = this.nextNode();
            if (node.kind !== Nodes_1.SyntaxKind.BoundaryAssertion) {
                nodes.push(node);
                continue;
            }
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!this.done) {
                this.reportError('Boundary assertions are not supported in this position; they are only allowed at the start / end of the pattern.', pos);
            }
            requireWordBoundaryAtEnd = true;
        }
        return { requireWordBoundaryAtStart, requireWordBoundaryAtEnd, nodes };
    }
    setInput(input) {
        this.input = input;
        this.line = 1;
        this.column = 1;
        this.position = 0;
        this.lastColumn = 1;
        this.lastWidth = 0;
        return this;
    }
    nextNode() {
        switch (this.peek()) {
            case eof:
                return undefined;
            case 91 /* LeftSquareBracket */:
                return this.parseOptional();
            case 93 /* RightSquareBracket */:
                this.reportError(`Unexpected ']' with no corresponding '['.`);
            case 63 /* QuestionMark */:
                return this.parseWildcard();
            case 124 /* VerticalBar */:
                return this.parseBoundaryAssertion();
            default:
                return this.parseLiteral();
        }
    }
    get done() {
        return this.position >= this.input.length;
    }
    // Optional ::= '[' Wildcard | Text ']'
    parseOptional() {
        const preOpenBracketPos = this.mark();
        this.next(); // '['
        const postOpenBracketPos = this.mark();
        if (this.done)
            this.reportError("Unexpected unclosed '['.", preOpenBracketPos);
        if (this.accept('['))
            this.reportError('Unexpected nested optional node.', postOpenBracketPos);
        const childNode = this.nextNode();
        if (childNode.kind === Nodes_1.SyntaxKind.BoundaryAssertion) {
            this.reportError('Boundary assertions are not supported in this position; they are only allowed at the start / end of the pattern.', postOpenBracketPos);
        }
        if (!this.accept(']'))
            this.reportError("Unexpected unclosed '['.");
        return { kind: Nodes_1.SyntaxKind.Optional, childNode: childNode };
    }
    // Wildcard ::= '?'
    parseWildcard() {
        this.next(); // '?'
        return { kind: Nodes_1.SyntaxKind.Wildcard };
    }
    // BoundaryAssertion ::= '|'
    parseBoundaryAssertion() {
        this.next(); // '|'
        return { kind: Nodes_1.SyntaxKind.BoundaryAssertion };
    }
    // Literal              ::= (NON_SPECIAL | '\' SUPPORTS_ESCAPING)+
    // NON_SPECIAL         ::= _any character other than '\', '?', '[', ']', or '|'_
    // SUPPORTS_ESCAPING   ::= '\' | '[' | ']' | '?' | '|'
    parseLiteral() {
        const chars = [];
        while (!this.done) {
            if (this.accept('[]?|')) {
                this.backup();
                break;
            }
            const next = this.next();
            if (next === 92 /* Backslash */) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (this.done) {
                    this.backup();
                    this.reportError('Unexpected trailing backslash.');
                }
                // Can we escape the next character?
                const escaped = this.next();
                if (!supportsEscaping.includes(escaped)) {
                    const repr = String.fromCodePoint(escaped);
                    this.backup();
                    this.reportError(`Cannot escape character '${repr}'; the only characters that can be escaped are the following: ${supportsEscapingList}.`);
                }
                chars.push(escaped);
            }
            else {
                chars.push(next);
            }
        }
        return { kind: Nodes_1.SyntaxKind.Literal, chars: chars };
    }
    reportError(message, { line = this.line, column = this.column } = {}) {
        throw new ParserError_1.ParserError(message, line, column);
    }
    // Marks the current position.
    mark() {
        return { line: this.line, column: this.column };
    }
    // Accepts any code point in the charset provided. Iff accepted, the character is consumed.
    accept(charset) {
        const next = this.next();
        const iter = new CharacterIterator_1.CharacterIterator(charset);
        for (const char of iter) {
            if (char === next)
                return true;
        }
        this.backup();
        return false;
    }
    // Reads one code point from the input, without consuming it.
    peek() {
        const next = this.next();
        this.backup();
        return next;
    }
    // Consumes one code point from the input.
    next() {
        if (this.done)
            return eof;
        const char = this.input.charCodeAt(this.position++);
        this.lastWidth = 1;
        if (char === 10 /* Newline */) {
            this.lastColumn = this.column;
            this.column = 1;
            this.line++;
            return char;
        }
        this.lastColumn = this.column++;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!Char_1.isHighSurrogate(char) || this.done)
            return char;
        // Do we have a surrogate pair?
        const next = this.input.charCodeAt(this.position);
        if (Char_1.isLowSurrogate(next)) {
            this.position++;
            this.lastWidth++;
            return Char_1.convertSurrogatePairToCodePoint(char, next);
        }
        return char;
    }
    // Steps back one character; can only be called once per call to next().
    backup() {
        this.position -= this.lastWidth;
        this.column = this.lastColumn;
        // Adjust line count if needed.
        if (this.lastWidth === 1 && this.input.charCodeAt(this.position) === 10 /* Newline */) {
            this.line--;
        }
    }
}
exports.Parser = Parser;


/***/ }),

/***/ 3403:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParserError = void 0;
/**
 * Custom error thrown by the parser when syntactical errors are detected.
 */
class ParserError extends Error {
    constructor(message, line, column) {
        super(`${line}:${column}: ${message}`);
        this.name = 'ParserError';
        this.line = line;
        this.column = column;
    }
}
exports.ParserError = ParserError;


/***/ }),

/***/ 7148:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseRawPattern = exports.pattern = void 0;
const Parser_1 = __nccwpck_require__(6966);
const parser = new Parser_1.Parser();
/**
 * Parses a pattern, which matches a set of strings; see the `Syntax` section
 * for details. This function is intended to be called as a [template
 * tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates).
 *
 * **Syntax**
 *
 * Generally speaking, in patterns, characters are interpreted literally. That
 * is, they match exactly what they are: `a` matches an `a`, `b` matches a `b`,
 * `;` matches a `;`, and so on.
 *
 * However, there are several constructs that have special meaning:
 *
 * - `[expr]` matches either the empty string or `expr` (an **optional
 *   expression**). `expr` may be a sequence of literal characters or a wildcard
 *   (see below).
 * - `?` matches any character (a **wildcard**).
 * - A `|` at the start or end of the pattern asserts position at a word
 *   boundary (a **word boundary assertion**). If `|` is at the start, it
 *   ensures that the match either starts at the start of the string or a non-
 *   word character preceding it; if it is at the end, it ensures that the match
 *   either ends at the end of the string or a non-word character follows it.
 *
 *   A word character is an lower-case or upper-case ASCII alphabet character or
 *   an ASCII digit.
 * - In a literal, a backslash may be used to **escape** one of the
 *   meta-characters mentioned above so that it does match literally: `\\[`
 *   matches `[`, and does not mark the start of an optional expression.
 *
 *   **Note about escapes**
 *
 *   As this function operates on raw strings, double-escaping backslashes is
 *   not necessary:
 *
 *   ```typescript
 *   // Use this:
 *   const parsed = pattern`hello \[`;
 *   // Don't use this:
 *   const parsed = pattern`hello \\[`;
 *   ```
 *
 * **Examples**
 *
 * - `baz` matches `baz` exactly.
 *
 * - `b\[ar` matches `b[ar` exactly.
 *
 * - `d?ude` matches `d`, then any character, then `ude`. All of the following
 *   strings are matched by this pattern:
 *   - `dyude`
 *   - `d;ude`
 *   - `d!ude`
 *
 * - `h[?]ello` matches either `h`, any character, then `ello` or the literal
 *   string `hello`. The set of strings it matches is equal to the union of the
 *   set of strings that the two patterns `hello` and `h?ello` match. All of the
 *   following strings are matched by this pattern:
 *   - `hello`
 *   - `h!ello`
 *   - `h;ello`
 *
 * - `|foobar|` asserts position at a word boundary, matches the literal string
 *   `foobar`, and asserts position at a word boundary:
 *   - `foobar` matches, as the start and end of string count as word
 *     boundaries;
 *   - `yofoobar` does _not_ match, as `f` is immediately preceded by a word
 *     character;
 *   - `hello foobar bye` matches, as `f` is immediately preceded by a non-word
 *     character, and `r` is immediately followed by a non-word character.
 *
 * **Grammar**
 *
 * ```
 * Pattern  ::= '['? Atom* ']'?
 * Atom     ::= Literal | Wildcard | Optional
 * Optional ::= '[' Literal | Wildcard ']'
 * Literal  ::= (NON_SPECIAL | '\' SUPPORTS_ESCAPING)+
 *
 * NON_SPECIAL       ::= _any character other than '\', '?', '[', ']', or '|'_
 * SUPPORTS_ESCAPING ::= '\' | '[' | ']' | '?' | '|'
 * ```
 *
 * @example
 * ```typescript
 * const parsed = pattern`hello?`; // match "hello", then any character
 * ```
 *
 * @example
 * ```typescript
 * const parsed = pattern`w[o]rld`; // match "wrld" or "world"
 * ```
 *
 * @example
 * ```typescript
 * const parsed = pattern`my initials are \[??\]`; // match "my initials are [", then any two characters, then a "]"
 * ```
 *
 * @returns The parsed pattern, which can then be used with the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 * @throws [[ParserError]] if a syntactical error was detected while parsing the
 * pattern.
 * @see [[parseRawPattern]] if you want to parse a string into a pattern without
 * using a template tag.
 */
function pattern(strings, ...expressions) {
    let result = strings.raw[0];
    for (let i = 0; i < expressions.length; i++) {
        result += expressions[i];
        result += strings.raw[i + 1];
    }
    return parser.parse(result);
}
exports.pattern = pattern;
/**
 * Parses a string as a pattern directly.
 *
 * **Note**
 *
 * It is recommended to use the [[pattern | pattern template tag]] instead of
 * this function for literal patterns (i.e. ones without dynamic content).
 *
 * @param pattern - The string to parse.
 * @throws [[ParserError]] if a syntactical error was detected while parsing the
 * pattern.
 * @returns The parsed pattern, which can then be used with the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 */
function parseRawPattern(pattern) {
    return parser.parse(pattern);
}
exports.parseRawPattern = parseRawPattern;


/***/ }),

/***/ 3596:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.simplify = void 0;
const Nodes_1 = __nccwpck_require__(5069);
// Returns a list of patterns using simple constructs that match the same set of strings
// as the original pattern.
function simplify(nodes) {
    const result = [[]];
    for (const node of nodes) {
        if (node.kind === Nodes_1.SyntaxKind.Optional) {
            // Given the pattern [p1, p2, p3, ..., pm] where p1, p2, p3, etc., are
            // wildcard / literal nodes and pm is an optional node, we can
            // simplify it to two patterns (one where the optional node exists,
            // and one where it does not):
            // 	[p1, p2, p3, ..., pm-1], [p1, p2, p3, ..., pm]
            //
            // If there are multiple optional nodes, the idea is the same; we
            // "fork" the pattern whenever we find an optional node and
            // continue doing so until all nodes have been handled.
            //
            // N.B.: This technique results in the number of simplified patterns
            // growing exponentially, as having two possibilities at each
            // optional node results in 2^n patterns where n is the number of
            // optional nodes. However, in practice, this is unlikely to be an
            // issue.
            const mark = result.length;
            for (let i = 0; i < mark; i++) {
                const pre = result[i];
                result.push([...pre, node.childNode]);
            }
        }
        else {
            for (const nodes of result)
                nodes.push(node);
        }
    }
    return result.map(mergeLiteralNodeRuns);
}
exports.simplify = simplify;
function mergeLiteralNodeRuns(nodes) {
    const merged = [];
    let i = 0;
    while (i < nodes.length) {
        const node = nodes[i++];
        if (node.kind !== Nodes_1.SyntaxKind.Literal) {
            merged.push(node);
            continue;
        }
        // Find all literal nodes right after the current one, and merge their content.
        const chars = [...node.chars];
        while (i < nodes.length && nodes[i].kind === Nodes_1.SyntaxKind.Literal) {
            chars.push(...nodes[i++].chars);
        }
        merged.push({ kind: Nodes_1.SyntaxKind.Literal, chars: chars });
    }
    return merged;
}


/***/ }),

/***/ 3025:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.groupByNodeType = exports.computePatternMatchLength = exports.getRegExpStringForNode = exports.compilePatternToRegExp = exports.potentiallyMatchesEmptyString = void 0;
const Nodes_1 = __nccwpck_require__(5069);
function potentiallyMatchesEmptyString(pattern) {
    return pattern.nodes.every((node) => node.kind === Nodes_1.SyntaxKind.Optional);
}
exports.potentiallyMatchesEmptyString = potentiallyMatchesEmptyString;
function compilePatternToRegExp(pattern) {
    let regExpStr = '';
    if (pattern.requireWordBoundaryAtStart)
        regExpStr += '\\b';
    for (const node of pattern.nodes)
        regExpStr += getRegExpStringForNode(node);
    if (pattern.requireWordBoundaryAtEnd)
        regExpStr += `\\b`;
    return new RegExp(regExpStr, 'gs');
}
exports.compilePatternToRegExp = compilePatternToRegExp;
const regExpSpecialChars = ['[', '.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', '\\', ']'].map((str) => str.charCodeAt(0));
function getRegExpStringForNode(node) {
    switch (node.kind) {
        case Nodes_1.SyntaxKind.Literal: {
            let str = '';
            for (const char of node.chars) {
                if (regExpSpecialChars.includes(char))
                    str += '\\';
                str += String.fromCodePoint(char);
            }
            return str;
        }
        case Nodes_1.SyntaxKind.Optional:
            return `(?:${getRegExpStringForNode(node.childNode)})?`;
        case Nodes_1.SyntaxKind.Wildcard:
            return `.`;
    }
}
exports.getRegExpStringForNode = getRegExpStringForNode;
function computePatternMatchLength(nodes) {
    return nodes.reduce((total, node) => total + (node.kind === Nodes_1.SyntaxKind.Wildcard ? 1 : node.chars.length), 0);
}
exports.computePatternMatchLength = computePatternMatchLength;
function groupByNodeType(nodes) {
    let i = 0;
    const groups = [];
    while (i < nodes.length) {
        const node = nodes[i];
        if (node.kind === Nodes_1.SyntaxKind.Literal) {
            const literals = [];
            while (i < nodes.length && nodes[i].kind === Nodes_1.SyntaxKind.Literal)
                literals.push(nodes[i++]);
            groups.push({ literals, isLiteralGroup: true });
        }
        else {
            const mark = i;
            while (i < nodes.length && nodes[i].kind === Nodes_1.SyntaxKind.Wildcard)
                i++;
            groups.push({ wildcardCount: i - mark, isLiteralGroup: false });
        }
    }
    return groups;
}
exports.groupByNodeType = groupByNodeType;


/***/ }),

/***/ 1660:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.englishDataset = exports.englishRecommendedTransformers = exports.englishRecommendedWhitelistMatcherTransformers = exports.englishRecommendedBlacklistMatcherTransformers = void 0;
const DataSet_1 = __nccwpck_require__(2537);
const Pattern_1 = __nccwpck_require__(7148);
const collapse_duplicates_1 = __nccwpck_require__(5674);
const resolve_confusables_1 = __nccwpck_require__(474);
const resolve_leetspeak_1 = __nccwpck_require__(2633);
const skip_non_alphabetic_1 = __nccwpck_require__(6458);
const to_ascii_lowercase_1 = __nccwpck_require__(6336);
/**
 * A set of transformers to be used when matching blacklisted patterns with the
 * [[englishDataset | english word dataset]].
 */
exports.englishRecommendedBlacklistMatcherTransformers = [
    resolve_confusables_1.resolveConfusablesTransformer(),
    resolve_leetspeak_1.resolveLeetSpeakTransformer(),
    to_ascii_lowercase_1.toAsciiLowerCaseTransformer(),
    skip_non_alphabetic_1.skipNonAlphabeticTransformer(),
    collapse_duplicates_1.collapseDuplicatesTransformer({
        defaultThreshold: 1,
        customThresholds: new Map([
            ['b', 2],
            ['e', 2],
            ['o', 2],
            ['l', 2],
            ['s', 2],
            ['g', 2], // ni_gg_er
        ]),
    }),
];
/**
 * A set of transformers to be used when matching whitelisted terms with the
 * [[englishDataset | english word dataset]].
 */
exports.englishRecommendedWhitelistMatcherTransformers = [
    to_ascii_lowercase_1.toAsciiLowerCaseTransformer(),
    collapse_duplicates_1.collapseDuplicatesTransformer({
        defaultThreshold: Infinity,
        customThresholds: new Map([[' ', 1]]), // collapse spaces
    }),
];
/**
 * Recommended transformers to be used with the [[englishDataset | english word
 * dataset]] and the [[RegExpMatcher]] or the [[NfaMatcher]].
 */
exports.englishRecommendedTransformers = {
    blacklistMatcherTransformers: exports.englishRecommendedBlacklistMatcherTransformers,
    whitelistMatcherTransformers: exports.englishRecommendedWhitelistMatcherTransformers,
};
/**
 * A dataset of profane English words.
 *
 * @example
 * ```typescript
 * const matcher = new RegExpMatcher({
 * 	...englishDataset.build(),
 * 	...englishRecommendedTransformers,
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Extending the data-set by adding a new word and removing an existing one.
 * const myDataset = new DataSet()
 * 	.addAll(englishDataset)
 * 	.removePhrasesIf((phrase) => phrase.metadata.originalWord === 'vagina')
 * 	.addPhrase((phrase) => phrase.addPattern(pattern`|balls|`));
 * ```
 *
 * @copyright
 * The words are taken from the [cuss](https://github.com/words/cuss) project,
 * with some modifications.
 *
 * ```text
 * (The MIT License)
 *
 * Copyright (c) 2016 Titus Wormer <tituswormer@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
exports.englishDataset = new DataSet_1.DataSet()
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'abbo' })
    .addPattern(Pattern_1.pattern `abbo`)
    .addWhitelistedTerm('abbot'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'abeed' }).addPattern(Pattern_1.pattern `ab[b]eed`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'africoon' }).addPattern(Pattern_1.pattern `africoon`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'anal' })
    .addPattern(Pattern_1.pattern `|anal`)
    .addWhitelistedTerm('analabos')
    .addWhitelistedTerm('analagous')
    .addWhitelistedTerm('analav')
    .addWhitelistedTerm('analy')
    .addWhitelistedTerm('analog')
    .addWhitelistedTerm('an al')
    .addPattern(Pattern_1.pattern `danal`)
    .addPattern(Pattern_1.pattern `eanal`)
    .addPattern(Pattern_1.pattern `fanal`)
    .addWhitelistedTerm('fan al')
    .addPattern(Pattern_1.pattern `ganal`)
    .addWhitelistedTerm('gan al')
    .addPattern(Pattern_1.pattern `ianal`)
    .addWhitelistedTerm('ian al')
    .addPattern(Pattern_1.pattern `janal`)
    .addWhitelistedTerm('trojan al')
    .addPattern(Pattern_1.pattern `kanal`)
    .addPattern(Pattern_1.pattern `lanal`)
    .addWhitelistedTerm('lan al')
    .addPattern(Pattern_1.pattern `lanal`)
    .addWhitelistedTerm('lan al')
    .addPattern(Pattern_1.pattern `oanal|`)
    .addPattern(Pattern_1.pattern `panal`)
    .addWhitelistedTerm('pan al')
    .addPattern(Pattern_1.pattern `qanal`)
    .addPattern(Pattern_1.pattern `ranal`)
    .addPattern(Pattern_1.pattern `sanal`)
    .addPattern(Pattern_1.pattern `tanal`)
    .addWhitelistedTerm('tan al')
    .addPattern(Pattern_1.pattern `uanal`)
    .addWhitelistedTerm('uan al')
    .addPattern(Pattern_1.pattern `vanal`)
    .addWhitelistedTerm('van al')
    .addPattern(Pattern_1.pattern `wanal`)
    .addPattern(Pattern_1.pattern `xanal`)
    .addWhitelistedTerm('texan al')
    .addPattern(Pattern_1.pattern `yanal`)
    .addPattern(Pattern_1.pattern `zanal`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'anus' })
    .addPattern(Pattern_1.pattern `anus`)
    .addWhitelistedTerm('an us')
    .addWhitelistedTerm('tetanus')
    .addWhitelistedTerm('uranus')
    .addWhitelistedTerm('janus')
    .addWhitelistedTerm('manus'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'arabush' }).addPattern(Pattern_1.pattern `arab[b]ush`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'arse' })
    .addPattern(Pattern_1.pattern `|ars[s]e`)
    .addWhitelistedTerm('arsen'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'ass' })
    .addPattern(Pattern_1.pattern `|ass`)
    .addWhitelistedTerm('assa')
    .addWhitelistedTerm('assem')
    .addWhitelistedTerm('assen')
    .addWhitelistedTerm('asser')
    .addWhitelistedTerm('asset')
    .addWhitelistedTerm('assev')
    .addWhitelistedTerm('assi')
    .addWhitelistedTerm('assoc')
    .addWhitelistedTerm('assoi')
    .addWhitelistedTerm('assu'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'bestiality' }).addPattern(Pattern_1.pattern `be[e]s[s]tial`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'bastard' }).addPattern(Pattern_1.pattern `bas[s]tard`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'boob' }).addPattern(Pattern_1.pattern `boob`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'boonga' })
    .addPattern(Pattern_1.pattern `boonga`)
    .addWhitelistedTerm('baboon ga'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'bitch' })
    .addPattern(Pattern_1.pattern `bitch`)
    .addPattern(Pattern_1.pattern `bich|`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'blowjob' }).addPattern(Pattern_1.pattern `b[b]l[l][o]wj[o]b`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'chingchong' }).addPattern(Pattern_1.pattern `chingchong`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'chink' })
    .addPattern(Pattern_1.pattern `chink`)
    .addWhitelistedTerm('chin k'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'cock' })
    .addPattern(Pattern_1.pattern `|cock|`)
    .addPattern(Pattern_1.pattern `|cocks`)
    .addPattern(Pattern_1.pattern `|cockp`)
    .addPattern(Pattern_1.pattern `|cocke[e]|`)
    .addWhitelistedTerm('cockney'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'cum' })
    .addPattern(Pattern_1.pattern `|cum`)
    .addWhitelistedTerm('cumu')
    .addWhitelistedTerm('cumb'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'cunt' }).addPattern(Pattern_1.pattern `|cunt`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'deepthroat' })
    .addPattern(Pattern_1.pattern `deepthro[o]at`)
    .addPattern(Pattern_1.pattern `deepthro[o]t`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'dick' })
    .addPattern(Pattern_1.pattern `d?ck|`)
    .addPattern(Pattern_1.pattern `d?cke[e]s|`)
    .addPattern(Pattern_1.pattern `d?cks|`)
    .addPattern(Pattern_1.pattern `|dck|`)
    .addPattern(Pattern_1.pattern `dick`)
    .addWhitelistedTerm('benedick')
    .addWhitelistedTerm('dickens'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'doggystyle' }).addPattern(Pattern_1.pattern `d[o]g[g]ys[s]t[y]l[l]`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'ejaculate' })
    .addPattern(Pattern_1.pattern `e[e]jacul`)
    .addPattern(Pattern_1.pattern `e[e]jakul`)
    .addPattern(Pattern_1.pattern `e[e]acul[l]ate`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'fag' })
    .addPattern(Pattern_1.pattern `|fag`)
    .addPattern(Pattern_1.pattern `fggot`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'fellatio' }).addPattern(Pattern_1.pattern `f[e][e]llat`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'felch' }).addPattern(Pattern_1.pattern `fe[e]l[l]ch`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'fisting' }).addPattern(Pattern_1.pattern `fistin`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'fuck' })
    .addPattern(Pattern_1.pattern `f[?]ck`)
    .addPattern(Pattern_1.pattern `|fk`)
    .addPattern(Pattern_1.pattern `|fu|`)
    .addPattern(Pattern_1.pattern `|fuk`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'gangbang' }).addPattern(Pattern_1.pattern `g[?]ngbang`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'handjob' }).addPattern(Pattern_1.pattern `h[?]ndjob`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'jizz' }).addPattern(Pattern_1.pattern `jizz`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'lubejob' }).addPattern(Pattern_1.pattern `lubejob`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'masturbate' })
    .addPattern(Pattern_1.pattern `m[?]sturbate`)
    .addPattern(Pattern_1.pattern `masterbate`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'nigger' })
    .addPattern(Pattern_1.pattern `n[i]gger`)
    .addPattern(Pattern_1.pattern `n[i]gga`)
    .addPattern(Pattern_1.pattern `|nig|`)
    .addPattern(Pattern_1.pattern `|nigs|`)
    .addPattern(Pattern_1.pattern `?igge`)
    .addWhitelistedTerm('bigge')
    .addWhitelistedTerm('digge')
    .addWhitelistedTerm('rigge')
    .addWhitelistedTerm('snigger'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'orgasm' })
    .addPattern(Pattern_1.pattern `[or]gasm`)
    .addWhitelistedTerm('gasma'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'orgy' })
    .addPattern(Pattern_1.pattern `orgy`)
    .addPattern(Pattern_1.pattern `orgies`)
    .addWhitelistedTerm('porgy'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'porn' })
    .addPattern(Pattern_1.pattern `|prn|`)
    .addPattern(Pattern_1.pattern `porn`)
    .addWhitelistedTerm('p orna'))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'hentai' }).addPattern(Pattern_1.pattern `h[e][e]ntai`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'pussy' }).addPattern(Pattern_1.pattern `p[u]ssy`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'vagina' })
    .addPattern(Pattern_1.pattern `vagina`)
    .addPattern(Pattern_1.pattern `|v[?]gina`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'penis' })
    .addPattern(Pattern_1.pattern `pe[e]nis`)
    .addPattern(Pattern_1.pattern `|pnis`)
    .addWhitelistedTerm('pen is'))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'rape' })
    .addPattern(Pattern_1.pattern `|rape`)
    .addPattern(Pattern_1.pattern `|rapis[s]t`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'retard' }).addPattern(Pattern_1.pattern `retard`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'scat' }).addPattern(Pattern_1.pattern `|s[s]cat|`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'slut' }).addPattern(Pattern_1.pattern `s[s]lut`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'semen' }).addPattern(Pattern_1.pattern `|s[s]e[e]me[e]n`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'sex' })
    .addPattern(Pattern_1.pattern `|s[s]e[e]x|`)
    .addPattern(Pattern_1.pattern `|s[s]e[e]xy|`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'tit' })
    .addPattern(Pattern_1.pattern `|tit|`)
    .addPattern(Pattern_1.pattern `|tits|`)
    .addPattern(Pattern_1.pattern `|titt`)
    .addPattern(Pattern_1.pattern `|tiddies`)
    .addPattern(Pattern_1.pattern `|tities`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'whore' })
    .addPattern(Pattern_1.pattern `|wh[o]re|`)
    .addPattern(Pattern_1.pattern `|who[o]res[s]|`)
    .addWhitelistedTerm("who're"))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'dildo' }).addPattern(Pattern_1.pattern `dildo`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'double penetration' }).addPattern(Pattern_1.pattern `double penetra`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'finger bang' }).addPattern(Pattern_1.pattern `fingerbang`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'hooker' }).addPattern(Pattern_1.pattern `hooker`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'jerk off' }).addPattern(Pattern_1.pattern `jerkoff`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'incest' }).addPattern(Pattern_1.pattern `incest`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'tranny' }).addPattern(Pattern_1.pattern `tranny`))
    .addPhrase((phrase) => phrase.setMetadata({ originalWord: 'buttplug' }).addPattern(Pattern_1.pattern `buttplug`))
    .addPhrase((phrase) => phrase
    .setMetadata({ originalWord: 'cuck' })
    .addPattern(Pattern_1.pattern `cuck`)
    .addWhitelistedTerm('cuckoo'));


/***/ }),

/***/ 1690:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformerSet = void 0;
class TransformerSet {
    constructor(transformers) {
        this.transformers = transformers;
        this.statefulTransformers = new Array(this.transformers.length);
        for (let i = 0; i < this.transformers.length; i++) {
            const transformer = this.transformers[i];
            if (transformer.type === 1 /* Stateful */) {
                this.statefulTransformers[i] = transformer.factory();
            }
        }
    }
    applyTo(char) {
        let transformed = char;
        for (let i = 0; i < this.transformers.length && transformed !== undefined; i++) {
            const transformer = this.transformers[i];
            if (transformer.type === 0 /* Simple */)
                transformed = transformer.transform(transformed);
            else
                transformed = this.statefulTransformers[i].transform(transformed);
        }
        return transformed;
    }
    resetAll() {
        for (let i = 0; i < this.transformers.length; i++) {
            if (this.transformers[i].type === 1 /* Stateful */) {
                this.statefulTransformers[i].reset();
            }
        }
    }
}
exports.TransformerSet = TransformerSet;


/***/ }),

/***/ 181:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createStatefulTransformer = exports.createSimpleTransformer = void 0;
/**
 * Creates a container holding the transformer function provided. Simple
 * transformers are suitable for stateless transformations, e.g., a
 * transformation that maps certain characters to others. For transformations
 * that need to keep around state, see `createStatefulTransformer`.
 *
 * @example
 * ```typescript
 * function lowercaseToUppercase(char) {
 *  return isLowercase(char) ? char - 32 : char;
 * }
 *
 * const transformer = createSimpleTransformer(lowercaseToUppercase);
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @example
 * ```typescript
 * function ignoreAllNonDigitChars(char) {
 *  return isDigit(char) ? char : undefined;
 * }
 *
 * const transformer = createSimpleTransformer(ignoreAllNonDigitChars);
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @param transformer - Function that applies the transformation. It should
 * accept one argument, the input character, and return the transformed
 * character. A return value of `undefined` indicates that the character should
 * be ignored.
 * @returns A container holding the transformer, which can then be passed to the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 */
function createSimpleTransformer(transformer) {
    return { type: 0 /* Simple */, transform: transformer };
}
exports.createSimpleTransformer = createSimpleTransformer;
/**
 * Creates a container holding the stateful transformer. Stateful transformers
 * are objects which satisfy the `StatefulTransformer` interface. They are
 * suitable for transformations that require keeping around some state regarding
 * the characters previously transformed in the text.
 *
 * @example
 * ```typescript
 * class IgnoreDuplicateCharactersTransformer implements StatefulTransformer {
 *  private lastChar = -1;
 *
 *  public transform(char: number) {
 *      if (char === this.lastChar) return undefined;
 *      this.lastChar = char;
 *      return char;
 *  }
 *
 *  public reset() {
 *      this.lastChar = -1;
 *  }
 * }
 *
 * const transformer = createStatefulTransformer(() => new IgnoreDuplicateCharactersTransformer());
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @param factory A function that returns an instance of the stateful
 * transformer.
 * @returns A container holding the stateful transformer, which can then be
 * passed to the [[RegExpMatcher]] or the [[NfaMatcher]].
 */
function createStatefulTransformer(factory) {
    return { type: 1 /* Stateful */, factory };
}
exports.createStatefulTransformer = createStatefulTransformer;


/***/ }),

/***/ 5674:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.collapseDuplicatesTransformer = void 0;
const Char_1 = __nccwpck_require__(8861);
const Transformers_1 = __nccwpck_require__(181);
const transformer_1 = __nccwpck_require__(4063);
/**
 * Creates a transformer that collapses duplicate characters. This is useful for
 * detecting variants of patterns in which a character is repeated to bypass
 * detection.
 *
 * As an example, the pattern `hi` does not match `hhiii` by default, as the
 * frequency of the characters does not match. With this transformer, `hhiii`
 * would become `hi`, and would therefore match the pattern.
 *
 * **Application order**
 *
 * It is recommended that this transformer be applied after all other
 * transformers. Using it before other transformers may have the effect of not
 * catching duplicates of certain characters that were originally different but
 * became the same after a series of transformations.
 *
 * **Warning**
 *
 * This transformer should be used with caution, as while it can make certain
 * patterns match text that wouldn't have been matched before, it can also go
 * the other way. For example, the pattern `hello` clearly matches `hello`, but
 * with this transformer, by default, `hello` would become `helo` which does
 * _not_ match. In this cases, the `customThresholds` option can be used to
 * allow two `l`s in a row, making it leave `hello` unchanged.
 *
 * @example
 * ```typescript
 * // Collapse runs of the same character.
 * const transformer = collapseDuplicatesTransformer();
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @example
 * ```typescript
 * // Collapse runs of characters other than 'a'.
 * const transformer = collapseDuplicatesTransformer({ customThresholds: new Map([['a', Infinity]]) });
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @param options - Options for the transformer.
 * @returns A container holding the transformer, which can then be passed to the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 */
function collapseDuplicatesTransformer({ defaultThreshold = 1, customThresholds = new Map(), } = {}) {
    const map = createCharacterToThresholdMap(customThresholds);
    return Transformers_1.createStatefulTransformer(() => new transformer_1.CollapseDuplicatesTransformer({ defaultThreshold, customThresholds: map }));
}
exports.collapseDuplicatesTransformer = collapseDuplicatesTransformer;
function createCharacterToThresholdMap(customThresholds) {
    const map = new Map();
    for (const [str, threshold] of customThresholds) {
        if (threshold < 0)
            throw new RangeError('Expected all thresholds to be non-negative.');
        const char = Char_1.getAndAssertSingleCodePoint(str);
        map.set(char, threshold);
    }
    return map;
}


/***/ }),

/***/ 4063:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CollapseDuplicatesTransformer = void 0;
class CollapseDuplicatesTransformer {
    constructor({ defaultThreshold, customThresholds }) {
        this.remaining = -1;
        this.lastChar = -1;
        this.defaultThreshold = defaultThreshold;
        this.customThresholds = customThresholds;
    }
    transform(char) {
        if (char === this.lastChar) {
            return this.remaining-- > 0 ? char : undefined;
        }
        const threshold = this.customThresholds.get(char) ?? this.defaultThreshold;
        this.remaining = threshold - 1;
        this.lastChar = char;
        return threshold > 0 ? char : undefined;
    }
    reset() {
        this.remaining = -1;
        this.lastChar = -1;
    }
}
exports.CollapseDuplicatesTransformer = CollapseDuplicatesTransformer;


/***/ }),

/***/ 5859:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.remapCharactersTransformer = void 0;
const Char_1 = __nccwpck_require__(8861);
const CharacterIterator_1 = __nccwpck_require__(8460);
const Transformers_1 = __nccwpck_require__(181);
/**
 * Maps certain characters to other characters, leaving other characters
 * unchanged.
 *
 * **Application order**
 *
 * It is recommended that this transformer be applied near the start of the
 * transformer chain.
 *
 * @example
 * ```typescript
 * // Transform 'a' to 'b'.
 * const transformer = remapCharactersTransformer({ 'b': 'a' });
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @example
 * ```typescript
 * // Transform '🅱️' to 'b', and use a map instead of an object as the argument.
 * const transformer = remapCharactersTransformer(new Map([['b', '🅱️']]));
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @example
 * ```typescript
 * // Transform '🇴' and '0' to 'o'.
 * const transformer = remapCharactersTransformer({ o: '🇴0' });
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @param mapping - A map/object mapping certain characters to others.
 * @returns A container holding the transformer, which can then be passed to the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 * @see [[resolveConfusablesTransformer | Transformer that handles confusable
 * Unicode characters]]
 * @see [[resolveLeetSpeakTransformer | Transformer that handles leet-speak]]
 */
function remapCharactersTransformer(mapping) {
    const map = createOneToOneMap(mapping);
    return Transformers_1.createSimpleTransformer((c) => map.get(c) ?? c);
}
exports.remapCharactersTransformer = remapCharactersTransformer;
function createOneToOneMap(mapping) {
    const map = new Map();
    const iterable = mapping instanceof Map ? mapping.entries() : Object.entries(mapping);
    for (const [original, equivalents] of iterable) {
        const originalChar = Char_1.getAndAssertSingleCodePoint(original);
        const iter = new CharacterIterator_1.CharacterIterator(equivalents);
        for (const equivalent of iter)
            map.set(equivalent, originalChar);
    }
    return map;
}


/***/ }),

/***/ 757:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.confusables = void 0;
/**
 * Maps confusable Unicode characters to their normalized equivalents.
 *
 * @copyright
 * The data here is taken from the
 * [confusables](https://github.com/gc/confusables) library.
 *
 * ```text
 * # The MIT License (MIT)
 *
 * Copyright © 2019 https://github.com/gc/
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the “Software”), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
exports.confusables = new Map([
    [' ', ' '],
    ['0', '⓿'],
    ['1', '⓵➊⑴¹𝟏𝟙１𝟷𝟣⒈𝟭1➀₁①❶⥠'],
    ['2', '⓶⒉⑵➋ƻ²ᒿ𝟚２𝟮𝟤ᒾ𝟸Ƨ𝟐②ᴤ₂➁❷ᘝƨ'],
    ['3', '³ⳌꞫ𝟑ℨ𝟛𝟯𝟥Ꝫ➌ЗȜ⓷ӠƷ３𝟹⑶⒊ʒʓǯǮƺ𝕴ᶾзᦡ➂③₃ᶚᴣᴟ❸ҘҙӬӡӭӟӞ'],
    ['4', '➍ҶᏎ𝟜ҷ⓸ҸҹӴӵᶣ４чㄩ⁴➃₄④❹Ӌ⑷⒋'],
    ['5', '𝟱⓹➎Ƽ𝟓𝟻𝟝𝟧５➄₅⑤⁵❺ƽ⑸⒌'],
    ['6', 'ⳒᏮ𝟞𝟨𝟔➏⓺Ϭϭ⁶б６ᧈ⑥➅₆❻⑹⒍'],
    ['7', '⓻𐓒➐７⁷⑦₇❼➆⑺⒎'],
    ['8', '𐌚➑⓼８𝟠𝟪৪⁸₈𝟴➇⑧❽𝟾𝟖⑻⒏'],
    ['9', 'ꝮⳊ⓽➒੧৭୨９𝟫𝟿𝟗⁹₉Գ➈⑨❾⑼⒐'],
    ['A', '🄰Ꭿ𐊠𝕬𝜜𝐴ꓮᎪ𝚨ꭺ𝝖🅐Å∀🇦₳🅰𝒜𝘈𝐀𝔸дǺᗅⒶＡΑᾋᗩĂÃÅǍȀȂĀȺĄʌΛλƛᴀᴬДАልÄₐᕱªǞӒΆẠẢẦẨẬẮẰẲẴẶᾸᾹᾺΆᾼᾈᾉᾊᾌᾍᾎᾏἈἉἊἋἌἍἎἏḀȦǠӐÀÁÂẤẪ𝛢𝓐𝙰𝘼'],
    ['a', '∂⍺ⓐձǟᵃᶏ⒜аɒａαȃȁคǎმäɑāɐąᾄẚạảǡầẵḁȧӑӓãåάὰάăẩằẳặᾀᾁᾂᾃᾅᾆᾰᾱᾲᾳᾴᶐᾶᾷἀἁἂἃἄἅἆἇᾇậắàáâấẫǻⱥ𝐚𝑎𝒂𝒶𝓪𝔞𝕒𝖆𝖺𝗮𝘢𝙖𝚊𝛂𝛼𝜶𝝰𝞪⍶'],
    ['B', '𐌁𝑩𝕭🄱𐊡𝖡𝘽ꓐ𝗕𝘉𝜝𐊂𝚩𝐁𝛣𝝗𝐵𝙱𝔹Ᏼᏼ𝞑Ꞵ𝔅🅑฿𝓑ᗿᗾᗽ🅱ⒷＢвϐᗷƁ乃ßცჩ๖βɮБՅ๒ᙖʙᴮᵇጌḄℬΒВẞḂḆɃദᗹᗸᵝᙞᙟᙝᛒᙗᙘᴃ🇧'],
    ['b', 'Ꮟ𝐛𝘣𝒷𝔟𝓫𝖇𝖻𝑏𝙗𝕓𝒃𝗯𝚋♭ᑳᒈｂᖚᕹᕺⓑḃḅҍъḇƃɓƅᖯƄЬᑲþƂ⒝ЪᶀᑿᒀᒂᒁᑾьƀҌѢѣᔎ'],
    ['C', 'ᏟⲤ🄲ꓚ𐊢𐌂🅲𐐕🅒☾ČÇⒸＣↃƇᑕㄈ¢८↻ĈϾՇȻᙅᶜ⒞ĆҀĊ©टƆℂℭϹС匚ḈҪʗᑖᑡᑢᑣᑤᑥⅭ𝐂𝐶𝑪𝒞𝓒𝕮𝖢𝗖𝘊𝘾ᔍ'],
    ['c', 'ⲥ𐐽ꮯĉｃⓒćčċçҁƈḉȼↄсርᴄϲҫ꒝ςɽϛ𝙲ᑦ᧚𝐜𝑐𝒄𝒸𝓬𝔠𝕔𝖈𝖼𝗰𝘤𝙘𝚌₵🇨ᥴᒼⅽ'],
    ['D', 'Ꭰ🄳𝔡𝖉𝔻𝗗𝘋𝙳𝐷𝓓𝐃𝑫𝕯𝖣𝔇𝘿ꭰⅅ𝒟ꓓ🅳🅓ⒹＤƉᗪƊÐԺᴅᴰↁḊĐÞⅮᗞᑯĎḌḐḒḎᗫᗬᗟᗠᶛᴆ🇩'],
    ['d', 'Ꮷꓒ𝓭ᵭ₫ԃⓓｄḋďḍḑḓḏđƌɖɗᵈ⒟ԁⅾᶁԀᑺᑻᑼᑽᒄᑰᑱᶑ𝕕𝖽𝑑𝘥𝒅𝙙𝐝𝗱𝚍ⅆ𝒹ʠժ'],
    ['E', 'ꭼ🄴𝙀𝔼𐊆𝚬ꓰ𝝚𝞔𝓔𝑬𝗘🅴🅔ⒺΈＥƎἝᕮƐモЄᴇᴱᵉÉ乇ЁɆꂅ€ÈℰΕЕⴹᎬĒĔĖĘĚÊËԐỀẾỄỂẼḔḖẺȄȆẸỆȨḜḘḚἘἙἚἛἜῈΈӖὲέЀϵ🇪'],
    ['e', '𝑒𝓮𝕖𝖊𝘦𝗲𝚎𝙚𝒆𝔢𝖾𝐞Ҿҿⓔｅ⒠èᧉéᶒêɘἔềếễ૯ǝєεēҽɛểẽḕḗĕėëẻěȅȇẹệȩɇₑęḝḙḛ℮еԑѐӗᥱёἐἑἒἓἕℯ'],
    ['F', '🄵𐊇𝔉𝘍𐊥ꓝꞘ🅵🅕𝓕ⒻＦғҒᖴƑԲϝቻḞℱϜ₣🇫Ⅎ'],
    ['f', '𝐟𝖋ⓕｆƒḟʃբᶠ⒡ſꊰʄ∱ᶂ𝘧'],
    ['G', 'ꓖᏳ🄶Ꮐᏻ𝔾𝓖𝑮𝕲ꮐ𝒢𝙂𝖦𝙶𝔊𝐺𝐆🅶🅖ⒼＧɢƓʛĢᘜᴳǴĠԌĜḠĞǦǤԍ₲🇬⅁'],
    ['g', 'ⓖｇǵĝḡğġǧģց૭ǥɠﻭﻮᵍ⒢ℊɡᧁ𝐠𝑔𝒈𝓰𝔤𝕘𝖌𝗀𝗴𝘨𝙜𝚐'],
    ['H', '🄷𝜢ꓧ𝘏𝐻𝝜𝖧𐋏𝗛ꮋℍᎻℌⲎ𝑯𝞖🅷🅗ዞǶԋⒽＨĤᚺḢḦȞḤḨḪĦⱧҢңҤῊΉῌἨἩἪἫἭἮἯᾘᾙᾚᾛᾜᾝᾞᾟӉӈҥΉн卄♓𝓗ℋН𝐇𝙃𝙷ʜ𝛨Η𝚮ᕼӇᴴᵸ🇭'],
    ['h', 'Һ⒣ђⓗｈĥḣḧȟḥḩḫẖħⱨհһከኩኪካɦℎ𝐡𝒉𝒽𝓱𝔥𝕙𝖍𝗁𝗵𝘩𝙝𝚑իʰᑋᗁɧんɥ'],
    ['I', '🄸ЇꀤᏆ🅸🅘إﺇٳأﺃٲٵⒾＩ៸ÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗェエῘῙῚΊἸἹἺἻἼἽἾⅠΪΊɪᶦᑊᥣ𝛪𝐈𝙄𝙸𝓵𝙡𝐼ᴵ𝚰𝑰🇮'],
    ['i', 'ⓘｉìíîĩīĭïḯỉǐȉȋịḭῐῑῒΐῖῗἰἱἲⅰⅼ∣ⵏ￨׀ا١۱ߊᛁἳἴἵɨіὶίᶖ𝔦𝚒𝝸𝗂𝐢𝕚𝖎𝗶𝘪𝙞ίⁱᵢ𝓲⒤'],
    ['J', '🄹🅹🅙ⒿＪЈʝᒍנﾌĴʆวلյʖᴊᴶﻝጋɈⱼՂๅႱįᎫȷ丿ℐℑᒘᒙᒚᒛᒴᒵᒎᒏ🇯'],
    ['j', 'ⓙｊϳʲ⒥ɉĵǰјڶᶨ𝒿𝘫𝗷𝑗𝙟𝔧𝒋𝗃𝓳𝕛𝚓𝖏𝐣'],
    ['K', '𝗞🄺𝜥𝘒ꓗ𝙆𝕂Ⲕ𝔎𝛫Ꮶ𝞙𝒦🅺🅚₭ⓀＫĸḰќƘкҠκқҟӄʞҚКҡᴋᴷᵏ⒦ᛕЌጕḲΚKҜҝҞĶḴǨⱩϗӃ🇰'],
    ['k', 'ⓚｋḱǩḳķḵƙⱪᶄ𝐤𝘬𝗄𝕜𝜅𝜘𝜿𝝒𝝹𝞌𝞳𝙠𝚔𝑘𝒌ϰ𝛋𝛞𝟆𝗸𝓴𝓀'],
    ['L', '🄻𐐛Ⳑ𝑳𝙻𐑃𝓛ⳑꮮᏞꓡ🅻🅛ﺈ└ⓁւＬĿᒪ乚ՆʟꓶιԼᴸˡĹረḶₗΓլĻᄂⅬℒⱢᥧᥨᒻᒶᒷᶫﺎᒺᒹᒸᒫ⎳ㄥŁⱠﺄȽ🇱'],
    ['l', 'ⓛｌŀĺľḷḹļӀℓḽḻłﾚɭƚɫⱡ|Ɩ⒧ʅǀוןΙІ｜ᶩӏ𝓘𝕀𝖨𝗜𝘐𝐥𝑙𝒍𝓁𝔩𝕝𝖑𝗅𝗹𝘭𝚕𝜤𝝞ı𝚤ɩι𝛊𝜄𝜾𝞲'],
    ['M', '🄼𐌑𐊰ꓟⲘᎷ🅼🅜ⓂＭмṂ൱ᗰ州ᘻო๓♏ʍᙏᴍᴹᵐ⒨ḾМṀ௱ⅯℳΜϺᛖӍӎ𝐌𝑀𝑴𝓜𝔐𝕄𝕸𝖬𝗠𝘔𝙈𝙼𝚳𝛭𝜧𝝡𝞛🇲'],
    ['m', '₥ᵯ𝖒𝐦𝗆𝔪𝕞𝓂ⓜｍനᙢ൩ḿṁⅿϻṃጠɱ៳ᶆ𝙢𝓶𝚖𝑚𝗺᧕᧗'],
    ['N', '🄽ℕꓠ𝛮𝝢𝙽𝚴𝑵𝑁Ⲛ𝐍𝒩𝞜𝗡𝘕𝜨𝓝𝖭🅽₦🅝ЙЍⓃҋ៷ＮᴎɴƝᑎ几иՈռИהЛπᴺᶰŃ刀ክṄⁿÑПΝᴨոϖǸŇṆŅṊṈทŊӢӣӤӥћѝйᥢҊᴻ🇳'],
    ['n', 'ח𝒏𝓷𝙣𝑛𝖓𝔫𝗇𝚗𝗻ᥒⓝήｎǹᴒńñᾗηṅňṇɲņṋṉղຖՌƞŋ⒩ภกɳпŉлԉȠἠἡῃդᾐᾑᾒᾓᾔᾕᾖῄῆῇῂἢἣἤἥἦἧὴήበቡቢባቤብቦȵ𝛈𝜂𝜼𝝶𝞰𝕟𝘯𝐧𝓃ᶇᵰᥥ∩'],
    [
        'O',
        'ꄲ🄾𐊒𝟬ꓳⲞ𐐄𐊫𐓂𝞞🅞⍥◯ⵁ⊖０⊝𝝤Ѳϴ𝚶𝜪ѺӦӨӪΌʘ𝐎ǑÒŎÓÔÕȌȎㇿ❍ⓄＯὋロ❤૦⊕ØФԾΘƠᴼᵒ⒪ŐÖₒ¤◊Φ〇ΟОՕଠഠ௦סỒỐỖỔṌȬṎŌṐṒȮȰȪỎỜỚỠỞỢỌỘǪǬǾƟⵔ߀៰⍜⎔⎕⦰⦱⦲⦳⦴⦵⦶⦷⦸⦹⦺⦻⦼⦽⦾⦿⧀⧁⧂⧃ὈὉὊὌὍ',
    ],
    [
        'o',
        '𝚘𝛐𝗈𝞼ဝⲟ𝙤၀𐐬𝔬𐓪𝓸🇴⍤○ϙ🅾𝒪𝖮𝟢𝟶𝙾𝘰𝗼𝕠𝜊𝐨𝝾𝞸ᐤⓞѳ᧐ᥲðｏఠᦞՓòөӧóºōôǒȏŏồốȍỗổõσṍȭṏὄṑṓȯȫ๏ᴏőöѻоዐǭȱ০୦٥౦೦൦๐໐οօᴑ०੦ỏơờớỡởợọộǫøǿɵծὀὁόὸόὂὃὅ',
    ],
    ['P', '🄿ꓑ𝚸𝙿𝞠𝙋ꮲⲢ𝒫𝝦𝑃𝑷𝗣𝐏𐊕𝜬𝘗𝓟𝖯𝛲Ꮲ🅟Ҏ🅿ⓅＰƤᑭ尸Ṗրφքᴘᴾᵖ⒫ṔｱקРየᴩⱣℙΡῬᑸᑶᑷᑹᑬᑮ🇵₱'],
    ['p', 'ҏ℗ⓟｐṕṗƥᵽῥρрƿǷῤ⍴𝓹𝓅𝐩𝑝𝒑𝔭𝕡𝖕𝗉𝗽𝘱𝙥𝚙𝛒𝝆𝞺𝜌𝞀'],
    ['Q', '🅀🆀🅠ⓆＱℚⵕԚ𝐐𝑄𝑸𝒬𝓠𝚀𝘘𝙌𝖰𝕼𝔔𝗤🇶'],
    ['q', 'ⓠｑգ⒬۹զᑫɋɊԛ𝗊𝑞𝘲𝕢𝚚𝒒𝖖𝐪𝔮𝓺𝙦'],
    ['R', '℞℟ꭱᏒ𐒴ꮢᎡꓣ🆁🅡ⓇＲᴙȒʀᖇя尺ŔЯરƦᴿዪṚɌʁℛℜℝṘŘȐṜŖṞⱤ𝐑𝑅𝑹𝓡𝕽𝖱𝗥𝘙𝙍𝚁ᚱ🇷ᴚ'],
    ['r', 'ⓡｒŕṙřȑȓṛṝŗгՐɾᥬṟɍʳ⒭ɼѓᴦᶉ𝐫𝑟𝒓𝓇𝓻𝔯𝕣𝖗𝗋𝗿𝘳𝙧ᵲґᵣ'],
    ['S', '🅂ꇙ𝓢𝗦Ꮪ𝒮Ꮥ𝚂𝐒ꓢ𝖲𝔖𝙎𐊖𝕾𐐠𝘚𝕊𝑆𝑺🆂🅢ⓈＳṨŞֆՏȘˢ⒮ЅṠŠŚṤŜṦṢടᔕᔖᔢᔡᔣᔤ'],
    ['s', 'ⓢꜱ𐑈ꮪｓśṥŝṡšṧʂṣṩѕşșȿᶊక𝐬𝑠𝒔𝓈𝓼𝔰𝕤𝖘𝗌𝘀𝘴𝙨𝚜ގ🇸'],
    ['T', '🅃🆃𐌕𝚻𝛵𝕋𝕿𝑻𐊱𐊗𝖳𝙏🝨𝝩𝞣𝚃𝘛𝑇ꓔ⟙𝐓Ⲧ𝗧⊤𝔗Ꭲꭲ𝒯🅣⏇⏉ⓉＴтҬҭƬイŦԵτᴛᵀｲፕϮŤ⊥ƮΤТ下ṪṬȚŢṰṮ丅丁ᐪ𝛕𝜏𝝉𝞃𝞽𝓣ㄒ🇹ጥ'],
    ['t', 'ⓣｔṫẗťṭțȶ੮էʇ†ţṱṯƭŧᵗ⒯ʈեƫ𝐭𝑡𝒕𝓉𝓽𝔱𝕥𝖙𝗍𝘁𝘵𝙩𝚝ナ'],
    ['U', '🅄ꓴ𐓎꒤🆄🅤ŨŬŮᑗᑘǓǕǗǙⓊＵȖᑌ凵ƱմԱꓵЦŪՄƲᙀᵁᵘ⒰ŰપÜՍÙÚÛṸṺǛỦȔƯỪỨỮỬỰỤṲŲṶṴɄᥩᑧ∪ᘮ⋃𝐔𝑈𝑼𝒰𝓤𝔘𝕌𝖀𝖴𝗨𝘜𝙐𝚄🇺'],
    ['u', 'ὺύⓤｕùũūừṷṹŭǖữᥙǚǜὗυΰนսʊǘǔúůᴜűųยûṻцሁüᵾᵤµʋủȕȗưứửựụṳṵʉῠῡῢΰῦῧὐὑϋύὒὓὔὕὖᥔ𝐮𝑢𝒖𝓊𝓾𝔲𝕦𝖚𝗎ᶙ'],
    ['V', '🅅ꓦ𝑽𝖵𝘝Ꮩ𝚅𝙑𝐕🆅🅥ⓋＶᐯѴᵛ⒱۷ṾⅴⅤṼ٧ⴸѶᐺᐻ🇻𝓥'],
    ['v', 'ሀⓥｖ𝜐𝝊ṽṿ౮งѵעᴠνטᵥѷ៴ᘁ𝙫𝚟𝛎𝜈𝝂𝝼𝞶𝘷𝘃𝓿'],
    ['W', '🅆ᏔᎳ𝑾ꓪ𝒲𝘞🆆Ⓦ🅦ｗＷẂᾧᗯᥕ山ѠຟచաЩШώщฬшᙎᵂʷ⒲ฝሠẄԜẀŴẆẈധᘺѿᙡƜ₩🇼'],
    ['w', 'ẁꮃẃⓦ⍵ŵẇẅẘẉⱳὼὠὡὢὣωὤὥὦὧῲῳῴῶῷⱲѡԝᴡώᾠᾡᾢᾣᾤᾥᾦɯ𝝕𝟉𝞏'],
    ['X', '🞨🞩🞪🅇🞫🞬𐌗Ⲭꓫ𝖃𝞦𝘟𐊐𝚾𝝬𝜲Ꭓ𐌢𝖷𝑋𝕏𝔛𐊴𝗫🆇🅧❌Ⓧ𝓧ＸẊ᙭χㄨ𝒳ӾჯӼҳЖΧҲᵡˣ⒳אሸẌꊼⅩХ╳᙮ᕁᕽⅹᚷⵝ𝙓𝚇乂𝐗🇽'],
    ['x', 'ⓧｘхẋ×ₓ⤫⤬⨯ẍᶍ𝙭ӽ𝘹𝐱𝚡⨰ﾒ𝔁'],
    ['Y', 'Ⲩ𝚈𝑌𝗬𝐘ꓬ𝒀𝜰𐊲🆈🅨ⓎＹὛƳㄚʏ⅄ϔ￥¥ՎϓγץӲЧЎሃŸɎϤΥϒҮỲÝŶỸȲẎỶỴῨῩῪΎὙὝὟΫΎӮӰҰұ𝕐🇾'],
    ['y', '🅈ᎽᎩⓨｙỳýŷỹȳẏÿỷуყẙỵƴɏᵞɣʸᶌү⒴ӳӱӯўУʎ'],
    ['Z', '🅉ꓜ𝗭𝐙☡Ꮓ𝘡🆉🅩ⓏＺẔƵ乙ẐȤᶻ⒵ŹℤΖŻŽẒⱫ🇿'],
    ['z', 'ꮓⓩｚźẑżžẓẕƶȥɀᴢጊʐⱬᶎʑᙆ'],
]);


/***/ }),

/***/ 474:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveConfusablesTransformer = void 0;
const remap_characters_1 = __nccwpck_require__(5859);
const confusables_1 = __nccwpck_require__(757);
/**
 * Creates a transformer that maps confusable Unicode characters to their
 * normalized equivalent. For example, `⓵`, `➊`, and `⑴` become `1` when using
 * this transformer.
 *
 * **Application order**
 *
 * It is recommended that this transformer be applied near the start of the
 * transformer chain.
 *
 * @example
 * ```typescript
 * const transformer = resolveConfusablesTransformer();
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @returns A container holding the transformer, which can then be passed to the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 */
function resolveConfusablesTransformer() {
    return remap_characters_1.remapCharactersTransformer(confusables_1.confusables);
}
exports.resolveConfusablesTransformer = resolveConfusablesTransformer;


/***/ }),

/***/ 7120:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dictionary = void 0;
exports.dictionary = new Map([
    ['a', '@4'],
    ['c', '('],
    ['e', '3'],
    ['i', '1|'],
    ['o', '0'],
    ['s', '$'],
]);


/***/ }),

/***/ 2633:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveLeetSpeakTransformer = void 0;
const remap_characters_1 = __nccwpck_require__(5859);
const dictionary_1 = __nccwpck_require__(7120);
/**
 * Creates a transformer that maps leet-speak characters to their normalized
 * equivalent. For example, `$` becomes `s` when using this transformer.
 *
 * **Application order**
 *
 * It is recommended that this transformer be applied near the start of the
 * transformer chain, but after similar transformers that map characters to
 * other characters, such as the [[resolveConfusablesTransformer | transformer
 * that resolves confusable Unicode characters]].
 *
 * @example
 * ```typescript
 * const transformer = resolveLeetSpeakTransformer();
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @returns A container holding the transformer, which can then be passed to the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 */
function resolveLeetSpeakTransformer() {
    return remap_characters_1.remapCharactersTransformer(dictionary_1.dictionary);
}
exports.resolveLeetSpeakTransformer = resolveLeetSpeakTransformer;


/***/ }),

/***/ 6458:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.skipNonAlphabeticTransformer = void 0;
const Char_1 = __nccwpck_require__(8861);
const Transformers_1 = __nccwpck_require__(181);
/**
 * Creates a transformer that skips non-alphabetic characters (`a`-`z`,
 * `A`-`Z`). This is useful when matching text on patterns that are solely
 * comprised of alphabetic characters (the pattern `hello` does not match
 * `h.e.l.l.o` by default, but does with this transformer).
 *
 * **Application order**
 *
 * It is recommended that this transformer be applied near the end of the
 * transformer chain.
 *
 * @example
 * ```typescript
 * const transformer = resolveLeetSpeakTransformer();
 * const matcher = new RegExpMatcher({ ..., blacklistMatcherTransformers: [transformer] });
 * ```
 *
 * @returns A container holding the transformer, which can then be passed to the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 */
function skipNonAlphabeticTransformer() {
    return Transformers_1.createSimpleTransformer((c) => (Char_1.isAlphabetic(c) ? c : undefined));
}
exports.skipNonAlphabeticTransformer = skipNonAlphabeticTransformer;


/***/ }),

/***/ 6336:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toAsciiLowerCaseTransformer = void 0;
const Char_1 = __nccwpck_require__(8861);
const Transformers_1 = __nccwpck_require__(181);
/**
 * Creates a transformer that changes all ASCII alphabet characters to
 * lower-case, leaving other characters unchanged.
 *
 * **Application order**
 *
 * It is recommended that this transformer be applied near the end of the
 * transformer chain. Using it before other transformers may have the effect of
 * making its changes useless as transformers applied after produce characters
 * of varying cases.
 *
 * @returns A container holding the transformer, which can then be passed to the
 * [[RegExpMatcher]] or the [[NfaMatcher]].
 */
function toAsciiLowerCaseTransformer() {
    return Transformers_1.createSimpleTransformer((c) => (Char_1.isUpperCase(c) ? Char_1.invertCaseOfAlphabeticChar(c) : c));
}
exports.toAsciiLowerCaseTransformer = toAsciiLowerCaseTransformer;


/***/ }),

/***/ 8861:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAndAssertSingleCodePoint = exports.invertCaseOfAlphabeticChar = exports.isUpperCase = exports.isLowerCase = exports.isAlphabetic = exports.isDigit = exports.isWordChar = exports.convertSurrogatePairToCodePoint = exports.isLowSurrogate = exports.isHighSurrogate = void 0;
function isHighSurrogate(char) {
    return 55296 /* HighSurrogateStart */ <= char && char <= 56319 /* HighSurrogateEnd */;
}
exports.isHighSurrogate = isHighSurrogate;
function isLowSurrogate(char) {
    return 56320 /* LowSurrogateStart */ <= char && char <= 57343 /* LowSurrogateEnd */;
}
exports.isLowSurrogate = isLowSurrogate;
// See https://unicodebook.readthedocs.io/unicode_encodings.html#utf-16-surrogate-pairs.
function convertSurrogatePairToCodePoint(highSurrogate, lowSurrogate) {
    return ((highSurrogate - 55296 /* HighSurrogateStart */) * 0x400 +
        lowSurrogate -
        56320 /* LowSurrogateStart */ +
        0x10000);
}
exports.convertSurrogatePairToCodePoint = convertSurrogatePairToCodePoint;
function isWordChar(char) {
    return isDigit(char) || isAlphabetic(char);
}
exports.isWordChar = isWordChar;
function isDigit(char) {
    return 48 /* Zero */ <= char && char <= 57 /* Nine */;
}
exports.isDigit = isDigit;
function isAlphabetic(char) {
    return isLowerCase(char) || isUpperCase(char);
}
exports.isAlphabetic = isAlphabetic;
function isLowerCase(char) {
    return 97 /* LowerA */ <= char && char <= 122 /* LowerZ */;
}
exports.isLowerCase = isLowerCase;
function isUpperCase(char) {
    return 65 /* UpperA */ <= char && char <= 90 /* UpperZ */;
}
exports.isUpperCase = isUpperCase;
// Input must be a lower-case or upper-case ASCII alphabet character.
function invertCaseOfAlphabeticChar(char) {
    return char ^ 0x20;
}
exports.invertCaseOfAlphabeticChar = invertCaseOfAlphabeticChar;
// Asserts that the string is comprised of one and only one code point,
// then returns said code point.
function getAndAssertSingleCodePoint(str) {
    if ([...str].length !== 1)
        throw new RangeError(`Expected the input string to be one code point in length.`);
    return str.codePointAt(0);
}
exports.getAndAssertSingleCodePoint = getAndAssertSingleCodePoint;


/***/ }),

/***/ 8460:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CharacterIterator = void 0;
const Char_1 = __nccwpck_require__(8861);
class CharacterIterator {
    constructor(input) {
        this.lastPosition = -1;
        this.currentPosition = 0;
        this._lastWidth = 0;
        this._input = input ?? '';
    }
    get input() {
        return this._input;
    }
    setInput(input) {
        this._input = input;
        this.reset();
        return this;
    }
    reset() {
        this.lastPosition = -1;
        this.currentPosition = 0;
        this._lastWidth = 0;
    }
    next() {
        if (this.done)
            return { done: true, value: undefined };
        this.lastPosition = this.currentPosition;
        const char = this._input.charCodeAt(this.currentPosition++);
        this._lastWidth = 1;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.done || !Char_1.isHighSurrogate(char))
            return { done: false, value: char };
        // Do we have a surrogate pair?
        const next = this._input.charCodeAt(this.currentPosition);
        if (Char_1.isLowSurrogate(next)) {
            this._lastWidth++;
            this.currentPosition++;
            return { done: false, value: Char_1.convertSurrogatePairToCodePoint(char, next) };
        }
        return { done: false, value: char };
    }
    // Position of the iterator; equals the start index of the last character consumed.
    // -1 if no characters were consumed yet.
    get position() {
        return this.lastPosition;
    }
    // Width of the last character consumed; 2 if it was a surrogate pair and 1 otherwise.
    // 0 if no characters were consumed yet.
    get lastWidth() {
        return this._lastWidth;
    }
    get done() {
        return this.currentPosition >= this._input.length;
    }
    [Symbol.iterator]() {
        return this;
    }
}
exports.CharacterIterator = CharacterIterator;


/***/ }),

/***/ 5376:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CircularBuffer = void 0;
class CircularBuffer {
    // Note: calling this constructor with a certain capacity does not guarantee that
    // the circular buffer's capacity will be exactly that value. It is only guaranteed
    // that the circular buffer can store at least that capacity.
    constructor(capacity) {
        this._length = 0;
        this.head = 0;
        // Round up to the nearest higher power of two.
        this.data = new Array(1 << Math.ceil(Math.log2(capacity)));
        this.mask = this.capacity - 1;
    }
    push(value) {
        this.data[this.head + (this._length & this.mask)] = value;
        if (this._length === this.capacity) {
            this.head = (this.head + 1) & this.mask;
        }
        else {
            this._length++;
        }
    }
    get(index) {
        if (index < 0 || index >= this._length)
            return undefined;
        return this.data[(this.head + index) & this.mask];
    }
    set(index, value) {
        this.data[(this.head + index) & this.mask] = value;
    }
    clear() {
        this.head = 0;
        this._length = 0;
        this.data.fill(undefined);
    }
    get capacity() {
        return this.data.length;
    }
    get length() {
        return this._length;
    }
    *[Symbol.iterator]() {
        for (let i = this.head; i < this.head + this._length; i++) {
            yield this.data[i & this.mask];
        }
    }
}
exports.CircularBuffer = CircularBuffer;


/***/ }),

/***/ 2990:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compareIntervals = void 0;
function compareIntervals(lowerBound0, upperBound0, lowerBound1, upperBound1) {
    if (lowerBound0 < lowerBound1)
        return -1;
    if (lowerBound1 < lowerBound0)
        return 1;
    if (upperBound0 < upperBound1)
        return -1;
    if (upperBound1 < upperBound0)
        return 1;
    return 0;
}
exports.compareIntervals = compareIntervals;


/***/ }),

/***/ 8844:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Queue = void 0;
/**
 * A first-in first-out queue.
 *
 * @copyright
 * This is a derivative work of https://github.com/invertase/denque.
 *
 * ```text
 * Copyright (c) 2018 Mike Diarmid (Salakar) <mike.diarmid@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ```
 */
class Queue {
    constructor() {
        this.data = new Array(4).fill(undefined);
        this.mask = 0x3;
        this.head = 0;
        this.tail = 0;
    }
    push(value) {
        this.data[this.tail] = value;
        this.tail = (this.tail + 1) & this.mask;
        if (this.tail === this.head)
            this.growArray();
    }
    shift() {
        if (this.head === this.tail)
            return undefined;
        const value = this.data[this.head];
        this.data[this.head] = undefined;
        this.head = (this.head + 1) & this.mask;
        return value;
    }
    get length() {
        if (this.head <= this.tail)
            return this.tail - this.head;
        return this.capacity - (this.head - this.tail);
    }
    get capacity() {
        return this.data.length;
    }
    growArray() {
        if (this.head > 0) {
            // Create a new array from the data, but in proper order.
            const inOrder = this.data.slice(this.head, this.capacity);
            inOrder.push(...this.data.slice(0, this.tail));
            this.data = inOrder;
            this.head = 0;
        }
        this.tail = this.capacity;
        this.data.length <<= 1;
        this.mask = (this.mask << 1) | 1;
    }
}
exports.Queue = Queue;


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 778:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186);

module.exports = class ActionUtils {

    static getInputAsArray(name, options) {

        return ActionUtils
            .getInput(name, options)
            .split("\n")
            .map(s => s.trim())
            .filter(x => x !== "");
    }

    static getInput(name, options = {}) {

        let input = core.getInput(name, options);

        if (input) {
            input = input.trim();
        }

        return input;
    }
}

/***/ }),

/***/ 1970:
/***/ ((module) => {

module.exports = class ArrayUtils {

    static split(array, separator = ",") {

        let result = [];

        array.forEach(e => {
            result = [...result, ...ArrayUtils.splitFromString(e, separator)];
        });

        return result;
    }

    static splitFromString(str, separator = ",") {

        return str
            .split(separator)
            .map(s => s.trim())
            .filter(x => x !== "");
    }
}

/***/ }),

/***/ 4056:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fs = __nccwpck_require__(7147)
const path = __nccwpck_require__(1017)
const process = __nccwpck_require__(7282)
const { glob } = __nccwpck_require__(3277)

module.exports = class FileUtils {
  static isWorkspaceEmpty() {
    return FileUtils.isEmpty(FileUtils.getWorkspacePath())
  }

  static getWorkspacePath() {
    return process.env['GITHUB_WORKSPACE'] || ''
  }

  static exists(fileOrPath) {
    return fs.existsSync(fileOrPath)
  }

  static searchFiles(pattern = [], ignore = []) {
    pattern = Array.isArray(pattern) ? pattern : [pattern]
    ignore = Array.isArray(ignore) ? ignore : [ignore]

    const options = {
      cwd: FileUtils.getWorkspacePath(),
      ignore: ignore,
    }

    return glob.sync(pattern, options)
  }

  static isEmpty(path) {
    if (!FileUtils.exists(path)) {
      throw new Error(`${path} does not exist`)
    }

    return fs.readdirSync(path).length === 0
  }

  static readContent(file, encoding = 'utf-8') {
    const filePath = path.join(FileUtils.getWorkspacePath(), file)

    return fs.readFileSync(filePath, { encoding })
  }

  static writeContent(file, content, encoding = 'utf-8') {
    const filePath = path.join(FileUtils.getWorkspacePath(), file)

    return fs.writeFileSync(filePath, content, encoding)
  }
}


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3292:
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 7282:
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 6463:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Glob = void 0;
const minimatch_1 = __nccwpck_require__(266);
const path_scurry_1 = __nccwpck_require__(9569);
const url_1 = __nccwpck_require__(7310);
const pattern_js_1 = __nccwpck_require__(6722);
const walker_js_1 = __nccwpck_require__(9173);
// if no process global, just call it linux.
// so we default to case-sensitive, / separators
const defaultPlatform = typeof process === 'object' &&
    process &&
    typeof process.platform === 'string'
    ? process.platform
    : 'linux';
/**
 * An object that can perform glob pattern traversals.
 */
class Glob {
    absolute;
    cwd;
    root;
    dot;
    dotRelative;
    follow;
    ignore;
    magicalBraces;
    mark;
    matchBase;
    maxDepth;
    nobrace;
    nocase;
    nodir;
    noext;
    noglobstar;
    pattern;
    platform;
    realpath;
    scurry;
    stat;
    signal;
    windowsPathsNoEscape;
    withFileTypes;
    /**
     * The options provided to the constructor.
     */
    opts;
    /**
     * An array of parsed immutable {@link Pattern} objects.
     */
    patterns;
    /**
     * All options are stored as properties on the `Glob` object.
     *
     * See {@link GlobOptions} for full options descriptions.
     *
     * Note that a previous `Glob` object can be passed as the
     * `GlobOptions` to another `Glob` instantiation to re-use settings
     * and caches with a new pattern.
     *
     * Traversal functions can be called multiple times to run the walk
     * again.
     */
    constructor(pattern, opts) {
        this.withFileTypes = !!opts.withFileTypes;
        this.signal = opts.signal;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.dotRelative = !!opts.dotRelative;
        this.nodir = !!opts.nodir;
        this.mark = !!opts.mark;
        if (!opts.cwd) {
            this.cwd = '';
        }
        else if (opts.cwd instanceof URL || opts.cwd.startsWith('file://')) {
            opts.cwd = (0, url_1.fileURLToPath)(opts.cwd);
        }
        this.cwd = opts.cwd || '';
        this.root = opts.root;
        this.magicalBraces = !!opts.magicalBraces;
        this.nobrace = !!opts.nobrace;
        this.noext = !!opts.noext;
        this.realpath = !!opts.realpath;
        this.absolute = opts.absolute;
        this.noglobstar = !!opts.noglobstar;
        this.matchBase = !!opts.matchBase;
        this.maxDepth =
            typeof opts.maxDepth === 'number' ? opts.maxDepth : Infinity;
        this.stat = !!opts.stat;
        this.ignore = opts.ignore;
        if (this.withFileTypes && this.absolute !== undefined) {
            throw new Error('cannot set absolute and withFileTypes:true');
        }
        if (typeof pattern === 'string') {
            pattern = [pattern];
        }
        this.windowsPathsNoEscape =
            !!opts.windowsPathsNoEscape ||
                opts.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
            pattern = pattern.map(p => p.replace(/\\/g, '/'));
        }
        if (this.matchBase) {
            if (opts.noglobstar) {
                throw new TypeError('base matching requires globstar');
            }
            pattern = pattern.map(p => (p.includes('/') ? p : `./**/${p}`));
        }
        this.pattern = pattern;
        this.platform = opts.platform || defaultPlatform;
        this.opts = { ...opts, platform: this.platform };
        if (opts.scurry) {
            this.scurry = opts.scurry;
            if (opts.nocase !== undefined &&
                opts.nocase !== opts.scurry.nocase) {
                throw new Error('nocase option contradicts provided scurry option');
            }
        }
        else {
            const Scurry = opts.platform === 'win32'
                ? path_scurry_1.PathScurryWin32
                : opts.platform === 'darwin'
                    ? path_scurry_1.PathScurryDarwin
                    : opts.platform
                        ? path_scurry_1.PathScurryPosix
                        : path_scurry_1.PathScurry;
            this.scurry = new Scurry(this.cwd, {
                nocase: opts.nocase,
                fs: opts.fs,
            });
        }
        this.nocase = this.scurry.nocase;
        // If you do nocase:true on a case-sensitive file system, then
        // we need to use regexps instead of strings for non-magic
        // path portions, because statting `aBc` won't return results
        // for the file `AbC` for example.
        const nocaseMagicOnly = this.platform === 'darwin' || this.platform === 'win32';
        const mmo = {
            // default nocase based on platform
            ...opts,
            dot: this.dot,
            matchBase: this.matchBase,
            nobrace: this.nobrace,
            nocase: this.nocase,
            nocaseMagicOnly,
            nocomment: true,
            noext: this.noext,
            nonegate: true,
            optimizationLevel: 2,
            platform: this.platform,
            windowsPathsNoEscape: this.windowsPathsNoEscape,
            debug: !!this.opts.debug,
        };
        const mms = this.pattern.map(p => new minimatch_1.Minimatch(p, mmo));
        const [matchSet, globParts] = mms.reduce((set, m) => {
            set[0].push(...m.set);
            set[1].push(...m.globParts);
            return set;
        }, [[], []]);
        this.patterns = matchSet.map((set, i) => {
            return new pattern_js_1.Pattern(set, globParts[i], 0, this.platform);
        });
    }
    async walk() {
        // Walkers always return array of Path objects, so we just have to
        // coerce them into the right shape.  It will have already called
        // realpath() if the option was set to do so, so we know that's cached.
        // start out knowing the cwd, at least
        return [
            ...(await new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
                ...this.opts,
                maxDepth: this.maxDepth !== Infinity
                    ? this.maxDepth + this.scurry.cwd.depth()
                    : Infinity,
                platform: this.platform,
                nocase: this.nocase,
            }).walk()),
        ];
    }
    walkSync() {
        return [
            ...new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
                ...this.opts,
                maxDepth: this.maxDepth !== Infinity
                    ? this.maxDepth + this.scurry.cwd.depth()
                    : Infinity,
                platform: this.platform,
                nocase: this.nocase,
            }).walkSync(),
        ];
    }
    stream() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity
                ? this.maxDepth + this.scurry.cwd.depth()
                : Infinity,
            platform: this.platform,
            nocase: this.nocase,
        }).stream();
    }
    streamSync() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity
                ? this.maxDepth + this.scurry.cwd.depth()
                : Infinity,
            platform: this.platform,
            nocase: this.nocase,
        }).streamSync();
    }
    /**
     * Default sync iteration function. Returns a Generator that
     * iterates over the results.
     */
    iterateSync() {
        return this.streamSync()[Symbol.iterator]();
    }
    [Symbol.iterator]() {
        return this.iterateSync();
    }
    /**
     * Default async iteration function. Returns an AsyncGenerator that
     * iterates over the results.
     */
    iterate() {
        return this.stream()[Symbol.asyncIterator]();
    }
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
}
exports.Glob = Glob;
//# sourceMappingURL=glob.js.map

/***/ }),

/***/ 4131:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasMagic = void 0;
const minimatch_1 = __nccwpck_require__(266);
/**
 * Return true if the patterns provided contain any magic glob characters,
 * given the options provided.
 *
 * Brace expansion is not considered "magic" unless the `magicalBraces` option
 * is set, as brace expansion just turns one string into an array of strings.
 * So a pattern like `'x{a,b}y'` would return `false`, because `'xay'` and
 * `'xby'` both do not contain any magic glob characters, and it's treated the
 * same as if you had called it on `['xay', 'xby']`. When `magicalBraces:true`
 * is in the options, brace expansion _is_ treated as a pattern having magic.
 */
const hasMagic = (pattern, options = {}) => {
    if (!Array.isArray(pattern)) {
        pattern = [pattern];
    }
    for (const p of pattern) {
        if (new minimatch_1.Minimatch(p, options).hasMagic())
            return true;
    }
    return false;
};
exports.hasMagic = hasMagic;
//# sourceMappingURL=has-magic.js.map

/***/ }),

/***/ 7639:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// give it a pattern, and it'll be able to tell you if
// a given path should be ignored.
// Ignoring a path ignores its children if the pattern ends in /**
// Ignores are always parsed in dot:true mode
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ignore = void 0;
const minimatch_1 = __nccwpck_require__(266);
const pattern_js_1 = __nccwpck_require__(6722);
const defaultPlatform = typeof process === 'object' &&
    process &&
    typeof process.platform === 'string'
    ? process.platform
    : 'linux';
/**
 * Class used to process ignored patterns
 */
class Ignore {
    relative;
    relativeChildren;
    absolute;
    absoluteChildren;
    constructor(ignored, { nobrace, nocase, noext, noglobstar, platform = defaultPlatform, }) {
        this.relative = [];
        this.absolute = [];
        this.relativeChildren = [];
        this.absoluteChildren = [];
        const mmopts = {
            dot: true,
            nobrace,
            nocase,
            noext,
            noglobstar,
            optimizationLevel: 2,
            platform,
            nocomment: true,
            nonegate: true,
        };
        // this is a little weird, but it gives us a clean set of optimized
        // minimatch matchers, without getting tripped up if one of them
        // ends in /** inside a brace section, and it's only inefficient at
        // the start of the walk, not along it.
        // It'd be nice if the Pattern class just had a .test() method, but
        // handling globstars is a bit of a pita, and that code already lives
        // in minimatch anyway.
        // Another way would be if maybe Minimatch could take its set/globParts
        // as an option, and then we could at least just use Pattern to test
        // for absolute-ness.
        // Yet another way, Minimatch could take an array of glob strings, and
        // a cwd option, and do the right thing.
        for (const ign of ignored) {
            const mm = new minimatch_1.Minimatch(ign, mmopts);
            for (let i = 0; i < mm.set.length; i++) {
                const parsed = mm.set[i];
                const globParts = mm.globParts[i];
                const p = new pattern_js_1.Pattern(parsed, globParts, 0, platform);
                const m = new minimatch_1.Minimatch(p.globString(), mmopts);
                const children = globParts[globParts.length - 1] === '**';
                const absolute = p.isAbsolute();
                if (absolute)
                    this.absolute.push(m);
                else
                    this.relative.push(m);
                if (children) {
                    if (absolute)
                        this.absoluteChildren.push(m);
                    else
                        this.relativeChildren.push(m);
                }
            }
        }
    }
    ignored(p) {
        const fullpath = p.fullpath();
        const fullpaths = `${fullpath}/`;
        const relative = p.relative() || '.';
        const relatives = `${relative}/`;
        for (const m of this.relative) {
            if (m.match(relative) || m.match(relatives))
                return true;
        }
        for (const m of this.absolute) {
            if (m.match(fullpath) || m.match(fullpaths))
                return true;
        }
        return false;
    }
    childrenIgnored(p) {
        const fullpath = p.fullpath() + '/';
        const relative = (p.relative() || '.') + '/';
        for (const m of this.relativeChildren) {
            if (m.match(relative))
                return true;
        }
        for (const m of this.absoluteChildren) {
            if (m.match(fullpath))
                true;
        }
        return false;
    }
}
exports.Ignore = Ignore;
//# sourceMappingURL=ignore.js.map

/***/ }),

/***/ 3277:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.glob = exports.hasMagic = exports.Glob = exports.unescape = exports.escape = exports.sync = exports.iterate = exports.iterateSync = exports.stream = exports.streamSync = exports.globIterate = exports.globIterateSync = exports.globSync = exports.globStream = exports.globStreamSync = void 0;
const minimatch_1 = __nccwpck_require__(266);
const glob_js_1 = __nccwpck_require__(6463);
const has_magic_js_1 = __nccwpck_require__(4131);
function globStreamSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).streamSync();
}
exports.globStreamSync = globStreamSync;
function globStream(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).stream();
}
exports.globStream = globStream;
function globSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).walkSync();
}
exports.globSync = globSync;
async function glob_(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).walk();
}
function globIterateSync(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).iterateSync();
}
exports.globIterateSync = globIterateSync;
function globIterate(pattern, options = {}) {
    return new glob_js_1.Glob(pattern, options).iterate();
}
exports.globIterate = globIterate;
// aliases: glob.sync.stream() glob.stream.sync() glob.sync() etc
exports.streamSync = globStreamSync;
exports.stream = Object.assign(globStream, { sync: globStreamSync });
exports.iterateSync = globIterateSync;
exports.iterate = Object.assign(globIterate, {
    sync: globIterateSync,
});
exports.sync = Object.assign(globSync, {
    stream: globStreamSync,
    iterate: globIterateSync,
});
/* c8 ignore start */
var minimatch_2 = __nccwpck_require__(266);
Object.defineProperty(exports, "escape", ({ enumerable: true, get: function () { return minimatch_2.escape; } }));
Object.defineProperty(exports, "unescape", ({ enumerable: true, get: function () { return minimatch_2.unescape; } }));
var glob_js_2 = __nccwpck_require__(6463);
Object.defineProperty(exports, "Glob", ({ enumerable: true, get: function () { return glob_js_2.Glob; } }));
var has_magic_js_2 = __nccwpck_require__(4131);
Object.defineProperty(exports, "hasMagic", ({ enumerable: true, get: function () { return has_magic_js_2.hasMagic; } }));
/* c8 ignore stop */
exports.glob = Object.assign(glob_, {
    glob: glob_,
    globSync,
    sync: exports.sync,
    globStream,
    stream: exports.stream,
    globStreamSync,
    streamSync: exports.streamSync,
    globIterate,
    iterate: exports.iterate,
    globIterateSync,
    iterateSync: exports.iterateSync,
    Glob: glob_js_1.Glob,
    hasMagic: has_magic_js_1.hasMagic,
    escape: minimatch_1.escape,
    unescape: minimatch_1.unescape,
});
exports.glob.glob = exports.glob;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6722:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// this is just a very light wrapper around 2 arrays with an offset index
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pattern = void 0;
const minimatch_1 = __nccwpck_require__(266);
const isPatternList = (pl) => pl.length >= 1;
const isGlobList = (gl) => gl.length >= 1;
/**
 * An immutable-ish view on an array of glob parts and their parsed
 * results
 */
class Pattern {
    #patternList;
    #globList;
    #index;
    length;
    #platform;
    #rest;
    #globString;
    #isDrive;
    #isUNC;
    #isAbsolute;
    #followGlobstar = true;
    constructor(patternList, globList, index, platform) {
        if (!isPatternList(patternList)) {
            throw new TypeError('empty pattern list');
        }
        if (!isGlobList(globList)) {
            throw new TypeError('empty glob list');
        }
        if (globList.length !== patternList.length) {
            throw new TypeError('mismatched pattern list and glob list lengths');
        }
        this.length = patternList.length;
        if (index < 0 || index >= this.length) {
            throw new TypeError('index out of range');
        }
        this.#patternList = patternList;
        this.#globList = globList;
        this.#index = index;
        this.#platform = platform;
        // normalize root entries of absolute patterns on initial creation.
        if (this.#index === 0) {
            // c: => ['c:/']
            // C:/ => ['C:/']
            // C:/x => ['C:/', 'x']
            // //host/share => ['//host/share/']
            // //host/share/ => ['//host/share/']
            // //host/share/x => ['//host/share/', 'x']
            // /etc => ['/', 'etc']
            // / => ['/']
            if (this.isUNC()) {
                // '' / '' / 'host' / 'share'
                const [p0, p1, p2, p3, ...prest] = this.#patternList;
                const [g0, g1, g2, g3, ...grest] = this.#globList;
                if (prest[0] === '') {
                    // ends in /
                    prest.shift();
                    grest.shift();
                }
                const p = [p0, p1, p2, p3, ''].join('/');
                const g = [g0, g1, g2, g3, ''].join('/');
                this.#patternList = [p, ...prest];
                this.#globList = [g, ...grest];
                this.length = this.#patternList.length;
            }
            else if (this.isDrive() || this.isAbsolute()) {
                const [p1, ...prest] = this.#patternList;
                const [g1, ...grest] = this.#globList;
                if (prest[0] === '') {
                    // ends in /
                    prest.shift();
                    grest.shift();
                }
                const p = p1 + '/';
                const g = g1 + '/';
                this.#patternList = [p, ...prest];
                this.#globList = [g, ...grest];
                this.length = this.#patternList.length;
            }
        }
    }
    /**
     * The first entry in the parsed list of patterns
     */
    pattern() {
        return this.#patternList[this.#index];
    }
    /**
     * true of if pattern() returns a string
     */
    isString() {
        return typeof this.#patternList[this.#index] === 'string';
    }
    /**
     * true of if pattern() returns GLOBSTAR
     */
    isGlobstar() {
        return this.#patternList[this.#index] === minimatch_1.GLOBSTAR;
    }
    /**
     * true if pattern() returns a regexp
     */
    isRegExp() {
        return this.#patternList[this.#index] instanceof RegExp;
    }
    /**
     * The /-joined set of glob parts that make up this pattern
     */
    globString() {
        return (this.#globString =
            this.#globString ||
                (this.#index === 0
                    ? this.isAbsolute()
                        ? this.#globList[0] + this.#globList.slice(1).join('/')
                        : this.#globList.join('/')
                    : this.#globList.slice(this.#index).join('/')));
    }
    /**
     * true if there are more pattern parts after this one
     */
    hasMore() {
        return this.length > this.#index + 1;
    }
    /**
     * The rest of the pattern after this part, or null if this is the end
     */
    rest() {
        if (this.#rest !== undefined)
            return this.#rest;
        if (!this.hasMore())
            return (this.#rest = null);
        this.#rest = new Pattern(this.#patternList, this.#globList, this.#index + 1, this.#platform);
        this.#rest.#isAbsolute = this.#isAbsolute;
        this.#rest.#isUNC = this.#isUNC;
        this.#rest.#isDrive = this.#isDrive;
        return this.#rest;
    }
    /**
     * true if the pattern represents a //unc/path/ on windows
     */
    isUNC() {
        const pl = this.#patternList;
        return this.#isUNC !== undefined
            ? this.#isUNC
            : (this.#isUNC =
                this.#platform === 'win32' &&
                    this.#index === 0 &&
                    pl[0] === '' &&
                    pl[1] === '' &&
                    typeof pl[2] === 'string' &&
                    !!pl[2] &&
                    typeof pl[3] === 'string' &&
                    !!pl[3]);
    }
    // pattern like C:/...
    // split = ['C:', ...]
    // XXX: would be nice to handle patterns like `c:*` to test the cwd
    // in c: for *, but I don't know of a way to even figure out what that
    // cwd is without actually chdir'ing into it?
    /**
     * True if the pattern starts with a drive letter on Windows
     */
    isDrive() {
        const pl = this.#patternList;
        return this.#isDrive !== undefined
            ? this.#isDrive
            : (this.#isDrive =
                this.#platform === 'win32' &&
                    this.#index === 0 &&
                    this.length > 1 &&
                    typeof pl[0] === 'string' &&
                    /^[a-z]:$/i.test(pl[0]));
    }
    // pattern = '/' or '/...' or '/x/...'
    // split = ['', ''] or ['', ...] or ['', 'x', ...]
    // Drive and UNC both considered absolute on windows
    /**
     * True if the pattern is rooted on an absolute path
     */
    isAbsolute() {
        const pl = this.#patternList;
        return this.#isAbsolute !== undefined
            ? this.#isAbsolute
            : (this.#isAbsolute =
                (pl[0] === '' && pl.length > 1) ||
                    this.isDrive() ||
                    this.isUNC());
    }
    /**
     * consume the root of the pattern, and return it
     */
    root() {
        const p = this.#patternList[0];
        return typeof p === 'string' && this.isAbsolute() && this.#index === 0
            ? p
            : '';
    }
    /**
     * Check to see if the current globstar pattern is allowed to follow
     * a symbolic link.
     */
    checkFollowGlobstar() {
        return !(this.#index === 0 ||
            !this.isGlobstar() ||
            !this.#followGlobstar);
    }
    /**
     * Mark that the current globstar pattern is following a symbolic link
     */
    markFollowGlobstar() {
        if (this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar)
            return false;
        this.#followGlobstar = false;
        return true;
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=pattern.js.map

/***/ }),

/***/ 4601:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// synchronous utility for filtering entries and calculating subwalks
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Processor = exports.SubWalks = exports.MatchRecord = exports.HasWalkedCache = void 0;
const minimatch_1 = __nccwpck_require__(266);
/**
 * A cache of which patterns have been processed for a given Path
 */
class HasWalkedCache {
    store;
    constructor(store = new Map()) {
        this.store = store;
    }
    copy() {
        return new HasWalkedCache(new Map(this.store));
    }
    hasWalked(target, pattern) {
        return this.store.get(target.fullpath())?.has(pattern.globString());
    }
    storeWalked(target, pattern) {
        const fullpath = target.fullpath();
        const cached = this.store.get(fullpath);
        if (cached)
            cached.add(pattern.globString());
        else
            this.store.set(fullpath, new Set([pattern.globString()]));
    }
}
exports.HasWalkedCache = HasWalkedCache;
/**
 * A record of which paths have been matched in a given walk step,
 * and whether they only are considered a match if they are a directory,
 * and whether their absolute or relative path should be returned.
 */
class MatchRecord {
    store = new Map();
    add(target, absolute, ifDir) {
        const n = (absolute ? 2 : 0) | (ifDir ? 1 : 0);
        const current = this.store.get(target);
        this.store.set(target, current === undefined ? n : n & current);
    }
    // match, absolute, ifdir
    entries() {
        return [...this.store.entries()].map(([path, n]) => [
            path,
            !!(n & 2),
            !!(n & 1),
        ]);
    }
}
exports.MatchRecord = MatchRecord;
/**
 * A collection of patterns that must be processed in a subsequent step
 * for a given path.
 */
class SubWalks {
    store = new Map();
    add(target, pattern) {
        if (!target.canReaddir()) {
            return;
        }
        const subs = this.store.get(target);
        if (subs) {
            if (!subs.find(p => p.globString() === pattern.globString())) {
                subs.push(pattern);
            }
        }
        else
            this.store.set(target, [pattern]);
    }
    get(target) {
        const subs = this.store.get(target);
        /* c8 ignore start */
        if (!subs) {
            throw new Error('attempting to walk unknown path');
        }
        /* c8 ignore stop */
        return subs;
    }
    entries() {
        return this.keys().map(k => [k, this.store.get(k)]);
    }
    keys() {
        return [...this.store.keys()].filter(t => t.canReaddir());
    }
}
exports.SubWalks = SubWalks;
/**
 * The class that processes patterns for a given path.
 *
 * Handles child entry filtering, and determining whether a path's
 * directory contents must be read.
 */
class Processor {
    hasWalkedCache;
    matches = new MatchRecord();
    subwalks = new SubWalks();
    patterns;
    follow;
    dot;
    opts;
    constructor(opts, hasWalkedCache) {
        this.opts = opts;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.hasWalkedCache = hasWalkedCache
            ? hasWalkedCache.copy()
            : new HasWalkedCache();
    }
    processPatterns(target, patterns) {
        this.patterns = patterns;
        const processingSet = patterns.map(p => [target, p]);
        // map of paths to the magic-starting subwalks they need to walk
        // first item in patterns is the filter
        for (let [t, pattern] of processingSet) {
            this.hasWalkedCache.storeWalked(t, pattern);
            const root = pattern.root();
            const absolute = pattern.isAbsolute() && this.opts.absolute !== false;
            // start absolute patterns at root
            if (root) {
                t = t.resolve(root === '/' && this.opts.root !== undefined
                    ? this.opts.root
                    : root);
                const rest = pattern.rest();
                if (!rest) {
                    this.matches.add(t, true, false);
                    continue;
                }
                else {
                    pattern = rest;
                }
            }
            if (t.isENOENT())
                continue;
            let p;
            let rest;
            let changed = false;
            while (typeof (p = pattern.pattern()) === 'string' &&
                (rest = pattern.rest())) {
                const c = t.resolve(p);
                // we can be reasonably sure that .. is a readable dir
                if (c.isUnknown() && p !== '..')
                    break;
                t = c;
                pattern = rest;
                changed = true;
            }
            p = pattern.pattern();
            rest = pattern.rest();
            if (changed) {
                if (this.hasWalkedCache.hasWalked(t, pattern))
                    continue;
                this.hasWalkedCache.storeWalked(t, pattern);
            }
            // now we have either a final string for a known entry,
            // more strings for an unknown entry,
            // or a pattern starting with magic, mounted on t.
            if (typeof p === 'string') {
                // must be final entry
                if (!rest) {
                    const ifDir = p === '..' || p === '' || p === '.';
                    this.matches.add(t.resolve(p), absolute, ifDir);
                }
                else {
                    this.subwalks.add(t, pattern);
                }
                continue;
            }
            else if (p === minimatch_1.GLOBSTAR) {
                // if no rest, match and subwalk pattern
                // if rest, process rest and subwalk pattern
                // if it's a symlink, but we didn't get here by way of a
                // globstar match (meaning it's the first time THIS globstar
                // has traversed a symlink), then we follow it. Otherwise, stop.
                if (!t.isSymbolicLink() ||
                    this.follow ||
                    pattern.checkFollowGlobstar()) {
                    this.subwalks.add(t, pattern);
                }
                const rp = rest?.pattern();
                const rrest = rest?.rest();
                if (!rest || ((rp === '' || rp === '.') && !rrest)) {
                    // only HAS to be a dir if it ends in **/ or **/.
                    // but ending in ** will match files as well.
                    this.matches.add(t, absolute, rp === '' || rp === '.');
                }
                else {
                    if (rp === '..') {
                        // this would mean you're matching **/.. at the fs root,
                        // and no thanks, I'm not gonna test that specific case.
                        /* c8 ignore start */
                        const tp = t.parent || t;
                        /* c8 ignore stop */
                        if (!rrest)
                            this.matches.add(tp, absolute, true);
                        else if (!this.hasWalkedCache.hasWalked(tp, rrest)) {
                            this.subwalks.add(tp, rrest);
                        }
                    }
                }
            }
            else if (p instanceof RegExp) {
                this.subwalks.add(t, pattern);
            }
        }
        return this;
    }
    subwalkTargets() {
        return this.subwalks.keys();
    }
    child() {
        return new Processor(this.opts, this.hasWalkedCache);
    }
    // return a new Processor containing the subwalks for each
    // child entry, and a set of matches, and
    // a hasWalkedCache that's a copy of this one
    // then we're going to call
    filterEntries(parent, entries) {
        const patterns = this.subwalks.get(parent);
        // put matches and entry walks into the results processor
        const results = this.child();
        for (const e of entries) {
            for (const pattern of patterns) {
                const absolute = pattern.isAbsolute();
                const p = pattern.pattern();
                const rest = pattern.rest();
                if (p === minimatch_1.GLOBSTAR) {
                    results.testGlobstar(e, pattern, rest, absolute);
                }
                else if (p instanceof RegExp) {
                    results.testRegExp(e, p, rest, absolute);
                }
                else {
                    results.testString(e, p, rest, absolute);
                }
            }
        }
        return results;
    }
    testGlobstar(e, pattern, rest, absolute) {
        if (this.dot || !e.name.startsWith('.')) {
            if (!pattern.hasMore()) {
                this.matches.add(e, absolute, false);
            }
            if (e.canReaddir()) {
                // if we're in follow mode or it's not a symlink, just keep
                // testing the same pattern. If there's more after the globstar,
                // then this symlink consumes the globstar. If not, then we can
                // follow at most ONE symlink along the way, so we mark it, which
                // also checks to ensure that it wasn't already marked.
                if (this.follow || !e.isSymbolicLink()) {
                    this.subwalks.add(e, pattern);
                }
                else if (e.isSymbolicLink()) {
                    if (rest && pattern.checkFollowGlobstar()) {
                        this.subwalks.add(e, rest);
                    }
                    else if (pattern.markFollowGlobstar()) {
                        this.subwalks.add(e, pattern);
                    }
                }
            }
        }
        // if the NEXT thing matches this entry, then also add
        // the rest.
        if (rest) {
            const rp = rest.pattern();
            if (typeof rp === 'string' &&
                // dots and empty were handled already
                rp !== '..' &&
                rp !== '' &&
                rp !== '.') {
                this.testString(e, rp, rest.rest(), absolute);
            }
            else if (rp === '..') {
                /* c8 ignore start */
                const ep = e.parent || e;
                /* c8 ignore stop */
                this.subwalks.add(ep, rest);
            }
            else if (rp instanceof RegExp) {
                this.testRegExp(e, rp, rest.rest(), absolute);
            }
        }
    }
    testRegExp(e, p, rest, absolute) {
        if (!p.test(e.name))
            return;
        if (!rest) {
            this.matches.add(e, absolute, false);
        }
        else {
            this.subwalks.add(e, rest);
        }
    }
    testString(e, p, rest, absolute) {
        // should never happen?
        if (!e.isNamed(p))
            return;
        if (!rest) {
            this.matches.add(e, absolute, false);
        }
        else {
            this.subwalks.add(e, rest);
        }
    }
}
exports.Processor = Processor;
//# sourceMappingURL=processor.js.map

/***/ }),

/***/ 9173:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobStream = exports.GlobWalker = exports.GlobUtil = void 0;
/**
 * Single-use utility classes to provide functionality to the {@link Glob}
 * methods.
 *
 * @module
 */
const minipass_1 = __nccwpck_require__(1077);
const ignore_js_1 = __nccwpck_require__(7639);
const processor_js_1 = __nccwpck_require__(4601);
const makeIgnore = (ignore, opts) => typeof ignore === 'string'
    ? new ignore_js_1.Ignore([ignore], opts)
    : Array.isArray(ignore)
        ? new ignore_js_1.Ignore(ignore, opts)
        : ignore;
/**
 * basic walking utilities that all the glob walker types use
 */
class GlobUtil {
    path;
    patterns;
    opts;
    seen = new Set();
    paused = false;
    aborted = false;
    #onResume = [];
    #ignore;
    #sep;
    signal;
    maxDepth;
    constructor(patterns, path, opts) {
        this.patterns = patterns;
        this.path = path;
        this.opts = opts;
        this.#sep = !opts.posix && opts.platform === 'win32' ? '\\' : '/';
        if (opts.ignore) {
            this.#ignore = makeIgnore(opts.ignore, opts);
        }
        // ignore, always set with maxDepth, but it's optional on the
        // GlobOptions type
        /* c8 ignore start */
        this.maxDepth = opts.maxDepth || Infinity;
        /* c8 ignore stop */
        if (opts.signal) {
            this.signal = opts.signal;
            this.signal.addEventListener('abort', () => {
                this.#onResume.length = 0;
            });
        }
    }
    #ignored(path) {
        return this.seen.has(path) || !!this.#ignore?.ignored?.(path);
    }
    #childrenIgnored(path) {
        return !!this.#ignore?.childrenIgnored?.(path);
    }
    // backpressure mechanism
    pause() {
        this.paused = true;
    }
    resume() {
        /* c8 ignore start */
        if (this.signal?.aborted)
            return;
        /* c8 ignore stop */
        this.paused = false;
        let fn = undefined;
        while (!this.paused && (fn = this.#onResume.shift())) {
            fn();
        }
    }
    onResume(fn) {
        if (this.signal?.aborted)
            return;
        /* c8 ignore start */
        if (!this.paused) {
            fn();
        }
        else {
            /* c8 ignore stop */
            this.#onResume.push(fn);
        }
    }
    // do the requisite realpath/stat checking, and return the path
    // to add or undefined to filter it out.
    async matchCheck(e, ifDir) {
        if (ifDir && this.opts.nodir)
            return undefined;
        let rpc;
        if (this.opts.realpath) {
            rpc = e.realpathCached() || (await e.realpath());
            if (!rpc)
                return undefined;
            e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        return this.matchCheckTest(needStat ? await e.lstat() : e, ifDir);
    }
    matchCheckTest(e, ifDir) {
        return e &&
            (this.maxDepth === Infinity || e.depth() <= this.maxDepth) &&
            (!ifDir || e.canReaddir()) &&
            (!this.opts.nodir || !e.isDirectory()) &&
            !this.#ignored(e)
            ? e
            : undefined;
    }
    matchCheckSync(e, ifDir) {
        if (ifDir && this.opts.nodir)
            return undefined;
        let rpc;
        if (this.opts.realpath) {
            rpc = e.realpathCached() || e.realpathSync();
            if (!rpc)
                return undefined;
            e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        return this.matchCheckTest(needStat ? e.lstatSync() : e, ifDir);
    }
    matchFinish(e, absolute) {
        if (this.#ignored(e))
            return;
        const abs = this.opts.absolute === undefined ? absolute : this.opts.absolute;
        this.seen.add(e);
        const mark = this.opts.mark && e.isDirectory() ? this.#sep : '';
        // ok, we have what we need!
        if (this.opts.withFileTypes) {
            this.matchEmit(e);
        }
        else if (abs) {
            const abs = this.opts.posix ? e.fullpathPosix() : e.fullpath();
            this.matchEmit(abs + mark);
        }
        else {
            const rel = this.opts.posix ? e.relativePosix() : e.relative();
            const pre = this.opts.dotRelative && !rel.startsWith('..' + this.#sep)
                ? '.' + this.#sep
                : '';
            this.matchEmit(!rel ? '.' + mark : pre + rel + mark);
        }
    }
    async match(e, absolute, ifDir) {
        const p = await this.matchCheck(e, ifDir);
        if (p)
            this.matchFinish(p, absolute);
    }
    matchSync(e, absolute, ifDir) {
        const p = this.matchCheckSync(e, ifDir);
        if (p)
            this.matchFinish(p, absolute);
    }
    walkCB(target, patterns, cb) {
        /* c8 ignore start */
        if (this.signal?.aborted)
            cb();
        /* c8 ignore stop */
        this.walkCB2(target, patterns, new processor_js_1.Processor(this.opts), cb);
    }
    walkCB2(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target))
            return cb();
        if (this.signal?.aborted)
            cb();
        if (this.paused) {
            this.onResume(() => this.walkCB2(target, patterns, processor, cb));
            return;
        }
        processor.processPatterns(target, patterns);
        // done processing.  all of the above is sync, can be abstracted out.
        // subwalks is a map of paths to the entry filters they need
        // matches is a map of paths to [absolute, ifDir] tuples.
        let tasks = 1;
        const next = () => {
            if (--tasks === 0)
                cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
            if (this.#ignored(m))
                continue;
            tasks++;
            this.match(m, absolute, ifDir).then(() => next());
        }
        for (const t of processor.subwalkTargets()) {
            if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
                continue;
            }
            tasks++;
            const childrenCached = t.readdirCached();
            if (t.calledReaddir())
                this.walkCB3(t, childrenCached, processor, next);
            else {
                t.readdirCB((_, entries) => this.walkCB3(t, entries, processor, next), true);
            }
        }
        next();
    }
    walkCB3(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = () => {
            if (--tasks === 0)
                cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
            if (this.#ignored(m))
                continue;
            tasks++;
            this.match(m, absolute, ifDir).then(() => next());
        }
        for (const [target, patterns] of processor.subwalks.entries()) {
            tasks++;
            this.walkCB2(target, patterns, processor.child(), next);
        }
        next();
    }
    walkCBSync(target, patterns, cb) {
        /* c8 ignore start */
        if (this.signal?.aborted)
            cb();
        /* c8 ignore stop */
        this.walkCB2Sync(target, patterns, new processor_js_1.Processor(this.opts), cb);
    }
    walkCB2Sync(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target))
            return cb();
        if (this.signal?.aborted)
            cb();
        if (this.paused) {
            this.onResume(() => this.walkCB2Sync(target, patterns, processor, cb));
            return;
        }
        processor.processPatterns(target, patterns);
        // done processing.  all of the above is sync, can be abstracted out.
        // subwalks is a map of paths to the entry filters they need
        // matches is a map of paths to [absolute, ifDir] tuples.
        let tasks = 1;
        const next = () => {
            if (--tasks === 0)
                cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
            if (this.#ignored(m))
                continue;
            this.matchSync(m, absolute, ifDir);
        }
        for (const t of processor.subwalkTargets()) {
            if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
                continue;
            }
            tasks++;
            const children = t.readdirSync();
            this.walkCB3Sync(t, children, processor, next);
        }
        next();
    }
    walkCB3Sync(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = () => {
            if (--tasks === 0)
                cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
            if (this.#ignored(m))
                continue;
            this.matchSync(m, absolute, ifDir);
        }
        for (const [target, patterns] of processor.subwalks.entries()) {
            tasks++;
            this.walkCB2Sync(target, patterns, processor.child(), next);
        }
        next();
    }
}
exports.GlobUtil = GlobUtil;
class GlobWalker extends GlobUtil {
    matches;
    constructor(patterns, path, opts) {
        super(patterns, path, opts);
        this.matches = new Set();
    }
    matchEmit(e) {
        this.matches.add(e);
    }
    async walk() {
        if (this.signal?.aborted)
            throw this.signal.reason;
        if (this.path.isUnknown()) {
            await this.path.lstat();
        }
        await new Promise((res, rej) => {
            this.walkCB(this.path, this.patterns, () => {
                if (this.signal?.aborted) {
                    rej(this.signal.reason);
                }
                else {
                    res(this.matches);
                }
            });
        });
        return this.matches;
    }
    walkSync() {
        if (this.signal?.aborted)
            throw this.signal.reason;
        if (this.path.isUnknown()) {
            this.path.lstatSync();
        }
        // nothing for the callback to do, because this never pauses
        this.walkCBSync(this.path, this.patterns, () => {
            if (this.signal?.aborted)
                throw this.signal.reason;
        });
        return this.matches;
    }
}
exports.GlobWalker = GlobWalker;
class GlobStream extends GlobUtil {
    results;
    constructor(patterns, path, opts) {
        super(patterns, path, opts);
        this.results = new minipass_1.Minipass({
            signal: this.signal,
            objectMode: true,
        });
        this.results.on('drain', () => this.resume());
        this.results.on('resume', () => this.resume());
    }
    matchEmit(e) {
        this.results.write(e);
        if (!this.results.flowing)
            this.pause();
    }
    stream() {
        const target = this.path;
        if (target.isUnknown()) {
            target.lstat().then(() => {
                this.walkCB(target, this.patterns, () => this.results.end());
            });
        }
        else {
            this.walkCB(target, this.patterns, () => this.results.end());
        }
        return this.results;
    }
    streamSync() {
        if (this.path.isUnknown()) {
            this.path.lstatSync();
        }
        this.walkCBSync(this.path, this.patterns, () => this.results.end());
        return this.results;
    }
}
exports.GlobStream = GlobStream;
//# sourceMappingURL=walker.js.map

/***/ }),

/***/ 5934:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assertValidPattern = void 0;
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern) => {
    if (typeof pattern !== 'string') {
        throw new TypeError('invalid pattern');
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError('pattern is too long');
    }
};
exports.assertValidPattern = assertValidPattern;
//# sourceMappingURL=assert-valid-pattern.js.map

/***/ }),

/***/ 7642:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// parse a single path portion
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AST = void 0;
const brace_expressions_js_1 = __nccwpck_require__(314);
const unescape_js_1 = __nccwpck_require__(9820);
const types = new Set(['!', '?', '+', '*', '@']);
const isExtglobType = (c) => types.has(c);
// Patterns that get prepended to bind to the start of either the
// entire string, or just a single path portion, to prevent dots
// and/or traversal patterns, when needed.
// Exts don't need the ^ or / bit, because the root binds that already.
const startNoTraversal = '(?!(?:^|/)\\.\\.?(?:$|/))';
const startNoDot = '(?!\\.)';
// characters that indicate a start of pattern needs the "no dots" bit,
// because a dot *might* be matched. ( is not in the list, because in
// the case of a child extglob, it will handle the prevention itself.
const addPatternStart = new Set(['[', '.']);
// cases where traversal is A-OK, no dot prevention needed
const justDots = new Set(['..', '.']);
const reSpecials = new Set('().*{}+?[]^$\\!');
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// any single thing other than /
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// use + when we need to ensure that *something* matches, because the * is
// the only thing in the path portion.
const starNoEmpty = qmark + '+?';
// remove the \ chars that we added if we end up doing a nonmagic compare
// const deslash = (s: string) => s.replace(/\\(.)/g, '$1')
class AST {
    type;
    #root;
    #hasMagic;
    #uflag = false;
    #parts = [];
    #parent;
    #parentIndex;
    #negs;
    #filledNegs = false;
    #options;
    #toString;
    // set to true if it's an extglob with no children
    // (which really means one child of '')
    #emptyExt = false;
    constructor(type, parent, options = {}) {
        this.type = type;
        // extglobs are inherently magical
        if (type)
            this.#hasMagic = true;
        this.#parent = parent;
        this.#root = this.#parent ? this.#parent.#root : this;
        this.#options = this.#root === this ? options : this.#root.#options;
        this.#negs = this.#root === this ? [] : this.#root.#negs;
        if (type === '!' && !this.#root.#filledNegs)
            this.#negs.push(this);
        this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
    }
    get hasMagic() {
        /* c8 ignore start */
        if (this.#hasMagic !== undefined)
            return this.#hasMagic;
        /* c8 ignore stop */
        for (const p of this.#parts) {
            if (typeof p === 'string')
                continue;
            if (p.type || p.hasMagic)
                return (this.#hasMagic = true);
        }
        // note: will be undefined until we generate the regexp src and find out
        return this.#hasMagic;
    }
    // reconstructs the pattern
    toString() {
        if (this.#toString !== undefined)
            return this.#toString;
        if (!this.type) {
            return (this.#toString = this.#parts.map(p => String(p)).join(''));
        }
        else {
            return (this.#toString =
                this.type + '(' + this.#parts.map(p => String(p)).join('|') + ')');
        }
    }
    #fillNegs() {
        /* c8 ignore start */
        if (this !== this.#root)
            throw new Error('should only call on root');
        if (this.#filledNegs)
            return this;
        /* c8 ignore stop */
        // call toString() once to fill this out
        this.toString();
        this.#filledNegs = true;
        let n;
        while ((n = this.#negs.pop())) {
            if (n.type !== '!')
                continue;
            // walk up the tree, appending everthing that comes AFTER parentIndex
            let p = n;
            let pp = p.#parent;
            while (pp) {
                for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
                    for (const part of n.#parts) {
                        /* c8 ignore start */
                        if (typeof part === 'string') {
                            throw new Error('string part in extglob AST??');
                        }
                        /* c8 ignore stop */
                        part.copyIn(pp.#parts[i]);
                    }
                }
                p = pp;
                pp = p.#parent;
            }
        }
        return this;
    }
    push(...parts) {
        for (const p of parts) {
            if (p === '')
                continue;
            /* c8 ignore start */
            if (typeof p !== 'string' && !(p instanceof AST && p.#parent === this)) {
                throw new Error('invalid part: ' + p);
            }
            /* c8 ignore stop */
            this.#parts.push(p);
        }
    }
    toJSON() {
        const ret = this.type === null
            ? this.#parts.slice().map(p => (typeof p === 'string' ? p : p.toJSON()))
            : [this.type, ...this.#parts.map(p => p.toJSON())];
        if (this.isStart() && !this.type)
            ret.unshift([]);
        if (this.isEnd() &&
            (this === this.#root ||
                (this.#root.#filledNegs && this.#parent?.type === '!'))) {
            ret.push({});
        }
        return ret;
    }
    isStart() {
        if (this.#root === this)
            return true;
        // if (this.type) return !!this.#parent?.isStart()
        if (!this.#parent?.isStart())
            return false;
        if (this.#parentIndex === 0)
            return true;
        // if everything AHEAD of this is a negation, then it's still the "start"
        const p = this.#parent;
        for (let i = 0; i < this.#parentIndex; i++) {
            const pp = p.#parts[i];
            if (!(pp instanceof AST && pp.type === '!')) {
                return false;
            }
        }
        return true;
    }
    isEnd() {
        if (this.#root === this)
            return true;
        if (this.#parent?.type === '!')
            return true;
        if (!this.#parent?.isEnd())
            return false;
        if (!this.type)
            return this.#parent?.isEnd();
        // if not root, it'll always have a parent
        /* c8 ignore start */
        const pl = this.#parent ? this.#parent.#parts.length : 0;
        /* c8 ignore stop */
        return this.#parentIndex === pl - 1;
    }
    copyIn(part) {
        if (typeof part === 'string')
            this.push(part);
        else
            this.push(part.clone(this));
    }
    clone(parent) {
        const c = new AST(this.type, parent);
        for (const p of this.#parts) {
            c.copyIn(p);
        }
        return c;
    }
    static #parseAST(str, ast, pos, opt) {
        let escaping = false;
        let inBrace = false;
        let braceStart = -1;
        let braceNeg = false;
        if (ast.type === null) {
            // outside of a extglob, append until we find a start
            let i = pos;
            let acc = '';
            while (i < str.length) {
                const c = str.charAt(i++);
                // still accumulate escapes at this point, but we do ignore
                // starts that are escaped
                if (escaping || c === '\\') {
                    escaping = !escaping;
                    acc += c;
                    continue;
                }
                if (inBrace) {
                    if (i === braceStart + 1) {
                        if (c === '^' || c === '!') {
                            braceNeg = true;
                        }
                    }
                    else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                        inBrace = false;
                    }
                    acc += c;
                    continue;
                }
                else if (c === '[') {
                    inBrace = true;
                    braceStart = i;
                    braceNeg = false;
                    acc += c;
                    continue;
                }
                if (!opt.noext && isExtglobType(c) && str.charAt(i) === '(') {
                    ast.push(acc);
                    acc = '';
                    const ext = new AST(c, ast);
                    i = AST.#parseAST(str, ext, i, opt);
                    ast.push(ext);
                    continue;
                }
                acc += c;
            }
            ast.push(acc);
            return i;
        }
        // some kind of extglob, pos is at the (
        // find the next | or )
        let i = pos + 1;
        let part = new AST(null, ast);
        const parts = [];
        let acc = '';
        while (i < str.length) {
            const c = str.charAt(i++);
            // still accumulate escapes at this point, but we do ignore
            // starts that are escaped
            if (escaping || c === '\\') {
                escaping = !escaping;
                acc += c;
                continue;
            }
            if (inBrace) {
                if (i === braceStart + 1) {
                    if (c === '^' || c === '!') {
                        braceNeg = true;
                    }
                }
                else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                    inBrace = false;
                }
                acc += c;
                continue;
            }
            else if (c === '[') {
                inBrace = true;
                braceStart = i;
                braceNeg = false;
                acc += c;
                continue;
            }
            if (isExtglobType(c) && str.charAt(i) === '(') {
                part.push(acc);
                acc = '';
                const ext = new AST(c, part);
                part.push(ext);
                i = AST.#parseAST(str, ext, i, opt);
                continue;
            }
            if (c === '|') {
                part.push(acc);
                acc = '';
                parts.push(part);
                part = new AST(null, ast);
                continue;
            }
            if (c === ')') {
                if (acc === '' && ast.#parts.length === 0) {
                    ast.#emptyExt = true;
                }
                part.push(acc);
                acc = '';
                ast.push(...parts, part);
                return i;
            }
            acc += c;
        }
        // unfinished extglob
        // if we got here, it was a malformed extglob! not an extglob, but
        // maybe something else in there.
        ast.type = null;
        ast.#hasMagic = undefined;
        ast.#parts = [str.substring(pos - 1)];
        return i;
    }
    static fromGlob(pattern, options = {}) {
        const ast = new AST(null, undefined, options);
        AST.#parseAST(pattern, ast, 0, options);
        return ast;
    }
    // returns the regular expression if there's magic, or the unescaped
    // string if not.
    toMMPattern() {
        // should only be called on root
        /* c8 ignore start */
        if (this !== this.#root)
            return this.#root.toMMPattern();
        /* c8 ignore stop */
        const glob = this.toString();
        const [re, body, hasMagic, uflag] = this.toRegExpSource();
        // if we're in nocase mode, and not nocaseMagicOnly, then we do
        // still need a regular expression if we have to case-insensitively
        // match capital/lowercase characters.
        const anyMagic = hasMagic ||
            this.#hasMagic ||
            (this.#options.nocase &&
                !this.#options.nocaseMagicOnly &&
                glob.toUpperCase() !== glob.toLowerCase());
        if (!anyMagic) {
            return body;
        }
        const flags = (this.#options.nocase ? 'i' : '') + (uflag ? 'u' : '');
        return Object.assign(new RegExp(`^${re}$`, flags), {
            _src: re,
            _glob: glob,
        });
    }
    // returns the string match, the regexp source, whether there's magic
    // in the regexp (so a regular expression is required) and whether or
    // not the uflag is needed for the regular expression (for posix classes)
    // TODO: instead of injecting the start/end at this point, just return
    // the BODY of the regexp, along with the start/end portions suitable
    // for binding the start/end in either a joined full-path makeRe context
    // (where we bind to (^|/), or a standalone matchPart context (where
    // we bind to ^, and not /).  Otherwise slashes get duped!
    //
    // In part-matching mode, the start is:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: ^(?!\.\.?$)
    // - if dots allowed or not possible: ^
    // - if dots possible and not allowed: ^(?!\.)
    // end is:
    // - if not isEnd(): nothing
    // - else: $
    //
    // In full-path matching mode, we put the slash at the START of the
    // pattern, so start is:
    // - if first pattern: same as part-matching mode
    // - if not isStart(): nothing
    // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
    // - if dots allowed or not possible: /
    // - if dots possible and not allowed: /(?!\.)
    // end is:
    // - if last pattern, same as part-matching mode
    // - else nothing
    //
    // Always put the (?:$|/) on negated tails, though, because that has to be
    // there to bind the end of the negated pattern portion, and it's easier to
    // just stick it in now rather than try to inject it later in the middle of
    // the pattern.
    //
    // We can just always return the same end, and leave it up to the caller
    // to know whether it's going to be used joined or in parts.
    // And, if the start is adjusted slightly, can do the same there:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
    // - if dots allowed or not possible: (?:/|^)
    // - if dots possible and not allowed: (?:/|^)(?!\.)
    //
    // But it's better to have a simpler binding without a conditional, for
    // performance, so probably better to return both start options.
    //
    // Then the caller just ignores the end if it's not the first pattern,
    // and the start always gets applied.
    //
    // But that's always going to be $ if it's the ending pattern, or nothing,
    // so the caller can just attach $ at the end of the pattern when building.
    //
    // So the todo is:
    // - better detect what kind of start is needed
    // - return both flavors of starting pattern
    // - attach $ at the end of the pattern when creating the actual RegExp
    //
    // Ah, but wait, no, that all only applies to the root when the first pattern
    // is not an extglob. If the first pattern IS an extglob, then we need all
    // that dot prevention biz to live in the extglob portions, because eg
    // +(*|.x*) can match .xy but not .yx.
    //
    // So, return the two flavors if it's #root and the first child is not an
    // AST, otherwise leave it to the child AST to handle it, and there,
    // use the (?:^|/) style of start binding.
    //
    // Even simplified further:
    // - Since the start for a join is eg /(?!\.) and the start for a part
    // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
    // or start or whatever) and prepend ^ or / at the Regexp construction.
    toRegExpSource(allowDot) {
        const dot = allowDot ?? !!this.#options.dot;
        if (this.#root === this)
            this.#fillNegs();
        if (!this.type) {
            const noEmpty = this.isStart() && this.isEnd();
            const src = this.#parts
                .map(p => {
                const [re, _, hasMagic, uflag] = typeof p === 'string'
                    ? AST.#parseGlob(p, this.#hasMagic, noEmpty)
                    : p.toRegExpSource(allowDot);
                this.#hasMagic = this.#hasMagic || hasMagic;
                this.#uflag = this.#uflag || uflag;
                return re;
            })
                .join('');
            let start = '';
            if (this.isStart()) {
                if (typeof this.#parts[0] === 'string') {
                    // this is the string that will match the start of the pattern,
                    // so we need to protect against dots and such.
                    // '.' and '..' cannot match unless the pattern is that exactly,
                    // even if it starts with . or dot:true is set.
                    const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
                    if (!dotTravAllowed) {
                        const aps = addPatternStart;
                        // check if we have a possibility of matching . or ..,
                        // and prevent that.
                        const needNoTrav = 
                        // dots are allowed, and the pattern starts with [ or .
                        (dot && aps.has(src.charAt(0))) ||
                            // the pattern starts with \., and then [ or .
                            (src.startsWith('\\.') && aps.has(src.charAt(2))) ||
                            // the pattern starts with \.\., and then [ or .
                            (src.startsWith('\\.\\.') && aps.has(src.charAt(4)));
                        // no need to prevent dots if it can't match a dot, or if a
                        // sub-pattern will be preventing it anyway.
                        const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
                        start = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : '';
                    }
                }
            }
            // append the "end of path portion" pattern to negation tails
            let end = '';
            if (this.isEnd() &&
                this.#root.#filledNegs &&
                this.#parent?.type === '!') {
                end = '(?:$|\\/)';
            }
            const final = start + src + end;
            return [
                final,
                (0, unescape_js_1.unescape)(src),
                (this.#hasMagic = !!this.#hasMagic),
                this.#uflag,
            ];
        }
        // We need to calculate the body *twice* if it's a repeat pattern
        // at the start, once in nodot mode, then again in dot mode, so a
        // pattern like *(?) can match 'x.y'
        const repeated = this.type === '*' || this.type === '+';
        // some kind of extglob
        const start = this.type === '!' ? '(?:(?!(?:' : '(?:';
        let body = this.#partsToRegExp(dot);
        if (this.isStart() && this.isEnd() && !body && this.type !== '!') {
            // invalid extglob, has to at least be *something* present, if it's
            // the entire path portion.
            const s = this.toString();
            this.#parts = [s];
            this.type = null;
            this.#hasMagic = undefined;
            return [s, (0, unescape_js_1.unescape)(this.toString()), false, false];
        }
        // XXX abstract out this map method
        let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot
            ? ''
            : this.#partsToRegExp(true);
        if (bodyDotAllowed === body) {
            bodyDotAllowed = '';
        }
        if (bodyDotAllowed) {
            body = `(?:${body})(?:${bodyDotAllowed})*?`;
        }
        // an empty !() is exactly equivalent to a starNoEmpty
        let final = '';
        if (this.type === '!' && this.#emptyExt) {
            final = (this.isStart() && !dot ? startNoDot : '') + starNoEmpty;
        }
        else {
            const close = this.type === '!'
                ? // !() must match something,but !(x) can match ''
                    '))' +
                        (this.isStart() && !dot && !allowDot ? startNoDot : '') +
                        star +
                        ')'
                : this.type === '@'
                    ? ')'
                    : this.type === '?'
                        ? ')?'
                        : this.type === '+' && bodyDotAllowed
                            ? ')'
                            : this.type === '*' && bodyDotAllowed
                                ? `)?`
                                : `)${this.type}`;
            final = start + body + close;
        }
        return [
            final,
            (0, unescape_js_1.unescape)(body),
            (this.#hasMagic = !!this.#hasMagic),
            this.#uflag,
        ];
    }
    #partsToRegExp(dot) {
        return this.#parts
            .map(p => {
            // extglob ASTs should only contain parent ASTs
            /* c8 ignore start */
            if (typeof p === 'string') {
                throw new Error('string type in extglob ast??');
            }
            /* c8 ignore stop */
            // can ignore hasMagic, because extglobs are already always magic
            const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
            this.#uflag = this.#uflag || uflag;
            return re;
        })
            .filter(p => !(this.isStart() && this.isEnd()) || !!p)
            .join('|');
    }
    static #parseGlob(glob, hasMagic, noEmpty = false) {
        let escaping = false;
        let re = '';
        let uflag = false;
        for (let i = 0; i < glob.length; i++) {
            const c = glob.charAt(i);
            if (escaping) {
                escaping = false;
                re += (reSpecials.has(c) ? '\\' : '') + c;
                continue;
            }
            if (c === '\\') {
                if (i === glob.length - 1) {
                    re += '\\\\';
                }
                else {
                    escaping = true;
                }
                continue;
            }
            if (c === '[') {
                const [src, needUflag, consumed, magic] = (0, brace_expressions_js_1.parseClass)(glob, i);
                if (consumed) {
                    re += src;
                    uflag = uflag || needUflag;
                    i += consumed - 1;
                    hasMagic = hasMagic || magic;
                    continue;
                }
            }
            if (c === '*') {
                if (noEmpty && glob === '*')
                    re += starNoEmpty;
                else
                    re += star;
                hasMagic = true;
                continue;
            }
            if (c === '?') {
                re += qmark;
                hasMagic = true;
                continue;
            }
            re += regExpEscape(c);
        }
        return [re, (0, unescape_js_1.unescape)(glob), !!hasMagic, uflag];
    }
}
exports.AST = AST;
//# sourceMappingURL=ast.js.map

/***/ }),

/***/ 314:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// translate the various posix character classes into unicode properties
// this works across all unicode locales
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseClass = void 0;
// { <posix class>: [<translation>, /u flag required, negated]
const posixClasses = {
    '[:alnum:]': ['\\p{L}\\p{Nl}\\p{Nd}', true],
    '[:alpha:]': ['\\p{L}\\p{Nl}', true],
    '[:ascii:]': ['\\x' + '00-\\x' + '7f', false],
    '[:blank:]': ['\\p{Zs}\\t', true],
    '[:cntrl:]': ['\\p{Cc}', true],
    '[:digit:]': ['\\p{Nd}', true],
    '[:graph:]': ['\\p{Z}\\p{C}', true, true],
    '[:lower:]': ['\\p{Ll}', true],
    '[:print:]': ['\\p{C}', true],
    '[:punct:]': ['\\p{P}', true],
    '[:space:]': ['\\p{Z}\\t\\r\\n\\v\\f', true],
    '[:upper:]': ['\\p{Lu}', true],
    '[:word:]': ['\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}', true],
    '[:xdigit:]': ['A-Fa-f0-9', false],
};
// only need to escape a few things inside of brace expressions
// escapes: [ \ ] -
const braceEscape = (s) => s.replace(/[[\]\\-]/g, '\\$&');
// escape all regexp magic characters
const regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// everything has already been escaped, we just have to join
const rangesToString = (ranges) => ranges.join('');
// takes a glob string at a posix brace expression, and returns
// an equivalent regular expression source, and boolean indicating
// whether the /u flag needs to be applied, and the number of chars
// consumed to parse the character class.
// This also removes out of order ranges, and returns ($.) if the
// entire class just no good.
const parseClass = (glob, position) => {
    const pos = position;
    /* c8 ignore start */
    if (glob.charAt(pos) !== '[') {
        throw new Error('not in a brace expression');
    }
    /* c8 ignore stop */
    const ranges = [];
    const negs = [];
    let i = pos + 1;
    let sawStart = false;
    let uflag = false;
    let escaping = false;
    let negate = false;
    let endPos = pos;
    let rangeStart = '';
    WHILE: while (i < glob.length) {
        const c = glob.charAt(i);
        if ((c === '!' || c === '^') && i === pos + 1) {
            negate = true;
            i++;
            continue;
        }
        if (c === ']' && sawStart && !escaping) {
            endPos = i + 1;
            break;
        }
        sawStart = true;
        if (c === '\\') {
            if (!escaping) {
                escaping = true;
                i++;
                continue;
            }
            // escaped \ char, fall through and treat like normal char
        }
        if (c === '[' && !escaping) {
            // either a posix class, a collation equivalent, or just a [
            for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
                if (glob.startsWith(cls, i)) {
                    // invalid, [a-[] is fine, but not [a-[:alpha]]
                    if (rangeStart) {
                        return ['$.', false, glob.length - pos, true];
                    }
                    i += cls.length;
                    if (neg)
                        negs.push(unip);
                    else
                        ranges.push(unip);
                    uflag = uflag || u;
                    continue WHILE;
                }
            }
        }
        // now it's just a normal character, effectively
        escaping = false;
        if (rangeStart) {
            // throw this range away if it's not valid, but others
            // can still match.
            if (c > rangeStart) {
                ranges.push(braceEscape(rangeStart) + '-' + braceEscape(c));
            }
            else if (c === rangeStart) {
                ranges.push(braceEscape(c));
            }
            rangeStart = '';
            i++;
            continue;
        }
        // now might be the start of a range.
        // can be either c-d or c-] or c<more...>] or c] at this point
        if (glob.startsWith('-]', i + 1)) {
            ranges.push(braceEscape(c + '-'));
            i += 2;
            continue;
        }
        if (glob.startsWith('-', i + 1)) {
            rangeStart = c;
            i += 2;
            continue;
        }
        // not the start of a range, just a single character
        ranges.push(braceEscape(c));
        i++;
    }
    if (endPos < i) {
        // didn't see the end of the class, not a valid class,
        // but might still be valid as a literal match.
        return ['', false, 0, false];
    }
    // if we got no ranges and no negates, then we have a range that
    // cannot possibly match anything, and that poisons the whole glob
    if (!ranges.length && !negs.length) {
        return ['$.', false, glob.length - pos, true];
    }
    // if we got one positive range, and it's a single character, then that's
    // not actually a magic pattern, it's just that one literal character.
    // we should not treat that as "magic", we should just return the literal
    // character. [_] is a perfectly valid way to escape glob magic chars.
    if (negs.length === 0 &&
        ranges.length === 1 &&
        /^\\?.$/.test(ranges[0]) &&
        !negate) {
        const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
        return [regexpEscape(r), false, endPos - pos, false];
    }
    const sranges = '[' + (negate ? '^' : '') + rangesToString(ranges) + ']';
    const snegs = '[' + (negate ? '' : '^') + rangesToString(negs) + ']';
    const comb = ranges.length && negs.length
        ? '(' + sranges + '|' + snegs + ')'
        : ranges.length
            ? sranges
            : snegs;
    return [comb, uflag, endPos - pos, true];
};
exports.parseClass = parseClass;
//# sourceMappingURL=brace-expressions.js.map

/***/ }),

/***/ 1477:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.escape = void 0;
/**
 * Escape all magic characters in a glob pattern.
 *
 * If the {@link windowsPathsNoEscape | GlobOptions.windowsPathsNoEscape}
 * option is used, then characters are escaped by wrapping in `[]`, because
 * a magic character wrapped in a character class can only be satisfied by
 * that exact character.  In this mode, `\` is _not_ escaped, because it is
 * not interpreted as a magic character, but instead as a path separator.
 */
const escape = (s, { windowsPathsNoEscape = false, } = {}) => {
    // don't need to escape +@! because we escape the parens
    // that make those magic, and escaping ! as [!] isn't valid,
    // because [!]] is a valid glob class meaning not ']'.
    return windowsPathsNoEscape
        ? s.replace(/[?*()[\]]/g, '[$&]')
        : s.replace(/[?*()[\]\\]/g, '\\$&');
};
exports.escape = escape;
//# sourceMappingURL=escape.js.map

/***/ }),

/***/ 266:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unescape = exports.escape = exports.AST = exports.Minimatch = exports.match = exports.makeRe = exports.braceExpand = exports.defaults = exports.filter = exports.GLOBSTAR = exports.sep = exports.minimatch = void 0;
const brace_expansion_1 = __importDefault(__nccwpck_require__(1046));
const assert_valid_pattern_js_1 = __nccwpck_require__(5934);
const ast_js_1 = __nccwpck_require__(7642);
const escape_js_1 = __nccwpck_require__(1477);
const unescape_js_1 = __nccwpck_require__(9820);
const minimatch = (p, pattern, options = {}) => {
    (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
    // shortcut: comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') {
        return false;
    }
    return new Minimatch(pattern, options).match(p);
};
exports.minimatch = minimatch;
// Optimized checking for the most common glob patterns.
const starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
const starDotExtTest = (ext) => (f) => !f.startsWith('.') && f.endsWith(ext);
const starDotExtTestDot = (ext) => (f) => f.endsWith(ext);
const starDotExtTestNocase = (ext) => {
    ext = ext.toLowerCase();
    return (f) => !f.startsWith('.') && f.toLowerCase().endsWith(ext);
};
const starDotExtTestNocaseDot = (ext) => {
    ext = ext.toLowerCase();
    return (f) => f.toLowerCase().endsWith(ext);
};
const starDotStarRE = /^\*+\.\*+$/;
const starDotStarTest = (f) => !f.startsWith('.') && f.includes('.');
const starDotStarTestDot = (f) => f !== '.' && f !== '..' && f.includes('.');
const dotStarRE = /^\.\*+$/;
const dotStarTest = (f) => f !== '.' && f !== '..' && f.startsWith('.');
const starRE = /^\*+$/;
const starTest = (f) => f.length !== 0 && !f.startsWith('.');
const starTestDot = (f) => f.length !== 0 && f !== '.' && f !== '..';
const qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
const qmarksTestNocase = ([$0, ext = '']) => {
    const noext = qmarksTestNoExt([$0]);
    if (!ext)
        return noext;
    ext = ext.toLowerCase();
    return (f) => noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestNocaseDot = ([$0, ext = '']) => {
    const noext = qmarksTestNoExtDot([$0]);
    if (!ext)
        return noext;
    ext = ext.toLowerCase();
    return (f) => noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestDot = ([$0, ext = '']) => {
    const noext = qmarksTestNoExtDot([$0]);
    return !ext ? noext : (f) => noext(f) && f.endsWith(ext);
};
const qmarksTest = ([$0, ext = '']) => {
    const noext = qmarksTestNoExt([$0]);
    return !ext ? noext : (f) => noext(f) && f.endsWith(ext);
};
const qmarksTestNoExt = ([$0]) => {
    const len = $0.length;
    return (f) => f.length === len && !f.startsWith('.');
};
const qmarksTestNoExtDot = ([$0]) => {
    const len = $0.length;
    return (f) => f.length === len && f !== '.' && f !== '..';
};
/* c8 ignore start */
const defaultPlatform = (typeof process === 'object' && process
    ? (typeof process.env === 'object' &&
        process.env &&
        process.env.__MINIMATCH_TESTING_PLATFORM__) ||
        process.platform
    : 'posix');
const path = {
    win32: { sep: '\\' },
    posix: { sep: '/' },
};
/* c8 ignore stop */
exports.sep = defaultPlatform === 'win32' ? path.win32.sep : path.posix.sep;
exports.minimatch.sep = exports.sep;
exports.GLOBSTAR = Symbol('globstar **');
exports.minimatch.GLOBSTAR = exports.GLOBSTAR;
// any single thing other than /
// don't need to escape / when using new RegExp()
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
const twoStarDot = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?';
// not a ^ or / followed by a dot,
// followed by anything, any number of times.
const twoStarNoDot = '(?:(?!(?:\\/|^)\\.).)*?';
const filter = (pattern, options = {}) => (p) => (0, exports.minimatch)(p, pattern, options);
exports.filter = filter;
exports.minimatch.filter = exports.filter;
const ext = (a, b = {}) => Object.assign({}, a, b);
const defaults = (def) => {
    if (!def || typeof def !== 'object' || !Object.keys(def).length) {
        return exports.minimatch;
    }
    const orig = exports.minimatch;
    const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
    return Object.assign(m, {
        Minimatch: class Minimatch extends orig.Minimatch {
            constructor(pattern, options = {}) {
                super(pattern, ext(def, options));
            }
            static defaults(options) {
                return orig.defaults(ext(def, options)).Minimatch;
            }
        },
        AST: class AST extends orig.AST {
            /* c8 ignore start */
            constructor(type, parent, options = {}) {
                super(type, parent, ext(def, options));
            }
            /* c8 ignore stop */
            static fromGlob(pattern, options = {}) {
                return orig.AST.fromGlob(pattern, ext(def, options));
            }
        },
        unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
        escape: (s, options = {}) => orig.escape(s, ext(def, options)),
        filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
        defaults: (options) => orig.defaults(ext(def, options)),
        makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
        braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
        match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
        sep: orig.sep,
        GLOBSTAR: exports.GLOBSTAR,
    });
};
exports.defaults = defaults;
exports.minimatch.defaults = exports.defaults;
// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
const braceExpand = (pattern, options = {}) => {
    (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
    // Thanks to Yeting Li <https://github.com/yetingli> for
    // improving this regexp to avoid a ReDOS vulnerability.
    if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        // shortcut. no need to expand.
        return [pattern];
    }
    return (0, brace_expansion_1.default)(pattern);
};
exports.braceExpand = braceExpand;
exports.minimatch.braceExpand = exports.braceExpand;
// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
const makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
exports.makeRe = makeRe;
exports.minimatch.makeRe = exports.makeRe;
const match = (list, pattern, options = {}) => {
    const mm = new Minimatch(pattern, options);
    list = list.filter(f => mm.match(f));
    if (mm.options.nonull && !list.length) {
        list.push(pattern);
    }
    return list;
};
exports.match = match;
exports.minimatch.match = exports.match;
// replace stuff like \* with *
const globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
class Minimatch {
    options;
    set;
    pattern;
    windowsPathsNoEscape;
    nonegate;
    negate;
    comment;
    empty;
    preserveMultipleSlashes;
    partial;
    globSet;
    globParts;
    nocase;
    isWindows;
    platform;
    windowsNoMagicRoot;
    regexp;
    constructor(pattern, options = {}) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        options = options || {};
        this.options = options;
        this.pattern = pattern;
        this.platform = options.platform || defaultPlatform;
        this.isWindows = this.platform === 'win32';
        this.windowsPathsNoEscape =
            !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
            this.pattern = this.pattern.replace(/\\/g, '/');
        }
        this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
        this.regexp = null;
        this.negate = false;
        this.nonegate = !!options.nonegate;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.nocase = !!this.options.nocase;
        this.windowsNoMagicRoot =
            options.windowsNoMagicRoot !== undefined
                ? options.windowsNoMagicRoot
                : !!(this.isWindows && this.nocase);
        this.globSet = [];
        this.globParts = [];
        this.set = [];
        // make the set of regexps etc.
        this.make();
    }
    hasMagic() {
        if (this.options.magicalBraces && this.set.length > 1) {
            return true;
        }
        for (const pattern of this.set) {
            for (const part of pattern) {
                if (typeof part !== 'string')
                    return true;
            }
        }
        return false;
    }
    debug(..._) { }
    make() {
        const pattern = this.pattern;
        const options = this.options;
        // empty patterns and comments match nothing.
        if (!options.nocomment && pattern.charAt(0) === '#') {
            this.comment = true;
            return;
        }
        if (!pattern) {
            this.empty = true;
            return;
        }
        // step 1: figure out negation, etc.
        this.parseNegate();
        // step 2: expand braces
        this.globSet = [...new Set(this.braceExpand())];
        if (options.debug) {
            this.debug = (...args) => console.error(...args);
        }
        this.debug(this.pattern, this.globSet);
        // step 3: now we have a set, so turn each one into a series of
        // path-portion matching patterns.
        // These will be regexps, except in the case of "**", which is
        // set to the GLOBSTAR object for globstar behavior,
        // and will not contain any / characters
        //
        // First, we preprocess to make the glob pattern sets a bit simpler
        // and deduped.  There are some perf-killing patterns that can cause
        // problems with a glob walk, but we can simplify them down a bit.
        const rawGlobParts = this.globSet.map(s => this.slashSplit(s));
        this.globParts = this.preprocess(rawGlobParts);
        this.debug(this.pattern, this.globParts);
        // glob --> regexps
        let set = this.globParts.map((s, _, __) => {
            if (this.isWindows && this.windowsNoMagicRoot) {
                // check if it's a drive or unc path.
                const isUNC = s[0] === '' &&
                    s[1] === '' &&
                    (s[2] === '?' || !globMagic.test(s[2])) &&
                    !globMagic.test(s[3]);
                const isDrive = /^[a-z]:/i.test(s[0]);
                if (isUNC) {
                    return [...s.slice(0, 4), ...s.slice(4).map(ss => this.parse(ss))];
                }
                else if (isDrive) {
                    return [s[0], ...s.slice(1).map(ss => this.parse(ss))];
                }
            }
            return s.map(ss => this.parse(ss));
        });
        this.debug(this.pattern, set);
        // filter out everything that didn't compile properly.
        this.set = set.filter(s => s.indexOf(false) === -1);
        // do not treat the ? in UNC paths as magic
        if (this.isWindows) {
            for (let i = 0; i < this.set.length; i++) {
                const p = this.set[i];
                if (p[0] === '' &&
                    p[1] === '' &&
                    this.globParts[i][2] === '?' &&
                    typeof p[3] === 'string' &&
                    /^[a-z]:$/i.test(p[3])) {
                    p[2] = '?';
                }
            }
        }
        this.debug(this.pattern, this.set);
    }
    // various transforms to equivalent pattern sets that are
    // faster to process in a filesystem walk.  The goal is to
    // eliminate what we can, and push all ** patterns as far
    // to the right as possible, even if it increases the number
    // of patterns that we have to process.
    preprocess(globParts) {
        // if we're not in globstar mode, then turn all ** into *
        if (this.options.noglobstar) {
            for (let i = 0; i < globParts.length; i++) {
                for (let j = 0; j < globParts[i].length; j++) {
                    if (globParts[i][j] === '**') {
                        globParts[i][j] = '*';
                    }
                }
            }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            // aggressive optimization for the purpose of fs walking
            globParts = this.firstPhasePreProcess(globParts);
            globParts = this.secondPhasePreProcess(globParts);
        }
        else if (optimizationLevel >= 1) {
            // just basic optimizations to remove some .. parts
            globParts = this.levelOneOptimize(globParts);
        }
        else {
            globParts = this.adjascentGlobstarOptimize(globParts);
        }
        return globParts;
    }
    // just get rid of adjascent ** portions
    adjascentGlobstarOptimize(globParts) {
        return globParts.map(parts => {
            let gs = -1;
            while (-1 !== (gs = parts.indexOf('**', gs + 1))) {
                let i = gs;
                while (parts[i + 1] === '**') {
                    i++;
                }
                if (i !== gs) {
                    parts.splice(gs, i - gs);
                }
            }
            return parts;
        });
    }
    // get rid of adjascent ** and resolve .. portions
    levelOneOptimize(globParts) {
        return globParts.map(parts => {
            parts = parts.reduce((set, part) => {
                const prev = set[set.length - 1];
                if (part === '**' && prev === '**') {
                    return set;
                }
                if (part === '..') {
                    if (prev && prev !== '..' && prev !== '.' && prev !== '**') {
                        set.pop();
                        return set;
                    }
                }
                set.push(part);
                return set;
            }, []);
            return parts.length === 0 ? [''] : parts;
        });
    }
    levelTwoFileOptimize(parts) {
        if (!Array.isArray(parts)) {
            parts = this.slashSplit(parts);
        }
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/<e>/<rest> -> <pre>/<rest>
            if (!this.preserveMultipleSlashes) {
                for (let i = 1; i < parts.length - 1; i++) {
                    const p = parts[i];
                    // don't squeeze out UNC patterns
                    if (i === 1 && p === '' && parts[0] === '')
                        continue;
                    if (p === '.' || p === '') {
                        didSomething = true;
                        parts.splice(i, 1);
                        i--;
                    }
                }
                if (parts[0] === '.' &&
                    parts.length === 2 &&
                    (parts[1] === '.' || parts[1] === '')) {
                    didSomething = true;
                    parts.pop();
                }
            }
            // <pre>/<p>/../<rest> -> <pre>/<rest>
            let dd = 0;
            while (-1 !== (dd = parts.indexOf('..', dd + 1))) {
                const p = parts[dd - 1];
                if (p && p !== '.' && p !== '..' && p !== '**') {
                    didSomething = true;
                    parts.splice(dd - 1, 2);
                    dd -= 2;
                }
            }
        } while (didSomething);
        return parts.length === 0 ? [''] : parts;
    }
    // First phase: single-pattern processing
    // <pre> is 1 or more portions
    // <rest> is 1 or more portions
    // <p> is any portion other than ., .., '', or **
    // <e> is . or ''
    //
    // **/.. is *brutal* for filesystem walking performance, because
    // it effectively resets the recursive walk each time it occurs,
    // and ** cannot be reduced out by a .. pattern part like a regexp
    // or most strings (other than .., ., and '') can be.
    //
    // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
    // <pre>/<e>/<rest> -> <pre>/<rest>
    // <pre>/<p>/../<rest> -> <pre>/<rest>
    // **/**/<rest> -> **/<rest>
    //
    // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
    // this WOULD be allowed if ** did follow symlinks, or * didn't
    firstPhasePreProcess(globParts) {
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
            for (let parts of globParts) {
                let gs = -1;
                while (-1 !== (gs = parts.indexOf('**', gs + 1))) {
                    let gss = gs;
                    while (parts[gss + 1] === '**') {
                        // <pre>/**/**/<rest> -> <pre>/**/<rest>
                        gss++;
                    }
                    // eg, if gs is 2 and gss is 4, that means we have 3 **
                    // parts, and can remove 2 of them.
                    if (gss > gs) {
                        parts.splice(gs + 1, gss - gs);
                    }
                    let next = parts[gs + 1];
                    const p = parts[gs + 2];
                    const p2 = parts[gs + 3];
                    if (next !== '..')
                        continue;
                    if (!p ||
                        p === '.' ||
                        p === '..' ||
                        !p2 ||
                        p2 === '.' ||
                        p2 === '..') {
                        continue;
                    }
                    didSomething = true;
                    // edit parts in place, and push the new one
                    parts.splice(gs, 1);
                    const other = parts.slice(0);
                    other[gs] = '**';
                    globParts.push(other);
                    gs--;
                }
                // <pre>/<e>/<rest> -> <pre>/<rest>
                if (!this.preserveMultipleSlashes) {
                    for (let i = 1; i < parts.length - 1; i++) {
                        const p = parts[i];
                        // don't squeeze out UNC patterns
                        if (i === 1 && p === '' && parts[0] === '')
                            continue;
                        if (p === '.' || p === '') {
                            didSomething = true;
                            parts.splice(i, 1);
                            i--;
                        }
                    }
                    if (parts[0] === '.' &&
                        parts.length === 2 &&
                        (parts[1] === '.' || parts[1] === '')) {
                        didSomething = true;
                        parts.pop();
                    }
                }
                // <pre>/<p>/../<rest> -> <pre>/<rest>
                let dd = 0;
                while (-1 !== (dd = parts.indexOf('..', dd + 1))) {
                    const p = parts[dd - 1];
                    if (p && p !== '.' && p !== '..' && p !== '**') {
                        didSomething = true;
                        const needDot = dd === 1 && parts[dd + 1] === '**';
                        const splin = needDot ? ['.'] : [];
                        parts.splice(dd - 1, 2, ...splin);
                        if (parts.length === 0)
                            parts.push('');
                        dd -= 2;
                    }
                }
            }
        } while (didSomething);
        return globParts;
    }
    // second phase: multi-pattern dedupes
    // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
    // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
    // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
    //
    // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
    // ^-- not valid because ** doens't follow symlinks
    secondPhasePreProcess(globParts) {
        for (let i = 0; i < globParts.length - 1; i++) {
            for (let j = i + 1; j < globParts.length; j++) {
                const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
                if (!matched)
                    continue;
                globParts[i] = matched;
                globParts[j] = [];
            }
        }
        return globParts.filter(gs => gs.length);
    }
    partsMatch(a, b, emptyGSMatch = false) {
        let ai = 0;
        let bi = 0;
        let result = [];
        let which = '';
        while (ai < a.length && bi < b.length) {
            if (a[ai] === b[bi]) {
                result.push(which === 'b' ? b[bi] : a[ai]);
                ai++;
                bi++;
            }
            else if (emptyGSMatch && a[ai] === '**' && b[bi] === a[ai + 1]) {
                result.push(a[ai]);
                ai++;
            }
            else if (emptyGSMatch && b[bi] === '**' && a[ai] === b[bi + 1]) {
                result.push(b[bi]);
                bi++;
            }
            else if (a[ai] === '*' &&
                b[bi] &&
                (this.options.dot || !b[bi].startsWith('.')) &&
                b[bi] !== '**') {
                if (which === 'b')
                    return false;
                which = 'a';
                result.push(a[ai]);
                ai++;
                bi++;
            }
            else if (b[bi] === '*' &&
                a[ai] &&
                (this.options.dot || !a[ai].startsWith('.')) &&
                a[ai] !== '**') {
                if (which === 'a')
                    return false;
                which = 'b';
                result.push(b[bi]);
                ai++;
                bi++;
            }
            else {
                return false;
            }
        }
        // if we fall out of the loop, it means they two are identical
        // as long as their lengths match
        return a.length === b.length && result;
    }
    parseNegate() {
        if (this.nonegate)
            return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for (let i = 0; i < pattern.length && pattern.charAt(i) === '!'; i++) {
            negate = !negate;
            negateOffset++;
        }
        if (negateOffset)
            this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
    }
    // set partial to true to test if, for example,
    // "/a/b" matches the start of "/*/b/*/d"
    // Partial means, if you run out of file before you run
    // out of pattern, then that's fine, as long as all
    // the parts match.
    matchOne(file, pattern, partial = false) {
        const options = this.options;
        // UNC paths like //?/X:/... can match X:/... and vice versa
        // Drive letters in absolute drive or unc paths are always compared
        // case-insensitively.
        if (this.isWindows) {
            const fileDrive = typeof file[0] === 'string' && /^[a-z]:$/i.test(file[0]);
            const fileUNC = !fileDrive &&
                file[0] === '' &&
                file[1] === '' &&
                file[2] === '?' &&
                /^[a-z]:$/i.test(file[3]);
            const patternDrive = typeof pattern[0] === 'string' && /^[a-z]:$/i.test(pattern[0]);
            const patternUNC = !patternDrive &&
                pattern[0] === '' &&
                pattern[1] === '' &&
                pattern[2] === '?' &&
                typeof pattern[3] === 'string' &&
                /^[a-z]:$/i.test(pattern[3]);
            const fdi = fileUNC ? 3 : fileDrive ? 0 : undefined;
            const pdi = patternUNC ? 3 : patternDrive ? 0 : undefined;
            if (typeof fdi === 'number' && typeof pdi === 'number') {
                const [fd, pd] = [file[fdi], pattern[pdi]];
                if (fd.toLowerCase() === pd.toLowerCase()) {
                    pattern[pdi] = fd;
                    if (pdi > fdi) {
                        pattern = pattern.slice(pdi);
                    }
                    else if (fdi > pdi) {
                        file = file.slice(fdi);
                    }
                }
            }
        }
        // resolve and reduce . and .. portions in the file as well.
        // dont' need to do the second phase, because it's only one string[]
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            file = this.levelTwoFileOptimize(file);
        }
        this.debug('matchOne', this, { file, pattern });
        this.debug('matchOne', file.length, pattern.length);
        for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
            this.debug('matchOne loop');
            var p = pattern[pi];
            var f = file[fi];
            this.debug(pattern, p, f);
            // should be impossible.
            // some invalid regexp stuff in the set.
            /* c8 ignore start */
            if (p === false) {
                return false;
            }
            /* c8 ignore stop */
            if (p === exports.GLOBSTAR) {
                this.debug('GLOBSTAR', [pattern, p, f]);
                // "**"
                // a/**/b/**/c would match the following:
                // a/b/x/y/z/c
                // a/x/y/z/b/c
                // a/b/x/b/x/c
                // a/b/c
                // To do this, take the rest of the pattern after
                // the **, and see if it would match the file remainder.
                // If so, return success.
                // If not, the ** "swallows" a segment, and try again.
                // This is recursively awful.
                //
                // a/**/b/**/c matching a/b/x/y/z/c
                // - a matches a
                // - doublestar
                //   - matchOne(b/x/y/z/c, b/**/c)
                //     - b matches b
                //     - doublestar
                //       - matchOne(x/y/z/c, c) -> no
                //       - matchOne(y/z/c, c) -> no
                //       - matchOne(z/c, c) -> no
                //       - matchOne(c, c) yes, hit
                var fr = fi;
                var pr = pi + 1;
                if (pr === pl) {
                    this.debug('** at the end');
                    // a ** at the end will just swallow the rest.
                    // We have found a match.
                    // however, it will not swallow /.x, unless
                    // options.dot is set.
                    // . and .. are *never* matched by **, for explosively
                    // exponential reasons.
                    for (; fi < fl; fi++) {
                        if (file[fi] === '.' ||
                            file[fi] === '..' ||
                            (!options.dot && file[fi].charAt(0) === '.'))
                            return false;
                    }
                    return true;
                }
                // ok, let's see if we can swallow whatever we can.
                while (fr < fl) {
                    var swallowee = file[fr];
                    this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);
                    // XXX remove this slice.  Just pass the start index.
                    if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                        this.debug('globstar found match!', fr, fl, swallowee);
                        // found a match.
                        return true;
                    }
                    else {
                        // can't swallow "." or ".." ever.
                        // can only swallow ".foo" when explicitly asked.
                        if (swallowee === '.' ||
                            swallowee === '..' ||
                            (!options.dot && swallowee.charAt(0) === '.')) {
                            this.debug('dot detected!', file, fr, pattern, pr);
                            break;
                        }
                        // ** swallows a segment, and continue.
                        this.debug('globstar swallow a segment, and continue');
                        fr++;
                    }
                }
                // no match was found.
                // However, in partial mode, we can't say this is necessarily over.
                /* c8 ignore start */
                if (partial) {
                    // ran out of file
                    this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
                    if (fr === fl) {
                        return true;
                    }
                }
                /* c8 ignore stop */
                return false;
            }
            // something other than **
            // non-magic patterns just have to match exactly
            // patterns with magic have been turned into regexps.
            let hit;
            if (typeof p === 'string') {
                hit = f === p;
                this.debug('string match', p, f, hit);
            }
            else {
                hit = p.test(f);
                this.debug('pattern match', p, f, hit);
            }
            if (!hit)
                return false;
        }
        // Note: ending in / means that we'll get a final ""
        // at the end of the pattern.  This can only match a
        // corresponding "" at the end of the file.
        // If the file ends in /, then it can only match a
        // a pattern that ends in /, unless the pattern just
        // doesn't have any more for it. But, a/b/ should *not*
        // match "a/b/*", even though "" matches against the
        // [^/]*? pattern, except in partial mode, where it might
        // simply not be reached yet.
        // However, a/b/ should still satisfy a/*
        // now either we fell off the end of the pattern, or we're done.
        if (fi === fl && pi === pl) {
            // ran out of pattern and filename at the same time.
            // an exact hit!
            return true;
        }
        else if (fi === fl) {
            // ran out of file, but still had pattern left.
            // this is ok if we're doing the match as part of
            // a glob fs traversal.
            return partial;
        }
        else if (pi === pl) {
            // ran out of pattern, still have file left.
            // this is only acceptable if we're on the very last
            // empty segment of a file with a trailing slash.
            // a/* should match a/b/
            return fi === fl - 1 && file[fi] === '';
            /* c8 ignore start */
        }
        else {
            // should be unreachable.
            throw new Error('wtf?');
        }
        /* c8 ignore stop */
    }
    braceExpand() {
        return (0, exports.braceExpand)(this.pattern, this.options);
    }
    parse(pattern) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        const options = this.options;
        // shortcuts
        if (pattern === '**')
            return exports.GLOBSTAR;
        if (pattern === '')
            return '';
        // far and away, the most common glob pattern parts are
        // *, *.*, and *.<ext>  Add a fast check method for those.
        let m;
        let fastTest = null;
        if ((m = pattern.match(starRE))) {
            fastTest = options.dot ? starTestDot : starTest;
        }
        else if ((m = pattern.match(starDotExtRE))) {
            fastTest = (options.nocase
                ? options.dot
                    ? starDotExtTestNocaseDot
                    : starDotExtTestNocase
                : options.dot
                    ? starDotExtTestDot
                    : starDotExtTest)(m[1]);
        }
        else if ((m = pattern.match(qmarksRE))) {
            fastTest = (options.nocase
                ? options.dot
                    ? qmarksTestNocaseDot
                    : qmarksTestNocase
                : options.dot
                    ? qmarksTestDot
                    : qmarksTest)(m);
        }
        else if ((m = pattern.match(starDotStarRE))) {
            fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
        }
        else if ((m = pattern.match(dotStarRE))) {
            fastTest = dotStarTest;
        }
        const re = ast_js_1.AST.fromGlob(pattern, this.options).toMMPattern();
        return fastTest ? Object.assign(re, { test: fastTest }) : re;
    }
    makeRe() {
        if (this.regexp || this.regexp === false)
            return this.regexp;
        // at this point, this.set is a 2d array of partial
        // pattern strings, or "**".
        //
        // It's better to use .match().  This function shouldn't
        // be used, really, but it's pretty convenient sometimes,
        // when you just want to work with a regex.
        const set = this.set;
        if (!set.length) {
            this.regexp = false;
            return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar
            ? star
            : options.dot
                ? twoStarDot
                : twoStarNoDot;
        const flags = new Set(options.nocase ? ['i'] : []);
        // regexpify non-globstar patterns
        // if ** is only item, then we just do one twoStar
        // if ** is first, and there are more, prepend (\/|twoStar\/)? to next
        // if ** is last, append (\/twoStar|) to previous
        // if ** is in the middle, append (\/|\/twoStar\/) to previous
        // then filter out GLOBSTAR symbols
        let re = set
            .map(pattern => {
            const pp = pattern.map(p => {
                if (p instanceof RegExp) {
                    for (const f of p.flags.split(''))
                        flags.add(f);
                }
                return typeof p === 'string'
                    ? regExpEscape(p)
                    : p === exports.GLOBSTAR
                        ? exports.GLOBSTAR
                        : p._src;
            });
            pp.forEach((p, i) => {
                const next = pp[i + 1];
                const prev = pp[i - 1];
                if (p !== exports.GLOBSTAR || prev === exports.GLOBSTAR) {
                    return;
                }
                if (prev === undefined) {
                    if (next !== undefined && next !== exports.GLOBSTAR) {
                        pp[i + 1] = '(?:\\/|' + twoStar + '\\/)?' + next;
                    }
                    else {
                        pp[i] = twoStar;
                    }
                }
                else if (next === undefined) {
                    pp[i - 1] = prev + '(?:\\/|' + twoStar + ')?';
                }
                else if (next !== exports.GLOBSTAR) {
                    pp[i - 1] = prev + '(?:\\/|\\/' + twoStar + '\\/)' + next;
                    pp[i + 1] = exports.GLOBSTAR;
                }
            });
            return pp.filter(p => p !== exports.GLOBSTAR).join('/');
        })
            .join('|');
        // need to wrap in parens if we had more than one thing with |,
        // otherwise only the first will be anchored to ^ and the last to $
        const [open, close] = set.length > 1 ? ['(?:', ')'] : ['', ''];
        // must match entire pattern
        // ending in a * or ** will make it less strict.
        re = '^' + open + re + close + '$';
        // can match anything, as long as it's not this.
        if (this.negate)
            re = '^(?!' + re + ').+$';
        try {
            this.regexp = new RegExp(re, [...flags].join(''));
            /* c8 ignore start */
        }
        catch (ex) {
            // should be impossible
            this.regexp = false;
        }
        /* c8 ignore stop */
        return this.regexp;
    }
    slashSplit(p) {
        // if p starts with // on windows, we preserve that
        // so that UNC paths aren't broken.  Otherwise, any number of
        // / characters are coalesced into one, unless
        // preserveMultipleSlashes is set to true.
        if (this.preserveMultipleSlashes) {
            return p.split('/');
        }
        else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
            // add an extra '' for the one we lose
            return ['', ...p.split(/\/+/)];
        }
        else {
            return p.split(/\/+/);
        }
    }
    match(f, partial = this.partial) {
        this.debug('match', f, this.pattern);
        // short-circuit in the case of busted things.
        // comments, etc.
        if (this.comment) {
            return false;
        }
        if (this.empty) {
            return f === '';
        }
        if (f === '/' && partial) {
            return true;
        }
        const options = this.options;
        // windows: need to use /, not \
        if (this.isWindows) {
            f = f.split('\\').join('/');
        }
        // treat the test path as a set of pathparts.
        const ff = this.slashSplit(f);
        this.debug(this.pattern, 'split', ff);
        // just ONE of the pattern sets in this.set needs to match
        // in order for it to be valid.  If negating, then just one
        // match means that we have failed.
        // Either way, return on the first hit.
        const set = this.set;
        this.debug(this.pattern, 'set', set);
        // Find the basename of the path by looking for the last non-empty segment
        let filename = ff[ff.length - 1];
        if (!filename) {
            for (let i = ff.length - 2; !filename && i >= 0; i--) {
                filename = ff[i];
            }
        }
        for (let i = 0; i < set.length; i++) {
            const pattern = set[i];
            let file = ff;
            if (options.matchBase && pattern.length === 1) {
                file = [filename];
            }
            const hit = this.matchOne(file, pattern, partial);
            if (hit) {
                if (options.flipNegate) {
                    return true;
                }
                return !this.negate;
            }
        }
        // didn't get any hits.  this is success if it's a negative
        // pattern, failure otherwise.
        if (options.flipNegate) {
            return false;
        }
        return this.negate;
    }
    static defaults(def) {
        return exports.minimatch.defaults(def).Minimatch;
    }
}
exports.Minimatch = Minimatch;
/* c8 ignore start */
var ast_js_2 = __nccwpck_require__(7642);
Object.defineProperty(exports, "AST", ({ enumerable: true, get: function () { return ast_js_2.AST; } }));
var escape_js_2 = __nccwpck_require__(1477);
Object.defineProperty(exports, "escape", ({ enumerable: true, get: function () { return escape_js_2.escape; } }));
var unescape_js_2 = __nccwpck_require__(9820);
Object.defineProperty(exports, "unescape", ({ enumerable: true, get: function () { return unescape_js_2.unescape; } }));
/* c8 ignore stop */
exports.minimatch.AST = ast_js_1.AST;
exports.minimatch.Minimatch = Minimatch;
exports.minimatch.escape = escape_js_1.escape;
exports.minimatch.unescape = unescape_js_1.unescape;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9820:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unescape = void 0;
/**
 * Un-escape a string that has been escaped with {@link escape}.
 *
 * If the {@link windowsPathsNoEscape} option is used, then square-brace
 * escapes are removed, but not backslash escapes.  For example, it will turn
 * the string `'[*]'` into `*`, but it will not turn `'\\*'` into `'*'`,
 * becuase `\` is a path separator in `windowsPathsNoEscape` mode.
 *
 * When `windowsPathsNoEscape` is not set, then both brace escapes and
 * backslash escapes are removed.
 *
 * Slashes (and backslashes in `windowsPathsNoEscape` mode) cannot be escaped
 * or unescaped.
 */
const unescape = (s, { windowsPathsNoEscape = false, } = {}) => {
    return windowsPathsNoEscape
        ? s.replace(/\[([^\/\\])\]/g, '$1')
        : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, '$1$2').replace(/\\([^\/])/g, '$1');
};
exports.unescape = unescape;
//# sourceMappingURL=unescape.js.map

/***/ }),

/***/ 9569:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PathScurry = exports.Path = exports.PathScurryDarwin = exports.PathScurryPosix = exports.PathScurryWin32 = exports.PathScurryBase = exports.PathPosix = exports.PathWin32 = exports.PathBase = exports.ChildrenCache = exports.ResolveCache = void 0;
const lru_cache_1 = __nccwpck_require__(7433);
const path_1 = __nccwpck_require__(1017);
const url_1 = __nccwpck_require__(7310);
const actualFS = __importStar(__nccwpck_require__(7147));
const fs_1 = __nccwpck_require__(7147);
const realpathSync = fs_1.realpathSync.native;
// TODO: test perf of fs/promises realpath vs realpathCB,
// since the promises one uses realpath.native
const promises_1 = __nccwpck_require__(3292);
const minipass_1 = __nccwpck_require__(1077);
const defaultFS = {
    lstatSync: fs_1.lstatSync,
    readdir: fs_1.readdir,
    readdirSync: fs_1.readdirSync,
    readlinkSync: fs_1.readlinkSync,
    realpathSync,
    promises: {
        lstat: promises_1.lstat,
        readdir: promises_1.readdir,
        readlink: promises_1.readlink,
        realpath: promises_1.realpath,
    },
};
// if they just gave us require('fs') then use our default
const fsFromOption = (fsOption) => !fsOption || fsOption === defaultFS || fsOption === actualFS
    ? defaultFS
    : {
        ...defaultFS,
        ...fsOption,
        promises: {
            ...defaultFS.promises,
            ...(fsOption.promises || {}),
        },
    };
// turn something like //?/c:/ into c:\
const uncDriveRegexp = /^\\\\\?\\([a-z]:)\\?$/i;
const uncToDrive = (rootPath) => rootPath.replace(/\//g, '\\').replace(uncDriveRegexp, '$1\\');
// windows paths are separated by either / or \
const eitherSep = /[\\\/]/;
const UNKNOWN = 0; // may not even exist, for all we know
const IFIFO = 0b0001;
const IFCHR = 0b0010;
const IFDIR = 0b0100;
const IFBLK = 0b0110;
const IFREG = 0b1000;
const IFLNK = 0b1010;
const IFSOCK = 0b1100;
const IFMT = 0b1111;
// mask to unset low 4 bits
const IFMT_UNKNOWN = ~IFMT;
// set after successfully calling readdir() and getting entries.
const READDIR_CALLED = 16;
// set after a successful lstat()
const LSTAT_CALLED = 32;
// set if an entry (or one of its parents) is definitely not a dir
const ENOTDIR = 64;
// set if an entry (or one of its parents) does not exist
// (can also be set on lstat errors like EACCES or ENAMETOOLONG)
const ENOENT = 128;
// cannot have child entries -- also verify &IFMT is either IFDIR or IFLNK
// set if we fail to readlink
const ENOREADLINK = 256;
// set if we know realpath() will fail
const ENOREALPATH = 512;
const ENOCHILD = ENOTDIR | ENOENT | ENOREALPATH;
const TYPEMASK = 1023;
const entToType = (s) => s.isFile()
    ? IFREG
    : s.isDirectory()
        ? IFDIR
        : s.isSymbolicLink()
            ? IFLNK
            : s.isCharacterDevice()
                ? IFCHR
                : s.isBlockDevice()
                    ? IFBLK
                    : s.isSocket()
                        ? IFSOCK
                        : s.isFIFO()
                            ? IFIFO
                            : UNKNOWN;
// normalize unicode path names
const normalizeCache = new Map();
const normalize = (s) => {
    const c = normalizeCache.get(s);
    if (c)
        return c;
    const n = s.normalize('NFKD');
    normalizeCache.set(s, n);
    return n;
};
const normalizeNocaseCache = new Map();
const normalizeNocase = (s) => {
    const c = normalizeNocaseCache.get(s);
    if (c)
        return c;
    const n = normalize(s.toLowerCase());
    normalizeNocaseCache.set(s, n);
    return n;
};
/**
 * An LRUCache for storing resolved path strings or Path objects.
 * @internal
 */
class ResolveCache extends lru_cache_1.LRUCache {
    constructor() {
        super({ max: 256 });
    }
}
exports.ResolveCache = ResolveCache;
// In order to prevent blowing out the js heap by allocating hundreds of
// thousands of Path entries when walking extremely large trees, the "children"
// in this tree are represented by storing an array of Path entries in an
// LRUCache, indexed by the parent.  At any time, Path.children() may return an
// empty array, indicating that it doesn't know about any of its children, and
// thus has to rebuild that cache.  This is fine, it just means that we don't
// benefit as much from having the cached entries, but huge directory walks
// don't blow out the stack, and smaller ones are still as fast as possible.
//
//It does impose some complexity when building up the readdir data, because we
//need to pass a reference to the children array that we started with.
/**
 * an LRUCache for storing child entries.
 * @internal
 */
class ChildrenCache extends lru_cache_1.LRUCache {
    constructor(maxSize = 16 * 1024) {
        super({
            maxSize,
            // parent + children
            sizeCalculation: a => a.length + 1,
        });
    }
}
exports.ChildrenCache = ChildrenCache;
const setAsCwd = Symbol('PathScurry setAsCwd');
/**
 * Path objects are sort of like a super-powered
 * {@link https://nodejs.org/docs/latest/api/fs.html#class-fsdirent fs.Dirent}
 *
 * Each one represents a single filesystem entry on disk, which may or may not
 * exist. It includes methods for reading various types of information via
 * lstat, readlink, and readdir, and caches all information to the greatest
 * degree possible.
 *
 * Note that fs operations that would normally throw will instead return an
 * "empty" value. This is in order to prevent excessive overhead from error
 * stack traces.
 */
class PathBase {
    /**
     * the basename of this path
     *
     * **Important**: *always* test the path name against any test string
     * usingthe {@link isNamed} method, and not by directly comparing this
     * string. Otherwise, unicode path strings that the system sees as identical
     * will not be properly treated as the same path, leading to incorrect
     * behavior and possible security issues.
     */
    name;
    /**
     * the Path entry corresponding to the path root.
     *
     * @internal
     */
    root;
    /**
     * All roots found within the current PathScurry family
     *
     * @internal
     */
    roots;
    /**
     * a reference to the parent path, or undefined in the case of root entries
     *
     * @internal
     */
    parent;
    /**
     * boolean indicating whether paths are compared case-insensitively
     * @internal
     */
    nocase;
    // potential default fs override
    #fs;
    // Stats fields
    #dev;
    get dev() {
        return this.#dev;
    }
    #mode;
    get mode() {
        return this.#mode;
    }
    #nlink;
    get nlink() {
        return this.#nlink;
    }
    #uid;
    get uid() {
        return this.#uid;
    }
    #gid;
    get gid() {
        return this.#gid;
    }
    #rdev;
    get rdev() {
        return this.#rdev;
    }
    #blksize;
    get blksize() {
        return this.#blksize;
    }
    #ino;
    get ino() {
        return this.#ino;
    }
    #size;
    get size() {
        return this.#size;
    }
    #blocks;
    get blocks() {
        return this.#blocks;
    }
    #atimeMs;
    get atimeMs() {
        return this.#atimeMs;
    }
    #mtimeMs;
    get mtimeMs() {
        return this.#mtimeMs;
    }
    #ctimeMs;
    get ctimeMs() {
        return this.#ctimeMs;
    }
    #birthtimeMs;
    get birthtimeMs() {
        return this.#birthtimeMs;
    }
    #atime;
    get atime() {
        return this.#atime;
    }
    #mtime;
    get mtime() {
        return this.#mtime;
    }
    #ctime;
    get ctime() {
        return this.#ctime;
    }
    #birthtime;
    get birthtime() {
        return this.#birthtime;
    }
    #matchName;
    #depth;
    #fullpath;
    #fullpathPosix;
    #relative;
    #relativePosix;
    #type;
    #children;
    #linkTarget;
    #realpath;
    /**
     * This property is for compatibility with the Dirent class as of
     * Node v20, where Dirent['path'] refers to the path of the directory
     * that was passed to readdir.  So, somewhat counterintuitively, this
     * property refers to the *parent* path, not the path object itself.
     * For root entries, it's the path to the entry itself.
     */
    get path() {
        return (this.parent || this).fullpath();
    }
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        this.name = name;
        this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
        this.#type = type & TYPEMASK;
        this.nocase = nocase;
        this.roots = roots;
        this.root = root || this;
        this.#children = children;
        this.#fullpath = opts.fullpath;
        this.#relative = opts.relative;
        this.#relativePosix = opts.relativePosix;
        this.parent = opts.parent;
        if (this.parent) {
            this.#fs = this.parent.#fs;
        }
        else {
            this.#fs = fsFromOption(opts.fs);
        }
    }
    /**
     * Returns the depth of the Path object from its root.
     *
     * For example, a path at `/foo/bar` would have a depth of 2.
     */
    depth() {
        if (this.#depth !== undefined)
            return this.#depth;
        if (!this.parent)
            return (this.#depth = 0);
        return (this.#depth = this.parent.depth() + 1);
    }
    /**
     * @internal
     */
    childrenCache() {
        return this.#children;
    }
    /**
     * Get the Path object referenced by the string path, resolved from this Path
     */
    resolve(path) {
        if (!path) {
            return this;
        }
        const rootPath = this.getRootString(path);
        const dir = path.substring(rootPath.length);
        const dirParts = dir.split(this.splitSep);
        const result = rootPath
            ? this.getRoot(rootPath).#resolveParts(dirParts)
            : this.#resolveParts(dirParts);
        return result;
    }
    #resolveParts(dirParts) {
        let p = this;
        for (const part of dirParts) {
            p = p.child(part);
        }
        return p;
    }
    /**
     * Returns the cached children Path objects, if still available.  If they
     * have fallen out of the cache, then returns an empty array, and resets the
     * READDIR_CALLED bit, so that future calls to readdir() will require an fs
     * lookup.
     *
     * @internal
     */
    children() {
        const cached = this.#children.get(this);
        if (cached) {
            return cached;
        }
        const children = Object.assign([], { provisional: 0 });
        this.#children.set(this, children);
        this.#type &= ~READDIR_CALLED;
        return children;
    }
    /**
     * Resolves a path portion and returns or creates the child Path.
     *
     * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
     * `'..'`.
     *
     * This should not be called directly.  If `pathPart` contains any path
     * separators, it will lead to unsafe undefined behavior.
     *
     * Use `Path.resolve()` instead.
     *
     * @internal
     */
    child(pathPart, opts) {
        if (pathPart === '' || pathPart === '.') {
            return this;
        }
        if (pathPart === '..') {
            return this.parent || this;
        }
        // find the child
        const children = this.children();
        const name = this.nocase
            ? normalizeNocase(pathPart)
            : normalize(pathPart);
        for (const p of children) {
            if (p.#matchName === name) {
                return p;
            }
        }
        // didn't find it, create provisional child, since it might not
        // actually exist.  If we know the parent isn't a dir, then
        // in fact it CAN'T exist.
        const s = this.parent ? this.sep : '';
        const fullpath = this.#fullpath
            ? this.#fullpath + s + pathPart
            : undefined;
        const pchild = this.newChild(pathPart, UNKNOWN, {
            ...opts,
            parent: this,
            fullpath,
        });
        if (!this.canReaddir()) {
            pchild.#type |= ENOENT;
        }
        // don't have to update provisional, because if we have real children,
        // then provisional is set to children.length, otherwise a lower number
        children.push(pchild);
        return pchild;
    }
    /**
     * The relative path from the cwd. If it does not share an ancestor with
     * the cwd, then this ends up being equivalent to the fullpath()
     */
    relative() {
        if (this.#relative !== undefined) {
            return this.#relative;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return (this.#relative = this.name);
        }
        const pv = p.relative();
        return pv + (!pv || !p.parent ? '' : this.sep) + name;
    }
    /**
     * The relative path from the cwd, using / as the path separator.
     * If it does not share an ancestor with
     * the cwd, then this ends up being equivalent to the fullpathPosix()
     * On posix systems, this is identical to relative().
     */
    relativePosix() {
        if (this.sep === '/')
            return this.relative();
        if (this.#relativePosix !== undefined)
            return this.#relativePosix;
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return (this.#relativePosix = this.fullpathPosix());
        }
        const pv = p.relativePosix();
        return pv + (!pv || !p.parent ? '' : '/') + name;
    }
    /**
     * The fully resolved path string for this Path entry
     */
    fullpath() {
        if (this.#fullpath !== undefined) {
            return this.#fullpath;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
            return (this.#fullpath = this.name);
        }
        const pv = p.fullpath();
        const fp = pv + (!p.parent ? '' : this.sep) + name;
        return (this.#fullpath = fp);
    }
    /**
     * On platforms other than windows, this is identical to fullpath.
     *
     * On windows, this is overridden to return the forward-slash form of the
     * full UNC path.
     */
    fullpathPosix() {
        if (this.#fullpathPosix !== undefined)
            return this.#fullpathPosix;
        if (this.sep === '/')
            return (this.#fullpathPosix = this.fullpath());
        if (!this.parent) {
            const p = this.fullpath().replace(/\\/g, '/');
            if (/^[a-z]:\//i.test(p)) {
                return (this.#fullpathPosix = `//?/${p}`);
            }
            else {
                return (this.#fullpathPosix = p);
            }
        }
        const p = this.parent;
        const pfpp = p.fullpathPosix();
        const fpp = pfpp + (!pfpp || !p.parent ? '' : '/') + this.name;
        return (this.#fullpathPosix = fpp);
    }
    /**
     * Is the Path of an unknown type?
     *
     * Note that we might know *something* about it if there has been a previous
     * filesystem operation, for example that it does not exist, or is not a
     * link, or whether it has child entries.
     */
    isUnknown() {
        return (this.#type & IFMT) === UNKNOWN;
    }
    isType(type) {
        return this[`is${type}`]();
    }
    getType() {
        return this.isUnknown()
            ? 'Unknown'
            : this.isDirectory()
                ? 'Directory'
                : this.isFile()
                    ? 'File'
                    : this.isSymbolicLink()
                        ? 'SymbolicLink'
                        : this.isFIFO()
                            ? 'FIFO'
                            : this.isCharacterDevice()
                                ? 'CharacterDevice'
                                : this.isBlockDevice()
                                    ? 'BlockDevice'
                                    : /* c8 ignore start */ this.isSocket()
                                        ? 'Socket'
                                        : 'Unknown';
        /* c8 ignore stop */
    }
    /**
     * Is the Path a regular file?
     */
    isFile() {
        return (this.#type & IFMT) === IFREG;
    }
    /**
     * Is the Path a directory?
     */
    isDirectory() {
        return (this.#type & IFMT) === IFDIR;
    }
    /**
     * Is the path a character device?
     */
    isCharacterDevice() {
        return (this.#type & IFMT) === IFCHR;
    }
    /**
     * Is the path a block device?
     */
    isBlockDevice() {
        return (this.#type & IFMT) === IFBLK;
    }
    /**
     * Is the path a FIFO pipe?
     */
    isFIFO() {
        return (this.#type & IFMT) === IFIFO;
    }
    /**
     * Is the path a socket?
     */
    isSocket() {
        return (this.#type & IFMT) === IFSOCK;
    }
    /**
     * Is the path a symbolic link?
     */
    isSymbolicLink() {
        return (this.#type & IFLNK) === IFLNK;
    }
    /**
     * Return the entry if it has been subject of a successful lstat, or
     * undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* simply
     * mean that we haven't called lstat on it.
     */
    lstatCached() {
        return this.#type & LSTAT_CALLED ? this : undefined;
    }
    /**
     * Return the cached link target if the entry has been the subject of a
     * successful readlink, or undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * readlink() has been called at some point.
     */
    readlinkCached() {
        return this.#linkTarget;
    }
    /**
     * Returns the cached realpath target if the entry has been the subject
     * of a successful realpath, or undefined otherwise.
     *
     * Does not read the filesystem, so an undefined result *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * realpath() has been called at some point.
     */
    realpathCached() {
        return this.#realpath;
    }
    /**
     * Returns the cached child Path entries array if the entry has been the
     * subject of a successful readdir(), or [] otherwise.
     *
     * Does not read the filesystem, so an empty array *could* just mean we
     * don't have any cached data. Only use it if you are very sure that a
     * readdir() has been called recently enough to still be valid.
     */
    readdirCached() {
        const children = this.children();
        return children.slice(0, children.provisional);
    }
    /**
     * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
     * any indication that readlink will definitely fail.
     *
     * Returns false if the path is known to not be a symlink, if a previous
     * readlink failed, or if the entry does not exist.
     */
    canReadlink() {
        if (this.#linkTarget)
            return true;
        if (!this.parent)
            return false;
        // cases where it cannot possibly succeed
        const ifmt = this.#type & IFMT;
        return !((ifmt !== UNKNOWN && ifmt !== IFLNK) ||
            this.#type & ENOREADLINK ||
            this.#type & ENOENT);
    }
    /**
     * Return true if readdir has previously been successfully called on this
     * path, indicating that cachedReaddir() is likely valid.
     */
    calledReaddir() {
        return !!(this.#type & READDIR_CALLED);
    }
    /**
     * Returns true if the path is known to not exist. That is, a previous lstat
     * or readdir failed to verify its existence when that would have been
     * expected, or a parent entry was marked either enoent or enotdir.
     */
    isENOENT() {
        return !!(this.#type & ENOENT);
    }
    /**
     * Return true if the path is a match for the given path name.  This handles
     * case sensitivity and unicode normalization.
     *
     * Note: even on case-sensitive systems, it is **not** safe to test the
     * equality of the `.name` property to determine whether a given pathname
     * matches, due to unicode normalization mismatches.
     *
     * Always use this method instead of testing the `path.name` property
     * directly.
     */
    isNamed(n) {
        return !this.nocase
            ? this.#matchName === normalize(n)
            : this.#matchName === normalizeNocase(n);
    }
    /**
     * Return the Path object corresponding to the target of a symbolic link.
     *
     * If the Path is not a symbolic link, or if the readlink call fails for any
     * reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     */
    async readlink() {
        const target = this.#linkTarget;
        if (target) {
            return target;
        }
        if (!this.canReadlink()) {
            return undefined;
        }
        /* c8 ignore start */
        // already covered by the canReadlink test, here for ts grumples
        if (!this.parent) {
            return undefined;
        }
        /* c8 ignore stop */
        try {
            const read = await this.#fs.promises.readlink(this.fullpath());
            const linkTarget = this.parent.resolve(read);
            if (linkTarget) {
                return (this.#linkTarget = linkTarget);
            }
        }
        catch (er) {
            this.#readlinkFail(er.code);
            return undefined;
        }
    }
    /**
     * Synchronous {@link PathBase.readlink}
     */
    readlinkSync() {
        const target = this.#linkTarget;
        if (target) {
            return target;
        }
        if (!this.canReadlink()) {
            return undefined;
        }
        /* c8 ignore start */
        // already covered by the canReadlink test, here for ts grumples
        if (!this.parent) {
            return undefined;
        }
        /* c8 ignore stop */
        try {
            const read = this.#fs.readlinkSync(this.fullpath());
            const linkTarget = this.parent.resolve(read);
            if (linkTarget) {
                return (this.#linkTarget = linkTarget);
            }
        }
        catch (er) {
            this.#readlinkFail(er.code);
            return undefined;
        }
    }
    #readdirSuccess(children) {
        // succeeded, mark readdir called bit
        this.#type |= READDIR_CALLED;
        // mark all remaining provisional children as ENOENT
        for (let p = children.provisional; p < children.length; p++) {
            children[p].#markENOENT();
        }
    }
    #markENOENT() {
        // mark as UNKNOWN and ENOENT
        if (this.#type & ENOENT)
            return;
        this.#type = (this.#type | ENOENT) & IFMT_UNKNOWN;
        this.#markChildrenENOENT();
    }
    #markChildrenENOENT() {
        // all children are provisional and do not exist
        const children = this.children();
        children.provisional = 0;
        for (const p of children) {
            p.#markENOENT();
        }
    }
    #markENOREALPATH() {
        this.#type |= ENOREALPATH;
        this.#markENOTDIR();
    }
    // save the information when we know the entry is not a dir
    #markENOTDIR() {
        // entry is not a directory, so any children can't exist.
        // this *should* be impossible, since any children created
        // after it's been marked ENOTDIR should be marked ENOENT,
        // so it won't even get to this point.
        /* c8 ignore start */
        if (this.#type & ENOTDIR)
            return;
        /* c8 ignore stop */
        let t = this.#type;
        // this could happen if we stat a dir, then delete it,
        // then try to read it or one of its children.
        if ((t & IFMT) === IFDIR)
            t &= IFMT_UNKNOWN;
        this.#type = t | ENOTDIR;
        this.#markChildrenENOENT();
    }
    #readdirFail(code = '') {
        // markENOTDIR and markENOENT also set provisional=0
        if (code === 'ENOTDIR' || code === 'EPERM') {
            this.#markENOTDIR();
        }
        else if (code === 'ENOENT') {
            this.#markENOENT();
        }
        else {
            this.children().provisional = 0;
        }
    }
    #lstatFail(code = '') {
        // Windows just raises ENOENT in this case, disable for win CI
        /* c8 ignore start */
        if (code === 'ENOTDIR') {
            // already know it has a parent by this point
            const p = this.parent;
            p.#markENOTDIR();
        }
        else if (code === 'ENOENT') {
            /* c8 ignore stop */
            this.#markENOENT();
        }
    }
    #readlinkFail(code = '') {
        let ter = this.#type;
        ter |= ENOREADLINK;
        if (code === 'ENOENT')
            ter |= ENOENT;
        // windows gets a weird error when you try to readlink a file
        if (code === 'EINVAL' || code === 'UNKNOWN') {
            // exists, but not a symlink, we don't know WHAT it is, so remove
            // all IFMT bits.
            ter &= IFMT_UNKNOWN;
        }
        this.#type = ter;
        // windows just gets ENOENT in this case.  We do cover the case,
        // just disabled because it's impossible on Windows CI
        /* c8 ignore start */
        if (code === 'ENOTDIR' && this.parent) {
            this.parent.#markENOTDIR();
        }
        /* c8 ignore stop */
    }
    #readdirAddChild(e, c) {
        return (this.#readdirMaybePromoteChild(e, c) ||
            this.#readdirAddNewChild(e, c));
    }
    #readdirAddNewChild(e, c) {
        // alloc new entry at head, so it's never provisional
        const type = entToType(e);
        const child = this.newChild(e.name, type, { parent: this });
        const ifmt = child.#type & IFMT;
        if (ifmt !== IFDIR && ifmt !== IFLNK && ifmt !== UNKNOWN) {
            child.#type |= ENOTDIR;
        }
        c.unshift(child);
        c.provisional++;
        return child;
    }
    #readdirMaybePromoteChild(e, c) {
        for (let p = c.provisional; p < c.length; p++) {
            const pchild = c[p];
            const name = this.nocase
                ? normalizeNocase(e.name)
                : normalize(e.name);
            if (name !== pchild.#matchName) {
                continue;
            }
            return this.#readdirPromoteChild(e, pchild, p, c);
        }
    }
    #readdirPromoteChild(e, p, index, c) {
        const v = p.name;
        // retain any other flags, but set ifmt from dirent
        p.#type = (p.#type & IFMT_UNKNOWN) | entToType(e);
        // case sensitivity fixing when we learn the true name.
        if (v !== e.name)
            p.name = e.name;
        // just advance provisional index (potentially off the list),
        // otherwise we have to splice/pop it out and re-insert at head
        if (index !== c.provisional) {
            if (index === c.length - 1)
                c.pop();
            else
                c.splice(index, 1);
            c.unshift(p);
        }
        c.provisional++;
        return p;
    }
    /**
     * Call lstat() on this Path, and update all known information that can be
     * determined.
     *
     * Note that unlike `fs.lstat()`, the returned value does not contain some
     * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
     * information is required, you will need to call `fs.lstat` yourself.
     *
     * If the Path refers to a nonexistent file, or if the lstat call fails for
     * any reason, `undefined` is returned.  Otherwise the updated Path object is
     * returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    async lstat() {
        if ((this.#type & ENOENT) === 0) {
            try {
                this.#applyStat(await this.#fs.promises.lstat(this.fullpath()));
                return this;
            }
            catch (er) {
                this.#lstatFail(er.code);
            }
        }
    }
    /**
     * synchronous {@link PathBase.lstat}
     */
    lstatSync() {
        if ((this.#type & ENOENT) === 0) {
            try {
                this.#applyStat(this.#fs.lstatSync(this.fullpath()));
                return this;
            }
            catch (er) {
                this.#lstatFail(er.code);
            }
        }
    }
    #applyStat(st) {
        const { atime, atimeMs, birthtime, birthtimeMs, blksize, blocks, ctime, ctimeMs, dev, gid, ino, mode, mtime, mtimeMs, nlink, rdev, size, uid, } = st;
        this.#atime = atime;
        this.#atimeMs = atimeMs;
        this.#birthtime = birthtime;
        this.#birthtimeMs = birthtimeMs;
        this.#blksize = blksize;
        this.#blocks = blocks;
        this.#ctime = ctime;
        this.#ctimeMs = ctimeMs;
        this.#dev = dev;
        this.#gid = gid;
        this.#ino = ino;
        this.#mode = mode;
        this.#mtime = mtime;
        this.#mtimeMs = mtimeMs;
        this.#nlink = nlink;
        this.#rdev = rdev;
        this.#size = size;
        this.#uid = uid;
        const ifmt = entToType(st);
        // retain any other flags, but set the ifmt
        this.#type = (this.#type & IFMT_UNKNOWN) | ifmt | LSTAT_CALLED;
        if (ifmt !== UNKNOWN && ifmt !== IFDIR && ifmt !== IFLNK) {
            this.#type |= ENOTDIR;
        }
    }
    #onReaddirCB = [];
    #readdirCBInFlight = false;
    #callOnReaddirCB(children) {
        this.#readdirCBInFlight = false;
        const cbs = this.#onReaddirCB.slice();
        this.#onReaddirCB.length = 0;
        cbs.forEach(cb => cb(null, children));
    }
    /**
     * Standard node-style callback interface to get list of directory entries.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     *
     * @param cb The callback called with (er, entries).  Note that the `er`
     * param is somewhat extraneous, as all readdir() errors are handled and
     * simply result in an empty set of entries being returned.
     * @param allowZalgo Boolean indicating that immediately known results should
     * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
     * zalgo at your peril, the dark pony lord is devious and unforgiving.
     */
    readdirCB(cb, allowZalgo = false) {
        if (!this.canReaddir()) {
            if (allowZalgo)
                cb(null, []);
            else
                queueMicrotask(() => cb(null, []));
            return;
        }
        const children = this.children();
        if (this.calledReaddir()) {
            const c = children.slice(0, children.provisional);
            if (allowZalgo)
                cb(null, c);
            else
                queueMicrotask(() => cb(null, c));
            return;
        }
        // don't have to worry about zalgo at this point.
        this.#onReaddirCB.push(cb);
        if (this.#readdirCBInFlight) {
            return;
        }
        this.#readdirCBInFlight = true;
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        this.#fs.readdir(fullpath, { withFileTypes: true }, (er, entries) => {
            if (er) {
                this.#readdirFail(er.code);
                children.provisional = 0;
            }
            else {
                // if we didn't get an error, we always get entries.
                //@ts-ignore
                for (const e of entries) {
                    this.#readdirAddChild(e, children);
                }
                this.#readdirSuccess(children);
            }
            this.#callOnReaddirCB(children.slice(0, children.provisional));
            return;
        });
    }
    #asyncReaddirInFlight;
    /**
     * Return an array of known child entries.
     *
     * If the Path cannot or does not contain any children, then an empty array
     * is returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    async readdir() {
        if (!this.canReaddir()) {
            return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
            return children.slice(0, children.provisional);
        }
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        if (this.#asyncReaddirInFlight) {
            await this.#asyncReaddirInFlight;
        }
        else {
            /* c8 ignore start */
            let resolve = () => { };
            /* c8 ignore stop */
            this.#asyncReaddirInFlight = new Promise(res => (resolve = res));
            try {
                for (const e of await this.#fs.promises.readdir(fullpath, {
                    withFileTypes: true,
                })) {
                    this.#readdirAddChild(e, children);
                }
                this.#readdirSuccess(children);
            }
            catch (er) {
                this.#readdirFail(er.code);
                children.provisional = 0;
            }
            this.#asyncReaddirInFlight = undefined;
            resolve();
        }
        return children.slice(0, children.provisional);
    }
    /**
     * synchronous {@link PathBase.readdir}
     */
    readdirSync() {
        if (!this.canReaddir()) {
            return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
            return children.slice(0, children.provisional);
        }
        // else read the directory, fill up children
        // de-provisionalize any provisional children.
        const fullpath = this.fullpath();
        try {
            for (const e of this.#fs.readdirSync(fullpath, {
                withFileTypes: true,
            })) {
                this.#readdirAddChild(e, children);
            }
            this.#readdirSuccess(children);
        }
        catch (er) {
            this.#readdirFail(er.code);
            children.provisional = 0;
        }
        return children.slice(0, children.provisional);
    }
    canReaddir() {
        if (this.#type & ENOCHILD)
            return false;
        const ifmt = IFMT & this.#type;
        // we always set ENOTDIR when setting IFMT, so should be impossible
        /* c8 ignore start */
        if (!(ifmt === UNKNOWN || ifmt === IFDIR || ifmt === IFLNK)) {
            return false;
        }
        /* c8 ignore stop */
        return true;
    }
    shouldWalk(dirs, walkFilter) {
        return ((this.#type & IFDIR) === IFDIR &&
            !(this.#type & ENOCHILD) &&
            !dirs.has(this) &&
            (!walkFilter || walkFilter(this)));
    }
    /**
     * Return the Path object corresponding to path as resolved
     * by realpath(3).
     *
     * If the realpath call fails for any reason, `undefined` is returned.
     *
     * Result is cached, and thus may be outdated if the filesystem is mutated.
     * On success, returns a Path object.
     */
    async realpath() {
        if (this.#realpath)
            return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
            return undefined;
        try {
            const rp = await this.#fs.promises.realpath(this.fullpath());
            return (this.#realpath = this.resolve(rp));
        }
        catch (_) {
            this.#markENOREALPATH();
        }
    }
    /**
     * Synchronous {@link realpath}
     */
    realpathSync() {
        if (this.#realpath)
            return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
            return undefined;
        try {
            const rp = this.#fs.realpathSync(this.fullpath());
            return (this.#realpath = this.resolve(rp));
        }
        catch (_) {
            this.#markENOREALPATH();
        }
    }
    /**
     * Internal method to mark this Path object as the scurry cwd,
     * called by {@link PathScurry#chdir}
     *
     * @internal
     */
    [setAsCwd](oldCwd) {
        if (oldCwd === this)
            return;
        const changed = new Set([]);
        let rp = [];
        let p = this;
        while (p && p.parent) {
            changed.add(p);
            p.#relative = rp.join(this.sep);
            p.#relativePosix = rp.join('/');
            p = p.parent;
            rp.push('..');
        }
        // now un-memoize parents of old cwd
        p = oldCwd;
        while (p && p.parent && !changed.has(p)) {
            p.#relative = undefined;
            p.#relativePosix = undefined;
            p = p.parent;
        }
    }
}
exports.PathBase = PathBase;
/**
 * Path class used on win32 systems
 *
 * Uses `'\\'` as the path separator for returned paths, either `'\\'` or `'/'`
 * as the path separator for parsing paths.
 */
class PathWin32 extends PathBase {
    /**
     * Separator for generating path strings.
     */
    sep = '\\';
    /**
     * Separator for parsing path strings.
     */
    splitSep = eitherSep;
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        super(name, type, root, roots, nocase, children, opts);
    }
    /**
     * @internal
     */
    newChild(name, type = UNKNOWN, opts = {}) {
        return new PathWin32(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
    }
    /**
     * @internal
     */
    getRootString(path) {
        return path_1.win32.parse(path).root;
    }
    /**
     * @internal
     */
    getRoot(rootPath) {
        rootPath = uncToDrive(rootPath.toUpperCase());
        if (rootPath === this.root.name) {
            return this.root;
        }
        // ok, not that one, check if it matches another we know about
        for (const [compare, root] of Object.entries(this.roots)) {
            if (this.sameRoot(rootPath, compare)) {
                return (this.roots[rootPath] = root);
            }
        }
        // otherwise, have to create a new one.
        return (this.roots[rootPath] = new PathScurryWin32(rootPath, this).root);
    }
    /**
     * @internal
     */
    sameRoot(rootPath, compare = this.root.name) {
        // windows can (rarely) have case-sensitive filesystem, but
        // UNC and drive letters are always case-insensitive, and canonically
        // represented uppercase.
        rootPath = rootPath
            .toUpperCase()
            .replace(/\//g, '\\')
            .replace(uncDriveRegexp, '$1\\');
        return rootPath === compare;
    }
}
exports.PathWin32 = PathWin32;
/**
 * Path class used on all posix systems.
 *
 * Uses `'/'` as the path separator.
 */
class PathPosix extends PathBase {
    /**
     * separator for parsing path strings
     */
    splitSep = '/';
    /**
     * separator for generating path strings
     */
    sep = '/';
    /**
     * Do not create new Path objects directly.  They should always be accessed
     * via the PathScurry class or other methods on the Path class.
     *
     * @internal
     */
    constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        super(name, type, root, roots, nocase, children, opts);
    }
    /**
     * @internal
     */
    getRootString(path) {
        return path.startsWith('/') ? '/' : '';
    }
    /**
     * @internal
     */
    getRoot(_rootPath) {
        return this.root;
    }
    /**
     * @internal
     */
    newChild(name, type = UNKNOWN, opts = {}) {
        return new PathPosix(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
    }
}
exports.PathPosix = PathPosix;
/**
 * The base class for all PathScurry classes, providing the interface for path
 * resolution and filesystem operations.
 *
 * Typically, you should *not* instantiate this class directly, but rather one
 * of the platform-specific classes, or the exported {@link PathScurry} which
 * defaults to the current platform.
 */
class PathScurryBase {
    /**
     * The root Path entry for the current working directory of this Scurry
     */
    root;
    /**
     * The string path for the root of this Scurry's current working directory
     */
    rootPath;
    /**
     * A collection of all roots encountered, referenced by rootPath
     */
    roots;
    /**
     * The Path entry corresponding to this PathScurry's current working directory.
     */
    cwd;
    #resolveCache;
    #resolvePosixCache;
    #children;
    /**
     * Perform path comparisons case-insensitively.
     *
     * Defaults true on Darwin and Windows systems, false elsewhere.
     */
    nocase;
    #fs;
    /**
     * This class should not be instantiated directly.
     *
     * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
     *
     * @internal
     */
    constructor(cwd = process.cwd(), pathImpl, sep, { nocase, childrenCacheSize = 16 * 1024, fs = defaultFS, } = {}) {
        this.#fs = fsFromOption(fs);
        if (cwd instanceof URL || cwd.startsWith('file://')) {
            cwd = (0, url_1.fileURLToPath)(cwd);
        }
        // resolve and split root, and then add to the store.
        // this is the only time we call path.resolve()
        const cwdPath = pathImpl.resolve(cwd);
        this.roots = Object.create(null);
        this.rootPath = this.parseRootPath(cwdPath);
        this.#resolveCache = new ResolveCache();
        this.#resolvePosixCache = new ResolveCache();
        this.#children = new ChildrenCache(childrenCacheSize);
        const split = cwdPath.substring(this.rootPath.length).split(sep);
        // resolve('/') leaves '', splits to [''], we don't want that.
        if (split.length === 1 && !split[0]) {
            split.pop();
        }
        /* c8 ignore start */
        if (nocase === undefined) {
            throw new TypeError('must provide nocase setting to PathScurryBase ctor');
        }
        /* c8 ignore stop */
        this.nocase = nocase;
        this.root = this.newRoot(this.#fs);
        this.roots[this.rootPath] = this.root;
        let prev = this.root;
        let len = split.length - 1;
        const joinSep = pathImpl.sep;
        let abs = this.rootPath;
        let sawFirst = false;
        for (const part of split) {
            const l = len--;
            prev = prev.child(part, {
                relative: new Array(l).fill('..').join(joinSep),
                relativePosix: new Array(l).fill('..').join('/'),
                fullpath: (abs += (sawFirst ? '' : joinSep) + part),
            });
            sawFirst = true;
        }
        this.cwd = prev;
    }
    /**
     * Get the depth of a provided path, string, or the cwd
     */
    depth(path = this.cwd) {
        if (typeof path === 'string') {
            path = this.cwd.resolve(path);
        }
        return path.depth();
    }
    /**
     * Return the cache of child entries.  Exposed so subclasses can create
     * child Path objects in a platform-specific way.
     *
     * @internal
     */
    childrenCache() {
        return this.#children;
    }
    /**
     * Resolve one or more path strings to a resolved string
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */
    resolve(...paths) {
        // first figure out the minimum number of paths we have to test
        // we always start at cwd, but any absolutes will bump the start
        let r = '';
        for (let i = paths.length - 1; i >= 0; i--) {
            const p = paths[i];
            if (!p || p === '.')
                continue;
            r = r ? `${p}/${r}` : p;
            if (this.isAbsolute(p)) {
                break;
            }
        }
        const cached = this.#resolveCache.get(r);
        if (cached !== undefined) {
            return cached;
        }
        const result = this.cwd.resolve(r).fullpath();
        this.#resolveCache.set(r, result);
        return result;
    }
    /**
     * Resolve one or more path strings to a resolved string, returning
     * the posix path.  Identical to .resolve() on posix systems, but on
     * windows will return a forward-slash separated UNC path.
     *
     * Same interface as require('path').resolve.
     *
     * Much faster than path.resolve() when called multiple times for the same
     * path, because the resolved Path objects are cached.  Much slower
     * otherwise.
     */
    resolvePosix(...paths) {
        // first figure out the minimum number of paths we have to test
        // we always start at cwd, but any absolutes will bump the start
        let r = '';
        for (let i = paths.length - 1; i >= 0; i--) {
            const p = paths[i];
            if (!p || p === '.')
                continue;
            r = r ? `${p}/${r}` : p;
            if (this.isAbsolute(p)) {
                break;
            }
        }
        const cached = this.#resolvePosixCache.get(r);
        if (cached !== undefined) {
            return cached;
        }
        const result = this.cwd.resolve(r).fullpathPosix();
        this.#resolvePosixCache.set(r, result);
        return result;
    }
    /**
     * find the relative path from the cwd to the supplied path string or entry
     */
    relative(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.relative();
    }
    /**
     * find the relative path from the cwd to the supplied path string or
     * entry, using / as the path delimiter, even on Windows.
     */
    relativePosix(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.relativePosix();
    }
    /**
     * Return the basename for the provided string or Path object
     */
    basename(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.name;
    }
    /**
     * Return the dirname for the provided string or Path object
     */
    dirname(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return (entry.parent || entry).fullpath();
    }
    async readdir(entry = this.cwd, opts = {
        withFileTypes: true,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes } = opts;
        if (!entry.canReaddir()) {
            return [];
        }
        else {
            const p = await entry.readdir();
            return withFileTypes ? p : p.map(e => e.name);
        }
    }
    readdirSync(entry = this.cwd, opts = {
        withFileTypes: true,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true } = opts;
        if (!entry.canReaddir()) {
            return [];
        }
        else if (withFileTypes) {
            return entry.readdirSync();
        }
        else {
            return entry.readdirSync().map(e => e.name);
        }
    }
    /**
     * Call lstat() on the string or Path object, and update all known
     * information that can be determined.
     *
     * Note that unlike `fs.lstat()`, the returned value does not contain some
     * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
     * information is required, you will need to call `fs.lstat` yourself.
     *
     * If the Path refers to a nonexistent file, or if the lstat call fails for
     * any reason, `undefined` is returned.  Otherwise the updated Path object is
     * returned.
     *
     * Results are cached, and thus may be out of date if the filesystem is
     * mutated.
     */
    async lstat(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.lstat();
    }
    /**
     * synchronous {@link PathScurryBase.lstat}
     */
    lstatSync(entry = this.cwd) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        return entry.lstatSync();
    }
    async readlink(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = await entry.readlink();
        return withFileTypes ? e : e?.fullpath();
    }
    readlinkSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = entry.readlinkSync();
        return withFileTypes ? e : e?.fullpath();
    }
    async realpath(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = await entry.realpath();
        return withFileTypes ? e : e?.fullpath();
    }
    realpathSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false,
    }) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            withFileTypes = entry.withFileTypes;
            entry = this.cwd;
        }
        const e = entry.realpathSync();
        return withFileTypes ? e : e?.fullpath();
    }
    async walk(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        const results = [];
        if (!filter || filter(entry)) {
            results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set();
        const walk = (dir, cb) => {
            dirs.add(dir);
            dir.readdirCB((er, entries) => {
                /* c8 ignore start */
                if (er) {
                    return cb(er);
                }
                /* c8 ignore stop */
                let len = entries.length;
                if (!len)
                    return cb();
                const next = () => {
                    if (--len === 0) {
                        cb();
                    }
                };
                for (const e of entries) {
                    if (!filter || filter(e)) {
                        results.push(withFileTypes ? e : e.fullpath());
                    }
                    if (follow && e.isSymbolicLink()) {
                        e.realpath()
                            .then(r => (r?.isUnknown() ? r.lstat() : r))
                            .then(r => r?.shouldWalk(dirs, walkFilter) ? walk(r, next) : next());
                    }
                    else {
                        if (e.shouldWalk(dirs, walkFilter)) {
                            walk(e, next);
                        }
                        else {
                            next();
                        }
                    }
                }
            }, true); // zalgooooooo
        };
        const start = entry;
        return new Promise((res, rej) => {
            walk(start, er => {
                /* c8 ignore start */
                if (er)
                    return rej(er);
                /* c8 ignore stop */
                res(results);
            });
        });
    }
    walkSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        const results = [];
        if (!filter || filter(entry)) {
            results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set([entry]);
        for (const dir of dirs) {
            const entries = dir.readdirSync();
            for (const e of entries) {
                if (!filter || filter(e)) {
                    results.push(withFileTypes ? e : e.fullpath());
                }
                let r = e;
                if (e.isSymbolicLink()) {
                    if (!(follow && (r = e.realpathSync())))
                        continue;
                    if (r.isUnknown())
                        r.lstatSync();
                }
                if (r.shouldWalk(dirs, walkFilter)) {
                    dirs.add(r);
                }
            }
        }
        return results;
    }
    /**
     * Support for `for await`
     *
     * Alias for {@link PathScurryBase.iterate}
     *
     * Note: As of Node 19, this is very slow, compared to other methods of
     * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
     * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
     */
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
    iterate(entry = this.cwd, options = {}) {
        // iterating async over the stream is significantly more performant,
        // especially in the warm-cache scenario, because it buffers up directory
        // entries in the background instead of waiting for a yield for each one.
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            options = entry;
            entry = this.cwd;
        }
        return this.stream(entry, options)[Symbol.asyncIterator]();
    }
    /**
     * Iterating over a PathScurry performs a synchronous walk.
     *
     * Alias for {@link PathScurryBase.iterateSync}
     */
    [Symbol.iterator]() {
        return this.iterateSync();
    }
    *iterateSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        if (!filter || filter(entry)) {
            yield withFileTypes ? entry : entry.fullpath();
        }
        const dirs = new Set([entry]);
        for (const dir of dirs) {
            const entries = dir.readdirSync();
            for (const e of entries) {
                if (!filter || filter(e)) {
                    yield withFileTypes ? e : e.fullpath();
                }
                let r = e;
                if (e.isSymbolicLink()) {
                    if (!(follow && (r = e.realpathSync())))
                        continue;
                    if (r.isUnknown())
                        r.lstatSync();
                }
                if (r.shouldWalk(dirs, walkFilter)) {
                    dirs.add(r);
                }
            }
        }
    }
    stream(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        const results = new minipass_1.Minipass({ objectMode: true });
        if (!filter || filter(entry)) {
            results.write(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = new Set();
        const queue = [entry];
        let processing = 0;
        const process = () => {
            let paused = false;
            while (!paused) {
                const dir = queue.shift();
                if (!dir) {
                    if (processing === 0)
                        results.end();
                    return;
                }
                processing++;
                dirs.add(dir);
                const onReaddir = (er, entries, didRealpaths = false) => {
                    /* c8 ignore start */
                    if (er)
                        return results.emit('error', er);
                    /* c8 ignore stop */
                    if (follow && !didRealpaths) {
                        const promises = [];
                        for (const e of entries) {
                            if (e.isSymbolicLink()) {
                                promises.push(e
                                    .realpath()
                                    .then((r) => r?.isUnknown() ? r.lstat() : r));
                            }
                        }
                        if (promises.length) {
                            Promise.all(promises).then(() => onReaddir(null, entries, true));
                            return;
                        }
                    }
                    for (const e of entries) {
                        if (e && (!filter || filter(e))) {
                            if (!results.write(withFileTypes ? e : e.fullpath())) {
                                paused = true;
                            }
                        }
                    }
                    processing--;
                    for (const e of entries) {
                        const r = e.realpathCached() || e;
                        if (r.shouldWalk(dirs, walkFilter)) {
                            queue.push(r);
                        }
                    }
                    if (paused && !results.flowing) {
                        results.once('drain', process);
                    }
                    else if (!sync) {
                        process();
                    }
                };
                // zalgo containment
                let sync = true;
                dir.readdirCB(onReaddir, true);
                sync = false;
            }
        };
        process();
        return results;
    }
    streamSync(entry = this.cwd, opts = {}) {
        if (typeof entry === 'string') {
            entry = this.cwd.resolve(entry);
        }
        else if (!(entry instanceof PathBase)) {
            opts = entry;
            entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter, } = opts;
        const results = new minipass_1.Minipass({ objectMode: true });
        const dirs = new Set();
        if (!filter || filter(entry)) {
            results.write(withFileTypes ? entry : entry.fullpath());
        }
        const queue = [entry];
        let processing = 0;
        const process = () => {
            let paused = false;
            while (!paused) {
                const dir = queue.shift();
                if (!dir) {
                    if (processing === 0)
                        results.end();
                    return;
                }
                processing++;
                dirs.add(dir);
                const entries = dir.readdirSync();
                for (const e of entries) {
                    if (!filter || filter(e)) {
                        if (!results.write(withFileTypes ? e : e.fullpath())) {
                            paused = true;
                        }
                    }
                }
                processing--;
                for (const e of entries) {
                    let r = e;
                    if (e.isSymbolicLink()) {
                        if (!(follow && (r = e.realpathSync())))
                            continue;
                        if (r.isUnknown())
                            r.lstatSync();
                    }
                    if (r.shouldWalk(dirs, walkFilter)) {
                        queue.push(r);
                    }
                }
            }
            if (paused && !results.flowing)
                results.once('drain', process);
        };
        process();
        return results;
    }
    chdir(path = this.cwd) {
        const oldCwd = this.cwd;
        this.cwd = typeof path === 'string' ? this.cwd.resolve(path) : path;
        this.cwd[setAsCwd](oldCwd);
    }
}
exports.PathScurryBase = PathScurryBase;
/**
 * Windows implementation of {@link PathScurryBase}
 *
 * Defaults to case insensitve, uses `'\\'` to generate path strings.  Uses
 * {@link PathWin32} for Path objects.
 */
class PathScurryWin32 extends PathScurryBase {
    /**
     * separator for generating path strings
     */
    sep = '\\';
    constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = true } = opts;
        super(cwd, path_1.win32, '\\', { ...opts, nocase });
        this.nocase = nocase;
        for (let p = this.cwd; p; p = p.parent) {
            p.nocase = this.nocase;
        }
    }
    /**
     * @internal
     */
    parseRootPath(dir) {
        // if the path starts with a single separator, it's not a UNC, and we'll
        // just get separator as the root, and driveFromUNC will return \
        // In that case, mount \ on the root from the cwd.
        return path_1.win32.parse(dir).root.toUpperCase();
    }
    /**
     * @internal
     */
    newRoot(fs) {
        return new PathWin32(this.rootPath, IFDIR, undefined, this.roots, this.nocase, this.childrenCache(), { fs });
    }
    /**
     * Return true if the provided path string is an absolute path
     */
    isAbsolute(p) {
        return (p.startsWith('/') || p.startsWith('\\') || /^[a-z]:(\/|\\)/i.test(p));
    }
}
exports.PathScurryWin32 = PathScurryWin32;
/**
 * {@link PathScurryBase} implementation for all posix systems other than Darwin.
 *
 * Defaults to case-sensitive matching, uses `'/'` to generate path strings.
 *
 * Uses {@link PathPosix} for Path objects.
 */
class PathScurryPosix extends PathScurryBase {
    /**
     * separator for generating path strings
     */
    sep = '/';
    constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = false } = opts;
        super(cwd, path_1.posix, '/', { ...opts, nocase });
        this.nocase = nocase;
    }
    /**
     * @internal
     */
    parseRootPath(_dir) {
        return '/';
    }
    /**
     * @internal
     */
    newRoot(fs) {
        return new PathPosix(this.rootPath, IFDIR, undefined, this.roots, this.nocase, this.childrenCache(), { fs });
    }
    /**
     * Return true if the provided path string is an absolute path
     */
    isAbsolute(p) {
        return p.startsWith('/');
    }
}
exports.PathScurryPosix = PathScurryPosix;
/**
 * {@link PathScurryBase} implementation for Darwin (macOS) systems.
 *
 * Defaults to case-insensitive matching, uses `'/'` for generating path
 * strings.
 *
 * Uses {@link PathPosix} for Path objects.
 */
class PathScurryDarwin extends PathScurryPosix {
    constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = true } = opts;
        super(cwd, { ...opts, nocase });
    }
}
exports.PathScurryDarwin = PathScurryDarwin;
/**
 * Default {@link PathBase} implementation for the current platform.
 *
 * {@link PathWin32} on Windows systems, {@link PathPosix} on all others.
 */
exports.Path = process.platform === 'win32' ? PathWin32 : PathPosix;
/**
 * Default {@link PathScurryBase} implementation for the current platform.
 *
 * {@link PathScurryWin32} on Windows systems, {@link PathScurryDarwin} on
 * Darwin (macOS) systems, {@link PathScurryPosix} on all others.
 */
exports.PathScurry = process.platform === 'win32'
    ? PathScurryWin32
    : process.platform === 'darwin'
        ? PathScurryDarwin
        : PathScurryPosix;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7433:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * @module LRUCache
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LRUCache = void 0;
const perf = typeof performance === 'object' &&
    performance &&
    typeof performance.now === 'function'
    ? performance
    : Date;
const warned = new Set();
/* c8 ignore start */
const PROCESS = (typeof process === 'object' && !!process ? process : {});
/* c8 ignore start */
const emitWarning = (msg, type, code, fn) => {
    typeof PROCESS.emitWarning === 'function'
        ? PROCESS.emitWarning(msg, type, code, fn)
        : console.error(`[${code}] ${type}: ${msg}`);
};
let AC = globalThis.AbortController;
let AS = globalThis.AbortSignal;
/* c8 ignore start */
if (typeof AC === 'undefined') {
    //@ts-ignore
    AS = class AbortSignal {
        onabort;
        _onabort = [];
        reason;
        aborted = false;
        addEventListener(_, fn) {
            this._onabort.push(fn);
        }
    };
    //@ts-ignore
    AC = class AbortController {
        constructor() {
            warnACPolyfill();
        }
        signal = new AS();
        abort(reason) {
            if (this.signal.aborted)
                return;
            //@ts-ignore
            this.signal.reason = reason;
            //@ts-ignore
            this.signal.aborted = true;
            //@ts-ignore
            for (const fn of this.signal._onabort) {
                fn(reason);
            }
            this.signal.onabort?.(reason);
        }
    };
    let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== '1';
    const warnACPolyfill = () => {
        if (!printACPolyfillWarning)
            return;
        printACPolyfillWarning = false;
        emitWarning('AbortController is not defined. If using lru-cache in ' +
            'node 14, load an AbortController polyfill from the ' +
            '`node-abort-controller` package. A minimal polyfill is ' +
            'provided for use by LRUCache.fetch(), but it should not be ' +
            'relied upon in other contexts (eg, passing it to other APIs that ' +
            'use AbortController/AbortSignal might have undesirable effects). ' +
            'You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.', 'NO_ABORT_CONTROLLER', 'ENOTSUP', warnACPolyfill);
    };
}
/* c8 ignore stop */
const shouldWarn = (code) => !warned.has(code);
const TYPE = Symbol('type');
const isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
/* c8 ignore start */
// This is a little bit ridiculous, tbh.
// The maximum array length is 2^32-1 or thereabouts on most JS impls.
// And well before that point, you're caching the entire world, I mean,
// that's ~32GB of just integers for the next/prev links, plus whatever
// else to hold that many keys and values.  Just filling the memory with
// zeroes at init time is brutal when you get that big.
// But why not be complete?
// Maybe in the future, these limits will have expanded.
const getUintArray = (max) => !isPosInt(max)
    ? null
    : max <= Math.pow(2, 8)
        ? Uint8Array
        : max <= Math.pow(2, 16)
            ? Uint16Array
            : max <= Math.pow(2, 32)
                ? Uint32Array
                : max <= Number.MAX_SAFE_INTEGER
                    ? ZeroArray
                    : null;
/* c8 ignore stop */
class ZeroArray extends Array {
    constructor(size) {
        super(size);
        this.fill(0);
    }
}
class Stack {
    heap;
    length;
    // private constructor
    static #constructing = false;
    static create(max) {
        const HeapCls = getUintArray(max);
        if (!HeapCls)
            return [];
        Stack.#constructing = true;
        const s = new Stack(max, HeapCls);
        Stack.#constructing = false;
        return s;
    }
    constructor(max, HeapCls) {
        /* c8 ignore start */
        if (!Stack.#constructing) {
            throw new TypeError('instantiate Stack using Stack.create(n)');
        }
        /* c8 ignore stop */
        this.heap = new HeapCls(max);
        this.length = 0;
    }
    push(n) {
        this.heap[this.length++] = n;
    }
    pop() {
        return this.heap[--this.length];
    }
}
/**
 * Default export, the thing you're using this module to get.
 *
 * All properties from the options object (with the exception of
 * {@link OptionsBase.max} and {@link OptionsBase.maxSize}) are added as
 * normal public members. (`max` and `maxBase` are read-only getters.)
 * Changing any of these will alter the defaults for subsequent method calls,
 * but is otherwise safe.
 */
class LRUCache {
    // properties coming in from the options of these, only max and maxSize
    // really *need* to be protected. The rest can be modified, as they just
    // set defaults for various methods.
    #max;
    #maxSize;
    #dispose;
    #disposeAfter;
    #fetchMethod;
    /**
     * {@link LRUCache.OptionsBase.ttl}
     */
    ttl;
    /**
     * {@link LRUCache.OptionsBase.ttlResolution}
     */
    ttlResolution;
    /**
     * {@link LRUCache.OptionsBase.ttlAutopurge}
     */
    ttlAutopurge;
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnGet}
     */
    updateAgeOnGet;
    /**
     * {@link LRUCache.OptionsBase.updateAgeOnHas}
     */
    updateAgeOnHas;
    /**
     * {@link LRUCache.OptionsBase.allowStale}
     */
    allowStale;
    /**
     * {@link LRUCache.OptionsBase.noDisposeOnSet}
     */
    noDisposeOnSet;
    /**
     * {@link LRUCache.OptionsBase.noUpdateTTL}
     */
    noUpdateTTL;
    /**
     * {@link LRUCache.OptionsBase.maxEntrySize}
     */
    maxEntrySize;
    /**
     * {@link LRUCache.OptionsBase.sizeCalculation}
     */
    sizeCalculation;
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
     */
    noDeleteOnFetchRejection;
    /**
     * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
     */
    noDeleteOnStaleGet;
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
     */
    allowStaleOnFetchAbort;
    /**
     * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
     */
    allowStaleOnFetchRejection;
    /**
     * {@link LRUCache.OptionsBase.ignoreFetchAbort}
     */
    ignoreFetchAbort;
    // computed properties
    #size;
    #calculatedSize;
    #keyMap;
    #keyList;
    #valList;
    #next;
    #prev;
    #head;
    #tail;
    #free;
    #disposed;
    #sizes;
    #starts;
    #ttls;
    #hasDispose;
    #hasFetchMethod;
    #hasDisposeAfter;
    /**
     * Do not call this method unless you need to inspect the
     * inner workings of the cache.  If anything returned by this
     * object is modified in any way, strange breakage may occur.
     *
     * These fields are private for a reason!
     *
     * @internal
     */
    static unsafeExposeInternals(c) {
        return {
            // properties
            starts: c.#starts,
            ttls: c.#ttls,
            sizes: c.#sizes,
            keyMap: c.#keyMap,
            keyList: c.#keyList,
            valList: c.#valList,
            next: c.#next,
            prev: c.#prev,
            get head() {
                return c.#head;
            },
            get tail() {
                return c.#tail;
            },
            free: c.#free,
            // methods
            isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
            backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
            moveToTail: (index) => c.#moveToTail(index),
            indexes: (options) => c.#indexes(options),
            rindexes: (options) => c.#rindexes(options),
            isStale: (index) => c.#isStale(index),
        };
    }
    // Protected read-only members
    /**
     * {@link LRUCache.OptionsBase.max} (read-only)
     */
    get max() {
        return this.#max;
    }
    /**
     * {@link LRUCache.OptionsBase.maxSize} (read-only)
     */
    get maxSize() {
        return this.#maxSize;
    }
    /**
     * The total computed size of items in the cache (read-only)
     */
    get calculatedSize() {
        return this.#calculatedSize;
    }
    /**
     * The number of items stored in the cache (read-only)
     */
    get size() {
        return this.#size;
    }
    /**
     * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
     */
    get fetchMethod() {
        return this.#fetchMethod;
    }
    /**
     * {@link LRUCache.OptionsBase.dispose} (read-only)
     */
    get dispose() {
        return this.#dispose;
    }
    /**
     * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
     */
    get disposeAfter() {
        return this.#disposeAfter;
    }
    constructor(options) {
        const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort, } = options;
        if (max !== 0 && !isPosInt(max)) {
            throw new TypeError('max option must be a nonnegative integer');
        }
        const UintArray = max ? getUintArray(max) : Array;
        if (!UintArray) {
            throw new Error('invalid max value: ' + max);
        }
        this.#max = max;
        this.#maxSize = maxSize;
        this.maxEntrySize = maxEntrySize || this.#maxSize;
        this.sizeCalculation = sizeCalculation;
        if (this.sizeCalculation) {
            if (!this.#maxSize && !this.maxEntrySize) {
                throw new TypeError('cannot set sizeCalculation without setting maxSize or maxEntrySize');
            }
            if (typeof this.sizeCalculation !== 'function') {
                throw new TypeError('sizeCalculation set to non-function');
            }
        }
        if (fetchMethod !== undefined &&
            typeof fetchMethod !== 'function') {
            throw new TypeError('fetchMethod must be a function if specified');
        }
        this.#fetchMethod = fetchMethod;
        this.#hasFetchMethod = !!fetchMethod;
        this.#keyMap = new Map();
        this.#keyList = new Array(max).fill(undefined);
        this.#valList = new Array(max).fill(undefined);
        this.#next = new UintArray(max);
        this.#prev = new UintArray(max);
        this.#head = 0;
        this.#tail = 0;
        this.#free = Stack.create(max);
        this.#size = 0;
        this.#calculatedSize = 0;
        if (typeof dispose === 'function') {
            this.#dispose = dispose;
        }
        if (typeof disposeAfter === 'function') {
            this.#disposeAfter = disposeAfter;
            this.#disposed = [];
        }
        else {
            this.#disposeAfter = undefined;
            this.#disposed = undefined;
        }
        this.#hasDispose = !!this.#dispose;
        this.#hasDisposeAfter = !!this.#disposeAfter;
        this.noDisposeOnSet = !!noDisposeOnSet;
        this.noUpdateTTL = !!noUpdateTTL;
        this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
        this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
        this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
        this.ignoreFetchAbort = !!ignoreFetchAbort;
        // NB: maxEntrySize is set to maxSize if it's set
        if (this.maxEntrySize !== 0) {
            if (this.#maxSize !== 0) {
                if (!isPosInt(this.#maxSize)) {
                    throw new TypeError('maxSize must be a positive integer if specified');
                }
            }
            if (!isPosInt(this.maxEntrySize)) {
                throw new TypeError('maxEntrySize must be a positive integer if specified');
            }
            this.#initializeSizeTracking();
        }
        this.allowStale = !!allowStale;
        this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
        this.updateAgeOnGet = !!updateAgeOnGet;
        this.updateAgeOnHas = !!updateAgeOnHas;
        this.ttlResolution =
            isPosInt(ttlResolution) || ttlResolution === 0
                ? ttlResolution
                : 1;
        this.ttlAutopurge = !!ttlAutopurge;
        this.ttl = ttl || 0;
        if (this.ttl) {
            if (!isPosInt(this.ttl)) {
                throw new TypeError('ttl must be a positive integer if specified');
            }
            this.#initializeTTLTracking();
        }
        // do not allow completely unbounded caches
        if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
            throw new TypeError('At least one of max, maxSize, or ttl is required');
        }
        if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
            const code = 'LRU_CACHE_UNBOUNDED';
            if (shouldWarn(code)) {
                warned.add(code);
                const msg = 'TTL caching without ttlAutopurge, max, or maxSize can ' +
                    'result in unbounded memory consumption.';
                emitWarning(msg, 'UnboundedCacheWarning', code, LRUCache);
            }
        }
    }
    /**
     * Return the remaining TTL time for a given entry key
     */
    getRemainingTTL(key) {
        return this.#keyMap.has(key) ? Infinity : 0;
    }
    #initializeTTLTracking() {
        const ttls = new ZeroArray(this.#max);
        const starts = new ZeroArray(this.#max);
        this.#ttls = ttls;
        this.#starts = starts;
        this.#setItemTTL = (index, ttl, start = perf.now()) => {
            starts[index] = ttl !== 0 ? start : 0;
            ttls[index] = ttl;
            if (ttl !== 0 && this.ttlAutopurge) {
                const t = setTimeout(() => {
                    if (this.#isStale(index)) {
                        this.delete(this.#keyList[index]);
                    }
                }, ttl + 1);
                // unref() not supported on all platforms
                /* c8 ignore start */
                if (t.unref) {
                    t.unref();
                }
                /* c8 ignore stop */
            }
        };
        this.#updateItemAge = index => {
            starts[index] = ttls[index] !== 0 ? perf.now() : 0;
        };
        this.#statusTTL = (status, index) => {
            if (ttls[index]) {
                const ttl = ttls[index];
                const start = starts[index];
                status.ttl = ttl;
                status.start = start;
                status.now = cachedNow || getNow();
                const age = status.now - start;
                status.remainingTTL = ttl - age;
            }
        };
        // debounce calls to perf.now() to 1s so we're not hitting
        // that costly call repeatedly.
        let cachedNow = 0;
        const getNow = () => {
            const n = perf.now();
            if (this.ttlResolution > 0) {
                cachedNow = n;
                const t = setTimeout(() => (cachedNow = 0), this.ttlResolution);
                // not available on all platforms
                /* c8 ignore start */
                if (t.unref) {
                    t.unref();
                }
                /* c8 ignore stop */
            }
            return n;
        };
        this.getRemainingTTL = key => {
            const index = this.#keyMap.get(key);
            if (index === undefined) {
                return 0;
            }
            const ttl = ttls[index];
            const start = starts[index];
            if (ttl === 0 || start === 0) {
                return Infinity;
            }
            const age = (cachedNow || getNow()) - start;
            return ttl - age;
        };
        this.#isStale = index => {
            return (ttls[index] !== 0 &&
                starts[index] !== 0 &&
                (cachedNow || getNow()) - starts[index] > ttls[index]);
        };
    }
    // conditionally set private methods related to TTL
    #updateItemAge = () => { };
    #statusTTL = () => { };
    #setItemTTL = () => { };
    /* c8 ignore stop */
    #isStale = () => false;
    #initializeSizeTracking() {
        const sizes = new ZeroArray(this.#max);
        this.#calculatedSize = 0;
        this.#sizes = sizes;
        this.#removeItemSize = index => {
            this.#calculatedSize -= sizes[index];
            sizes[index] = 0;
        };
        this.#requireSize = (k, v, size, sizeCalculation) => {
            // provisionally accept background fetches.
            // actual value size will be checked when they return.
            if (this.#isBackgroundFetch(v)) {
                return 0;
            }
            if (!isPosInt(size)) {
                if (sizeCalculation) {
                    if (typeof sizeCalculation !== 'function') {
                        throw new TypeError('sizeCalculation must be a function');
                    }
                    size = sizeCalculation(v, k);
                    if (!isPosInt(size)) {
                        throw new TypeError('sizeCalculation return invalid (expect positive integer)');
                    }
                }
                else {
                    throw new TypeError('invalid size value (must be positive integer). ' +
                        'When maxSize or maxEntrySize is used, sizeCalculation ' +
                        'or size must be set.');
                }
            }
            return size;
        };
        this.#addItemSize = (index, size, status) => {
            sizes[index] = size;
            if (this.#maxSize) {
                const maxSize = this.#maxSize - sizes[index];
                while (this.#calculatedSize > maxSize) {
                    this.#evict(true);
                }
            }
            this.#calculatedSize += sizes[index];
            if (status) {
                status.entrySize = size;
                status.totalCalculatedSize = this.#calculatedSize;
            }
        };
    }
    #removeItemSize = _i => { };
    #addItemSize = (_i, _s, _st) => { };
    #requireSize = (_k, _v, size, sizeCalculation) => {
        if (size || sizeCalculation) {
            throw new TypeError('cannot set size without setting maxSize or maxEntrySize on cache');
        }
        return 0;
    };
    *#indexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for (let i = this.#tail; true;) {
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#head) {
                    break;
                }
                else {
                    i = this.#prev[i];
                }
            }
        }
    }
    *#rindexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
            for (let i = this.#head; true;) {
                if (!this.#isValidIndex(i)) {
                    break;
                }
                if (allowStale || !this.#isStale(i)) {
                    yield i;
                }
                if (i === this.#tail) {
                    break;
                }
                else {
                    i = this.#next[i];
                }
            }
        }
    }
    #isValidIndex(index) {
        return (index !== undefined &&
            this.#keyMap.get(this.#keyList[index]) === index);
    }
    /**
     * Return a generator yielding `[key, value]` pairs,
     * in order from most recently used to least recently used.
     */
    *entries() {
        for (const i of this.#indexes()) {
            if (this.#valList[i] !== undefined &&
                this.#keyList[i] !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield [this.#keyList[i], this.#valList[i]];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.entries}
     *
     * Return a generator yielding `[key, value]` pairs,
     * in order from least recently used to most recently used.
     */
    *rentries() {
        for (const i of this.#rindexes()) {
            if (this.#valList[i] !== undefined &&
                this.#keyList[i] !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield [this.#keyList[i], this.#valList[i]];
            }
        }
    }
    /**
     * Return a generator yielding the keys in the cache,
     * in order from most recently used to least recently used.
     */
    *keys() {
        for (const i of this.#indexes()) {
            const k = this.#keyList[i];
            if (k !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.keys}
     *
     * Return a generator yielding the keys in the cache,
     * in order from least recently used to most recently used.
     */
    *rkeys() {
        for (const i of this.#rindexes()) {
            const k = this.#keyList[i];
            if (k !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield k;
            }
        }
    }
    /**
     * Return a generator yielding the values in the cache,
     * in order from most recently used to least recently used.
     */
    *values() {
        for (const i of this.#indexes()) {
            const v = this.#valList[i];
            if (v !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Inverse order version of {@link LRUCache.values}
     *
     * Return a generator yielding the values in the cache,
     * in order from least recently used to most recently used.
     */
    *rvalues() {
        for (const i of this.#rindexes()) {
            const v = this.#valList[i];
            if (v !== undefined &&
                !this.#isBackgroundFetch(this.#valList[i])) {
                yield this.#valList[i];
            }
        }
    }
    /**
     * Iterating over the cache itself yields the same results as
     * {@link LRUCache.entries}
     */
    [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * Find a value for which the supplied fn method returns a truthy value,
     * similar to Array.find().  fn is called as fn(value, key, cache).
     */
    find(fn, getOptions = {}) {
        for (const i of this.#indexes()) {
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v)
                ? v.__staleWhileFetching
                : v;
            if (value === undefined)
                continue;
            if (fn(value, this.#keyList[i], this)) {
                return this.get(this.#keyList[i], getOptions);
            }
        }
    }
    /**
     * Call the supplied function on each item in the cache, in order from
     * most recently used to least recently used.  fn is called as
     * fn(value, key, cache).  Does not update age or recenty of use.
     * Does not iterate over stale values.
     */
    forEach(fn, thisp = this) {
        for (const i of this.#indexes()) {
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v)
                ? v.__staleWhileFetching
                : v;
            if (value === undefined)
                continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * The same as {@link LRUCache.forEach} but items are iterated over in
     * reverse order.  (ie, less recently used items are iterated over first.)
     */
    rforEach(fn, thisp = this) {
        for (const i of this.#rindexes()) {
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v)
                ? v.__staleWhileFetching
                : v;
            if (value === undefined)
                continue;
            fn.call(thisp, value, this.#keyList[i], this);
        }
    }
    /**
     * Delete any stale entries. Returns true if anything was removed,
     * false otherwise.
     */
    purgeStale() {
        let deleted = false;
        for (const i of this.#rindexes({ allowStale: true })) {
            if (this.#isStale(i)) {
                this.delete(this.#keyList[i]);
                deleted = true;
            }
        }
        return deleted;
    }
    /**
     * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
     * passed to cache.load()
     */
    dump() {
        const arr = [];
        for (const i of this.#indexes({ allowStale: true })) {
            const key = this.#keyList[i];
            const v = this.#valList[i];
            const value = this.#isBackgroundFetch(v)
                ? v.__staleWhileFetching
                : v;
            if (value === undefined || key === undefined)
                continue;
            const entry = { value };
            if (this.#ttls && this.#starts) {
                entry.ttl = this.#ttls[i];
                // always dump the start relative to a portable timestamp
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = perf.now() - this.#starts[i];
                entry.start = Math.floor(Date.now() - age);
            }
            if (this.#sizes) {
                entry.size = this.#sizes[i];
            }
            arr.unshift([key, entry]);
        }
        return arr;
    }
    /**
     * Reset the cache and load in the items in entries in the order listed.
     * Note that the shape of the resulting cache may be different if the
     * same options are not used in both caches.
     */
    load(arr) {
        this.clear();
        for (const [key, entry] of arr) {
            if (entry.start) {
                // entry.start is a portable timestamp, but we may be using
                // node's performance.now(), so calculate the offset, so that
                // we get the intended remaining TTL, no matter how long it's
                // been on ice.
                //
                // it's ok for this to be a bit slow, it's a rare operation.
                const age = Date.now() - entry.start;
                entry.start = perf.now() - age;
            }
            this.set(key, entry.value, entry);
        }
    }
    /**
     * Add a value to the cache.
     *
     * Note: if `undefined` is specified as a value, this is an alias for
     * {@link LRUCache#delete}
     */
    set(k, v, setOptions = {}) {
        if (v === undefined) {
            this.delete(k);
            return this;
        }
        const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status, } = setOptions;
        let { noUpdateTTL = this.noUpdateTTL } = setOptions;
        const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
        // if the item doesn't fit, don't do anything
        // NB: maxEntrySize set to maxSize by default
        if (this.maxEntrySize && size > this.maxEntrySize) {
            if (status) {
                status.set = 'miss';
                status.maxEntrySizeExceeded = true;
            }
            // have to delete, in case something is there already.
            this.delete(k);
            return this;
        }
        let index = this.#size === 0 ? undefined : this.#keyMap.get(k);
        if (index === undefined) {
            // addition
            index = (this.#size === 0
                ? this.#tail
                : this.#free.length !== 0
                    ? this.#free.pop()
                    : this.#size === this.#max
                        ? this.#evict(false)
                        : this.#size);
            this.#keyList[index] = k;
            this.#valList[index] = v;
            this.#keyMap.set(k, index);
            this.#next[this.#tail] = index;
            this.#prev[index] = this.#tail;
            this.#tail = index;
            this.#size++;
            this.#addItemSize(index, size, status);
            if (status)
                status.set = 'add';
            noUpdateTTL = false;
        }
        else {
            // update
            this.#moveToTail(index);
            const oldVal = this.#valList[index];
            if (v !== oldVal) {
                if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
                    oldVal.__abortController.abort(new Error('replaced'));
                }
                else if (!noDisposeOnSet) {
                    if (this.#hasDispose) {
                        this.#dispose?.(oldVal, k, 'set');
                    }
                    if (this.#hasDisposeAfter) {
                        this.#disposed?.push([oldVal, k, 'set']);
                    }
                }
                this.#removeItemSize(index);
                this.#addItemSize(index, size, status);
                this.#valList[index] = v;
                if (status) {
                    status.set = 'replace';
                    const oldValue = oldVal && this.#isBackgroundFetch(oldVal)
                        ? oldVal.__staleWhileFetching
                        : oldVal;
                    if (oldValue !== undefined)
                        status.oldValue = oldValue;
                }
            }
            else if (status) {
                status.set = 'update';
            }
        }
        if (ttl !== 0 && !this.#ttls) {
            this.#initializeTTLTracking();
        }
        if (this.#ttls) {
            if (!noUpdateTTL) {
                this.#setItemTTL(index, ttl, start);
            }
            if (status)
                this.#statusTTL(status, index);
        }
        if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while ((task = dt?.shift())) {
                this.#disposeAfter?.(...task);
            }
        }
        return this;
    }
    /**
     * Evict the least recently used item, returning its value or
     * `undefined` if cache is empty.
     */
    pop() {
        try {
            while (this.#size) {
                const val = this.#valList[this.#head];
                this.#evict(true);
                if (this.#isBackgroundFetch(val)) {
                    if (val.__staleWhileFetching) {
                        return val.__staleWhileFetching;
                    }
                }
                else if (val !== undefined) {
                    return val;
                }
            }
        }
        finally {
            if (this.#hasDisposeAfter && this.#disposed) {
                const dt = this.#disposed;
                let task;
                while ((task = dt?.shift())) {
                    this.#disposeAfter?.(...task);
                }
            }
        }
    }
    #evict(free) {
        const head = this.#head;
        const k = this.#keyList[head];
        const v = this.#valList[head];
        if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error('evicted'));
        }
        else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
                this.#dispose?.(v, k, 'evict');
            }
            if (this.#hasDisposeAfter) {
                this.#disposed?.push([v, k, 'evict']);
            }
        }
        this.#removeItemSize(head);
        // if we aren't about to use the index, then null these out
        if (free) {
            this.#keyList[head] = undefined;
            this.#valList[head] = undefined;
            this.#free.push(head);
        }
        if (this.#size === 1) {
            this.#head = this.#tail = 0;
            this.#free.length = 0;
        }
        else {
            this.#head = this.#next[head];
        }
        this.#keyMap.delete(k);
        this.#size--;
        return head;
    }
    /**
     * Check if a key is in the cache, without updating the recency of use.
     * Will return false if the item is stale, even though it is technically
     * in the cache.
     *
     * Will not update item age unless
     * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
     */
    has(k, hasOptions = {}) {
        const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v) &&
                v.__staleWhileFetching === undefined) {
                return false;
            }
            if (!this.#isStale(index)) {
                if (updateAgeOnHas) {
                    this.#updateItemAge(index);
                }
                if (status) {
                    status.has = 'hit';
                    this.#statusTTL(status, index);
                }
                return true;
            }
            else if (status) {
                status.has = 'stale';
                this.#statusTTL(status, index);
            }
        }
        else if (status) {
            status.has = 'miss';
        }
        return false;
    }
    /**
     * Like {@link LRUCache#get} but doesn't update recency or delete stale
     * items.
     *
     * Returns `undefined` if the item is stale, unless
     * {@link LRUCache.OptionsBase.allowStale} is set.
     */
    peek(k, peekOptions = {}) {
        const { allowStale = this.allowStale } = peekOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined &&
            (allowStale || !this.#isStale(index))) {
            const v = this.#valList[index];
            // either stale and allowed, or forcing a refresh of non-stale value
            return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
        }
    }
    #backgroundFetch(k, index, options, context) {
        const v = index === undefined ? undefined : this.#valList[index];
        if (this.#isBackgroundFetch(v)) {
            return v;
        }
        const ac = new AC();
        const { signal } = options;
        // when/if our AC signals, then stop listening to theirs.
        signal?.addEventListener('abort', () => ac.abort(signal.reason), {
            signal: ac.signal,
        });
        const fetchOpts = {
            signal: ac.signal,
            options,
            context,
        };
        const cb = (v, updateCache = false) => {
            const { aborted } = ac.signal;
            const ignoreAbort = options.ignoreFetchAbort && v !== undefined;
            if (options.status) {
                if (aborted && !updateCache) {
                    options.status.fetchAborted = true;
                    options.status.fetchError = ac.signal.reason;
                    if (ignoreAbort)
                        options.status.fetchAbortIgnored = true;
                }
                else {
                    options.status.fetchResolved = true;
                }
            }
            if (aborted && !ignoreAbort && !updateCache) {
                return fetchFail(ac.signal.reason);
            }
            // either we didn't abort, and are still here, or we did, and ignored
            const bf = p;
            if (this.#valList[index] === p) {
                if (v === undefined) {
                    if (bf.__staleWhileFetching) {
                        this.#valList[index] = bf.__staleWhileFetching;
                    }
                    else {
                        this.delete(k);
                    }
                }
                else {
                    if (options.status)
                        options.status.fetchUpdated = true;
                    this.set(k, v, fetchOpts.options);
                }
            }
            return v;
        };
        const eb = (er) => {
            if (options.status) {
                options.status.fetchRejected = true;
                options.status.fetchError = er;
            }
            return fetchFail(er);
        };
        const fetchFail = (er) => {
            const { aborted } = ac.signal;
            const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
            const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
            const noDelete = allowStale || options.noDeleteOnFetchRejection;
            const bf = p;
            if (this.#valList[index] === p) {
                // if we allow stale on fetch rejections, then we need to ensure that
                // the stale value is not removed from the cache when the fetch fails.
                const del = !noDelete || bf.__staleWhileFetching === undefined;
                if (del) {
                    this.delete(k);
                }
                else if (!allowStaleAborted) {
                    // still replace the *promise* with the stale value,
                    // since we are done with the promise at this point.
                    // leave it untouched if we're still waiting for an
                    // aborted background fetch that hasn't yet returned.
                    this.#valList[index] = bf.__staleWhileFetching;
                }
            }
            if (allowStale) {
                if (options.status && bf.__staleWhileFetching !== undefined) {
                    options.status.returnedStale = true;
                }
                return bf.__staleWhileFetching;
            }
            else if (bf.__returned === bf) {
                throw er;
            }
        };
        const pcall = (res, rej) => {
            const fmp = this.#fetchMethod?.(k, v, fetchOpts);
            if (fmp && fmp instanceof Promise) {
                fmp.then(v => res(v === undefined ? undefined : v), rej);
            }
            // ignored, we go until we finish, regardless.
            // defer check until we are actually aborting,
            // so fetchMethod can override.
            ac.signal.addEventListener('abort', () => {
                if (!options.ignoreFetchAbort ||
                    options.allowStaleOnFetchAbort) {
                    res(undefined);
                    // when it eventually resolves, update the cache.
                    if (options.allowStaleOnFetchAbort) {
                        res = v => cb(v, true);
                    }
                }
            });
        };
        if (options.status)
            options.status.fetchDispatched = true;
        const p = new Promise(pcall).then(cb, eb);
        const bf = Object.assign(p, {
            __abortController: ac,
            __staleWhileFetching: v,
            __returned: undefined,
        });
        if (index === undefined) {
            // internal, don't expose status.
            this.set(k, bf, { ...fetchOpts.options, status: undefined });
            index = this.#keyMap.get(k);
        }
        else {
            this.#valList[index] = bf;
        }
        return bf;
    }
    #isBackgroundFetch(p) {
        if (!this.#hasFetchMethod)
            return false;
        const b = p;
        return (!!b &&
            b instanceof Promise &&
            b.hasOwnProperty('__staleWhileFetching') &&
            b.__abortController instanceof AC);
    }
    async fetch(k, fetchOptions = {}) {
        const { 
        // get options
        allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, 
        // set options
        ttl = this.ttl, noDisposeOnSet = this.noDisposeOnSet, size = 0, sizeCalculation = this.sizeCalculation, noUpdateTTL = this.noUpdateTTL, 
        // fetch exclusive options
        noDeleteOnFetchRejection = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection = this.allowStaleOnFetchRejection, ignoreFetchAbort = this.ignoreFetchAbort, allowStaleOnFetchAbort = this.allowStaleOnFetchAbort, context, forceRefresh = false, status, signal, } = fetchOptions;
        if (!this.#hasFetchMethod) {
            if (status)
                status.fetch = 'get';
            return this.get(k, {
                allowStale,
                updateAgeOnGet,
                noDeleteOnStaleGet,
                status,
            });
        }
        const options = {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet,
            ttl,
            noDisposeOnSet,
            size,
            sizeCalculation,
            noUpdateTTL,
            noDeleteOnFetchRejection,
            allowStaleOnFetchRejection,
            allowStaleOnFetchAbort,
            ignoreFetchAbort,
            status,
            signal,
        };
        let index = this.#keyMap.get(k);
        if (index === undefined) {
            if (status)
                status.fetch = 'miss';
            const p = this.#backgroundFetch(k, index, options, context);
            return (p.__returned = p);
        }
        else {
            // in cache, maybe already fetching
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                const stale = allowStale && v.__staleWhileFetching !== undefined;
                if (status) {
                    status.fetch = 'inflight';
                    if (stale)
                        status.returnedStale = true;
                }
                return stale ? v.__staleWhileFetching : (v.__returned = v);
            }
            // if we force a refresh, that means do NOT serve the cached value,
            // unless we are already in the process of refreshing the cache.
            const isStale = this.#isStale(index);
            if (!forceRefresh && !isStale) {
                if (status)
                    status.fetch = 'hit';
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                if (status)
                    this.#statusTTL(status, index);
                return v;
            }
            // ok, it is stale or a forced refresh, and not already fetching.
            // refresh the cache.
            const p = this.#backgroundFetch(k, index, options, context);
            const hasStale = p.__staleWhileFetching !== undefined;
            const staleVal = hasStale && allowStale;
            if (status) {
                status.fetch = isStale ? 'stale' : 'refresh';
                if (staleVal && isStale)
                    status.returnedStale = true;
            }
            return staleVal ? p.__staleWhileFetching : (p.__returned = p);
        }
    }
    /**
     * Return a value from the cache. Will update the recency of the cache
     * entry found.
     *
     * If the key is not found, get() will return `undefined`.
     */
    get(k, getOptions = {}) {
        const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status, } = getOptions;
        const index = this.#keyMap.get(k);
        if (index !== undefined) {
            const value = this.#valList[index];
            const fetching = this.#isBackgroundFetch(value);
            if (status)
                this.#statusTTL(status, index);
            if (this.#isStale(index)) {
                if (status)
                    status.get = 'stale';
                // delete only if not an in-flight background fetch
                if (!fetching) {
                    if (!noDeleteOnStaleGet) {
                        this.delete(k);
                    }
                    if (status && allowStale)
                        status.returnedStale = true;
                    return allowStale ? value : undefined;
                }
                else {
                    if (status &&
                        allowStale &&
                        value.__staleWhileFetching !== undefined) {
                        status.returnedStale = true;
                    }
                    return allowStale ? value.__staleWhileFetching : undefined;
                }
            }
            else {
                if (status)
                    status.get = 'hit';
                // if we're currently fetching it, we don't actually have it yet
                // it's not stale, which means this isn't a staleWhileRefetching.
                // If it's not stale, and fetching, AND has a __staleWhileFetching
                // value, then that means the user fetched with {forceRefresh:true},
                // so it's safe to return that value.
                if (fetching) {
                    return value.__staleWhileFetching;
                }
                this.#moveToTail(index);
                if (updateAgeOnGet) {
                    this.#updateItemAge(index);
                }
                return value;
            }
        }
        else if (status) {
            status.get = 'miss';
        }
    }
    #connect(p, n) {
        this.#prev[n] = p;
        this.#next[p] = n;
    }
    #moveToTail(index) {
        // if tail already, nothing to do
        // if head, move head to next[index]
        // else
        //   move next[prev[index]] to next[index] (head has no prev)
        //   move prev[next[index]] to prev[index]
        // prev[index] = tail
        // next[tail] = index
        // tail = index
        if (index !== this.#tail) {
            if (index === this.#head) {
                this.#head = this.#next[index];
            }
            else {
                this.#connect(this.#prev[index], this.#next[index]);
            }
            this.#connect(this.#tail, index);
            this.#tail = index;
        }
    }
    /**
     * Deletes a key out of the cache.
     * Returns true if the key was deleted, false otherwise.
     */
    delete(k) {
        let deleted = false;
        if (this.#size !== 0) {
            const index = this.#keyMap.get(k);
            if (index !== undefined) {
                deleted = true;
                if (this.#size === 1) {
                    this.clear();
                }
                else {
                    this.#removeItemSize(index);
                    const v = this.#valList[index];
                    if (this.#isBackgroundFetch(v)) {
                        v.__abortController.abort(new Error('deleted'));
                    }
                    else if (this.#hasDispose || this.#hasDisposeAfter) {
                        if (this.#hasDispose) {
                            this.#dispose?.(v, k, 'delete');
                        }
                        if (this.#hasDisposeAfter) {
                            this.#disposed?.push([v, k, 'delete']);
                        }
                    }
                    this.#keyMap.delete(k);
                    this.#keyList[index] = undefined;
                    this.#valList[index] = undefined;
                    if (index === this.#tail) {
                        this.#tail = this.#prev[index];
                    }
                    else if (index === this.#head) {
                        this.#head = this.#next[index];
                    }
                    else {
                        this.#next[this.#prev[index]] = this.#next[index];
                        this.#prev[this.#next[index]] = this.#prev[index];
                    }
                    this.#size--;
                    this.#free.push(index);
                }
            }
        }
        if (this.#hasDisposeAfter && this.#disposed?.length) {
            const dt = this.#disposed;
            let task;
            while ((task = dt?.shift())) {
                this.#disposeAfter?.(...task);
            }
        }
        return deleted;
    }
    /**
     * Clear the cache entirely, throwing away all values.
     */
    clear() {
        for (const index of this.#rindexes({ allowStale: true })) {
            const v = this.#valList[index];
            if (this.#isBackgroundFetch(v)) {
                v.__abortController.abort(new Error('deleted'));
            }
            else {
                const k = this.#keyList[index];
                if (this.#hasDispose) {
                    this.#dispose?.(v, k, 'delete');
                }
                if (this.#hasDisposeAfter) {
                    this.#disposed?.push([v, k, 'delete']);
                }
            }
        }
        this.#keyMap.clear();
        this.#valList.fill(undefined);
        this.#keyList.fill(undefined);
        if (this.#ttls && this.#starts) {
            this.#ttls.fill(0);
            this.#starts.fill(0);
        }
        if (this.#sizes) {
            this.#sizes.fill(0);
        }
        this.#head = 0;
        this.#tail = 0;
        this.#free.length = 0;
        this.#calculatedSize = 0;
        this.#size = 0;
        if (this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while ((task = dt?.shift())) {
                this.#disposeAfter?.(...task);
            }
        }
    }
}
exports.LRUCache = LRUCache;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9602:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"z":["ahole","anus","ash0le","ash0les","asholes","ass","Ass Monkey","Assface","assh0le","assh0lez","asshole","assholes","assholz","asswipe","azzhole","bassterds","bastard","bastards","bastardz","basterds","basterdz","Biatch","bitch","bitches","Blow Job","boffing","butthole","buttwipe","c0ck","c0cks","c0k","Carpet Muncher","cawk","cawks","Clit","cnts","cntz","cock","cockhead","cock-head","cocks","CockSucker","cock-sucker","crap","cum","cunt","cunts","cuntz","dick","dild0","dild0s","dildo","dildos","dilld0","dilld0s","dominatricks","dominatrics","dominatrix","dyke","enema","f u c k","f u c k e r","fag","fag1t","faget","fagg1t","faggit","faggot","fagg0t","fagit","fags","fagz","faig","faigs","fart","flipping the bird","fuck","fucker","fuckin","fucking","fucks","Fudge Packer","fuk","Fukah","Fuken","fuker","Fukin","Fukk","Fukkah","Fukken","Fukker","Fukkin","g00k","God-damned","h00r","h0ar","h0re","hells","hoar","hoor","hoore","jackoff","jap","japs","jerk-off","jisim","jiss","jizm","jizz","knob","knobs","knobz","kunt","kunts","kuntz","Lezzian","Lipshits","Lipshitz","masochist","masokist","massterbait","masstrbait","masstrbate","masterbaiter","masterbate","masterbates","Motha Fucker","Motha Fuker","Motha Fukkah","Motha Fukker","Mother Fucker","Mother Fukah","Mother Fuker","Mother Fukkah","Mother Fukker","mother-fucker","Mutha Fucker","Mutha Fukah","Mutha Fuker","Mutha Fukkah","Mutha Fukker","n1gr","nastt","nigger;","nigur;","niiger;","niigr;","orafis","orgasim;","orgasm","orgasum","oriface","orifice","orifiss","packi","packie","packy","paki","pakie","paky","pecker","peeenus","peeenusss","peenus","peinus","pen1s","penas","penis","penis-breath","penus","penuus","Phuc","Phuck","Phuk","Phuker","Phukker","polac","polack","polak","Poonani","pr1c","pr1ck","pr1k","pusse","pussee","pussy","puuke","puuker","qweir","recktum","rectum","retard","sadist","scank","schlong","screwing","semen","sex","sexy","Sh!t","sh1t","sh1ter","sh1ts","sh1tter","sh1tz","shit","shits","shitter","Shitty","Shity","shitz","Shyt","Shyte","Shytty","Shyty","skanck","skank","skankee","skankey","skanks","Skanky","slag","slut","sluts","Slutty","slutz","son-of-a-bitch","tit","turd","va1jina","vag1na","vagiina","vagina","vaj1na","vajina","vullva","vulva","w0p","wh00r","wh0re","whore","xrated","xxx","b!+ch","bitch","blowjob","clit","arschloch","fuck","shit","ass","asshole","b!tch","b17ch","b1tch","bastard","bi+ch","boiolas","buceta","c0ck","cawk","chink","cipa","clits","cock","cum","cunt","dildo","dirsa","ejakulate","fatass","fcuk","fuk","fux0r","hoer","hore","jism","kawk","l3itch","l3i+ch","masturbate","masterbat*","masterbat3","motherfucker","s.o.b.","mofo","nazi","nigga","nigger","nutsack","phuck","pimpis","pusse","pussy","scrotum","sh!t","shemale","shi+","sh!+","slut","smut","teets","tits","boobs","b00bs","teez","testical","testicle","titt","w00se","jackoff","wank","whoar","whore","*damn","*dyke","*fuck*","*shit*","@$$","amcik","andskota","arse*","assrammer","ayir","bi7ch","bitch*","bollock*","breasts","butt-pirate","cabron","cazzo","chraa","chuj","Cock*","cunt*","d4mn","daygo","dego","dick*","dike*","dupa","dziwka","ejackulate","Ekrem*","Ekto","enculer","faen","fag*","fanculo","fanny","feces","feg","Felcher","ficken","fitt*","Flikker","foreskin","Fotze","Fu(*","fuk*","futkretzn","gook","guiena","h0r","h4x0r","hell","helvete","hoer*","honkey","Huevon","hui","injun","jizz","kanker*","kike","klootzak","kraut","knulle","kuk","kuksuger","Kurac","kurwa","kusi*","kyrpa*","lesbo","mamhoon","masturbat*","merd*","mibun","monkleigh","mouliewop","muie","mulkku","muschi","nazis","nepesaurio","nigger*","orospu","paska*","perse","picka","pierdol*","pillu*","pimmel","piss*","pizda","poontsee","poop","porn","p0rn","pr0n","preteen","pula","pule","puta","puto","qahbeh","queef*","rautenberg","schaffer","scheiss*","schlampe","schmuck","screw","sh!t*","sharmuta","sharmute","shipal","shiz","skribz","skurwysyn","sphencter","spic","spierdalaj","splooge","suka","b00b*","testicle*","titt*","twat","vittu","wank*","wetback*","wichser","wop*","yed","zabourah"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
// EXTERNAL MODULE: ./node_modules/obscenity/dist/index.js
var dist = __nccwpck_require__(8795);
;// CONCATENATED MODULE: ./node_modules/obscenity/dist/index.mjs


/* harmony default export */ const obscenity_dist = ((/* unused pure expression or super */ null && (mod)));
const DataSet = dist.DataSet;
const NfaMatcher = dist.NfaMatcher;
const ParserError = dist.ParserError;
const PhraseBuilder = dist.PhraseBuilder;
const RegExpMatcher = dist.RegExpMatcher;
const SyntaxKind = dist.SyntaxKind;
const TextCensor = dist.TextCensor;
const assignIncrementingIds = dist.assignIncrementingIds;
const asteriskCensorStrategy = dist.asteriskCensorStrategy;
const collapseDuplicatesTransformer = dist.collapseDuplicatesTransformer;
const compareMatchByPositionAndId = dist.compareMatchByPositionAndId;
const englishDataset = dist.englishDataset;
const englishRecommendedBlacklistMatcherTransformers = dist.englishRecommendedBlacklistMatcherTransformers;
const englishRecommendedTransformers = dist.englishRecommendedTransformers;
const englishRecommendedWhitelistMatcherTransformers = dist.englishRecommendedWhitelistMatcherTransformers;
const fixedCharCensorStrategy = dist.fixedCharCensorStrategy;
const fixedPhraseCensorStrategy = dist.fixedPhraseCensorStrategy;
const grawlixCensorStrategy = dist.grawlixCensorStrategy;
const keepEndCensorStrategy = dist.keepEndCensorStrategy;
const keepStartCensorStrategy = dist.keepStartCensorStrategy;
const parseRawPattern = dist.parseRawPattern;
const pattern = dist.pattern;
const randomCharFromSetCensorStrategy = dist.randomCharFromSetCensorStrategy;
const remapCharactersTransformer = dist.remapCharactersTransformer;
const resolveConfusablesTransformer = dist.resolveConfusablesTransformer;
const resolveLeetSpeakTransformer = dist.resolveLeetSpeakTransformer;
const skipNonAlphabeticTransformer = dist.skipNonAlphabeticTransformer;
const toAsciiLowerCaseTransformer = dist.toAsciiLowerCaseTransformer;
const version = dist.version;

// EXTERNAL MODULE: ./src/utils/ActionUtils.js
var ActionUtils = __nccwpck_require__(778);
// EXTERNAL MODULE: ./src/utils/ArrayUtils.js
var ArrayUtils = __nccwpck_require__(1970);
// EXTERNAL MODULE: ./src/utils/FileUtils.js
var FileUtils = __nccwpck_require__(4056);
;// CONCATENATED MODULE: ./src/index.js






async function run() {
  try {
    if ((0,FileUtils.isWorkspaceEmpty)()) {
      throw new Error('Workspace is empty')
    }

    const matcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    })

    let replace = (0,ActionUtils.getInput)('replace', { required: false })
    if (!replace) {
      replace = 'cute'
    }
    let include = (0,ActionUtils.getInputAsArray)('include', { required: false })
    let exclude = (0,ActionUtils.getInputAsArray)('exclude', { required: false })

    include = (0,ArrayUtils.split)(include, ',')
    exclude = (0,ArrayUtils.split)(exclude, ',')

    ;(0,core.info)(`include: ${JSON.stringify(include)}`)
    ;(0,core.info)(`exclude: ${JSON.stringify(exclude)}`)
    ;(0,core.info)(`replace: ${replace}`)

    const files = (0,FileUtils.searchFiles)(include, exclude)

    ;(0,core.info)(`Found ${files.length} file(s). Checking them out:`)

    let modifiedFiles = 0
    const fudgeStrategy = () => replace
    const censor = new TextCensor().setStrategy(fudgeStrategy)

    files.forEach((file) => {
      ;(0,core.info)(`Processing: ${file}`)

      let content = (0,FileUtils.readContent)(file)

      // const matches = matcher.getAllMatches(input)
      // const newContent = censor.applyTo(input, matches)
      var Filter = __nccwpck_require__(4229)
      var customFilter = new Filter({ placeHolder: 'x' })
      const newContent = customFilter.clean(input)
      ;(0,core.info)(`newContent: ${newContent}`)
      if (content != newContent) {
        modifiedFiles++
      }

      (0,FileUtils.writeContent)(file, newContent)
    })

    ;(0,core.info)('Done. All files checked')

    ;(0,core.setOutput)('modifiedFiles', modifiedFiles)
  } catch (error) {
    (0,core.setFailed)(error.message)
  }
}

run()

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map