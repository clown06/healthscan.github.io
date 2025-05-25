// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 视频上传功能
    const videoUploadForm = document.getElementById('video-upload-form');
    if (videoUploadForm) {
        const fileInput = document.getElementById('video-file');
        const fileName = document.getElementById('file-name');
        const uploadBtn = document.getElementById('upload-btn');
        const progressContainer = document.querySelector('.progress-container');
        const progressBar = document.getElementById('upload-progress');
        const progressText = document.querySelector('.progress-text');
        const uploadMessage = document.getElementById('upload-message');
        
        // 显示选择的文件名
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
                // 验证文件类型和大小
                const fileType = this.files[0].type;
                const fileSize = this.files[0].size / (1024 * 1024); // 转换为MB
                
                if (!fileType.startsWith('video/')) {
                    uploadMessage.textContent = '请选择视频文件';
                    uploadMessage.className = 'upload-message error';
                    uploadBtn.disabled = true;
                } else if (fileSize > 500) {
                    uploadMessage.textContent = '文件大小超过500MB限制';
                    uploadMessage.className = 'upload-message error';
                    uploadBtn.disabled = true;
                } else {
                    uploadMessage.textContent = '';
                    uploadMessage.className = 'upload-message';
                    uploadBtn.disabled = false;
                }
            } else {
                fileName.textContent = '未选择文件';
            }
        });
        
        // 处理表单提交
        videoUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 检查是否选择了文件
            if (fileInput.files.length === 0) {
                uploadMessage.textContent = '请选择要上传的视频文件';
                uploadMessage.className = 'upload-message error';
                return;
            }
            
            // 检查是否同意条款
            const consentCheckbox = document.getElementById('consent');
            if (!consentCheckbox.checked) {
                uploadMessage.textContent = '请同意隐私条款';
                uploadMessage.className = 'upload-message error';
                return;
            }
            
            // 显示进度条
            progressContainer.style.display = 'block';
            uploadBtn.disabled = true;
            
            // 模拟上传进度（实际项目中应替换为真实的上传逻辑）
            let progress = 0;
            const interval = setInterval(function() {
                progress += 5;
                progressBar.style.width = progress + '%';
                progressText.textContent = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    uploadMessage.textContent = '上传成功！我们的系统将分析您的视频并提供评估结果。';
                    uploadMessage.className = 'upload-message success';
                    setTimeout(() => {
                        progressContainer.style.display = 'none';
                        uploadBtn.disabled = false;
                    }, 2000);
                }
            }, 200);
            
            /* 
            // 实际项目中的上传代码示例
            const formData = new FormData(videoUploadForm);
            fetch('/api/upload-video', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                uploadMessage.textContent = data.message;
                uploadMessage.className = 'upload-message success';
            })
            .catch(error => {
                uploadMessage.textContent = '上传失败：' + error.message;
                uploadMessage.className = 'upload-message error';
            })
            .finally(() => {
                progressContainer.style.display = 'none';
                uploadBtn.disabled = false;
            });
            */
        });
    }
    
    // 检查是否有保存的滚动位置并恢复
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition && !window.location.hash) {
        setTimeout(() => {
            window.scrollTo({
                top: parseInt(savedScrollPosition),
                behavior: 'auto'
            });
        }, 100);
        sessionStorage.removeItem('scrollPosition');
    }
    
    // 检查是否有目标区域需要滚动到
    const targetSection = sessionStorage.getItem('targetSection');
    if (targetSection) {
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 200);
        }
        sessionStorage.removeItem('targetSection');
    }
    
    // 为详情页面中的返回按钮添加事件监听器
    const returnButtons = document.querySelectorAll('.btn.btn-secondary');
    returnButtons.forEach(button => {
        if (button.textContent.includes('返回服务列表') || button.textContent.includes('返回技术列表')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                // 保存当前页面的URL，用于标识来源页面
                sessionStorage.setItem('sourcePageUrl', window.location.href);
                // 保存目标锚点位置
                const targetSection = href.split('#')[1];
                sessionStorage.setItem('targetSection', targetSection);
                window.location.href = href;
            });
        }
    })
    // 导航菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // 骨架动画背景视差效果
    const skeletonBg = document.querySelector('.hero-skeleton-bg');
    if (skeletonBg) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const heroSection = document.querySelector('.hero');
            if (scrollY <= heroSection.offsetHeight) {
                skeletonBg.style.transform = `translateY(${scrollY * 0.4}px)`;
            }
        });
    }
    
    // 添加打字机效果到hero标题
    const heroTitle = document.querySelector('.hero-content h1 .highlight');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 500);
    }
    
    // 添加数字计数器动画
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            counter.textContent = '0';
            
            const updateCounter = () => {
                const current = parseInt(counter.textContent);
                const increment = Math.ceil(target / 20);
                
                if (current < target) {
                    counter.textContent = Math.min(current + increment, target);
                    setTimeout(updateCounter, 100);
                }
            };
            
            // 当元素进入视口时开始计数
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(updateCounter, 500);
                    observer.disconnect();
                }
            });
            
            observer.observe(counter);
        });
    }
    
    // 导航链接点击后关闭菜单
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });
    
    // 为服务和技术卡片的查看详情链接添加事件监听器
    const detailLinks = document.querySelectorAll('.service-item a.btn-primary, .tech-card');
    // 移除保存滚动位置的功能，让页面跳转后保持在顶部
    // detailLinks.forEach(link => {
    //     link.addEventListener('click', function() {
    //         // 保存当前滚动位置到会话存储
    //         sessionStorage.setItem('scrollPosition', window.pageYOffset);
    //     });
    // });
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
        }
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 导航链接激活状态
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // 初始化设置激活状态
    setActiveNavLink();
    
    // 表单提交处理
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 这里可以添加表单验证和提交逻辑
            alert('感谢您的留言！我们会尽快回复您。');
            this.reset();
        });
    }
    
    // 为服务和技术详情页的返回按钮添加事件处理
    const detailPageReturnButtons = document.querySelectorAll('a[href^="../index.html#"]');
    detailPageReturnButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').split('#')[1];
            sessionStorage.setItem('scrollPosition', document.querySelector('#' + targetSection) ? document.querySelector('#' + targetSection).offsetTop - 80 : 0);
            window.location.href = '../index.html';
        });
    });
    
    // 为返回技术列表按钮添加事件处理
    const returnToTechButton = document.getElementById('return-to-tech');
    if (returnToTechButton) {
        returnToTechButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').split('#')[1];
            sessionStorage.setItem('scrollPosition', document.querySelector('#' + targetSection) ? document.querySelector('#' + targetSection).offsetTop - 80 : 0);
            window.location.href = '../index.html';
        });
    }
});