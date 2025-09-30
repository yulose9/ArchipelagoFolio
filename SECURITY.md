# 🔐 Security Best Practices

## Critical Security Guidelines

This document outlines security best practices for this Next.js portfolio project. **Follow these guidelines strictly before pushing to production.**

---

## 🚨 Environment Variables

### **NEVER Commit These Files:**
- ❌ `.env.local` - Contains real API keys
- ❌ `.env.production.local` - Contains production secrets
- ❌ `.vscode/mcp.json` - May contain hardcoded tokens
- ❌ Any file with `*-SECRETS.md` or `*-TOKENS.md` pattern

### **Safe to Commit:**
- ✅ `.env.example` - Template with placeholder values only
- ✅ Configuration files that reference environment variables

---

## 🔑 API Keys & Tokens

### **Mapbox Tokens**

#### Public Token (`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`)
- **Format**: Starts with `pk.`
- **Exposure**: Safe to expose in client-side code
- **Usage**: Browser-based map rendering
- **Restrictions**: 
  - Limit URL referrers in Mapbox dashboard
  - Set usage quotas
  - Monitor usage in Mapbox account

#### Secret Token (`MAPBOX_SECRET_TOKEN`)
- **Format**: Starts with `sk.`
- **Exposure**: ⚠️ **NEVER expose to client** - server-side only
- **Usage**: Server-side API calls (if needed)
- **Storage**: Only in `.env.local` or deployment platform secrets

### **Token Rotation Schedule**
- Rotate public tokens: Every 90 days
- Rotate secret tokens: Every 30 days or immediately if compromised
- Keep old tokens active for 7 days during rotation

---

## 📝 .gitignore Configuration

Your `.gitignore` must include:

```gitignore
# Environment Variables (CRITICAL)
.env
.env.local
.env*.local
*.env

# IDE with Secrets
.vscode/mcp.json

# Build Artifacts (may contain inlined env vars)
.next/
out/
build/
dist/

# Documentation with Secrets
*-SECRETS.md
*-TOKENS.md
SETUP_COMPLETE_LOCAL.md
```

---

## 🛡️ Pre-Push Checklist

Before pushing to GitHub or deploying:

### 1. **Search for Hardcoded Secrets**
```bash
# Search for Mapbox tokens
grep -r "pk\." --exclude-dir=node_modules --exclude-dir=.next
grep -r "sk\." --exclude-dir=node_modules --exclude-dir=.next

# Search for common secret patterns
grep -r "API_KEY\|SECRET\|TOKEN\|PASSWORD" --exclude-dir=node_modules --exclude-dir=.next
```

### 2. **Verify .env Files**
```bash
# Check what's tracked by git
git ls-files | grep "\.env"

# Should return ONLY .env.example
# If .env.local appears, STOP and fix immediately
```

### 3. **Check .next Build Output**
```bash
# .next folder should be git-ignored
git check-ignore .next

# Should output: .next
```

### 4. **Scan Documentation**
```bash
# Check for exposed tokens in markdown files
grep -r "pk\.eyJ\|sk\.eyJ" --include="*.md" --exclude-dir=node_modules
```

---

## 🚀 Deployment Security

### **Vercel Deployment**
1. Add environment variables in Vercel dashboard
2. **Never** add secrets to `vercel.json`
3. Use different tokens for development and production
4. Enable "Automatically expose System Environment Variables" only if needed

### **Environment Variable Setup (Vercel)**
```bash
# Development
vercel env add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN development

# Production
vercel env add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN production
```

### **Other Platforms**
- **Netlify**: Use Netlify UI > Site Settings > Environment Variables
- **AWS Amplify**: Use Environment Variables in console
- **Railway**: Use Variables tab in project settings

---

## 🔍 Security Audit Commands

### **Find All .env Files**
```bash
find . -name ".env*" -type f ! -name ".env.example"
```

### **Check Git History for Secrets**
```bash
# Scan commit history for accidentally committed secrets
git log -p | grep -E "pk\.|sk\.|API_KEY|SECRET"
```

### **Verify .gitignore Effectiveness**
```bash
# List what would be committed
git status --porcelain

# Ensure no .env.local, .vscode/mcp.json, or .next files appear
```

---

## ⚠️ What to Do If Secrets Are Exposed

### **Immediate Actions:**

1. **Revoke Compromised Tokens**
   - Go to [Mapbox Account Tokens](https://account.mapbox.com/access-tokens/)
   - Delete compromised tokens immediately
   - Generate new tokens

2. **Remove from Git History**
   ```bash
   # Use BFG Repo-Cleaner or git-filter-repo
   git filter-repo --path .env.local --invert-paths
   
   # Force push (only if you're sure)
   git push origin --force --all
   ```

3. **Update All Deployments**
   - Update environment variables in all deployment platforms
   - Redeploy applications with new tokens

4. **Monitor Usage**
   - Check Mapbox dashboard for unusual activity
   - Review access logs
   - Set up usage alerts

---

## 📚 Resources

- [Mapbox Access Tokens Best Practices](https://docs.mapbox.com/help/troubleshooting/how-to-use-mapbox-securely/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## 🎯 Project-Specific Security Notes

### **Current Setup:**
- ✅ `.env.example` contains safe placeholders
- ✅ `.env.local` is git-ignored
- ✅ Source code uses `process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- ✅ No tokens in `next.config.js` or `vercel.json`
- ✅ `.next` build directory is git-ignored
- ✅ `.vscode/mcp.json` is git-ignored

### **Validation:**
All tokens should be loaded from environment variables:
```typescript
// ✅ CORRECT
const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// ❌ WRONG
const token = 'pk.eyJ1IjoieXVsb3NlOSIsImEiOiJjbWc0ZnlpY2gxbTZrMnJvaXZ5ZGUxZjFkIn0.Lnknjnfdraq6yg49h9k9jg';
```

---

## ✅ Final Pre-Push Verification

Run this complete security check:

```bash
#!/bin/bash
echo "🔍 Running security audit..."

# 1. Check for hardcoded tokens
echo "1. Scanning for hardcoded tokens..."
grep -r "pk\.eyJ\|sk\.eyJ" --exclude-dir={node_modules,.next,.git} . && echo "❌ FOUND HARDCODED TOKENS!" || echo "✅ No hardcoded tokens"

# 2. Check .env files
echo "2. Checking .env files..."
git ls-files | grep "\.env" | grep -v ".env.example" && echo "❌ .env files in git!" || echo "✅ No .env files tracked"

# 3. Check .next directory
echo "3. Checking .next directory..."
git check-ignore .next > /dev/null && echo "✅ .next is ignored" || echo "❌ .next NOT ignored!"

# 4. Check .vscode/mcp.json
echo "4. Checking .vscode/mcp.json..."
git check-ignore .vscode/mcp.json > /dev/null && echo "✅ mcp.json is ignored" || echo "❌ mcp.json NOT ignored!"

echo ""
echo "✅ Security audit complete!"
```

Save this as `scripts/security-check.sh` and run before every push:
```bash
chmod +x scripts/security-check.sh
./scripts/security-check.sh
```

---

**Last Updated**: September 30, 2025  
**Status**: ✅ All security measures implemented
