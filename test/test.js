import should from 'should';

import * as garlandTools from '../garlandtools-api'

describe("achievement", function() {
    const makeTest = (id, expectedAchievementName, lang) => {
        it(`should return the achievement ${expectedAchievementName} for { id: ${id}, lang: ${lang} }`, async function() {
            garlandTools.setLang(lang);
            const achievement = (await garlandTools.achievement(id)).achievement;
            should.equal(achievement.name, expectedAchievementName);
        });
    };

    makeTest(1, "To Crush Your Enemies I", "en");
    makeTest(203, "Prosperierender Prospektor", "de");
    makeTest(270, "Noyer le poisson : Sombrelinceul", "fr");
    makeTest(92, "調理師：レベル10", "ja");
});