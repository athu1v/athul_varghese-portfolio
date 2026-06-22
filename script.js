/* ==========================================
   PREMIUM PORTFOLIO INTERACTION CONTROLLER
   ========================================== */

// Ensure script runs after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

  // --- BACKGROUND CANVAS (DISSOLVING Abstract tech wave grid) ---
  const bgCanvas = document.getElementById('background-canvas');
  if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    let gridPoints = [];
    const gridSpacing = 45;
    let mouse = { x: null, y: null, radius: 120 };

    function resizeBgCanvas() {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
      
      gridPoints = [];
      for (let x = 0; x < width + gridSpacing; x += gridSpacing) {
        for (let y = 0; y < height + gridSpacing; y += gridSpacing) {
          gridPoints.push({
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            angle: Math.random() * Math.PI * 2,
            speed: 0.15 + Math.random() * 0.2
          });
        }
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', resizeBgCanvas);
    resizeBgCanvas();

    let animationTime = 0;
    function animateBgMesh() {
      bgCtx.clearRect(0, 0, width, height);
      animationTime += 0.005;

      bgCtx.fillStyle = 'rgba(16, 185, 129, 0.015)';
      bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      bgCtx.lineWidth = 0.5;

      gridPoints.forEach(point => {
        // Subtle ambient wave motion
        point.angle += 0.01;
        let waveX = Math.sin(point.angle + animationTime) * 8;
        let waveY = Math.cos(point.angle + animationTime) * 8;

        let targetX = point.baseX + waveX;
        let targetY = point.baseY + waveY;

        // Mouse attraction/repel
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - targetX;
          let dy = mouse.y - targetY;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let force = (mouse.radius - dist) / mouse.radius;
            // Push points away slightly
            targetX -= (dx / dist) * force * 15;
            targetY -= (dy / dist) * force * 15;
          }
        }

        // Interpolate point towards current target
        point.x += (targetX - point.x) * 0.1;
        point.y += (targetY - point.y) * 0.1;

        // Draw small mesh dots
        bgCtx.beginPath();
        bgCtx.arc(point.x, point.y, 0.8, 0, Math.PI * 2);
        bgCtx.fill();
      });

      // Draw faint connections for grid neighbors (horizontal only for clean tech lines)
      bgCtx.beginPath();
      for (let i = 0; i < gridPoints.length; i++) {
        // Connect to next point on the right (if it shares same Y grid base)
        const next = gridPoints[i + 1];
        if (next && next.baseY === gridPoints[i].baseY && Math.abs(next.x - gridPoints[i].x) < gridSpacing * 1.5) {
          bgCtx.moveTo(gridPoints[i].x, gridPoints[i].y);
          bgCtx.lineTo(next.x, next.y);
        }
      }
      bgCtx.stroke();

      requestAnimationFrame(animateBgMesh);
    }
    animateBgMesh();
  }

  // --- EFFECT 11: HERO PARALLAX LAYER ---
  const heroParallaxBg = document.querySelector('.parallax-bg');
  if (heroParallaxBg) {
    window.addEventListener('scroll', () => {
      let scrollY = window.scrollY;
      // Shift background down slightly slower to simulate background distance depth
      heroParallaxBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    });
  }

  // --- EFFECT 18: TEXT SCROLL ON REVEAL ---
  const revealParagraph = document.querySelector('.reveal-paragraph');
  if (revealParagraph) {
    const rawText = revealParagraph.innerText;
    const words = rawText.split(' ');
    // Wrap each word in a custom reveal span
    revealParagraph.innerHTML = words.map(w => `<span class="reveal-word">${w}</span>`).join(' ');
    
    const wordSpans = revealParagraph.querySelectorAll('.reveal-word');
    
    function checkWordReveal() {
      const rect = revealParagraph.getBoundingClientRect();
      const winHeight = window.innerHeight;
      
      // Calculate scroll progress relative to the viewport height
      // 0.8: enters bottom area; 0.2: exits top area
      const triggerStart = winHeight * 0.85;
      const triggerEnd = winHeight * 0.15;
      
      const elementHeight = rect.height;
      const currentPos = rect.top;
      
      // Map progress from 0 (below screen) to 1 (passed screen)
      let progress = (triggerStart - currentPos) / (triggerStart - triggerEnd + elementHeight);
      progress = Math.max(0, Math.min(1, progress)); // clamp between 0 and 1
      
      // Scale progress to reveal index
      const revealThreshold = Math.floor(progress * wordSpans.length * 1.4 - wordSpans.length * 0.15);
      
      wordSpans.forEach((span, idx) => {
        if (idx <= revealThreshold) {
          span.classList.add('active');
        } else {
          span.classList.remove('active');
        }
      });
    }
    
    window.addEventListener('scroll', checkWordReveal);
    window.addEventListener('resize', checkWordReveal);
    checkWordReveal(); // Initial check
  }

  // --- EFFECT 7: STICKY SECTIONS INTERSECTION LINKS ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item');
  
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px', // trigger when section occupies viewport center
    threshold: 0.15
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, sectionObserverOptions);
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // --- SKILLS DYNAMIC BARS EXPANSION ---
  const skillBars = document.querySelectorAll('.skill-fill-line');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const widthVal = bar.getAttribute('data-width');
        bar.style.width = widthVal;
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => {
    skillObserver.observe(bar);
  });

  // --- EXPERIMENTAL NODE MESH CANVAS (Skills Side Graphic) ---
  const nodesCanvas = document.getElementById('nodes-canvas');
  if (nodesCanvas) {
    const nCtx = nodesCanvas.getContext('2d');
    let cWidth = 0;
    let cHeight = 0;
    let nodesList = [];
    const totalNodesCount = 30;
    const connectDistance = 85;
    let localMouse = { x: null, y: null, radius: 85 };

    function resizeLocalCanvas() {
      const containerRect = nodesCanvas.parentElement.getBoundingClientRect();
      cWidth = nodesCanvas.width = containerRect.width;
      cHeight = nodesCanvas.height = containerRect.height;
      
      nodesList = [];
      for (let i = 0; i < totalNodesCount; i++) {
        nodesList.push({
          x: Math.random() * cWidth,
          y: Math.random() * cHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
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

    window.addEventListener('resize', resizeLocalCanvas);
    resizeLocalCanvas();

    const activePathsEl = document.getElementById('nodes-active-paths');

    function drawNodeNetwork() {
      nCtx.clearRect(0, 0, cWidth, cHeight);
      
      // Update and draw nodes
      nodesList.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        // Edge bouncing
        if (node.x > cWidth || node.x < 0) node.vx *= -1;
        if (node.y > cHeight || node.y < 0) node.vy *= -1;

        // Cursor magnetic gravity force
        if (localMouse.x !== null && localMouse.y !== null) {
          let dx = localMouse.x - node.x;
          let dy = localMouse.y - node.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < localMouse.radius) {
            const pullForce = (localMouse.radius - distance) / localMouse.radius;
            node.x += dx * pullForce * 0.025;
            node.y += dy * pullForce * 0.025;
          }
        }

        nCtx.fillStyle = 'rgba(16, 185, 129, 0.65)';
        nCtx.beginPath();
        nCtx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        nCtx.fill();
      });

      // Connecting lines
      let activeConnections = 0;
      for (let i = 0; i < nodesList.length; i++) {
        for (let j = i + 1; j < nodesList.length; j++) {
          let dx = nodesList[i].x - nodesList[j].x;
          let dy = nodesList[i].y - nodesList[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectDistance) {
            let opacity = (1 - (distance / connectDistance)) * 0.22;
            nCtx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
            
            // Brighten connecting paths near user cursor
            if (localMouse.x !== null && localMouse.y !== null) {
              let mDx = localMouse.x - nodesList[i].x;
              let mDy = localMouse.y - nodesList[i].y;
              let mDistance = Math.sqrt(mDx * mDx + mDy * mDy);
              if (mDistance < localMouse.radius) {
                nCtx.strokeStyle = `rgba(52, 211, 153, ${opacity * 2.2})`;
                activeConnections++;
              }
            }

            nCtx.lineWidth = 0.6;
            nCtx.beginPath();
            nCtx.moveTo(nodesList[i].x, nodesList[i].y);
            nCtx.lineTo(nodesList[j].x, nodesList[j].y);
            nCtx.stroke();
          }
        }
      }

      if (activePathsEl) {
        activePathsEl.innerText = `${activeConnections} paths active`;
      }

      requestAnimationFrame(drawNodeNetwork);
    }
    drawNodeNetwork();
  }

  // --- EXPERIMENTAL TIMELINE SCROLL TRIGGER ---
  const timelineSection = document.getElementById('experience');
  if (timelineSection) {
    const timelineItems = timelineSection.querySelectorAll('.timeline-item');
    const timelineLineTrack = timelineSection.querySelector('.timeline-line-track');
    
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Smoothly animate the line track height down on reveal
          if (timelineLineTrack) {
            timelineLineTrack.style.height = '100%';
          }
        }
      });
    }, { threshold: 0.15 });

    timelineItems.forEach(item => {
      timelineObserver.observe(item);
    });
  }

  // --- WIDGET 1: PASSWORD COMPLEXITY AUDITOR ---
  const auditInput = document.getElementById('audit-input');
  const auditEntropy = document.getElementById('audit-entropy');
  const auditStrength = document.getElementById('audit-strength');
  const auditCracktime = document.getElementById('audit-cracktime');

  if (auditInput) {
    auditInput.addEventListener('input', () => {
      const val = auditInput.value;
      
      if (val.length === 0) {
        auditEntropy.innerText = "0 bits";
        auditEntropy.className = "result-val text-muted";
        auditStrength.innerText = "NONE";
        auditStrength.className = "result-val text-muted";
        auditCracktime.innerText = "Instantly (<0.01s)";
        auditCracktime.className = "result-val text-muted";
        return;
      }

      // Calculate character set pool size R
      let R = 0;
      if (/[a-z]/.test(val)) R += 26;
      if (/[A-Z]/.test(val)) R += 26;
      if (/[0-9]/.test(val)) R += 10;
      if (/[^a-zA-Z0-9]/.test(val)) R += 33; // Symbols pool approx size

      const entropy = Math.round(val.length * Math.log2(R));
      auditEntropy.innerText = `${entropy} bits`;

      const guesses = Math.pow(2, entropy);
      const secondsToCrack = guesses / 1e9; // 1 Billion guesses/sec hashing benchmark

      let timeText = "";
      let colorClass = "";
      let strengthText = "";

      if (entropy < 35) {
        strengthText = "WEAK";
        timeText = "Instantly (<0.01s)";
        colorClass = "text-accent"; // Reddish/Orange alert in original theme, we'll keep custom colors
        auditEntropy.style.color = '#f43f5e';
        auditStrength.style.color = '#f43f5e';
        auditCracktime.style.color = '#f43f5e';
      } else if (entropy < 55) {
        strengthText = "MODERATE";
        colorClass = "text-blue";
        auditEntropy.style.color = 'var(--blue-color)';
        auditStrength.style.color = 'var(--blue-color)';
        auditCracktime.style.color = 'var(--blue-color)';
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
        auditEntropy.style.color = 'var(--primary-color)';
        auditStrength.style.color = 'var(--primary-color)';
        auditCracktime.style.color = 'var(--primary-color)';
        const days = secondsToCrack / 86400;
        if (days < 365) {
          timeText = `${Math.round(days)} days`;
        } else if (days < 36500) {
          timeText = `${Math.round(days / 365)} years`;
        } else {
          timeText = "Centuries / Resistant";
        }
      }

      auditStrength.innerText = strengthText;
      auditCracktime.innerText = timeText;
    });
  }

  // --- WIDGET 2: SIMULATED OCR SCANNER WIDGET ---
  const ocrBtn = document.getElementById('trigger-ocr-btn');
  const ocrLaser = document.querySelector('.ocr-laser-line');
  const ocrOutput = document.getElementById('ocr-output-log');

  if (ocrBtn && ocrLaser && ocrOutput) {
    ocrBtn.addEventListener('click', () => {
      if (ocrLaser.classList.contains('sweeping')) return;

      ocrLaser.classList.add('sweeping');
      ocrOutput.innerText = "System: Initializing laser grid calibration...";
      ocrBtn.disabled = true;

      setTimeout(() => {
        ocrOutput.innerText = "System: Target locked. Scanning nutrition label vector metrics...";
      }, 900);

      setTimeout(() => {
        ocrOutput.innerText = "System: Parsing character matrix indexes [OCR Module ENG]...";
      }, 1900);

      setTimeout(() => {
        ocrLaser.classList.remove('sweeping');
        ocrBtn.disabled = false;

        const mockData = {
          status: "SUCCESS_DECRYPTED",
          fields_mapped: {
            item_type: "NUTRITION_FACTS",
            calories_count: "240 kcal",
            total_fat_grams: "8g",
            sodium_milligrams: "160mg",
            sugars_grams: "12g"
          },
          confidence_rating: "99.8%"
        };

        ocrOutput.innerHTML = `<pre style="line-height: 1.35; margin: 0; color: var(--primary-color);">${JSON.stringify(mockData, null, 2)}</pre>`;
      }, 3000);
    });
  }

  // --- TRANSMITTER PACKET FORM HANDLER ---
  const contactForm = document.getElementById('secure-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      formStatus.className = 'form-dispatch-status';
      formStatus.innerText = 'TRANSMITTING TRANSMISSION ENVELOPE [AES-256]...';
      formStatus.style.display = 'block';

      setTimeout(() => {
        formStatus.innerText = 'TRANSMITTED COMPROMISED PAYLOAD AND SYNCHRONIZED ROUTE PEERS.';
        formStatus.classList.add('success');
        contactForm.reset();
      }, 2000);
    });
  }

  // --- UTILITY SYSTEMS (Ping and Timestamps) ---
  const clockElement = document.getElementById('sys-clock');
  if (clockElement) {
    setInterval(() => {
      const now = new Date();
      clockElement.innerText = now.toTimeString().split(' ')[0];
    }, 1000);
  }

  const pingElement = document.getElementById('ping-value');
  if (pingElement) {
    setInterval(() => {
      const randPing = Math.floor(Math.random() * 12) + 6;
      pingElement.innerText = `${randPing}ms`;
    }, 4000);
  }

});
