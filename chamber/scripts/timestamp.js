/* ............. JOIN PAGE INITIALIZATION ............. */

const timestampField = document.querySelector("#timestamp");

/* ............. LOAD TIMESTAMP ............. */

if (timestampField) {
    timestampField.value = new Date().toISOString();
}