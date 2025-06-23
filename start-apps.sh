#!/bin/bash

# Module Federation Development Script
# Always starts the 'week' host application and selected remote applications based on flags

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default apps to run (week is always included)
APPS=("week")

# Available remote apps
AVAILABLE_REMOTES=("friday" "monday" "tuesday" "wednesday" "thursday" "saturday" "sunday")

# Flag to run all remotes
RUN_ALL=false

# Help function
show_help() {
    echo -e "${BLUE}Module Federation Development Script${NC}"
    echo -e "${YELLOW}Usage: ./start-apps.sh [OPTIONS]${NC}"
    echo ""
    echo "Always starts the 'week' host application plus selected remote applications."
    echo ""
    echo -e "${GREEN}Options:${NC}"
    echo "  -h, --help           Show this help message"
    echo "  -a, --all           Start all remote applications"
    echo "  -f, --friday        Start friday remote"
    echo "  -m, --monday        Start monday remote"
    echo "  -t, --tuesday       Start tuesday remote"
    echo "  -w, --wednesday     Start wednesday remote"
    echo "  -th, --thursday     Start thursday remote"
    echo "  -s, --saturday      Start saturday remote"
    echo "  -su, --sunday       Start sunday remote"
    echo ""
    echo -e "${GREEN}Examples:${NC}"
    echo "  ./start-apps.sh --friday --monday"
    echo "  ./start-apps.sh -f -m -t"
    echo "  ./start-apps.sh --all"
    echo "  ./start-apps.sh -a"
    echo ""
    echo -e "${GREEN}Port Mapping:${NC}"
    echo "  week      : http://localhost:4200 (Host)"
    echo "  friday    : http://localhost:4201"
    echo "  monday    : http://localhost:4202"
    echo "  tuesday   : http://localhost:4203"
    echo "  wednesday : http://localhost:4204"
    echo "  thursday  : http://localhost:4205"
    echo "  saturday  : http://localhost:4206"
    echo "  sunday    : http://localhost:4207"
}

# Check if nx is available
check_nx() {
    if ! command -v npx &> /dev/null; then
        echo -e "${RED}Error: npx is not installed or not in PATH${NC}"
        exit 1
    fi
    
    if ! npx nx --version &> /dev/null; then
        echo -e "${RED}Error: Nx is not installed. Please run 'npm install' first.${NC}"
        exit 1
    fi
}

# Add app to the list if not already present
add_app() {
    local app=$1
    if [[ ! " ${APPS[@]} " =~ " ${app} " ]]; then
        APPS+=("$app")
    fi
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -a|--all)
                RUN_ALL=true
                shift
                ;;
            -f|--friday)
                add_app "friday"
                shift
                ;;
            -m|--monday)
                add_app "monday"
                shift
                ;;
            -t|--tuesday)
                add_app "tuesday"
                shift
                ;;
            -w|--wednesday)
                add_app "wednesday"
                shift
                ;;
            -th|--thursday)
                add_app "thursday"
                shift
                ;;
            -s|--saturday)
                add_app "saturday"
                shift
                ;;
            -su|--sunday)
                add_app "sunday"
                shift
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                echo "Use --help for usage information."
                exit 1
                ;;
        esac
    done
}

# Add all remote apps if --all flag is used
add_all_remotes() {
    if [ "$RUN_ALL" = true ]; then
        for remote in "${AVAILABLE_REMOTES[@]}"; do
            add_app "$remote"
        done
    fi
}

# Display what will be started
show_startup_info() {
    echo -e "${BLUE}🚀 Starting Module Federation Applications${NC}"
    echo -e "${YELLOW}Host Application:${NC}"
    echo "  ✓ week (http://localhost:4200)"
    
    if [ ${#APPS[@]} -gt 1 ]; then
        echo -e "${YELLOW}Remote Applications:${NC}"
        for app in "${APPS[@]}"; do
            if [ "$app" != "week" ]; then
                case $app in
                    friday) echo "  ✓ friday (http://localhost:4201)" ;;
                    monday) echo "  ✓ monday (http://localhost:4202)" ;;
                    tuesday) echo "  ✓ tuesday (http://localhost:4203)" ;;
                    wednesday) echo "  ✓ wednesday (http://localhost:4204)" ;;
                    thursday) echo "  ✓ thursday (http://localhost:4205)" ;;
                    saturday) echo "  ✓ saturday (http://localhost:4206)" ;;
                    sunday) echo "  ✓ sunday (http://localhost:4207)" ;;
                esac
            fi
        done
    else
        echo -e "${YELLOW}Remote Applications:${NC}"
        echo "  (none selected)"
    fi
    echo ""
}

# Build the nx command
build_nx_command() {
    local projects=$(IFS=,; echo "${APPS[*]}")
    echo "npx nx run-many --target=serve --projects=$projects --parallel"
}

# Main execution
main() {
    # Parse arguments
    parse_args "$@"
    
    # Check prerequisites
    check_nx
    
    # Add all remotes if flag is set
    add_all_remotes
    
    # Show what will be started
    show_startup_info
    
    # Build and execute the command
    local nx_command=$(build_nx_command)
    
    echo -e "${GREEN}Executing:${NC} $nx_command"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop all applications${NC}"
    echo ""
    
    # Execute the command
    eval "$nx_command"
}

# Run main function with all arguments
main "$@" 