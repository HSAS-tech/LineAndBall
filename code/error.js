"use strict";
var error;
(function (error) {
    class ElementNotFound extends Error {
        constructor(selectors) {
            super(selectors);
        }
    }
    error.ElementNotFound = ElementNotFound;
    class ArgumentError extends Error {
        constructor(argument) {
            super(argument);
        }
    }
    error.ArgumentError = ArgumentError;
    class NetworkError extends Error {
        constructor(url) {
            super(url);
        }
    }
    error.NetworkError = NetworkError;
})(error || (error = {}));
