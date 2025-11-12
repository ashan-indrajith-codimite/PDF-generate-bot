#!/bin/bash
# Test script to verify Slack webhook integration
# Replace YOUR_WEBHOOK_URL with your actual webhook URL

WEBHOOK_URL="YOUR_WEBHOOK_URL_HERE"

echo "Testing Slack webhook integration..."

curl -X POST -H 'Content-type: application/json' \
--data '{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🧪 Manual Test - PR Merge Notification"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Repository:*\nPDF-generate-bot"
        },
        {
          "type": "mrkdwn",
          "text": "*PR Number:*\n#TEST"
        },
        {
          "type": "mrkdwn",
          "text": "*Author:*\nashan-indrajith-codimite"
        },
        {
          "type": "mrkdwn",
          "text": "*Branch:*\nBT-01"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*PR Title:*\nTest PR for Slack Integration"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Description:*\nThis is a manual test to verify that the Slack webhook integration is working correctly."
      }
    }
  ]
}' \
$WEBHOOK_URL

echo "Test message sent!"