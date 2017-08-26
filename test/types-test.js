var assert = chai.assert;

describe("node", function() {
    beforeEach(function() {
        Node.clearList();
        Link.clearList();
    });

    it("creates a node", function() {
        new Node(srcNode);
        assert.strictEqual(Node.list.length, 1);
        Node.clearList();
        assert.strictEqual(Node.list.length, 0);
    });

    it("creates lots of nodes", function() {
        for (let node of dstList) {
            new Node(node);
        }
        assert.strictEqual(Node.list.length, 17);
    });

    it("won't create duplicate records");
});

describe("link", function() {
    it("creates links", function() {
        for (let link of relList) {
            new Link(link);
        }
        assert.strictEqual(Link.list.length, 17);
        Link.clearList();
        assert.strictEqual(Link.list.length, 0);
    });
});

/* JSHINT */
/* globals chai, beforeEach, Node, Link, srcNode, dstList, relList */