#!/bin/bash
# GitHub Projects Setup Script
# Run this to set up GitHub Projects, Labels, and Import CSV

set -e

echo "🚀 Setting up GitHub Projects for Paragu-AI Builder..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub${NC}"
    echo "Run: gh auth login"
    exit 1
fi

echo -e "${GREEN}✓ GitHub CLI authenticated${NC}"
echo ""

# Create Labels
echo "🏷️  Creating Labels..."

# Type Labels
gh label create "epic" --color "FF6B6B" --description "Large body of work" || echo "Label exists"
gh label create "story" --color "4ECDC4" --description "User-facing feature" || echo "Label exists"
gh label create "task" --color "95E1D3" --description "Technical task" || echo "Label exists"
gh label create "bug" --color "FF4757" --description "Something is broken" || echo "Label exists"
gh label create "spike" --color "FFD93D" --description "Research/Investigation" || echo "Label exists"
gh label create "docs" --color "6C5CE7" --description "Documentation" || echo "Label exists"

# Priority Labels
gh label create "priority:P0" --color "FF0000" --description "Blocks production" || echo "Label exists"
gh label create "priority:P1" --color "FF6B00" --description "Required for MVP" || echo "Label exists"
gh label create "priority:P2" --color "FFD700" --description "Required for customers" || echo "Label exists"
gh label create "priority:P3" --color "00CED1" --description "Growth features" || echo "Label exists"
gh label create "priority:P4" --color "A9A9A9" --description "Nice to have" || echo "Label exists"

# Epic Labels
gh label create "epic:security" --color "8B0000" --description "Security hardening" || echo "Label exists"
gh label create "epic:testing" --color "006400" --description "Testing strategy" || echo "Label exists"
gh label create "epic:docs" --color "4169E1" --description "Documentation" || echo "Label exists"
gh label create "epic:platform" --color "FF1493" --description "Core platform" || echo "Label exists"
gh label create "epic:features" --color "9932CC" --description "Site features" || echo "Label exists"
gh label create "epic:outreach" --color "FF8C00" --description "Outreach & payments" || echo "Label exists"
gh label create "epic:payments" --color "20B2AA" --description "Payments" || echo "Label exists"

# Status Labels
gh label create "status:blocked" --color "000000" --description "Blocked by dependency" || echo "Label exists"
gh label create "status:ready" --color "00FF00" --description "Ready to start" || echo "Label exists"
gh label create "status:in-review" --color "FFA500" --description "In code review" || echo "Label exists"

echo -e "${GREEN}✓ Labels created${NC}"
echo ""

# Create Milestones for Sprints
echo "🎯 Creating Sprint Milestones..."

github_date() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        date -v+"$1"w +%Y-%m-%d
    else
        # Linux
        date -d "+$1 weeks" +%Y-%m-%d
    fi
}

gh api repos/{owner}/{repo}/milestones \
  --method POST \
  --field title="Sprint 1: Security Foundation" \
  --field state=open \
  --field description="Fix critical security issues, set up security infrastructure" \
  --field due_on="$(github_date 2)T23:59:59Z" 2>/dev/null || echo "Milestone may exist"

gh api repos/{owner}/{repo}/milestones \
  --method POST \
  --field title="Sprint 2: Testing & Documentation" \
  --field state=open \
  --field description="Complete testing foundation and documentation" \
  --field due_on="$(github_date 4)T23:59:59Z" 2>/dev/null || echo "Milestone may exist"

gh api repos/{owner}/{repo}/milestones \
  --method POST \
  --field title="Sprint 3: Core Platform" \
  --field state=open \
  --field description="Complete platform features and lead management" \
  --field due_on="$(github_date 6)T23:59:59Z" 2>/dev/null || echo "Milestone may exist"

echo -e "${GREEN}✓ Milestones created${NC}"
echo ""

# Create GitHub Project
echo "📋 Creating GitHub Project..."
echo -e "${YELLOW}Note: Project creation via CLI is limited. Please create manually:${NC}"
echo ""
echo "1. Go to: https://github.com/orgs/Ai-Whisperers/projects"
echo "2. Click 'New project'"
echo "3. Select 'Table' template"
echo "4. Name: 'Paragu-AI Builder Roadmap'"
echo "5. Click 'Create'"
echo ""
echo "Then add these Custom Fields:"
echo "  - Type (Single select: Epic, Story, Task, Bug, Spike)"
echo "  - Priority (Single select: P0, P1, P2, P3, P4)"
echo "  - Story Points (Number)"
echo "  - Epic (Single select: link to epics)"
echo "  - Status (Single select: Backlog, Todo, In Progress, Review, Done)"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next Steps:"
echo "1. Create GitHub Project manually (see instructions above)"
echo "2. Import CSV files:"
echo "   - docs/github-import-epics.csv"
echo "   - docs/github-import-stories.csv"
echo "   - docs/github-import-tasks-part1.csv"
echo "   - docs/github-import-tasks-part2.csv"
echo "   - docs/github-import-tasks-part3.csv"
echo ""
echo "3. Configure Project Views:"
echo "   - Roadmap View (Group by: Epic)"
echo "   - Sprint Board (Board view by Status)"
echo "   - Priority Dashboard (Filter: P0, P1)"
echo ""
echo "4. Set up Automation rules"
echo ""
echo "📖 Full guide: docs/GITHUB_PROJECTS_SETUP.md"
echo ""
