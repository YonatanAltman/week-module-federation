# Development Scripts Guide

This document explains how to use the custom development scripts for running your module federation applications efficiently.

## Overview

We've created cross-platform scripts that make it easy to start the module federation applications with fine-grained control over which remote applications to run.

## Available Scripts

### Shell Script (Linux/macOS)
- **File**: `start-apps.sh`
- **Usage**: `./start-apps.sh [OPTIONS]`

### Batch Script (Windows)
- **File**: `start-apps.bat`
- **Usage**: `start-apps.bat [OPTIONS]`

### npm Scripts
- `npm run dev` - Run the shell script (Linux/macOS)
- `npm run dev:all` - Run all applications via shell script
- `npm run dev:win` - Run the batch script (Windows)
- `npm run dev:all:win` - Run all applications via batch script

## Features

### Always Includes Host
- The `week` application (host) is **always** started automatically
- You only need to specify which remote applications you want to run

### Flag-Based Remote Selection
Choose which remote applications to run using flags:

| Flag | Long Form | Application | Port |
|------|-----------|-------------|------|
| `-f` | `--friday` | friday | 4201 |
| `-m` | `--monday` | monday | 4202 |
| `-t` | `--tuesday` | tuesday | 4203 |
| `-w` | `--wednesday` | wednesday | 4204 |
| `-th` | `--thursday` | thursday | 4205 |
| `-s` | `--saturday` | saturday | 4206 |
| `-su` | `--sunday` | sunday | 4207 |

### Special Flags
- `-a` or `--all` - Start all remote applications
- `-h` or `--help` - Show help and usage information

## Usage Examples

### Basic Examples

```bash
# Start only the host application (week)
./start-apps.sh

# Start host + friday remote
./start-apps.sh --friday

# Start host + multiple remotes
./start-apps.sh --friday --monday --tuesday

# Start all applications
./start-apps.sh --all
```

### Short Flag Examples

```bash
# Using short flags
./start-apps.sh -f -m -t

# Mix short and long flags
./start-apps.sh -f --monday -t

# All remotes with short flag
./start-apps.sh -a
```

### npm Script Examples

```bash
# Using npm scripts (Linux/macOS)
npm run dev                    # Host only
npm run dev -- --friday       # Host + friday
npm run dev -- -f -m          # Host + friday + monday
npm run dev:all                # All applications

# Using npm scripts (Windows)
npm run dev:win                # Host only
npm run dev:win -- --friday    # Host + friday
npm run dev:all:win            # All applications
```

## Development Workflows

### Frontend Developer Workflow
If you're working on specific features:

```bash
# Working on friday and monday features
./start-apps.sh --friday --monday

# Working on a single remote
./start-apps.sh --tuesday
```

### Full Stack Developer Workflow
When you need to see the complete application:

```bash
# Start everything
./start-apps.sh --all
# or
npm run dev:all
```

### Testing Workflow
For testing specific integrations:

```bash
# Test specific remote integrations
./start-apps.sh --friday --saturday

# Test weekend remotes
./start-apps.sh --saturday --sunday
```

## Script Output

The scripts provide clear feedback about what's being started:

```
🚀 Starting Module Federation Applications
Host Application:
  ✓ week (http://localhost:4200)

Remote Applications:
  ✓ friday (http://localhost:4201)
  ✓ monday (http://localhost:4202)

Executing: npx nx run-many --target=serve --projects=week,friday,monday --parallel

Press Ctrl+C to stop all applications
```

## Error Handling

The scripts include built-in error checking:

- **npx availability**: Checks if npx is installed
- **Nx availability**: Verifies Nx is properly installed
- **Invalid flags**: Shows helpful error messages for unknown options
- **Prerequisites**: Suggests running `npm install` if Nx is missing

## Platform Compatibility

### Linux/macOS (start-apps.sh)
- Requires bash shell
- Uses ANSI colors for better output
- More robust argument parsing

### Windows (start-apps.bat)
- Compatible with Windows Command Prompt
- Uses Windows batch scripting
- Equivalent functionality to the shell script

## Help and Documentation

Get help anytime by running:

```bash
# Shell script help
./start-apps.sh --help

# Batch script help
start-apps.bat --help
```

This shows:
- All available options
- Usage examples
- Port mapping
- Command syntax

## Tips and Best Practices

### Performance Tips
1. **Start only what you need**: Don't run all remotes if you're only working on specific features
2. **Use parallel execution**: The scripts automatically run applications in parallel for faster startup
3. **Monitor resource usage**: Running all 8 applications can be resource-intensive

### Development Tips
1. **Use consistent naming**: Stick to either short flags (-f) or long flags (--friday) for consistency
2. **Save common configurations**: Create aliases for frequently used combinations
3. **Check ports**: Each application runs on a specific port - the scripts show this information

### Troubleshooting
1. **Port conflicts**: If you get port errors, make sure no other applications are using those ports
2. **Permission errors**: On Linux/macOS, ensure the shell script is executable (`chmod +x start-apps.sh`)
3. **Path issues**: Run scripts from the root directory of your workspace

## Integration with IDE

You can integrate these scripts with your IDE:

### VS Code
Add to your workspace settings or tasks.json:

```json
{
  "label": "Start Dev Environment",
  "type": "shell",
  "command": "./start-apps.sh",
  "args": ["--friday", "--monday"],
  "group": "build"
}
```

### IntelliJ/WebStorm
Create run configurations that execute the scripts with your preferred flags.

## Future Enhancements

Possible future improvements:
- Configuration file support for saving flag combinations
- Integration with VS Code tasks
- Auto-detection of changed applications
- Health checks for running applications
- Support for custom port configurations 