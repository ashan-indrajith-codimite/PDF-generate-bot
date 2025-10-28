# Slack Webhook Configuration Guide

## Current Setup Status:
✅ Channel Selected: pdf_bot
⏳ Message: (Complete this step)

## Step-by-Step Instructions:

### 1. Complete the "Add a message" field:
Copy and paste this message:

🤖 GitHub PR Bot Setup Complete        ! 
This channel will receive automated notifications when pull requests are merged in the PDF-generate-bot repository.

### 2. After adding the message:
- Click "Add Incoming WebHooks Integration"
- Copy the Webhook URL that appears
- The URL format will be: `https://hooks.slack.com/services/[WORKSPACE]/[CHANNEL]/[TOKEN]`

### 3. Add to GitHub Secrets:
- Go to your repository Settings → Secrets and variables → Actions
- Click "New repository secret"
- Name: `SLACK_WEBHOOK_URL`
- Value: [Paste your actual webhook URL here]
- Click "Add secret"

### 4. Test the Integration:
Once setup is complete, the workflow will automatically trigger when you:
- Create a PR from BT-01 branch
- Merge that PR into main branch

## Expected Slack Message Format:
When a PR is merged, #pdf_bot channel will receive:
- PR title and description
- Author information
- Branch details
- Direct link to view the PR
- Professional formatting with emojis

## Customization Options:
You can modify the message format by editing:
`.github/workflows/pr-merged-slack.yml`

The current workflow sends rich formatted messages with:
- Header with emojis
- Structured fields
- PR description
- Action buttons

## Security Note:
Never commit actual webhook URLs to your repository. Always use GitHub Secrets to store sensitive information like webhook URLs, API keys, and tokens.