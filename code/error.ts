namespace error {
    export class ElementNotFound extends Error {
        public constructor(selectors: string) {
            super(selectors);
        }
    }
    export class ArgumentError extends Error {
        public constructor(argument: string) {
            super(argument);
        }
    }
    export class NetworkError extends Error {
        public constructor(url: string) {
            super(url);
        }
    }
}