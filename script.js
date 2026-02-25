// Job Notification Tracker - Complete Application Logic
class JobNotificationTracker {
    constructor() {
        this.currentRoute = 'dashboard';
        this.testStates = this.loadTestStates();
        this.preferences = this.loadPreferences();
        this.jobs = this.loadJobs();
        this.digest = this.loadDigest();
        this.init();
    }

    init() {
        this.bindNavigation();
        this.bindTestCheckboxes();
        this.bindPreferences();
        this.bindJobControls();
        this.updateTestUI();
        this.updateShipLock();
        this.loadPreferencesUI();
        console.log('Job Notification Tracker initialized');
    }

    // Navigation System
    bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const route = item.dataset.route;
                
                // Check if ship is locked
                if (route === 'ship' && item.classList.contains('locked')) {
                    this.showNotification('🔒 Complete all tests before shipping', 'warning');
                    return;
                }
                
                this.navigateToRoute(route);
            });
        });
    }

    navigateToRoute(route) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-route="${route}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.route-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(route).classList.add('active');

        this.currentRoute = route;
    }

    // Test Checklist System
    bindTestCheckboxes() {
        document.querySelectorAll('.test-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleTestChange(e.target);
            });
        });

        // Load saved states
        this.loadTestCheckboxStates();
    }

    handleTestChange(checkbox) {
        const testId = checkbox.dataset.test;
        const isChecked = checkbox.checked;
        
        // Save state
        this.testStates[testId] = isChecked;
        this.saveTestStates();
        
        // Update UI with animation
        this.animateCheckbox(checkbox);
        this.updateTestUI();
        this.updateShipLock();
    }

    animateCheckbox(checkbox) {
        const item = checkbox.closest('.checklist-item');
        item.style.transform = 'scale(1.02)';
        item.style.background = checkbox.checked ? 'var(--success-light)' : 'transparent';
        
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.background = 'transparent';
        }, 300);
    }

    updateTestUI() {
        const passedCount = this.getPassedTestCount();
        const progressPercentage = (passedCount / 10) * 100;
        
        // Update counter
        document.getElementById('passedCount').textContent = passedCount;
        
        // Update progress bar
        document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        
        // Update status message
        const statusElement = document.getElementById('summaryStatus');
        if (passedCount === 10) {
            statusElement.innerHTML = '<div class="success-message">✅ All tests passed! Ready to ship.</div>';
        } else {
            statusElement.innerHTML = '<div class="warning-message">⚠️ Resolve all issues before shipping.</div>';
        }
    }

    updateShipLock() {
        const passedCount = this.getPassedTestCount();
        const shipNavItem = document.getElementById('shipNavItem');
        const lockIndicator = document.getElementById('lockIndicator');
        const shipLocked = document.getElementById('shipLocked');
        const shipUnlocked = document.getElementById('shipUnlocked');
        
        if (passedCount === 10) {
            // Unlock ship
            shipNavItem.classList.remove('locked');
            lockIndicator.style.display = 'none';
            if (shipLocked) shipLocked.style.display = 'none';
            if (shipUnlocked) shipUnlocked.style.display = 'block';
        } else {
            // Lock ship
            shipNavItem.classList.add('locked');
            lockIndicator.style.display = 'inline';
            if (shipLocked) shipLocked.style.display = 'block';
            if (shipUnlocked) shipUnlocked.style.display = 'none';
        }
    }

    getPassedTestCount() {
        return Object.values(this.testStates).filter(state => state === true).length;
    }

    loadTestCheckboxStates() {
        document.querySelectorAll('.test-checkbox').forEach(checkbox => {
            const testId = checkbox.dataset.test;
            checkbox.checked = this.testStates[testId] || false;
        });
    }

    resetTestStates() {
        // Reset all states
        Object.keys(this.testStates).forEach(key => {
            this.testStates[key] = false;
        });
        
        // Save and update UI
        this.saveTestStates();
        this.loadTestCheckboxStates();
        this.updateTestUI();
        this.updateShipLock();
        
        // Show confirmation
        this.showResetConfirmation();
    }

    showResetConfirmation() {
        const resetBtn = document.querySelector('.btn-reset');
        const originalText = resetBtn.textContent;
        
        resetBtn.textContent = 'Reset Complete ✓';
        resetBtn.style.background = 'var(--success-color)';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        
        setTimeout(() => {
            resetBtn.textContent = originalText;
            resetBtn.style.background = 'var(--bg-secondary)';
            resetBtn.style.color = 'var(--text-secondary)';
            resetBtn.style.border = '1px solid var(--border-color)';
        }, 2000);
    }

    // Preferences System
    bindPreferences() {
        const matchThreshold = document.getElementById('matchThreshold');
        const thresholdValue = document.getElementById('thresholdValue');
        const emailNotifications = document.getElementById('emailNotifications');

        if (matchThreshold) {
            matchThreshold.addEventListener('input', (e) => {
                const value = e.target.value;
                thresholdValue.textContent = `${value}%`;
                this.preferences.matchThreshold = parseInt(value);
                this.savePreferences();
            });
        }

        if (emailNotifications) {
            emailNotifications.addEventListener('change', (e) => {
                this.preferences.emailNotifications = e.target.checked;
                this.savePreferences();
            });
        }
    }

    loadPreferencesUI() {
        const matchThreshold = document.getElementById('matchThreshold');
        const thresholdValue = document.getElementById('thresholdValue');
        const emailNotifications = document.getElementById('emailNotifications');

        if (matchThreshold && this.preferences.matchThreshold) {
            matchThreshold.value = this.preferences.matchThreshold;
            thresholdValue.textContent = `${this.preferences.matchThreshold}%`;
        }

        if (emailNotifications) {
            emailNotifications.checked = this.preferences.emailNotifications !== false;
        }
    }

    // Job Controls
    bindJobControls() {
        const showOnlyMatches = document.getElementById('showOnlyMatches');
        const statusFilter = document.getElementById('statusFilter');

        if (showOnlyMatches) {
            showOnlyMatches.addEventListener('change', (e) => {
                this.filterJobs();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterJobs();
            });
        }

        // Bind job action buttons
        document.querySelectorAll('.btn-save').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.saveJob(e.target);
            });
        });

        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.updateJobStatus(e.target);
            });
        });
    }

    filterJobs() {
        const showOnlyMatches = document.getElementById('showOnlyMatches').checked;
        const statusFilter = document.getElementById('statusFilter').value;
        
        // This would filter the job list in a real application
        console.log('Filtering jobs:', { showOnlyMatches, statusFilter });
        this.showNotification('Job filters applied', 'success');
    }

    saveJob(button) {
        const jobCard = button.closest('.job-card');
        const jobTitle = jobCard.querySelector('h3').textContent;
        
        button.textContent = 'Saved ✓';
        button.style.background = 'var(--success-color)';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = 'Save';
            button.style.background = 'var(--bg-tertiary)';
            button.style.color = 'var(--text-primary)';
        }, 2000);
        
        this.showNotification(`Job "${jobTitle}" saved`, 'success');
    }

    updateJobStatus(select) {
        const status = select.value;
        const jobCard = select.closest('.job-card');
        const jobTitle = jobCard.querySelector('h3').textContent;
        
        this.showNotification(`Job "${jobTitle}" status updated to ${status}`, 'success');
    }

    // Digest System
    generateDigest() {
        const digestList = document.getElementById('digestList');
        
        // Simulate generating digest
        digestList.innerHTML = '<p class="loading">Generating digest...</p>';
        
        setTimeout(() => {
            const mockDigest = [
                { title: 'Senior React Developer', company: 'TechCorp', score: 95 },
                { title: 'Frontend Engineer', company: 'StartupXYZ', score: 92 },
                { title: 'Full Stack Developer', company: 'BigTech Inc', score: 89 },
                { title: 'JavaScript Developer', company: 'WebCorp', score: 87 },
                { title: 'UI/UX Developer', company: 'DesignCo', score: 85 },
                { title: 'Software Engineer', company: 'CodeBase', score: 83 },
                { title: 'Web Developer', company: 'NetSolutions', score: 81 },
                { title: 'Frontend Specialist', company: 'DevStudio', score: 79 },
                { title: 'React Native Developer', company: 'MobileFirst', score: 77 },
                { title: 'TypeScript Developer', company: 'TypeCorp', score: 75 }
            ];

            let digestHTML = '<div class="digest-jobs">';
            mockDigest.forEach((job, index) => {
                digestHTML += `
                    <div class="digest-job">
                        <div class="digest-rank">#${index + 1}</div>
                        <div class="digest-info">
                            <h4>${job.title}</h4>
                            <p>${job.company}</p>
                        </div>
                        <div class="digest-score">${job.score}%</div>
                    </div>
                `;
            });
            digestHTML += '</div>';

            digestList.innerHTML = digestHTML;
            
            // Save digest with timestamp
            this.digest = {
                data: mockDigest,
                timestamp: new Date().toDateString()
            };
            this.saveDigest();
            
            this.showNotification('Daily digest generated successfully', 'success');
        }, 1500);
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'var(--success-color)',
            warning: 'var(--warning-color)',
            error: 'var(--danger-color)',
            info: 'var(--primary-color)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            font-weight: 500;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Data Persistence
    saveTestStates() {
        localStorage.setItem('jnt_test_states', JSON.stringify(this.testStates));
    }

    loadTestStates() {
        const saved = localStorage.getItem('jnt_test_states');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            'preferences': false,
            'match-score': false,
            'show-matches': false,
            'save-job': false,
            'apply-tab': false,
            'status-update': false,
            'status-filter': false,
            'digest-generation': false,
            'digest-persist': false,
            'no-errors': false
        };
    }

    savePreferences() {
        localStorage.setItem('jnt_preferences', JSON.stringify(this.preferences));
    }

    loadPreferences() {
        const saved = localStorage.getItem('jnt_preferences');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            matchThreshold: 75,
            emailNotifications: true
        };
    }

    saveJobs() {
        localStorage.setItem('jnt_jobs', JSON.stringify(this.jobs));
    }

    loadJobs() {
        const saved = localStorage.getItem('jnt_jobs');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return [];
    }

    saveDigest() {
        localStorage.setItem('jnt_digest', JSON.stringify(this.digest));
    }

    loadDigest() {
        const saved = localStorage.getItem('jnt_digest');
        if (saved) {
            const digest = JSON.parse(saved);
            // Check if digest is from today
            if (digest.timestamp === new Date().toDateString()) {
                return digest;
            }
        }
        
        return null;
    }
}

