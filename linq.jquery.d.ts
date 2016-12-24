declare module linqjs {
    interface IEnumerable<T> {
        tojQuery(): JQuery;
        tojQueryAsArray(): JQuery;
    }
}

interface JQuery {
    toEnumerable(): linqjs.IEnumerable<JQuery>;
}