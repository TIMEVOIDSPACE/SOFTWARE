// Application Data
const appData = {
  "software": [
    {
      "id": 1,
      "name": "Google Chrome",
      "description": "Fast, secure web browser",
      "category": "Browser",
      "version": "120.0",
      "size": "95 MB",
      "icon": "🌐",
      "installer": "chrome_installer.exe",
      "silentFlag": "/silent /install",
      "needsUpdate": false
    },
    {
      "id": 2,
      "name": "Visual Studio Code",
      "description": "Code editor with IntelliSense",
      "category": "Development", 
      "version": "1.85",
      "size": "85 MB",
      "icon": "💻",
      "installer": "vscode_installer.exe",
      "silentFlag": "/VERYSILENT /NORESTART",
      "needsUpdate": false
    },
    {
      "id": 3,
      "name": "VLC Media Player",
      "description": "Multimedia player for various formats",
      "category": "Media",
      "version": "3.0.18",
      "size": "42 MB", 
      "icon": "🎬",
      "installer": "vlc_installer.exe",
      "silentFlag": "/S",
      "needsUpdate": true
    },
    {
      "id": 4,
      "name": "7-Zip",
      "description": "File archiver with high compression",
      "category": "Utilities",
      "version": "23.01",
      "size": "1.5 MB",
      "icon": "📦",
      "installer": "7zip_installer.exe", 
      "silentFlag": "/S",
      "needsUpdate": false
    },
    {
      "id": 5,
      "name": "Adobe Acrobat Reader",
      "description": "PDF viewer and editor",
      "category": "Office",
      "version": "2023.008",
      "size": "210 MB",
      "icon": "📄", 
      "installer": "acrobat_installer.exe",
      "silentFlag": "/sAll /rs /msi",
      "needsUpdate": false
    },
    {
      "id": 6,
      "name": "Steam",
      "description": "Gaming platform and store",
      "category": "Gaming",
      "version": "Latest",
      "size": "2 MB",
      "icon": "🎮",
      "installer": "steam_installer.exe",
      "silentFlag": "/S",
      "needsUpdate": false
    },
    {
      "id": 7,
      "name": "Git",
      "description": "Version control system",
      "category": "Development",
      "version": "2.42.0",
      "size": "47 MB",
      "icon": "🔧",
      "installer": "git_installer.exe",
      "silentFlag": "/VERYSILENT /NORESTART",
      "needsUpdate": false
    },
    {
      "id": 8,
      "name": "Node.js",
      "description": "JavaScript runtime environment",
      "category": "Development", 
      "version": "20.9.0",
      "size": "32 MB",
      "icon": "⚡",
      "installer": "nodejs_installer.msi",
      "silentFlag": "/quiet",
      "needsUpdate": true
    },
    {
      "id": 9,
      "name": "Discord",
      "description": "Voice and text chat platform",
      "category": "Communication",
      "version": "1.0.9015",
      "size": "85 MB",
      "icon": "💬",
      "installer": "discord_installer.exe",
      "silentFlag": "/S",
      "needsUpdate": false
    },
    {
      "id": 10,
      "name": "OBS Studio",
      "description": "Video recording and streaming",
      "category": "Media",
      "version": "29.1.3",
      "size": "105 MB",
      "icon": "📹",
      "installer": "obs_installer.exe",
      "silentFlag": "/S",
      "needsUpdate": false
    }
  ],
  "clusters": [
    {
      "id": 1,
      "name": "Developer Pack",
      "description": "Essential tools for developers",
      "icon": "👨‍💻",
      "softwareIds": [2, 7, 8],
      "totalSize": "164 MB"
    },
    {
      "id": 2, 
      "name": "Office Suite",
      "description": "Productivity and document tools",
      "icon": "📊",
      "softwareIds": [1, 5],
      "totalSize": "305 MB"
    },
    {
      "id": 3,
      "name": "Media Center",
      "description": "Entertainment and media tools", 
      "icon": "🎭",
      "softwareIds": [3, 10],
      "totalSize": "147 MB"
    },
    {
      "id": 4,
      "name": "Gaming Essentials",
      "description": "Must-have gaming applications",
      "icon": "🎮",
      "softwareIds": [6, 9],
      "totalSize": "87 MB"
    }
  ],
  "categories": ["All", "Browser", "Development", "Media", "Utilities", "Office", "Gaming", "Communication"],
  "notifications": [
    {
      "id": 1,
      "title": "VLC Media Player Update Available",
      "message": "Version 3.0.19 is now available",
      "type": "update",
      "softwareId": 3,
      "timestamp": "2025-09-20T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Node.js Security Update",
      "message": "Critical security update to version 20.9.1",
      "type": "security", 
      "softwareId": 8,
      "timestamp": "2025-09-19T15:45:00Z"
    }
  ],
  "uploadedFiles": []
};

