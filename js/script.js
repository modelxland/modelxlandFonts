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
let selectedPaymentMethod = 'mobile-cash';

if (modal) {
    modal.innerHTML = `
        <div class="modal-container glass-panel order-modal-shell" role="dialog" aria-modal="true" aria-labelledby="paymentChoiceTitle">
            <div class="order-modal-topbar">
                <button class="modal-close order-modal-close" type="button" onclick="closeOrderModal()" aria-label="إغلاق">
                    <i class='bx bx-x'></i>
                </button>
                <button class="order-back-btn" type="button" onclick="goOrderBack()" aria-label="رجوع">
                    <span>رجوع</span>
                    <i class='bx bx-right-arrow-alt'></i>
                </button>
            </div>

            <div class="modal-body order-modal-body">
                <div class="step-content order-choice-step active" id="step1">
                    <div class="order-summary-panel">
                        <img src="images/drawer-3.jpg" alt="جرارات التخزين" class="order-summary-image">
                        <div class="order-summary-copy">
                            <h3 id="selectedModelName">جرارات التخزين</h3>
                            <ul class="order-price-list">
                                <li>
                                    <span class="price-dot"></span>
                                    <span class="order-price-label">ســــــعــــــر الـــمــنــتــج :</span>
                                    <strong class="order-price-value">$<span id="selectedModelPrice">11</span></strong>
                                </li>
                                <li>
                                    <span class="price-dot"></span>
                                    <span class="order-price-label">أجور الشحن والتغليف :</span>
                                    <strong class="order-price-value">$0</strong>
                                </li>
                                <li>
                                    <span class="price-dot"></span>
                                    <span class="order-price-label">الــمـــجــمــوع الـكــلــي :</span>
                                    <strong class="order-price-value">$<span id="selectedModelTotal">11</span></strong>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="order-divider"></div>

                    <h2 class="payment-method-title" id="paymentChoiceTitle">اختـر طريـقـة الدفــع :</h2>

                    <div class="payment-options-list" aria-label="طرق الدفع">
                        <button class="payment-opt-btn syriatel-mtn" type="button" onclick="selectPaymentMethod('mobile-cash')" aria-label="سيريتل كاش أو MTN كاش">
                            <span class="syriatel-side">
                                <img src="images/Syriatel-logo.png" alt="Syriatel">
                            </span>
                            <span class="mtn-side">
                                <img src="images/MTN-logo.png" alt="MTN">
                            </span>
                        </button>

                        <button class="payment-opt-btn card-option" type="button" onclick="selectPaymentMethod('card')">
                            <span class="credit-card-stack" aria-hidden="true">
                                <span class="credit-card-back"></span>
                                <span class="credit-card-front">
                                    <span class="credit-card-line"></span>
                                    <span class="credit-card-chip"></span>
                                    <span class="credit-card-marks"></span>
                                </span>
                            </span>
                            <span>Credit or Debit card</span>
                        </button>

                        <button class="payment-opt-btn sham-option" type="button" onclick="selectPaymentMethod('sham-cash')">
                            <img src="images/Sham-Cash.jpg" alt="Sham Cash">
                            <span>شــــام كاش</span>
                        </button>
                    </div>
                </div>

                <div class="step-content order-flow-step" id="step2">
                    <h3 class="modal-title text-center">معلومات التوصيل</h3>
                    <p class="modal-subtitle text-center">طريقة الدفع: <span id="selectedPaymentLabel" class="text-gradient font-bold">سيريتل / MTN كاش</span></p>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">الاسم الكامل</label>
                            <input type="text" class="form-input" id="customerName" placeholder="الاسم الثلاثي">
                        </div>
                        <div class="form-group">
                            <label class="form-label">رقم الموبايل</label>
                            <input type="tel" class="form-input" id="customerPhone" placeholder="09xxxxxxxxx">
                        </div>
                        <div class="form-group">
                            <label class="form-label">المحافظة</label>
                            <select class="form-input" id="customerCity">
                                <option value="">اختر المحافظة...</option>
                                <option value="دمشق">دمشق</option>
                                <option value="ريف دمشق">ريف دمشق</option>
                                <option value="حلب">حلب</option>
                                <option value="حمص">حمص</option>
                                <option value="حماة">حماة</option>
                                <option value="اللاذقية">اللاذقية</option>
                                <option value="طرطوس">طرطوس</option>
                                <option value="درعا">درعا</option>
                                <option value="السويداء">السويداء</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">العنوان التفصيلي</label>
                            <input type="text" class="form-input" id="customerAddress" placeholder="المنطقة، الشارع، البناء...">
                        </div>
                    </div>

                    <button class="btn-primary w-100 mt-4" type="button" onclick="nextStep()">
                        متابعة للدفع
                        <i class='bx bx-left-arrow-alt'></i>
                    </button>
                </div>

                <div class="step-content order-flow-step" id="step3">
                    <div class="payment-card glass-panel-inner">
                        <img src="images/Syriatel-logo.png" alt="Syriatel Cash" class="pay-logo" id="payLogo">
                        <h4 class="pay-title" id="payTitle">الدفع عبر سيريتل / MTN كاش</h4>
                        <p class="pay-hint">يرجى تحويل مبلغ <strong class="text-gradient text-lg">$<span id="paymentAmount">11</span></strong> إلى الرقم التالي:</p>

                        <div class="number-box" onclick="copyNumber()">
                            <span class="number-val" id="payNumber">0930000000</span>
                            <i class='bx bx-copy'></i>
                        </div>
                        <p class="copy-hint">اضغط لنسخ الرقم</p>
                    </div>

                    <div class="form-group mt-4">
                        <label class="form-label" id="paymentRefLabel">رقم عملية التحويل (Reference Number)</label>
                        <input type="text" class="form-input text-center font-bold" id="paymentRef" placeholder="مثال: 12345678">
                    </div>

                    <div class="btn-group">
                        <button class="btn-secondary flex-1" type="button" onclick="prevStep()">رجوع</button>
                        <button class="btn-primary flex-2 submit-order-btn" type="button" onclick="submitOrder()">تأكيد الطلب <i class='bx bx-check-circle'></i></button>
                    </div>
                </div>

                <div class="step-content text-center order-flow-step" id="step4">
                    <div class="success-animation">
                        <div class="checkmark-circle">
                            <i class='bx bx-check'></i>
                        </div>
                    </div>
                    <h3 class="success-title">تم استلام طلبك بنجاح!</h3>
                    <p class="success-text">سنقوم بمعالجة طلبك وشحنه خلال 1 إلى 3 أيام عمل.<br>سنتواصل معك قريباً للتأكيد.</p>
                    <button class="btn-secondary mt-4 w-100" type="button" onclick="closeOrderModal()">العودة للمتجر</button>
                </div>
            </div>
        </div>
    `;

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOrderModal();
        }
    });
}

