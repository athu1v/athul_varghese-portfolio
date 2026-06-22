/* ==========================================
   PROFESSIONAL CYBERSECURITY PORTFOLIO LOGIC
   ========================================== */

// --- AUDIO SYNTHESIS SYSTEM ---
let audioCtx = null;
let soundEnabled = false;

const soundToggle = document.getElementById('sound-toggle');
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      soundToggle.classList.add('active');
      soundToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span class="sound-label">AUDIO ON</span>';
      playSuccess();
    } else {
      soundToggle.classList.remove('active');
      soundToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span class="sound-label">AUDIO OFF</span>';
    }
  });
}

function playTick() {
  if (!soundEnabled || !audioCtx || audioCtx.state === 'suspended') return;
  try {
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.003, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.015);
  } catch (e) {}
}

function playSuccess() {
  if (!soundEnabled || !audioCtx || audioCtx.state === 'suspended') return;
  try {
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.05); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.15); // C6
    
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    
    osc.start();
    osc.stop(now + 0.35);
  } catch (e) {}
}

function playBeep(freq, duration) {
  if (!soundEnabled || !audioCtx || audioCtx.state === 'suspended') return;
  try {
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// Fallback avatar handling
const avatarImg = document.querySelector('.cyber-avatar-img');
const avatarFallback = document.querySelector('.cyber-avatar-fallback');
if (avatarImg) {
  avatarImg.addEventListener('error', () => {
    avatarImg.style.display = 'none';
    if (avatarFallback) avatarFallback.classList.remove('hidden');
  });
}

// --- BACKGROUND CANVAS (PROFESSIONAL SCROLLING HACKER TERMINAL LOGS) ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let terminalLines = [];
const fontSize = 12;
let columnsCount = 0;
let lineSpacing = 16;
let maxLines = 0;

const logTemplates = [
  "root@sec_node:~# nmap -sS -sV -O 192.168.4.15",
  "PORT     STATE SERVICE VERSION",
  "22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5",
  "80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))",
  "443/tcp  open  ssl/http Apache httpd 2.4.41",
  "MAC Address: 00:50:56:C0:00:08 (VMware)",
  "Device type: general purpose | Running: Linux 5.X",
  "root@sec_node:~# easyocr --model label_v3.bin --image nutrition.jpg",
  "EasyOCR: Loading Tesseract eng OCR engines... SUCCESS",
  "[INFO] Preprocessing Filter Applied: Grayscale=1, Contrast=1.2",
  "[EXTRACTED] CALORIES: 240 kcal | SODIUM: 160mg | FAT: 8g",
  "root@sec_node:~# sqlmap -u 'http://target.node/sqli/' --dbs",
  "[+] sqlmap/1.4.12#stable - automatic SQL injection tool",
  "[*] retrieving database names",
  "[*] db: portswigger_academy_sqli",
  "root@sec_node:~# burpsuite --project techcake_assessment",
  "[BurpSuite] Intercept enabled on localhost:8080",
  "[REPEATER] Sending payload: GET /admin HTTP/1.1",
  "[REPEATER] Response: 200 OK - Admin Panel Accessed successfully",
  "root@sec_node:~# thm --join-room mr_robot_ctf --decrypt-key",
  "[THM] Room 'Mr Robot CTF' synchronized. Initiating search...",
  "[THM] key1.txt retrieved: f3e970a04910cfab9812a88e990ad312",
  "root@sec_node:~# thm --join-room pickle_rick --exploit",
  "[THM] Pickle Rick: executing command execution payload...",
  "[THM] Webserver root accessible. flag: 'WUBBA LUBBA DUB DUB'",
  "root@sec_node:~# python3 password_strength_analyzer.py",
  "Entropy calculation active... trial passkey parsed.",
  "[AUDIT] Character classes: upper, lower, numbers, symbols",
  "[AUDIT] Calculated Entropy: 84 bits. Classification: SECURE",
  "root@sec_node:~# route print -4",
  "IPv4 Route Table - Active Routes:",
  "Network Destination      Netmask          Gateway       Interface",
  "          0.0.0.0          0.0.0.0      192.168.1.1    192.168.1.100",
  "      192.168.1.0    255.255.255.0         On-link    192.168.1.100",
  "[SEC_NODE] ESTABLISHING ROUTING TUNNEL... [AES-256-GCM]",
  "[SEC_NODE] PEER CONNECTION ESTABLISHED AT NODE Kannur, Kerala",
  "[OK] AUDIT SYSTEM INTEGRITY RATING: 100%"
];

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  maxLines = Math.floor(canvas.height / lineSpacing) + 5;
  columnsCount = Math.ceil(canvas.width / 400);
  
  terminalLines = [];
  for (let c = 0; c < columnsCount; c++) {
    terminalLines[c] = [];
    let startY = canvas.height - Math.random() * canvas.height;
    for (let i = 0; i < maxLines; i++) {
      terminalLines[c].push({
        text: logTemplates[Math.floor(Math.random() * logTemplates.length)],
        y: startY - (i * lineSpacing)
      });
    }
  }
}

function animateCanvas() {
  ctx.fillStyle = '#050608';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Faint green scanlines overlay
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.012)';
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
  
  for (let c = 0; c < columnsCount; c++) {
    const colX = 20 + c * 400;
    
    // Draw lines
    terminalLines[c].forEach(line => {
      const progress = line.y / canvas.height;
      let opacity = 0.045; // Subtle hacker logs background
      
      if (line.y < 100) opacity *= (line.y / 100);
      if (line.y > canvas.height - 100) opacity *= ((canvas.height - line.y) / 100);
      
      if (opacity < 0) opacity = 0;
      
      ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;
      ctx.fillText(line.text, colX, line.y);
      
      line.y -= 0.35;
    });
    
    // Roll top line off screen
    if (terminalLines[c][0] && terminalLines[c][0].y < -lineSpacing) {
      terminalLines[c].shift();
      const lastLine = terminalLines[c][terminalLines[c].length - 1];
      const newY = lastLine ? lastLine.y + lineSpacing : canvas.height;
      terminalLines[c].push({
        text: logTemplates[Math.floor(Math.random() * logTemplates.length)],
        y: newY
      });
    }
  }
  
  requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', initCanvas);
initCanvas();
requestAnimationFrame(animateCanvas);


// --- TEXT DECRYPTION SCRAMBLER ---
function scrambleText(element, originalText) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@$%&+[]{}';
  let iterations = 0;
  
  const interval = setInterval(() => {
    element.innerText = originalText
      .split('')
      .map((char, index) => {
        if (index < iterations) {
          return originalText[index];
        }
        if (char === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
      
    if (iterations >= originalText.length) {
      clearInterval(interval);
    }
    iterations += 1 / 3;
    playTick();
  }, 22);
}

// Scramble visual cards elements on hover
document.querySelectorAll('.cyber-card h3').forEach(title => {
  const original = title.innerText;
  title.addEventListener('mouseenter', () => {
    scrambleText(title, original);
  });
});

document.querySelectorAll('.project-card h3').forEach(title => {
  const original = title.innerText;
  title.addEventListener('mouseenter', () => {
    scrambleText(title, original);
  });
});


// --- WIDGET 1: PASSWORD COMPLEXITY AUDITOR ---
const auditInput = document.getElementById('audit-input');
const auditEntropy = document.getElementById('audit-entropy');
const auditStrength = document.getElementById('audit-strength');
const auditCrackTime = document.getElementById('audit-cracktime');

if (auditInput) {
  auditInput.addEventListener('input', () => {
    const val = auditInput.value;
    playTick();
    
    if (val.length === 0) {
      auditEntropy.innerText = "0 bits";
      auditEntropy.className = "val text-error";
      auditStrength.innerText = "WEAK";
      auditStrength.className = "val text-error";
      auditCrackTime.innerText = "Instantly (<0.01 seconds)";
      auditCrackTime.className = "val text-error";
      return;
    }
    
    let R = 0;
    if (/[a-z]/.test(val)) R += 26;
    if (/[A-Z]/.test(val)) R += 26;
    if (/[0-9]/.test(val)) R += 10;
    if (/[^a-zA-Z0-9]/.test(val)) R += 33;
    
    const entropy = Math.round(val.length * Math.log2(R));
    auditEntropy.innerText = `${entropy} bits`;
    
    const guesses = Math.pow(2, entropy);
    const secondsToCrack = guesses / 1e9; // assuming 1G guesses/sec
    
    let timeText = "";
    let colorClass = "text-error";
    let strengthText = "WEAK";
    
    if (entropy < 35) {
      timeText = "Instantly (<0.01 seconds)";
      strengthText = "WEAK";
      colorClass = "text-error";
    } else if (entropy < 55) {
      strengthText = "MODERATE";
      colorClass = "text-accent";
      if (secondsToCrack < 60) {
        timeText = `${Math.round(secondsToCrack)} seconds`;
      } else if (secondsToCrack < 3600) {
        timeText = `${Math.round(secondsToCrack / 60)} minutes`;
      } else {
        timeText = `${Math.round(secondsToCrack / 3600)} hours`;
      }
    } else {
      strengthText = "SECURE";
      colorClass = "text-success";
      const days = secondsToCrack / 86400;
      if (days < 365) {
        timeText = `${Math.round(days)} days`;
      } else if (days < 36500) {
        timeText = `${Math.round(days / 365)} years`;
      } else {
        timeText = "Centuries / Bruteforce Resistant";
      }
    }
    
    auditEntropy.className = `val ${colorClass}`;
    auditStrength.innerText = strengthText;
    auditStrength.className = `val ${colorClass}`;
    auditCrackTime.innerText = timeText;
    auditCrackTime.className = `val ${colorClass}`;
  });
}


// --- WIDGET 2: SIMULATED OCR LABEL SCANNER ---
const ocrBtn = document.getElementById('trigger-ocr-btn');
const ocrLaser = document.querySelector('.laser-scanner-line');
const ocrOutput = document.getElementById('ocr-output-log');

if (ocrBtn && ocrLaser && ocrOutput) {
  ocrBtn.addEventListener('click', () => {
    if (ocrLaser.classList.contains('scanning')) return;
    
    playBeep(600, 0.2);
    ocrLaser.classList.add('scanning');
    ocrOutput.innerText = "System: Scanner initializing. Targeting product label vectors...";
    ocrBtn.disabled = true;
    
    setTimeout(() => {
      ocrOutput.innerText = "System: Running text extraction algorithms over label area...";
      playBeep(650, 0.15);
    }, 1000);
    
    setTimeout(() => {
      ocrOutput.innerText = "System: Compiling extracted nutrition index metrics...";
      playBeep(700, 0.12);
    }, 2000);
    
    setTimeout(() => {
      ocrLaser.classList.remove('scanning');
      ocrBtn.disabled = false;
      playSuccess();
      
      const parsedData = {
        scan_status: "COMPLETED",
        label_recognized: "NUTRITION_FACTS",
        extracted_fields: {
          calories: "240 kcal",
          total_fat: "8 grams",
          sodium: "160 milligrams",
          sugars: "12 grams"
        },
        audit_verdict: "INTEGRITY CRITERIA MET"
      };
      
      ocrOutput.innerHTML = `<pre class="text-xs text-success" style="margin: 0; line-height: 1.2;">${JSON.stringify(parsedData, null, 2)}</pre>`;
    }, 3200);
  });
}


// --- WIDGET 3: ACTIVE SECURITY NODE CANVAS ---
const nodesCanvas = document.getElementById('nodes-canvas');
const activePathsEl = document.getElementById('nodes-active-paths');

if (nodesCanvas) {
  const nCtx = nodesCanvas.getContext('2d');
  
  let canvasWidth = 0;
  let canvasHeight = 0;
  let localNodes = [];
  const totalLocalNodes = 25;
  const linkRange = 70;
  
  const localMouse = {
    x: null,
    y: null,
    radius: 70
  };
  
  function resizeLocalCanvas() {
    canvasWidth = nodesCanvas.parentElement.getBoundingClientRect().width;
    canvasHeight = nodesCanvas.parentElement.getBoundingClientRect().height;
    nodesCanvas.width = canvasWidth;
    nodesCanvas.height = canvasHeight;
    
    localNodes = [];
    for (let i = 0; i < totalLocalNodes; i++) {
      localNodes.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        size: Math.random() * 2 + 1
      });
    }
  }
  
  nodesCanvas.addEventListener('mousemove', (e) => {
    const rect = nodesCanvas.getBoundingClientRect();
    localMouse.x = e.clientX - rect.left;
    localMouse.y = e.clientY - rect.top;
  });
  
  nodesCanvas.addEventListener('mouseleave', () => {
    localMouse.x = null;
    localMouse.y = null;
  });
  
  function drawNodeMesh() {
    nCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Update and draw local nodes
    localNodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      if (node.x > canvasWidth) node.x = 0;
      else if (node.x < 0) node.x = canvasWidth;
      if (node.y > canvasHeight) node.y = 0;
      else if (node.y < 0) node.y = canvasHeight;
      
      // cursor attraction force
      if (localMouse.x != null && localMouse.y != null) {
        let dx = localMouse.x - node.x;
        let dy = localMouse.y - node.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < localMouse.radius) {
          const force = (localMouse.radius - distance) / localMouse.radius;
          node.x += dx * force * 0.02;
          node.y += dy * force * 0.02;
        }
      }
      
      nCtx.fillStyle = 'rgba(6, 182, 212, 0.6)';
      nCtx.beginPath();
      nCtx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      nCtx.fill();
    });
    
    // Draw link lines
    let activeConnectionsCount = 0;
    for (let i = 0; i < localNodes.length; i++) {
      for (let j = i + 1; j < localNodes.length; j++) {
        let dx = localNodes[i].x - localNodes[j].x;
        let dy = localNodes[i].y - localNodes[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < linkRange) {
          let opacity = (1 - (distance / linkRange)) * 0.25;
          nCtx.strokeStyle = `rgba(13, 148, 136, ${opacity})`;
          
          if (localMouse.x != null && localMouse.y != null) {
            let mDx = localMouse.x - localNodes[i].x;
            let mDy = localMouse.y - localNodes[i].y;
            let mDistance = Math.sqrt(mDx * mDx + mDy * mDy);
            if (mDistance < localMouse.radius) {
              nCtx.strokeStyle = `rgba(6, 182, 212, ${opacity * 1.5})`;
              activeConnectionsCount++;
            }
          }
          
          nCtx.lineWidth = 0.5;
          nCtx.beginPath();
          nCtx.moveTo(localNodes[i].x, localNodes[i].y);
          nCtx.lineTo(localNodes[j].x, localNodes[j].y);
          nCtx.stroke();
        }
      }
    }
    
    // Update count in diagnostics
    if (activePathsEl) {
      activePathsEl.innerText = `${activeConnectionsCount} links active`;
    }
    
    requestAnimationFrame(drawNodeMesh);
  }
  
  resizeLocalCanvas();
  window.addEventListener('resize', resizeLocalCanvas);
  drawNodeMesh();
}


