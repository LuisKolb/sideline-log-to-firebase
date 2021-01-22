const fs = require("fs");
const admin = require("firebase-admin");
admin.initializeApp({
    apiKey: "AIzaSyBUv2C-h8oWiYbUX1F-RvY-gqiHjdq5HWU",
    authDomain: "sideline-302116.firebaseapp.com",
    projectId: "sideline-302116",
    storageBucket: "sideline-302116.appspot.com",
    messagingSenderId: "1070539112262",
    appId: "1:1070539112262:web:cd5fdc2b4307c56e9d6f47",
});
const db = admin.firestore();

var download_and_save = function () {
    if (!fs.existsSync("./user_data/")) {
        fs.mkdirSync("./user_data/");
    }

    var userID = process.argv[2];
    console.log("Downloading data from user " + userID + "...");
    const userRef = db.collection("logs").doc(userID);

    userRef.get().then(async function (doc) {
        var path = "./user_data/" + userID;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        fs.writeFileSync(path + "/nb.ipynb", JSON.stringify(doc.data().nbJSON));
        userRef
            .collection("actions")
            .orderBy("time", "asc")
            .get()
            .then(async (snapshot) => {
                if (fs.existsSync(path + "/actions.txt")) {
                    fs.unlinkSync(path + "/actions.txt");
                }
                await snapshot
                    .forEach((doc) => {
                        var actionStr = doc.data().time.toDate().toString() + "," + doc.data().action + "\n";
                        fs.writeFileSync(path + "/actions.txt", actionStr, { flag: "a" });
                    });
                console.log("Done.");
            });
    });
};

download_and_save();
