@echo off
setlocal enabledelayedexpansion

:: Module Federation Development Script (Windows)
:: Always starts the 'week' host application and selected remote applications based on flags

:: Default apps to run (week is always included)
set "APPS=week"
set "RUN_ALL=false"

:: Available remote apps
set "AVAILABLE_REMOTES=friday monday tuesday wednesday thursday saturday sunday"

:: Parse command line arguments
:parse_args
if "%~1"=="" goto :check_all
if /i "%~1"=="-h" goto :show_help
if /i "%~1"=="--help" goto :show_help
if /i "%~1"=="-a" (
    set "RUN_ALL=true"
    shift
    goto :parse_args
)
if /i "%~1"=="--all" (
    set "RUN_ALL=true"
    shift
    goto :parse_args
)
if /i "%~1"=="-f" (
    call :add_app friday
    shift
    goto :parse_args
)
if /i "%~1"=="--friday" (
    call :add_app friday
    shift
    goto :parse_args
)
if /i "%~1"=="-m" (
    call :add_app monday
    shift
    goto :parse_args
)
if /i "%~1"=="--monday" (
    call :add_app monday
    shift
    goto :parse_args
)
if /i "%~1"=="-t" (
    call :add_app tuesday
    shift
    goto :parse_args
)
if /i "%~1"=="--tuesday" (
    call :add_app tuesday
    shift
    goto :parse_args
)
if /i "%~1"=="-w" (
    call :add_app wednesday
    shift
    goto :parse_args
)
if /i "%~1"=="--wednesday" (
    call :add_app wednesday
    shift
    goto :parse_args
)
if /i "%~1"=="-th" (
    call :add_app thursday
    shift
    goto :parse_args
)
if /i "%~1"=="--thursday" (
    call :add_app thursday
    shift
    goto :parse_args
)
if /i "%~1"=="-s" (
    call :add_app saturday
    shift
    goto :parse_args
)
if /i "%~1"=="--saturday" (
    call :add_app saturday
    shift
    goto :parse_args
)
if /i "%~1"=="-su" (
    call :add_app sunday
    shift
    goto :parse_args
)
if /i "%~1"=="--sunday" (
    call :add_app sunday
    shift
    goto :parse_args
)

echo Unknown option: %~1
echo Use --help for usage information.
exit /b 1

:show_help
echo Module Federation Development Script (Windows)
echo Usage: start-apps.bat [OPTIONS]
echo.
echo Always starts the 'week' host application plus selected remote applications.
echo.
echo Options:
echo   -h, --help           Show this help message
echo   -a, --all           Start all remote applications
echo   -f, --friday        Start friday remote
echo   -m, --monday        Start monday remote
echo   -t, --tuesday       Start tuesday remote
echo   -w, --wednesday     Start wednesday remote
echo   -th, --thursday     Start thursday remote
echo   -s, --saturday      Start saturday remote
echo   -su, --sunday       Start sunday remote
echo.
echo Examples:
echo   start-apps.bat --friday --monday
echo   start-apps.bat -f -m -t
echo   start-apps.bat --all
echo   start-apps.bat -a
echo.
echo Port Mapping:
echo   week      : http://localhost:4200 (Host)
echo   friday    : http://localhost:4201
echo   monday    : http://localhost:4202
echo   tuesday   : http://localhost:4203
echo   wednesday : http://localhost:4204
echo   thursday  : http://localhost:4205
echo   saturday  : http://localhost:4206
echo   sunday    : http://localhost:4207
exit /b 0

:add_app
set "APP_TO_ADD=%~1"
echo !APPS! | findstr /C:"%APP_TO_ADD%" >nul
if errorlevel 1 (
    set "APPS=!APPS!,%APP_TO_ADD%"
)
exit /b 0

:check_all
if "!RUN_ALL!"=="true" (
    for %%r in (%AVAILABLE_REMOTES%) do (
        call :add_app %%r
    )
)

:: Check if nx is available
where npx >nul 2>&1
if errorlevel 1 (
    echo Error: npx is not installed or not in PATH
    exit /b 1
)

npx nx --version >nul 2>&1
if errorlevel 1 (
    echo Error: Nx is not installed. Please run 'npm install' first.
    exit /b 1
)

:: Show startup info
echo.
echo 🚀 Starting Module Federation Applications
echo Host Application:
echo   ✓ week (http://localhost:4200)
echo.

:: Check if we have remotes
set "HAS_REMOTES=false"
echo !APPS! | findstr /C:"," >nul
if not errorlevel 1 set "HAS_REMOTES=true"

if "!HAS_REMOTES!"=="true" (
    echo Remote Applications:
    for %%a in (!APPS!) do (
        if not "%%a"=="week" (
            if "%%a"=="friday" echo   ✓ friday (http://localhost:4201)
            if "%%a"=="monday" echo   ✓ monday (http://localhost:4202)
            if "%%a"=="tuesday" echo   ✓ tuesday (http://localhost:4203)
            if "%%a"=="wednesday" echo   ✓ wednesday (http://localhost:4204)
            if "%%a"=="thursday" echo   ✓ thursday (http://localhost:4205)
            if "%%a"=="saturday" echo   ✓ saturday (http://localhost:4206)
            if "%%a"=="sunday" echo   ✓ sunday (http://localhost:4207)
        )
    )
) else (
    echo Remote Applications:
    echo   (none selected)
)

echo.
echo Executing: npx nx run-many --target=serve --projects=!APPS! --parallel
echo.
echo Press Ctrl+C to stop all applications
echo.

:: Execute the command
npx nx run-many --target=serve --projects=!APPS! --parallel 