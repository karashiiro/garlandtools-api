@echo off
if exist build rmdir build /s /q
mkdir build
npx babel garlandtools-api.js --out-file build/garlandtools-api.js