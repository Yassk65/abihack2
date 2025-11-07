@echo off
echo Recherche du processus sur le port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Arret du processus %%a...
    taskkill /PID %%a /F
)
echo.
echo Port 3000 libere !
echo Vous pouvez maintenant executer: npm start
pause
