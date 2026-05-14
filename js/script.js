// Navbar Scroll Effect using IntersectionObserver (More performant than 'scroll' event)
const navTrigger = document.createElement('div');
navTrigger.style.position = 'absolute';
navTrigger.style.top = '0';
navTrigger.style.height = '50px';
navTrigger.style.width = '1px';
navTrigger.style.pointerEvents = 'none';
document.body.prepend(navTrigger);

const navbar = document.getElementById('navbar');
const navScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}, { threshold: 0 });

navScrollObserver.observe(navTrigger);

// Scroll Reveal Animations with IntersectionObserver
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, {
    rootMargin: "0px",
    threshold: 0.1
});

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Active Nav Link highlighting with IntersectionObserver
const navLi = document.querySelectorAll(".nav-links .nav-link");
const sections = document.querySelectorAll("section");

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");
            navLi.forEach(li => {
                li.classList.remove("active");
                if (li.getAttribute("href") === `#${currentId}`) {
                    li.classList.add("active");
                }
            });
        }
    });
}, {
    rootMargin: "-20% 0px -60% 0px"
});

sections.forEach(section => navObserver.observe(section));


// Modal Logic
const modal = document.getElementById('orderModal');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

function openOrderModal(modelName = 'الإصدار الأول', price = 150000) {
    document.getElementById('selectedModelName').innerText = modelName;
    document.getElementById('selectedModelPrice').innerText = price.toLocaleString('en-US');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset to step 1
    step1.classList.add('active');
    step2.classList.remove('active');
    step3.classList.remove('active');
    
    // Clear inputs
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerCity').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('paymentRef').value = '';
}

function closeOrderModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextStep() {
    // Basic validation
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const city = document.getElementById('customerCity').value;
    
    if (!name || !phone || !city) {
        alert('الرجاء تعبئة الحقول المطلوبة (الاسم، الرقم، المحافظة)');
        return;
    }
    
    step1.classList.remove('active');
    step2.classList.add('active');
}

function prevStep() {
    step2.classList.remove('active');
    step1.classList.add('active');
}

function submitOrder() {
    const ref = document.getElementById('paymentRef').value;
    if (!ref) {
        alert('الرجاء إدخال رقم عملية التحويل لتأكيد الدفع');
        return;
    }
    
    // Simulate API Call
    const btn = document.querySelector('#step2 .btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'جاري التأكيد... <i class="bx bx-loader-alt bx-spin"></i>';
    btn.disabled = true;
    
    setTimeout(() => {
        step2.classList.remove('active');
        step3.classList.add('active');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
}

// Copy Number Functionality
function copyNumber() {
    const numberText = document.getElementById('payNumber').innerText;
    navigator.clipboard.writeText(numberText).then(() => {
        const hint = document.querySelector('.copy-hint');
        const originalText = hint.innerText;
        hint.innerText = 'تم النسخ بنجاح! ✨';
        hint.style.color = '#10b981';
        
        const box = document.querySelector('.number-box');
        box.style.borderColor = '#10b981';
        box.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        
        setTimeout(() => {
            hint.innerText = originalText;
            hint.style.color = '';
            box.style.borderColor = '';
            box.style.backgroundColor = '';
        }, 2000);
    });
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeOrderModal();
    }
});
