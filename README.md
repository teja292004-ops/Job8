# Job Notification Tracker

A premium job management system with built-in test checklist and deployment controls.

## Features

### 🎯 Core Functionality
- **Dashboard** - Overview of job tracking activities
- **Job Listings** - Manage and track job opportunities
- **Preferences** - Customize your experience
- **Daily Digest** - Top 10 job matches by score

### 🧪 Built-In Test Checklist
- **System Tests** - 10 comprehensive feature tests
- **Progress Tracking** - Visual progress bar and counter
- **Test Tooltips** - Detailed testing instructions
- **Persistent State** - Test results survive page refresh

### 🚀 Ship Lock System
- **Deployment Control** - Prevents shipping until all tests pass
- **Visual Indicators** - Lock status in navigation
- **Guided Process** - Clear instructions for unlocking
- **Production Ready** - Deploy to staging or production

## Test Checklist Items

1. ✅ Preferences persist after refresh
2. ✅ Match score calculates correctly
3. ✅ "Show only matches" toggle works
4. ✅ Save job persists after refresh
5. ✅ Apply opens in new tab
6. ✅ Status update persists after refresh
7. ✅ Status filter works correctly
8. ✅ Digest generates top 10 by score
9. ✅ Digest persists for the day
10. ✅ No console errors on main pages

## Routes

- `/` - Dashboard (default)
- `/jt/07-test` - Test Checklist System
- `/jt/08-ship` - Deployment (locked until tests pass)

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Premium responsive design system
- **Storage**: LocalStorage for data persistence
- **Deployment**: Vercel-ready static site

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Navigate to "Test Checklist" to run system tests
4. Complete all tests to unlock shipping

## Deployment

This project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. No build configuration required

## License

MIT License - Feel free to use and modify as needed.

---

**Built with ❤️ for efficient job tracking and quality assurance**