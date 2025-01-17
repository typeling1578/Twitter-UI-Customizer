import fetch from "node-fetch";
import fs from "fs";

(async () => {
    let locales = [];
    if (process.argv.length == 2) {
        locales = JSON.parse(fs.readFileSync("./i18n/_langList.json", "utf8"));
    } else {
        for (var i = 2; i < process.argv.length; i++) {
            locales.push(process.argv[i]);
        }
    }
    const i18nObject = {};
    const i18nObjectOld = {};
    for (const elem of locales) {
        console.log(`Fetching i18n (${elem})...`);
        i18nObject[elem] = await (await fetch("https://raw.githubusercontent.com/fa0311/TwitterInternalAPIDocument/3f0ec1fb005f218a7eb60b580fd620541b1a9ad5/docs/json/i18n/" + elem + ".json")).json();
        i18nObjectOld[elem] = await (await fetch("https://raw.githubusercontent.com/fa0311/TwitterInternalAPIDocument/d4aa08362ae1ef6ff39e198909c4259292770f41/docs/json/i18n/" + elem + ".json")).json();
    }
    //https://github.com/fa0311/TwitterInternalAPIDocument/blob/3f0ec1fb005f218a7eb60b580fd620541b1a9ad5/docs/json/i18n/ja.json
    //https://github.com/fa0311/TwitterInternalAPIDocument/blob/d4aa08362ae1ef6ff39e198909c4259292770f41/docs/json/i18n/ja.json
    const TUICI18ns = JSON.parse(fs.readFileSync("../Twitter-UI-Customizer/i18n/_officalTwitterI18n.json", "utf8"));

    for (const elem of locales) {
        console.log(`Generating i18n (${elem})...`);
        let tmpObj = {};
        for (const elem2 in TUICI18ns) {
            if (i18nObject[elem][TUICI18ns[elem2]] != undefined || i18nObjectOld[elem][TUICI18ns[elem2]] != undefined) {
                if (TUICI18ns[elem2] == "g132f681") {
                    tmpObj = { [elem2]: i18nObject[elem][TUICI18ns[elem2]].replace("@{screenName}", ""), ...tmpObj };
                } else if (TUICI18ns[elem2] == "e74e9bb7") {
                    const textBase = i18nObject[elem][TUICI18ns[elem2]].slice(0, i18nObject[elem][TUICI18ns[elem2]].indexOf("(")).replace("{tweetCount}", "").replace(")");
                    if (i18nObject[elem][TUICI18ns[elem2]].includes("(")) {
                        tmpObj = { [elem2]: textBase + i18nObject[elem][TUICI18ns[elem2]].slice(i18nObject[elem][TUICI18ns[elem2]].indexOf("(")).split(",")[2].replace(")", "").replace(".", "").replace("。", ""), ...tmpObj };
                    } else {
                        tmpObj = { [elem2]: textBase.replace(".", "").replace("。", ""), ...tmpObj };
                    }
                } else if (TUICI18ns[elem2] == "c42234da" && i18nObject[elem][TUICI18ns[elem2]]?.includes("(")) {
                    const textBase = i18nObject[elem][TUICI18ns[elem2]].slice(0, i18nObject[elem][TUICI18ns[elem2]].indexOf("("));
                    tmpObj = { [elem2]: textBase + i18nObject[elem][TUICI18ns[elem2]].slice(i18nObject[elem][TUICI18ns[elem2]].indexOf("(")).split(",")[2].replace(")", ""), ...tmpObj };
                } else if (TUICI18ns[elem2] == "e2414185") {
                    if (i18nObjectOld[elem][TUICI18ns[elem2]]?.includes("(")) {
                        const textBase = i18nObjectOld[elem][TUICI18ns[elem2]].slice(0, i18nObjectOld[elem][TUICI18ns[elem2]].indexOf("("));
                        tmpObj = { [elem2]: textBase + i18nObjectOld[elem][TUICI18ns[elem2]].slice(i18nObjectOld[elem][TUICI18ns[elem2]].indexOf("(")).split(",")[2].replace(")", ""), ...tmpObj };
                    } else {
                        tmpObj = { [elem2]: i18nObjectOld[elem][TUICI18ns[elem2]], ...tmpObj };
                    }
                } else {
                    tmpObj = { [elem2]: i18nObject[elem][TUICI18ns[elem2]], ...tmpObj };
                }
            }
        }
        fs.writeFileSync("./i18n/ti18n/" + elem + ".json", JSON.stringify(tmpObj, undefined, 4));
    }
})();
