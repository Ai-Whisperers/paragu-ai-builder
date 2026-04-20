# 🎯 GitHub Projects Setup Guide

## Quick Start Commands

```bash
# Create a new GitHub Project (Beta - with custom fields)
gh project create "Paragu-AI Builder Roadmap" --owner Ai-Whisperers --visibility private

# Or create via GitHub Web UI (recommended for initial setup):
# 1. Go to: https://github.com/orgs/Ai-Whisperers/projects
# 2. Click "New project"
# 3. Select "Table" template
# 4. Name: "Paragu-AI Builder Roadmap"
```

---

## 📋 Recommended Project Structure

### Custom Fields to Add:

| Field Name | Type | Options |
|------------|------|---------|
| **Type** | Single Select | Epic, Story, Task, Bug, Spike |
| **Priority** | Single Select | P0-Critical, P1-High, P2-Medium, P3-Low |
| **Epic** | Single Select | (Link to Epic issues) |
| **Story Points** | Number | 1, 2, 3, 5, 8, 13, 21 |
| **Status** | Single Select | Backlog, Todo, In Progress, Review, Done |
| **Sprint** | Iteration | Sprint 1, Sprint 2, etc. |
| **Assignee** | Text | @username |
| **Estimated Hours** | Number | Hours |
| **Actual Hours** | Number | Hours |

### Views to Create:

1. **📊 Roadmap View** (Table)
   - Group by: Epic
   - Sort by: Priority, then Story Points

2. **🎯 Sprint Board** (Board)
   - Columns: Backlog → Todo → In Progress → Review → Done
   - Group by: Status

3. **📅 Sprint Planning** (Table)
   - Filter by: Current Sprint
   - Group by: Type

4. **🔥 Priority Dashboard** (Board)
   - Filter by: P0, P1
   - Group by: Priority

5. **👤 Team Workload** (Table)
   - Group by: Assignee
   - Sum: Story Points

---

## 🏷️ Label System

Create these labels in your repo:

### Type Labels
```bash
gh label create "epic" --color "FF6B6B" --description "Large body of work"
gh label create "story" --color "4ECDC4" --description "User-facing feature"
gh label create "task" --color "95E1D3" --description "Technical task"
gh label create "bug" --color "FF6B6B" --description "Something is broken"
gh label create "spike" --color "FFD93D" --description "Research/Investigation"
gh label create "docs" --color "6C5CE7" --description "Documentation"
```

### Priority Labels
```bash
gh label create "priority:P0" --color "FF0000" --description "Blocks production"
gh label create "priority:P1" --color "FF6B00" --description "Required for MVP"
gh label create "priority:P2" --color "FFD700" --description "Required for customers"
gh label create "priority:P3" --color "00CED1" --description "Growth features"
gh label create "priority:P4" --color "A9A9A9" --description "Nice to have"
```

### Epic Labels
```bash
gh label create "epic:security" --color "8B0000" --description "Security hardening"
gh label create "epic:testing" --color "006400" --description "Testing strategy"
gh label create "epic:docs" --color "4169E1" --description "Documentation"
gh label create "epic:platform" --color "FF1493" --description "Core platform"
gh label create "epic:features" --color "9932CC" --description "Site features"
gh label create "epic:outreach" --color "FF8C00" --description "Outreach & payments"
gh label create "epic:performance" --color "20B2AA" --description "Performance & scale"
```

### Status Labels
```bash
gh label create "status:blocked" --color "000000" --description "Blocked by dependency"
gh label create "status:ready" --color "00FF00" --description "Ready to start"
gh label create "status:in-review" --color "FFA500" --description "In code review"
```

---

## 📥 Import CSV Template

I've created CSV files you can import directly into GitHub Projects:

### Files Created:
1. `github-import-epics.csv` - 7 Epics
2. `github-import-stories.csv` - 35 Stories  
3. `github-import-tasks.csv` - ~100 Tasks

### How to Import:
1. Go to your GitHub Project
2. Click "..." (three dots) menu
3. Select "Import items"
4. Upload the CSV file
5. Map columns to custom fields

---

## 🔗 Issue Linking Strategy

### Epic → Story → Task Hierarchy:

```
Epic: "Security Hardening" (#100)
├── Story: "Critical Security Vulnerabilities" (#101)
│   ├── Task: "Fix SQL Injection" (#102)
│   ├── Task: "Fix XSS" (#103)
│   └── Task: "Fix Bulk Update" (#104)
└── Story: "Security Infrastructure" (#105)
    ├── Task: "Set up Snyk" (#106)
    └── Task: "Implement Rate Limiting" (#107)
```

### Linking Syntax in Issues:

```markdown
## Part of Epic
Part of #100

## Related Stories
- Required for #101
- Blocks #105

## Tasks
- [ ] #102
- [ ] #103
```

---

## 📊 Automation Rules (Beta)

Set up these automations in your project:

### Auto-Status Updates:
1. When PR opened → Move to "Review"
2. When PR merged → Move to "Done"
3. When issue closed → Move to "Done"

### Auto-Assignment:
1. When issue labeled "priority:P0" → Notify @tech-lead
2. When issue moved to "In Progress" → Assign to mover

### Auto-Labeling:
1. When title contains "[EPIC]" → Add "epic" label
2. When title contains "[BUG]" → Add "bug" label

---

## 📈 Reporting & Metrics

### Built-in GitHub Insights:
- Burndown charts (by sprint)
- Velocity tracking
- Cycle time analysis
- Workload distribution

### Custom Queries:

```
# P0 Issues
is:issue label:"priority:P0" state:open

# Ready for Sprint
is:issue label:"status:ready" no:milestone

# My Work
is:issue assignee:@me state:open

# Security Epic
is:issue label:"epic:security"

# Completed This Week
is:issue state:closed closed:>2026-04-13
```

---

## 🔄 Sprint Workflow

### Sprint Planning:
1. Create Sprint Milestone (e.g., "Sprint 1 - May 2026")
2. Filter by "status:ready"
3. Assign issues to sprint
4. Review capacity (sum of story points)

### Daily Standup:
1. View "Sprint Board" filtered by current sprint
2. Review "In Progress" column
3. Check for blockers

### Sprint Review:
1. Filter by sprint milestone
2. Show completed vs planned
3. Demo completed stories

### Sprint Retrospective:
1. Review velocity
2. Analyze cycle time
3. Identify improvements

---

## 📚 Additional Resources

- [GitHub Projects Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Projects](https://cli.github.com/manual/gh_project)
- [Importing to Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-items-in-your-project/adding-items-to-your-project#adding-multiple-issues-from-a-repository)

---

**Next Steps:**
1. Create the GitHub Project
2. Import the CSV files
3. Set up labels
4. Configure views
5. Start creating issues!
