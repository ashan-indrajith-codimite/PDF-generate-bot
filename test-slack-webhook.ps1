# PowerShell script to test Slack webhook
# Replace YOUR_WEBHOOK_URL with your actual webhook URL

$webhookUrl = "YOUR_WEBHOOK_URL_HERE"

$body = @{
    blocks = @(
        @{
            type = "header"
            text = @{
                type = "plain_text"
                text = "🧪 Manual Test - PR Merge Notification"
            }
        },
        @{
            type = "section"
            fields = @(
                @{
                    type = "mrkdwn"
                    text = "*Repository:*`nPDF-generate-bot"
                },
                @{
                    type = "mrkdwn"
                    text = "*PR Number:*`n#TEST"
                },
                @{
                    type = "mrkdwn"
                    text = "*Author:*`nashan-indrajith-codimite"
                },
                @{
                    type = "mrkdwn"
                    text = "*Branch:*`nBT-01"
                }
            )
        },
        @{
            type = "section"
            text = @{
                type = "mrkdwn"
                text = "*PR Title:*`nTest PR for Slack Integration"
            }
        },
        @{
            type = "section"
            text = @{
                type = "mrkdwn"
                text = "*Description:*`nThis is a manual test to verify that the Slack webhook integration is working correctly with rich formatting."
            }
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Testing Slack webhook integration..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Test message sent successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error sending message: $($_.Exception.Message)" -ForegroundColor Red
}