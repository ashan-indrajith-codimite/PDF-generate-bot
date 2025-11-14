# 🔍 Slack Workflow Troubleshooting Guide

## Common Reasons Why Slack Workflow Doesn't Work:

### 1. ❌ **Missing GitHub Secrets**
**Problem:** Secrets not configured in GitHub
**Check:** Go to `Repository → Settings → Secrets and variables → Actions`
**Required Secrets:**
- `SLACK_WEBHOOK_URL`
- `SLACK_REVIEWERS`

### 2. ❌ **Wrong Webhook URL Format**
**Problem:** Invalid Slack webhook URL
**Correct Format:** `https://hooks.slack.com/services/[WORKSPACE]/[CHANNEL]/[TOKEN]`
**Check:** Test your webhook URL manually

### 3. ❌ **Workflow Not Triggered**
**Problem:** PR created from same repository (not triggering workflow)
**Solution:** 
- Create PR from fork, OR
- Push to branch and create PR through GitHub UI

### 4. ❌ **JSON Syntax Errors**
**Problem:** Malformed JSON in curl command
**Current Issue:** Special characters not properly escaped

### 5. ❌ **Permissions Issues**
**Problem:** GitHub Actions don't have proper permissions
**Solution:** Add permissions to workflow

## 🔧 Quick Checks:

### Check 1: Verify Secrets Exist
```bash
# These should be set in GitHub:
SLACK_WEBHOOK_URL = [YOUR_WEBHOOK_URL_HERE]
SLACK_REVIEWERS = <@U099ETRC2K>
```

### Check 2: Test Webhook Manually
```bash
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"Test message from troubleshooting"}' \
[YOUR_WEBHOOK_URL]
```

### Check 3: Check GitHub Actions Tab
- Go to `Repository → Actions`
- Look for workflow runs
- Check for error messages

## 🚀 Diagnostic Steps:

1. **Create a test PR**
2. **Check Actions tab** for workflow execution
3. **Look at workflow logs** for error messages
4. **Verify secrets** are properly set
5. **Test webhook** independently

## Most Common Issue:
**Missing or incorrect SLACK_WEBHOOK_URL secret** - This causes silent failures.

## Security Note:
Never commit actual webhook URLs, tokens, or secrets to your repository. Always use GitHub Secrets to store sensitive information.