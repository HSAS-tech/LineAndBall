"use strict";
var pages;
(function (pages) {
    class MainPage extends game.Page {
        constructor(g) {
            super(g);
            this.backgroundColor = '#888888';
        }
    }
    pages.MainPage = MainPage;
    class LevelPage extends game.Page {
        constructor(g) {
            super(g);
        }
    }
    pages.LevelPage = LevelPage;
})(pages || (pages = {}));
