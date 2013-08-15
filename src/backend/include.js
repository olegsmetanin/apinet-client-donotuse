/* global sysConfig: true */
// backend
if (sysConfig.fakeBackend) {
    sysConfig.modules['core'].js.push("src/backend/backend.js");
}
// delay
if (sysConfig.delay) {
    sysConfig.modules['core'].js.push("src/backend/delay.js");
}