// --- INTERSECTION OBSERVER FOR SCROLL EFFECTS ---
const scrollSections = document.querySelectorAll('.reveal-on-scroll');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -25% 0px', 
  threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      const id = entry.target.getAttribute('id');
      updateActiveNavLink(id);
      
      const header = entry.target.querySelector('.decrypt-header');
      if (header && !header.classList.contains('scrambled')) {
        scrambleText(header, header.innerText);
        header.classList.add('scrambled');
      }
      
      if (id === 'skills') {
        animateSkillsBars();
      }
      
      if (id === 'experience') {
        const timeline = entry.target.querySelector('.timeline');
        if (timeline) timeline.classList.add('visible');
      }
    }
  });
}, observerOptions);

scrollSections.forEach(section => {
  sectionObserver.observe(section);
});

function updateActiveNavLink(activeId) {
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${activeId}`) {
      link.classList.add('active');
    }
  });
  
  mobileNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${activeId}`) {
      link.classList.add('active');
    }
  });
}

function animateSkillsBars() {
  const bars = document.querySelectorAll('.skill-fill');
  bars.forEach(bar => {
    const widthVal = bar.getAttribute('data-width');
    bar.style.width = widthVal;
  });
}

// Handle smooth scroll clicks manual alignment
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    const scrollContainer = document.querySelector('.scroll-container');
    
    if (targetElement && scrollContainer) {
      playSuccess();
      
      const elementTop = targetElement.offsetTop;
      scrollContainer.scrollTo({
        top: elementTop - 15,
        behavior: 'smooth'
      });
      
      const cleanId = targetId.substring(1);
      updateActiveNavLink(cleanId);
    }
  });
});

