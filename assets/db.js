var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "passwd"));
window.driver = driver;

function normalizeData(records, field, cb) {
    if (!Array.isArray(records) || typeof field !== "string") {
        console.log("records", records);
        console.log("field", field);
        throw new TypeError("bad arguments to normalizeData");
    }

    console.log("normalizeData records", records);
    var foo = records.reduce((acc, rec) => {
        console.log("acc x", acc);

        // get the record
        var record = rec.get(field).properties;
        var duplicate = acc.findIndex((r) => {
            return r.iri === record.iri;
        });

        duplicate = (duplicate === -1) ? false : true;
        // link records have no IRI and are never duplicates
        if (record.iri === undefined) duplicate = false;

        // if not a duplicate, add it to the list
        if (!duplicate) {
            // use the callback to format the data
            var x = cb(rec);
            acc.push(x);
        }
        return acc;
    }, []);
    console.log ("normalizeData returning", foo);
    return foo;
}

function normalizeNode(records, field) {
    return normalizeData(records, field, (r) => {
        // console.log ("cb r", r);
        var x = r.get(field).properties;
        // console.log ("callback", x);
        return x;
    });
}

function normalizeLink(records, src, rel, dst) {
    return normalizeData(records, rel, (r) => {
        var s = r.get(src);
        var d = r.get(dst);
        var l = r.get(rel);
        return {
            src: s.properties,
            dst: d.properties,
            link: l.properties,
        };
    });
}

function randomBiblio() {
    var session = driver.session();
    var query = `MATCH (src)-[rel]-(dst)
                 WHERE id(src) = toInteger(rand() * 34000000)
                 RETURN src,rel,dst`;
    query = "MATCH (src:BibliographicResource {iri: \"gbr:4086996\"})-[rel]-(dst) RETURN src, rel, dst";
    session.run(query)
        .then((res) => {
            session.close();
            var src = normalizeNode(res.records, "src")[0];
            var dstList = normalizeNode(res.records, "dst");
            var relList = normalizeLink(res.records, "src", "rel", "dst");

            // console.log ("src JSON", JSON.stringify(src));
            // console.log ("dstList JSON", JSON.stringify(dstList));
            // console.log ("relList JSON", JSON.stringify(relList));

            new Node(src);
            for (let node of dstList) {
                new Node(node);
            }
            for (let link of relList) {
                new Link(link);
            }
        })
        .catch((err) => {
            session.close();
            console.log("ERROR", err);
            throw err;
        });
}

// randomBiblio();

/* JSHINT */
/* globals neo4j, Node, Link */