// Global Functions (called from HTML)
function resetTestStatus() {
    if (window.jobTracker) {
        const confirmed = confirm('Are you sure you want to reset all test statuses?');
        if (confirmed) {
            window.jobTracker.resetTestStates();
        }
    }
}

function navigateToTests() {
    if (window.jobTracker) {
        window.jobTracker.navigateToRoute('test');
    }
}

function generateDigest() {
    if (window.jobTracker) {
        window.jobTracker.generateDigest();
    }
}

// Tooltip System
function initTooltips() {
    document.querySelectorAll('.test-tooltip').forEach(tooltip => {
        tooltip.addEventListener('mouseenter', (e) => {
            const title = e.target.getAttribute('title');
            if (title) {
                const customTooltip = document.createElement('div');
                customTooltip.className = 'custom-tooltip';
                customTooltip.textContent = title;
                customTooltip.style.cssText = `
                    position: absolute;
                    background: var(--text-primary);
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius);
                    font-size: 0.875rem;
                    white-space: nowrap;
                    z-index: 1000;
                    box-shadow: var(--shadow-lg);
                    pointer-events: none;
                    max-width: 300px;
                    white-space: normal;
                `;
                
                document.body.appendChild(customTooltip);
                
                // Position tooltip
                const rect = e.target.getBoundingClientRect();
                const tooltipRect = customTooltip.getBoundingClientRect();
                
                let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                let top = rect.top - tooltipRect.height - 8;
                
                // Adjust if tooltip goes off screen
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < 10) {
                    top = rect.bottom + 8;
                }
                
                customTooltip.style.left = left + 'px';
                customTooltip.style.top = top + 'px';
                
                // Remove title to prevent default tooltip
                e.target.removeAttribute('title');
                e.target.dataset.originalTitle = title;
            }
        });
        
        tooltip.addEventListener('mouseleave', (e) => {
            // Remove custom tooltip
            const customTooltip = document.querySelector('.custom-tooltip');
            if (customTooltip) {
                customTooltip.remove();
            }
            
            // Restore original title
            const originalTitle = e.target.dataset.originalTitle;
            if (originalTitle) {
                e.target.setAttribute('title', originalTitle);
            }
        });
    });
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    window.jobTracker = new JobNotificationTracker();
    
    // Initialize tooltips
    initTooltips();
    
    // Add digest styles
    const digestStyles = document.createElement('style');
    digestStyles.textContent = `
        .digest-jobs {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .digest-job {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
        }
        
        .digest-rank {
            font-weight: 700;
            color: var(--primary-color);
            font-size: 1.1rem;
            min-width: 30px;
        }
        
        .digest-info {
            flex: 1;
        }
        
        .digest-info h4 {
            margin: 0 0 0.25rem 0;
            color: var(--text-primary);
            font-size: 1rem;
        }
        
        .digest-info p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .digest-score {
            background: var(--success-light);
            color: var(--success-color);
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius);
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .loading {
            text-align: center;
            color: var(--text-muted);
            font-style: italic;
            padding: 2rem;
        }
    `;
    document.head.appendChild(digestStyles);
    
    console.log('Job Notification Tracker - Test Checklist System Ready');
});