// Track scroll container position for backup nav linkage
const scrollContainer = document.querySelector('.scroll-container');
if (scrollContainer) {
  scrollContainer.addEventListener('scroll', () => {
    if (scrollContainer.scrollTop < 100) {
      updateActiveNavLink('home');
    }
  });
}


// --- SECURE PACKET MESSAGE FORM DELAY ---
const contactForm = document.getElementById('secure-contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    formStatus.className = 'form-status-msg';
    formStatus.innerText = 'PACKING MESSAGE ENVELOPE [AES-256]...';
    formStatus.style.display = 'block';
    playBeep(480, 0.2);
    
    setTimeout(() => {
      formStatus.innerText = 'CONNECTING TO OVERLAY PEER RELAYS...';
      playBeep(560, 0.15);
    }, 900);
    
    setTimeout(() => {
      formStatus.innerText = 'MESSAGE PACKET TRANSMITTED & VERIFIED AT NODE hash:SHA256.';
      formStatus.classList.add('success');
      playSuccess();
      
      contactForm.reset();
    }, 2200);
  });
}


// --- SYSTEM TIMESTAMPS ---
setInterval(() => {
  const clock = document.getElementById('sys-clock');
  if (clock) {
    const d = new Date();
    clock.innerText = d.toTimeString().split(' ')[0];
  }
}, 1000);

setInterval(() => {
  const ping = document.getElementById('ping-value');
  if (ping) {
    const latency = Math.floor(Math.random() * 15) + 8;
    ping.innerText = latency + 'ms';
  }
}, 5000);
