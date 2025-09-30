#!/bin/bash

echo "🔍 Running Pre-Push Security Audit..."
echo "=========================================="
echo ""

# Track if any issues found
ISSUES_FOUND=0

# 1. Check for hardcoded Mapbox tokens
echo "1️⃣  Scanning for hardcoded Mapbox tokens..."
if grep -r "pk\.eyJ\|sk\.eyJ" --exclude-dir={node_modules,.next,.git,portfolio-map-app} --exclude="*.md" --exclude=".gitignore" --exclude="security-check.sh" --exclude=".env.local" --exclude=".env.*.local" . 2>/dev/null; then
    echo "   ❌ CRITICAL: Found hardcoded tokens in source code!"
    ISSUES_FOUND=1
else
    echo "   ✅ No hardcoded tokens found in source code"
fi
echo ""

# 2. Check for .env files tracked by git
echo "2️⃣  Checking for tracked .env files..."
TRACKED_ENV=$(git ls-files 2>/dev/null | grep "\.env" | grep -v ".env.example")
if [ -n "$TRACKED_ENV" ]; then
    echo "   ❌ CRITICAL: .env files are tracked by git!"
    echo "   Files: $TRACKED_ENV"
    ISSUES_FOUND=1
else
    echo "   ✅ No .env files tracked (only .env.example is safe)"
fi
echo ""

# 3. Check if .next is git-ignored
echo "3️⃣  Verifying .next directory is ignored..."
if git check-ignore .next > /dev/null 2>&1; then
    echo "   ✅ .next directory is properly ignored"
else
    echo "   ❌ WARNING: .next directory is NOT ignored!"
    ISSUES_FOUND=1
fi
echo ""

# 4. Check if .vscode/mcp.json is git-ignored
echo "4️⃣  Verifying .vscode/mcp.json is ignored..."
if [ -f ".vscode/mcp.json" ]; then
    if git check-ignore .vscode/mcp.json > /dev/null 2>&1; then
        echo "   ✅ .vscode/mcp.json is properly ignored"
    else
        echo "   ❌ CRITICAL: .vscode/mcp.json exists but is NOT ignored!"
        ISSUES_FOUND=1
    fi
else
    echo "   ✅ .vscode/mcp.json does not exist"
fi
echo ""

# 5. Check for API keys in configuration files
echo "5️⃣  Scanning configuration files for secrets..."
if grep -E "API_KEY|SECRET.*=|TOKEN.*=" next.config.js vercel.json package.json 2>/dev/null | grep -v "process.env"; then
    echo "   ❌ WARNING: Found potential secrets in config files!"
    ISSUES_FOUND=1
else
    echo "   ✅ No secrets in configuration files"
fi
echo ""

# 6. Check if .env.local exists and has content
echo "6️⃣  Checking .env.local status..."
if [ -f ".env.local" ]; then
    if git ls-files --error-unmatch .env.local > /dev/null 2>&1; then
        echo "   ❌ CRITICAL: .env.local is tracked by git!"
        ISSUES_FOUND=1
    else
        echo "   ✅ .env.local exists and is git-ignored"
    fi
else
    echo "   ⚠️  .env.local does not exist (needed for local dev)"
fi
echo ""

# 7. Check staged files for secrets
echo "7️⃣  Checking staged files..."
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null)
if [ -n "$STAGED_FILES" ]; then
    echo "   Staged files:"
    echo "$STAGED_FILES" | while read -r file; do
        echo "   - $file"
        if [[ "$file" == *".env"* ]] && [[ "$file" != ".env.example" ]]; then
            echo "     ❌ CRITICAL: .env file is staged!"
            ISSUES_FOUND=1
        fi
    done
else
    echo "   ℹ️  No files staged for commit"
fi
echo ""

# 8. Verify .env.example has no real tokens
echo "8️⃣  Verifying .env.example is safe..."
if [ -f ".env.example" ]; then
    if grep -E "pk\.eyJ|sk\.eyJ" .env.example > /dev/null 2>&1; then
        echo "   ❌ CRITICAL: .env.example contains real tokens!"
        ISSUES_FOUND=1
    else
        echo "   ✅ .env.example contains only placeholders"
    fi
else
    echo "   ⚠️  .env.example does not exist"
fi
echo ""

# Final Report
echo "=========================================="
if [ $ISSUES_FOUND -eq 0 ]; then
    echo "✅ ✅ ✅  SECURITY AUDIT PASSED  ✅ ✅ ✅"
    echo ""
    echo "Your codebase is ready to push safely!"
    echo "All secrets are properly secured."
    exit 0
else
    echo "❌ ❌ ❌  SECURITY ISSUES FOUND  ❌ ❌ ❌"
    echo ""
    echo "⛔ DO NOT PUSH until issues are resolved!"
    echo ""
    echo "📖 Review SECURITY.md for remediation steps"
    echo "🔧 Run: git reset HEAD <file> to unstage files"
    exit 1
fi
