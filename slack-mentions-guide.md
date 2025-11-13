# Slack User ID Finder Script
# This script helps you find Slack user IDs for mentions

## How to Find Slack User IDs:

### Method 1: Using Slack Web/Desktop App
1. Go to your Slack workspace
2. Click on the person's profile
3. Click "More" → "Copy member ID"
4. The ID will look like: U01234567AB

### Method 2: Using Slack API (Advanced)
```bash
# Install slack CLI or use curl
curl -X GET "https://slack.com/api/users.list" \
  -H "Authorization: Bearer YOUR_BOT_TOKEN" \
  -H "Content-Type: application/json"
```

### Method 3: From Profile URL
1. Right-click on user's profile picture
2. Copy link address
3. Extract ID from URL like: /team/U01234567AB

## GitHub Secrets to Add:

### Required Secrets in GitHub Repository Settings:
1. Go to: https://github.com/ashan-indrajith-codimite/PDF-generate-bot/settings/secrets/actions
2. Add these secrets:

```
SLACK_WEBHOOK_URL = https://hooks.slack.com/services/...
SLACK_REVIEWERS = <@U099ETRC2K> <@U01234567AB> <@U09876543CD>
```

### ⚠️ IMPORTANT: Correct Format for Slack Mentions
Your GitHub secret should contain the **exact format**:
```
<@U099ETRC2K>
```
NOT just: `U099ETRC2K`

### ✅ Example with Your User ID:
```
Name: SLACK_REVIEWERS
Value: <@U099ETRC2K> <@U01234567AB>
```

### Alternative: Individual User Secrets (if needed)
```
SLACK_USER_ID_ASHAN = U01234567AB
SLACK_USER_ID_REVIEWER2 = U09876543CD  
SLACK_USER_ID_USER3 = U12345678EF
```

## Testing User Mentions:

### 🧪 Test Your User ID Format:
```json
{
  "text": "Test mention: <@U099ETRC2K> please check this"
}
```

### ✅ Correct Format Examples:
```
Single user: <@U099ETRC2K>
Multiple users: <@U099ETRC2K> <@U01234567AB> <@U09876543CD>
```

### ❌ Incorrect Formats (Won't Work):
```
Without brackets: @U099ETRC2K
Without @: <U099ETRC2K>
Just ID: U099ETRC2K
```

### Advanced Block Message:
```json
{
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Hey <@U01234567AB>! New PR needs review 👀"
      }
    }
  ]
}
```

## Current Workflow Features:

### 🎯 Smart Reviewer Assignment:
- **Main branch PRs**: Mentions multiple reviewers
- **Feature branches**: Mentions team lead only
- **Other branches**: Default reviewer

### 📋 Rich Message Format:
- Clickable PR title linking to GitHub
- Branch information showing merge direction
- Author information
- Targeted reviewer mentions with emojis

### 🔧 Customization Options:
You can modify the logic in the workflow to:
- Add more reviewers based on file changes
- Mention different people for different repositories
- Add conditional logic based on PR labels
- Include PR description or changed files

## Example Final Message:
```
🔍 New PR Ready for Review

PR: Fix authentication bug in login system
Branch: main ← feature/auth-fix
Author: john.doe

Reviewers: @ashan.indrajith @tech.lead - Please review this PR 👀
```