// Application State
class AppState {
  constructor() {
    this.selectedSoftware = new Set();
    this.selectedClusters = new Set();
    this.currentPage = 'home';
    this.isAdminLoggedIn = false;
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.cartVisible = false;
    this.notificationsVisible = false;
    this.uploadedFiles = new Map(); // Store file objects
  }

  addSoftware(id) {
    this.selectedSoftware.add(id);
    this.updateCart();
  }

  removeSoftware(id) {
    this.selectedSoftware.delete(id);
    // Also remove from any clusters that contain this software
    appData.clusters.forEach(cluster => {
      if (cluster.softwareIds.includes(id)) {
        this.selectedClusters.delete(cluster.id);
      }
    });
    this.updateCart();
  }

  addCluster(clusterId) {
    const cluster = appData.clusters.find(c => c.id === clusterId);
    if (cluster) {
      this.selectedClusters.add(clusterId);
      cluster.softwareIds.forEach(id => this.selectedSoftware.add(id));
      this.updateCart();
    }
  }

  removeCluster(clusterId) {
    const cluster = appData.clusters.find(c => c.id === clusterId);
    if (cluster) {
      this.selectedClusters.delete(clusterId);
      cluster.softwareIds.forEach(id => this.selectedSoftware.delete(id));
      this.updateCart();
    }
  }

