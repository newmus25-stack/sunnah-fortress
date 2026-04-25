// Append to app.js - دالة معالجة نموذج النشرة البريدية

// ============================================
// 📧 معالج نموذج النشرة البريدية
// ============================================

/**
 * دالة معالجة الاشتراك في النشرة البريدية
 * تُضاف إلى app.js بعد DOMContentLoaded
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();

    // الحصول على عناصر النموذج
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    // حفظ النص الأصلي للزر
    const originalBtnText = submitBtn.textContent;

    // التحقق من وجود البريد
    if (!email) {
        showNotification('❌ الرجاء إدخال بريد إلكتروني', 'error');
        return;
    }

    // إظهار حالة التحميل
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ جاري الاشتراك...';

    // إضافة المشترك
    if (newsletter) {
        newsletter.addSubscriber(email).then(result => {
            if (result.success) {
                showNotification(result.message, 'success');
                emailInput.value = ''; // مسح الحقل
            } else {
                showNotification(result.message, 'warning');
            }
        }).catch(error => {
            console.error('خطأ في الاشتراك:', error);
            showNotification('❌ حدث خطأ في الاشتراك', 'error');
        }).finally(() => {
            // إعادة حالة الزر
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    } else {
        console.warn('نظام النشرة غير متوفر');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

/**
 * عرض إشعار للمستخدم
 */
function showNotification(message, type = 'info') {
    // إزالة الإشعارات السابقة
    const existingNotifications = document.querySelectorAll('.newsletter-notification');
    existingNotifications.forEach(n => n.remove());

    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `newsletter-notification notification-${type}`;
    notification.textContent = message;

    // تطبيق الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#dcfce7' : type === 'error' ? '#fee2e2' : '#fef3c7'};
        border-right: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
        border-radius: 4px;
        color: #333;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
        font-family: 'Tajawal', Arial, sans-serif;
        direction: rtl;
    `;

    document.body.appendChild(notification);

    // حذف الإشعار بعد 5 ثواني
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * إضافة أنيميشن للإشعارات
 */
function addNotificationStyles() {
    if (document.getElementById('newsletter-styles')) return;

    const style = document.createElement('style');
    style.id = 'newsletter-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        .newsletter-notification {
            font-size: 0.95rem;
            font-weight: 500;
        }

        @media (max-width: 768px) {
            .newsletter-notification {
                right: 10px !important;
                left: 10px !important;
                top: 10px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 🔗 ربط النموذج عند تحميل الصفحة
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // إضافة الأنماط
    addNotificationStyles();

    // الانتظار قليلاً للتأكد من تحميل newsletter-config.js
    setTimeout(() => {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm && window.newsletter) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
            console.log('✅ تم تفعيل نظام النشرة البريدية');
        } else if (!window.newsletter) {
            console.warn('⚠️ تنبيه: تأكد من تحميل newsletter-config.js قبل app.js');
        }
    }, 100);
});

// ============================================
// 📱 دعم إلغاء الاشتراك من الرابط
// ============================================

window.addEventListener('load', () => {
    // البحث عن معامل unsub في الرابط
    const params = new URLSearchParams(window.location.search);
    const unsubToken = params.get('unsub');

    if (unsubToken && window.newsletter) {
        // البحث عن المشترك برمز إلغاء الاشتراك
        const subscriber = window.newsletter.subscribers.find(
            s => s.confirmationToken === unsubToken
        );

        if (subscriber) {
            window.newsletter.unsubscribe(subscriber.email);
            showNotification('✅ تم إلغاء اشتراكك بنجاح', 'success');
        }
    }
});
