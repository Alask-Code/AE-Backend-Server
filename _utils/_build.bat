@echo off
cd ..
node build/main.js
echo 'Server.exe' Build Finished, any Key to Create '_Dist' Folder
pause

mkdir _Dist
copy Server.exe _Dist\
xcopy db _Dist\db /E /I
xcopy res _Dist\res /E /I
xcopy src _Dist\src /E /I
xcopy user _Dist\user /E /I
rmdir /q /s _Dist\user\cache
mkdir _Dist\user\cache
rmdir /q /s _Dist\user\logs
mkdir _Dist\user\logs
echo _Dist Creation Complete, any Key to Cleaner...
pause

del Server.exe /q
del Server-Icon.exe /q
del Server-Uncompressed.exe /q
echo Cleaner Exiting...
pause