function normalizeOrderPrice(price) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        return 11;
    }

    return numericPrice > 999 ? 11 : numericPrice;
}

function formatOrderPrice(price) {
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function setOrderStep(stepId) {
    document.querySelectorAll('#orderModal .step-content').forEach(step => {
        step.classList.toggle('active', step.id === stepId);
    });

    const shell = modal.querySelector('.order-modal-shell');
    if (shell) {
        shell.dataset.step = stepId;
    }
}

function openOrderModal(modelName = 'جرارات التخزين', price = 11) {
    const displayPrice = normalizeOrderPrice(price);
    const formattedPrice = formatOrderPrice(displayPrice);

    document.getElementById('selectedModelName').innerText = modelName;
    document.getElementById('selectedModelPrice').innerText = formattedPrice;
    document.getElementById('selectedModelTotal').innerText = formattedPrice;
    document.getElementById('paymentAmount').innerText = formattedPrice;

    modal.classList.add('active');
    document.documentElement.classList.add('order-modal-open');
    document.body.classList.add('order-modal-open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    selectedPaymentMethod = 'mobile-cash';
    updatePaymentDetails();
    setOrderStep('step1');

    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerCity').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('paymentRef').value = '';
}

function closeOrderModal() {
    modal.classList.remove('active');
    document.documentElement.classList.remove('order-modal-open');
    document.body.classList.remove('order-modal-open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = 'auto';
}

function goOrderBack() {
    const activeStep = modal.querySelector('.step-content.active')?.id;

    if (activeStep === 'step4') {
        setOrderStep('step3');
        return;
    }

    if (activeStep === 'step3') {
        setOrderStep('step2');
        return;
    }

    if (activeStep === 'step2') {
        setOrderStep('step1');
        return;
    }

    closeOrderModal();
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    updatePaymentDetails();
    setOrderStep('step2');
}

function updatePaymentDetails() {
    const paymentMap = {
        'mobile-cash': {
            label: 'سيريتل / MTN كاش',
            title: 'الدفع عبر سيريتل / MTN كاش',
            logo: 'images/Syriatel-logo.png',
            refLabel: 'رقم عملية التحويل (Reference Number)',
            placeholder: 'مثال: 12345678'
        },
        card: {
            label: 'Credit or Debit card',
            title: 'الدفع عبر البطاقة',
            logo: '',
            refLabel: 'رقم عملية الدفع (Reference Number)',
            placeholder: 'مثال: 12345678'
        },
        'sham-cash': {
            label: 'شام كاش',
            title: 'الدفع عبر شام كاش',
            logo: 'images/Sham-Cash.jpg',
            refLabel: 'رقم عملية التحويل (Reference Number)',
            placeholder: 'مثال: 12345678'
        }
    };

    const details = paymentMap[selectedPaymentMethod] || paymentMap['mobile-cash'];
    const label = document.getElementById('selectedPaymentLabel');
    const payTitle = document.getElementById('payTitle');
    const payLogo = document.getElementById('payLogo');
    const paymentRefLabel = document.getElementById('paymentRefLabel');
    const paymentRef = document.getElementById('paymentRef');

    if (label) label.innerText = details.label;
    if (payTitle) payTitle.innerText = details.title;
    if (paymentRefLabel) paymentRefLabel.innerText = details.refLabel;
    if (paymentRef) paymentRef.placeholder = details.placeholder;

    if (payLogo) {
        if (details.logo) {
            payLogo.src = details.logo;
            payLogo.style.display = '';
        } else {
            payLogo.style.display = 'none';
        }
    }
}

function nextStep() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const city = document.getElementById('customerCity').value;

    if (!name || !phone || !city) {
        alert('الرجاء تعبئة الحقول المطلوبة (الاسم، الرقم، المحافظة)');
        return;
    }

    setOrderStep('step3');
}

function prevStep() {
    setOrderStep('step2');
}

function submitOrder() {
    const ref = document.getElementById('paymentRef').value;
    if (!ref) {
        alert('الرجاء إدخال رقم عملية الدفع لتأكيد الطلب');
        return;
    }

    const btn = document.querySelector('#step3 .submit-order-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'جاري التأكيد... <i class="bx bx-loader-alt bx-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
        setOrderStep('step4');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 900);
}

// Copy Number Functionality
function copyNumber() {
    const numberText = document.getElementById('payNumber').innerText;
    navigator.clipboard.writeText(numberText).then(() => {
        const hint = document.querySelector('.copy-hint');
        const originalText = hint.innerText;
        hint.innerText = 'تم النسخ بنجاح!';
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
