var nodeList = [];

class Node {
    // takes a neo4j query result
    constructor(record) {
        console.log ("NODE CONSTRUCTOR:", record);
        console.log ("JSON:", JSON.stringify(record));
        if (typeof record !== "object" ||
            typeof record.iri !== "string") {
            throw new TypeError ("Malformed arguments in Node constructor: " + record);
        }
        // TODO: check for duplicate
        this.me = record;
        this.id = record.iri;
        console.log ("Node ID:", this.id);
        nodeList.push(this);
    }

    // selected
    // update
    static get list() {
        return nodeList;
    }

    static clearList() {
        nodeList.length = 0;
    }
    // static find
}

var linkList = [];

class Link {
    constructor(record) {
        console.log ("LINK CONSTRUCTOR:", record);
        if (typeof record !== "object" ||
            typeof record.src !== "object" ||
            typeof record.link !== "object" ||
            typeof record.dst !== "object") {
            console.log ("Bad link record:", record);
            throw new TypeError ("Malformed arguments in Link constructor: " + record);
        }
        this.src = record.src.iri;
        this.dst = record.dst.iri;
        this.type = record.link.type;
        console.log (this);

        linkList.push(this);
    }

    static get list() {
        return linkList;
    }

    static clearList() {
        linkList.length = 0;
    }
}

/* JSHINT */
/* exported Node, Link */