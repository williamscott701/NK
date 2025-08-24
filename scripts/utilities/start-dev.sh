#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Bible Web App Development Server...${NC}"

# Check if port 8080 is in use
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Port 8080 is already in use. Killing existing process...${NC}"
    
    # Get the PID of the process using port 8080
    PID=$(lsof -ti:8080)
    
    if [ ! -z "$PID" ]; then
        echo -e "${YELLOW}🔫 Killing process $PID on port 8080...${NC}"
        kill -9 $PID
        
        # Wait a moment for the process to fully terminate
        sleep 2
        
        # Verify the port is free
        if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${RED}❌ Failed to kill process on port 8080${NC}"
            exit 1
        else
            echo -e "${GREEN}✅ Successfully freed port 8080${NC}"
        fi
    fi
else
    echo -e "${GREEN}✅ Port 8080 is available${NC}"
fi

echo -e "${GREEN}🚀 Starting Astro dev server on port 8080...${NC}"
npm run astro dev