  updateCart() {
    const cart = document.getElementById('selectionCart');
    const selectedItems = document.getElementById('selectedItems');
    const totalSizeElement = document.getElementById('totalSize');
    const generateBtn = document.getElementById('generateBtn');

    if (this.selectedSoftware.size > 0) {
      cart.classList.add('visible');
      this.cartVisible = true;
    } else {
      cart.classList.remove('visible');
      this.cartVisible = false;
    }

    // Update selected items display
    selectedItems.innerHTML = '';
    let totalSize = 0;

    this.selectedSoftware.forEach(id => {
      const software = appData.software.find(s => s.id === id);
      if (software) {
        const sizeNum = parseFloat(software.size);
        totalSize += sizeNum;

        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
          <div class="selected-item-info">
            <span class="software-icon-small">${software.icon}</span>
            <div>
              <div class="selected-item-name">${software.name}</div>
              <div class="selected-item-size">${software.size}</div>
            </div>
          </div>
          <button class="remove-item" onclick="appState.removeSoftware(${id})">×</button>
        `;
        selectedItems.appendChild(item);
      }
    });

    totalSizeElement.textContent = `${totalSize.toFixed(1)} MB`;
    generateBtn.disabled = this.selectedSoftware.size === 0;
  }
}

// File Upload Manager
class FileUploadManager {
  constructor() {
    this.setupFileUpload();
  }

  setupFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    if (!dropZone || !fileInput) return;

    // Drag and drop events
    dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
    dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
    dropZone.addEventListener('drop', this.handleDrop.bind(this));
    
    // File input change
    fileInput.addEventListener('change', this.handleFileSelect.bind(this));
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').classList.add('dragover');
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').classList.remove('dragover');
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    this.processFiles(files);
  }

  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.processFiles(files);
  }

  processFiles(files) {
    const validExtensions = ['.exe', '.msi', '.pkg', '.dmg'];
    const validFiles = files.filter(file => 
      validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (validFiles.length === 0) {
      this.showMessage('Please select valid installer files (.exe, .msi, .pkg, .dmg)', 'error');
      return;
    }

    this.uploadFiles(validFiles);
  }

  uploadFiles(files) {
    const progressContainer = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const uploadPercent = document.getElementById('uploadPercent');

    progressContainer.classList.remove('hidden');

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;

      progressFill.style.width = `${progress}%`;
      uploadPercent.textContent = `${Math.round(progress)}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.completeUpload(files);
          progressContainer.classList.add('hidden');
        }, 500);
      }
    }, 200);
  }

  completeUpload(files) {
    files.forEach(file => {
      const fileData = {
        name: file.name,
        size: this.formatFileSize(file.size),
        type: file.type,
        uploadDate: new Date(),
        file: file
      };

      appState.uploadedFiles.set(file.name, fileData);
      appData.uploadedFiles.push(fileData);
    });

    this.renderUploadedFiles();
    this.showMessage(`${files.length} file(s) uploaded successfully!`, 'success');
  }

  renderUploadedFiles() {
    const filesList = document.getElementById('uploadedFilesList');
    if (!filesList) return;

    filesList.innerHTML = '';

    appData.uploadedFiles.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <div class="file-icon">
          <i class="fas fa-file-download"></i>
        </div>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${file.size}</div>
        </div>
        <div class="file-actions">
          <button class="btn-icon btn-delete" onclick="fileUploadManager.deleteFile('${file.name}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      filesList.appendChild(fileItem);
    });
  }

  deleteFile(fileName) {
    if (confirm('Are you sure you want to delete this file?')) {
      appState.uploadedFiles.delete(fileName);
      appData.uploadedFiles = appData.uploadedFiles.filter(f => f.name !== fileName);
      this.renderUploadedFiles();
      this.showMessage('File deleted successfully!', 'success');
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  showMessage(message, type) {
    // Simple message display - can be enhanced with a toast system
    alert(message);
  }
}

// UI Manager
class UIManager {
  constructor() {
    this.initializeEventListeners();
    this.renderCategories();
    this.renderSoftware();
    this.renderClusters();
    this.renderNotifications();
  }

  initializeEventListeners() {
    // Navigation - Fixed event handling
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.closest('.nav-btn').dataset.page;
        if (page) {
          this.showPage(page);
        }
      });
    });

    // Search - Fixed to work properly
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase();
        this.renderSoftware();
      });
    }

    // Category filter - Fixed to work properly
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        appState.selectedCategory = e.target.value;
        this.renderSoftware();
      });
    }

    // Cart close - Fixed event handling
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('selectionCart').classList.remove('visible');
        appState.cartVisible = false;
      });
    }

    // Generate installer
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        this.generateInstaller();
      });
    }

    // Notifications
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', () => {
        this.toggleNotifications();
      });
    }

    const closeNotifications = document.getElementById('closeNotifications');
    if (closeNotifications) {
      closeNotifications.addEventListener('click', () => {
        this.hideNotifications();
      });
    }

    // Admin login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAdminLogin();
      });
    }

    // Admin logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleAdminLogout();
      });
    }

    // Admin tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.showAdminTab(e.target.dataset.tab);
      });
    });

    // Modal close
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        this.hideModal();
      });
    }

    // Admin buttons
    const addSoftwareBtn = document.getElementById('addSoftwareBtn');
    if (addSoftwareBtn) {
      addSoftwareBtn.addEventListener('click', () => {
        this.showAddSoftwareModal();
      });
    }

    const addClusterBtn = document.getElementById('addClusterBtn');
    if (addClusterBtn) {
      addClusterBtn.addEventListener('click', () => {
        this.showAddClusterModal();
      });
    }
  }

  showPage(pageId) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
      targetPage.classList.add('active');
      appState.currentPage = pageId;
    }

    // Handle admin page logic
    if (pageId === 'admin' && !appState.isAdminLoggedIn) {
      const adminLogin = document.getElementById('adminLogin');
      const adminDashboard = document.getElementById('adminDashboard');
      if (adminLogin && adminDashboard) {
        adminLogin.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
      }
    }
  }

  renderCategories() {
    const filterSelect = document.getElementById('categoryFilter');
    if (filterSelect) {
      // Clear existing options except the first one
      filterSelect.innerHTML = '<option value="All">All Categories</option>';
      
      // Add category options
      const categories = ['Browser', 'Development', 'Media', 'Utilities', 'Office', 'Gaming', 'Communication'];
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
      });
    }
  }

  renderSoftware() {
    const softwareGrid = document.getElementById('softwareGrid');
    if (!softwareGrid) return;

    // Filter software based on search and category
    const filteredSoftware = appData.software.filter(software => {
      const matchesSearch = !appState.searchQuery || 
                           software.name.toLowerCase().includes(appState.searchQuery) ||
                           software.description.toLowerCase().includes(appState.searchQuery);
      const matchesCategory = appState.selectedCategory === 'All' || software.category === appState.selectedCategory;
      return matchesSearch && matchesCategory;
    });

    softwareGrid.innerHTML = '';
    filteredSoftware.forEach(software => {
      const card = document.createElement('div');
      card.className = `software-card ${appState.selectedSoftware.has(software.id) ? 'selected' : ''} ${software.needsUpdate ? 'needs-update' : ''}`;
      
      card.innerHTML = `
        <div class="software-header">
          <div class="software-icon-large">${software.icon}</div>
          <div class="software-info">
            <h3>${software.name}</h3>
            <p class="software-description">${software.description}</p>
          </div>
        </div>
        <div class="software-meta">
          <span>Version: ${software.version}</span>
          <span>Size: ${software.size}</span>
        </div>
        <div class="software-actions">
          <span class="status status--info">${software.category}</span>
          <input type="checkbox" class="software-checkbox" ${appState.selectedSoftware.has(software.id) ? 'checked' : ''} 
                 onchange="uiManager.toggleSoftware(${software.id}, event)">
        </div>
      `;
      
      softwareGrid.appendChild(card);
    });
  }

  renderClusters() {
    const clustersGrid = document.getElementById('clustersGrid');
    if (!clustersGrid) return;
    
    clustersGrid.innerHTML = '';
    
    appData.clusters.forEach(cluster => {
      const card = document.createElement('div');
      card.className = `cluster-card ${appState.selectedClusters.has(cluster.id) ? 'selected' : ''}`;
      
      const softwareIcons = cluster.softwareIds.map(id => {
        const software = appData.software.find(s => s.id === id);
        return software ? `<span class="software-icon">${software.icon}</span>` : '';
      }).join('');

      card.innerHTML = `
        <div class="cluster-header">
          <div class="cluster-icon">${cluster.icon}</div>
          <div class="cluster-info">
            <h3>${cluster.name}</h3>
            <p class="cluster-description">${cluster.description}</p>
          </div>
        </div>
        <div class="cluster-software">${softwareIcons}</div>
        <div class="cluster-size">Total Size: ${cluster.totalSize}</div>
      `;
      
      card.addEventListener('click', () => {
        this.toggleCluster(cluster.id);
      });
      
      clustersGrid.appendChild(card);
    });
  }

  renderNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    const notificationBadge = document.getElementById('notificationBadge');
    
    if (notificationBadge) {
      notificationBadge.textContent = appData.notifications.length;
    }
    
    if (notificationsList) {
      notificationsList.innerHTML = '';
      
      appData.notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.type}`;
        
        const date = new Date(notification.timestamp);
        const timeAgo = this.getTimeAgo(date);
        
        item.innerHTML = `
          <div class="notification-title">${notification.title}</div>
          <div class="notification-message">${notification.message}</div>
          <div class="notification-time">${timeAgo}</div>
        `;
        
        notificationsList.appendChild(item);
      });
    }
  }

  // Fixed software selection to work independently
  toggleSoftware(id, event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (appState.selectedSoftware.has(id)) {
      appState.removeSoftware(id);
    } else {
      appState.addSoftware(id);
    }
    this.renderSoftware();
    this.renderClusters();
  }

  toggleCluster(id) {
    if (appState.selectedClusters.has(id)) {
      appState.removeCluster(id);
    } else {
      appState.addCluster(id);
    }
    this.renderClusters();
    this.renderSoftware();
  }

  toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
      if (appState.notificationsVisible) {
        panel.classList.add('hidden');
        appState.notificationsVisible = false;
      } else {
        panel.classList.remove('hidden');
        appState.notificationsVisible = true;
      }
    }
  }

  hideNotifications() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
      panel.classList.add('hidden');
      appState.notificationsVisible = false;
    }
  }

  generateInstaller() {
    const progressModal = document.getElementById('progressModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressModal) {
      progressModal.classList.remove('hidden');
    }
    
    const steps = [
      'Preparing files...',
      'Collecting installers...',
      'Detecting silent install flags...',
      'Generating smart batch script...',
      'Creating ZIP package...',
      'Finalizing download...'
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      const progress = ((currentStep + 1) / steps.length) * 100;
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }
      if (progressText) {
        progressText.textContent = steps[currentStep];
      }
      
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          this.completeGeneration();
        }, 1000);
      }
    }, 1000);
  }

  completeGeneration() {
    const progressModal = document.getElementById('progressModal');
    if (progressModal) {
      progressModal.classList.add('hidden');
    }
    
    // Generate batch script content
    const batchScript = this.generateAdvancedBatchScript();
    
    // Create download
    this.downloadFiles(batchScript);
    
    // Reset selection
    appState.selectedSoftware.clear();
    appState.selectedClusters.clear();
    const cart = document.getElementById('selectionCart');
    if (cart) {
      cart.classList.remove('visible');
    }
    this.renderSoftware();
    this.renderClusters();
    
    alert('Advanced installer package generated successfully! The batch file includes intelligent auto-detection and error handling.');
  }

  generateAdvancedBatchScript() {
    let script = '@echo off\n';
    script += 'setlocal enabledelayedexpansion\n';
    script += 'title SoftRepo - Smart Auto Installer\n';
    script += 'color 0A\n\n';
    
    script += 'echo ================================================\n';
    script += 'echo      SoftRepo - Smart Auto Installer\n';
    script += 'echo ================================================\n';
    script += 'echo.\n';
    script += 'echo Installing selected software with intelligent detection...\n';
    script += 'echo.\n\n';
    
    script += 'set /a total=0\n';
    script += 'set /a success=0\n';
    script += 'set /a failed=0\n\n';
    
    // Add function for intelligent installation
    script += ':install_smart\n';
    script += 'set "installer=%~1"\n';
    script += 'set "name=%~2"\n';
    script += 'set "silent_flag=%~3"\n\n';
    
    script += 'echo Installing %name%...\n';
    script += 'if not exist "%installer%" (\n';
    script += '    echo ERROR: %installer% not found\n';
    script += '    set /a failed+=1\n';
    script += '    goto :eof\n';
    script += ')\n\n';
    
    script += 'REM Try primary silent flag\n';
    script += 'start /wait "" "%installer%" %silent_flag% >nul 2>&1\n';
    script += 'if !errorlevel! equ 0 (\n';
    script += '    echo SUCCESS: %name% installed with %silent_flag%\n';
    script += '    set /a success+=1\n';
    script += '    goto :eof\n';
    script += ')\n\n';
    
    // Add fallback silent flags
    const fallbackFlags = ['/S', '/silent', '/quiet', '/VERYSILENT', '/qn'];
    fallbackFlags.forEach(flag => {
      script += `REM Try ${flag}\n`;
      script += `start /wait "" "%installer%" ${flag} >nul 2>&1\n`;
      script += 'if !errorlevel! equ 0 (\n';
      script += `    echo SUCCESS: %name% installed with ${flag}\n`;
      script += '    set /a success+=1\n';
      script += '    goto :eof\n';
      script += ')\n\n';
    });
    
    script += 'REM All silent methods failed\n';
    script += 'echo WARNING: Silent installation failed for %name%\n';
    script += 'echo Attempting standard installation...\n';
    script += 'start /wait "" "%installer%"\n';
    script += 'if !errorlevel! equ 0 (\n';
    script += '    echo SUCCESS: %name% installed (manual interaction may be required)\n';
    script += '    set /a success+=1\n';
    script += ') else (\n';
    script += '    echo FAILED: %name% installation failed\n';
    script += '    set /a failed+=1\n';
    script += ')\n';
    script += 'goto :eof\n\n';
    
    // Add installations for selected software
    appState.selectedSoftware.forEach(id => {
      const software = appData.software.find(s => s.id === id);
      if (software) {
        script += `call :install_smart "${software.installer}" "${software.name}" "${software.silentFlag}"\n`;
        script += 'set /a total+=1\n';
        script += 'echo.\n\n';
      }
    });
    
    // Add summary
    script += 'echo ================================================\n';
    script += 'echo           Installation Summary\n';
    script += 'echo ================================================\n';
    script += 'echo Total software: !total!\n';
    script += 'echo Successfully installed: !success!\n';
    script += 'echo Failed installations: !failed!\n';
    script += 'echo.\n\n';
    
    script += 'if !failed! gtr 0 (\n';
    script += '    echo Some installations failed. You may need to:\n';
    script += '    echo - Run as Administrator\n';
    script += '    echo - Temporarily disable antivirus\n';
    script += '    echo - Install failed software manually\n';
    script += '    echo.\n';
    script += ')\n\n';
    
    script += 'echo Installation process completed!\n';
    script += 'echo Thank you for using SoftRepo Dark Edition.\n';
    script += 'pause\n';
    script += 'endlocal\n';
    
    return script;
  }

  downloadFiles(batchScript) {
    // Create and download batch file
    const blob = new Blob([batchScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SoftRepo_Smart_Installer.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  handleAdminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === 'admin' && password === 'admin123') {
      appState.isAdminLoggedIn = true;
      const adminLogin = document.getElementById('adminLogin');
      const adminDashboard = document.getElementById('adminDashboard');
      if (adminLogin && adminDashboard) {
        adminLogin.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
      }
      this.renderAdminContent();
    } else {
      alert('Invalid credentials! Use admin/admin123');
    }
  }

  handleAdminLogout() {
    appState.isAdminLoggedIn = false;
    const adminLogin = document.getElementById('adminLogin');
    const adminDashboard = document.getElementById('adminDashboard');
    if (adminLogin && adminDashboard) {
      adminLogin.classList.remove('hidden');
      adminDashboard.classList.add('hidden');
    }
  }

  showAdminTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
    const tabContent = document.getElementById(tabId + 'Tab');
    
    if (tabButton && tabContent) {
      tabButton.classList.add('active');
      tabContent.classList.add('active');
    }
    
    this.renderAdminContent();
  }

  renderAdminContent() {
    this.renderAdminSoftware();
    this.renderAdminClusters();
    this.renderAdminStats();
    fileUploadManager.renderUploadedFiles();
  }

  renderAdminSoftware() {
    const adminSoftwareList = document.getElementById('adminSoftwareList');
    if (!adminSoftwareList) return;
    
    adminSoftwareList.innerHTML = '';
    
    appData.software.forEach(software => {
      const item = document.createElement('div');
      item.className = 'admin-software-item';
      
      item.innerHTML = `
        <div class="admin-item-icon">${software.icon}</div>
        <div class="admin-item-info">
          <h4>${software.name}</h4>
          <div class="admin-item-meta">
            Version: ${software.version} • Size: ${software.size} • Category: ${software.category}<br>
            Installer: ${software.installer} • Silent: ${software.silentFlag}
            ${software.needsUpdate ? '<br><span class="status status--warning">Update Available</span>' : ''}
          </div>
        </div>
        <div class="admin-actions-btns">
          <button class="btn btn--sm btn-secondary" onclick="uiManager.editSoftware(${software.id})">Edit</button>
          <button class="btn btn--sm btn-outline" onclick="uiManager.deleteSoftware(${software.id})">Delete</button>
        </div>
      `;
      
      adminSoftwareList.appendChild(item);
    });
  }

  renderAdminClusters() {
    const adminClustersList = document.getElementById('adminClustersList');
    if (!adminClustersList) return;
    
    adminClustersList.innerHTML = '';
    
    appData.clusters.forEach(cluster => {
      const item = document.createElement('div');
      item.className = 'admin-cluster-item';
      
      const softwareNames = cluster.softwareIds.map(id => {
        const software = appData.software.find(s => s.id === id);
        return software ? software.name : '';
      }).filter(name => name).join(', ');
      
      item.innerHTML = `
        <div class="admin-item-icon">${cluster.icon}</div>
        <div class="admin-item-info">
          <h4>${cluster.name}</h4>
          <div class="admin-item-meta">
            ${cluster.description}<br>
            Software: ${softwareNames}<br>
            Total Size: ${cluster.totalSize}
          </div>
        </div>
        <div class="admin-actions-btns">
          <button class="btn btn--sm btn-secondary" onclick="uiManager.editCluster(${cluster.id})">Edit</button>
          <button class="btn btn--sm btn-outline" onclick="uiManager.deleteCluster(${cluster.id})">Delete</button>
        </div>
      `;
      
      adminClustersList.appendChild(item);
    });
  }

  renderAdminStats() {
    const totalSoftware = document.getElementById('totalSoftware');
    const totalClusters = document.getElementById('totalClusters');
    const updatesAvailable = document.getElementById('updatesAvailable');
    
    if (totalSoftware) {
      totalSoftware.textContent = appData.software.length;
    }
    if (totalClusters) {
      totalClusters.textContent = appData.clusters.length;
    }
    if (updatesAvailable) {
      updatesAvailable.textContent = appData.software.filter(s => s.needsUpdate).length;
    }
  }

  showAddSoftwareModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = 'Add New Software';
    
    // Create installer file dropdown from uploaded files
    const installerOptions = appData.uploadedFiles.map(file => 
      `<option value="${file.name}">${file.name}</option>`
    ).join('');
    
    modalBody.innerHTML = `
      <form id="addSoftwareForm">
        <div class="form-group">
          <label class="form-label">Software Name *</label>
          <input type="text" class="form-control" name="name" required>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" name="description"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="form-control" name="category" required>
              <option value="">Select Category</option>
              <option value="Browser">Browser</option>
              <option value="Development">Development</option>
              <option value="Media">Media</option>
              <option value="Utilities">Utilities</option>
              <option value="Office">Office</option>
              <option value="Gaming">Gaming</option>
              <option value="Communication">Communication</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Icon (Emoji) *</label>
            <input type="text" class="form-control" name="icon" placeholder="🔧" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Version</label>
            <input type="text" class="form-control" name="version">
          </div>
          <div class="form-group">
            <label class="form-label">Size</label>
            <input type="text" class="form-control" name="size" placeholder="e.g., 25 MB">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Installer File *</label>
          <select class="form-control" name="installer" required>
            <option value="">Select uploaded file...</option>
            ${installerOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Silent Install Flags</label>
          <input type="text" class="form-control" name="silentFlag" placeholder="Leave empty for auto-detection">
          <small style="color: var(--text-muted);">If left empty, the system will use intelligent auto-detection</small>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary">Add Software</button>
          <button type="button" class="btn btn-secondary" onclick="uiManager.hideModal()">Cancel</button>
        </div>
      </form>
    `;
    
    modal.classList.remove('hidden');
    
    const form = document.getElementById('addSoftwareForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addSoftware(new FormData(e.target));
      });
    }
  }

  showAddClusterModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = 'Create New Cluster';
    
    const softwareCheckboxes = appData.software.map(software => `
      <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">
        <input type="checkbox" name="softwareIds" value="${software.id}">
        ${software.icon} ${software.name}
      </label>
    `).join('');
    
    modalBody.innerHTML = `
      <form id="addClusterForm">
        <div class="form-group">
          <label class="form-label">Cluster Name *</label>
          <input type="text" class="form-control" name="name" required>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" name="description"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Icon (Emoji) *</label>
          <input type="text" class="form-control" name="icon" placeholder="📦" required>
        </div>
        <div class="form-group">
          <label class="form-label">Select Software</label>
          <div style="max-height: 200px; overflow-y: auto; padding: 1rem; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color);">
            ${softwareCheckboxes}
          </div>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary">Create Cluster</button>
          <button type="button" class="btn btn-secondary" onclick="uiManager.hideModal()">Cancel</button>
        </div>
      </form>
    `;
    
    modal.classList.remove('hidden');
    
    const form = document.getElementById('addClusterForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addCluster(new FormData(e.target));
      });
    }
  }

  addSoftware(formData) {
    const newSoftware = {
      id: Math.max(...appData.software.map(s => s.id)) + 1,
      name: formData.get('name'),
      description: formData.get('description') || '',
      category: formData.get('category'),
      version: formData.get('version') || 'Latest',
      size: formData.get('size') || 'Unknown',
      icon: formData.get('icon'),
      installer: formData.get('installer'),
      silentFlag: formData.get('silentFlag') || 'auto-detect',
      needsUpdate: false
    };
    
    appData.software.push(newSoftware);
    this.hideModal();
    this.renderSoftware();
    this.renderAdminSoftware();
    this.renderAdminStats();
    alert('Software added successfully!');
  }

  addCluster(formData) {
    const softwareIds = Array.from(formData.getAll('softwareIds')).map(id => parseInt(id));
    const totalSize = softwareIds.reduce((sum, id) => {
      const software = appData.software.find(s => s.id === id);
      return sum + (software ? parseFloat(software.size) : 0);
    }, 0);
    
    const newCluster = {
      id: Math.max(...appData.clusters.map(c => c.id)) + 1,
      name: formData.get('name'),
      description: formData.get('description') || '',
      icon: formData.get('icon'),
      softwareIds: softwareIds,
      totalSize: `${totalSize.toFixed(1)} MB`
    };
    
    appData.clusters.push(newCluster);
    this.hideModal();
    this.renderClusters();
    this.renderAdminClusters();
    this.renderAdminStats();
    alert('Cluster created successfully!');
  }

  editSoftware(id) {
    alert(`Edit functionality for software ID ${id} is available. You can extend this to show an edit form.`);
  }

  deleteSoftware(id) {
    if (confirm('Are you sure you want to delete this software?')) {
      const index = appData.software.findIndex(s => s.id === id);
      if (index > -1) {
        appData.software.splice(index, 1);
        this.renderSoftware();
        this.renderAdminSoftware();
        this.renderAdminStats();
        alert('Software deleted successfully!');
      }
    }
  }

  editCluster(id) {
    alert(`Edit functionality for cluster ID ${id} is available. You can extend this to show an edit form.`);
  }

  deleteCluster(id) {
    if (confirm('Are you sure you want to delete this cluster?')) {
      const index = appData.clusters.findIndex(c => c.id === id);
      if (index > -1) {
        appData.clusters.splice(index, 1);
        this.renderClusters();
        this.renderAdminClusters();
        this.renderAdminStats();
        alert('Cluster deleted successfully!');
      }
    }
  }

  hideModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}

// Initialize application
const appState = new AppState();
const uiManager = new UIManager();
const fileUploadManager = new FileUploadManager();

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modal');
  const progressModal = document.getElementById('progressModal');
  const notificationsPanel = document.getElementById('notificationsPanel');
  
  if (modal && e.target === modal) {
    uiManager.hideModal();
  }
  
  if (progressModal && e.target === progressModal) {
    progressModal.classList.add('hidden');
  }
  
  if (notificationsPanel && !notificationsPanel.contains(e.target) && !document.getElementById('notificationsBtn').contains(e.target)) {
    uiManager.hideNotifications();
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Show home page by default
  uiManager.showPage('home');
  
  console.log('🌟 SoftRepo Dark Edition initialized successfully!');
});
