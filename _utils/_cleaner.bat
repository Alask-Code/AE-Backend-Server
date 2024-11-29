@echo off
cd ..
echo Press to continue deleting user/cache and user/logs
pause

rmdir /Q /S user\cache
rmdir /Q /S user\logs