// newsletter-config.js - Newsletter Management System

/**
 * نظام إدارة النشرة البريدية
 * يوفر: إضافة مشتركين، إلغاء اشتراك، إحصائيات، تصدير، نسخة احتياطية
 */
class Newsletter {
    constructor() {
        this.storageKey = 'newsletter_subscribers';
        this.subscribers = this.loadSubscribers();
    }

    // تحميل المشتركين من localStorage
    loadSubscribers() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // حفظ المشتركين في localStorage
    saveSubscribers() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.subscribers));
    }

    // إضافة مشترك جديد
    addSubscriber(email) {
        return new Promise((resolve) => {
            const existing = this.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
            
            if (existing) {
                resolve({ success: false, message: '❌ هذا البريد مسجل مسبقاً' });
                return;
            }

            const subscriber = {
                email: email.trim(),
                subscribedAt: new Date().toISOString(),
                confirmed: true,
                confirmationToken: this.generateToken()
            };

            this.subscribers.push(subscriber);
            this.saveSubscribers();
            resolve({ success: true, message: '✅ تم الاشتراك بنجاح!' });
        });
    }

    // إلغاء اشتراك
    unsubscribe(email) {
        this.subscribers = this.subscribers.filter(s => s.email.toLowerCase() !== email.toLowerCase());
        this.saveSubscribers();
    }

    // الحصول على الإحصائيات
    getStats() {
        const total = this.subscribers.length;
        const confirmed = this.subscribers.filter(s => s.confirmed).length;
        const pending = total - confirmed;
        const percentage = total > 0 ? Math.round((confirmed / total) * 100) : 0;

        return { total, confirmed, pending, percentage };
    }

    // تصدير كـ CSV
    exportAsCSV() {
        const headers = ['البريد الإلكتروني', 'تاريخ الاشتراك', 'الحالة'];
        const rows = this.subscribers.map(s => [
            s.email,
            new Date(s.subscribedAt).toLocaleDateString('ar-EG'),
            s.confirmed ? 'مؤكد' : 'قيد الانتظار'
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    // إنشاء نسخة احتياطية
    createBackup() {
        const backup = {
            date: new Date().toISOString(),
            subscribers: this.subscribers
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `newsletter_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // إرسال بريد جماعي للمشتركين المؤكدين
    sendBulkEmail(subject, message) {
        const confirmedEmails = this.subscribers
            .filter(s => s.confirmed)
            .map(s => s.email);

        console.log('إرسال إلى:', confirmedEmails.length, 'مشترك');
        console.log('الموضوع:', subject);
        console.log('الرسالة:', message);

        // في بيئة حقيقية هنا يتم ربط مع خدمة بريدية
        alert(`✅ تم تجهيز البريد للإرسال إلى ${confirmedEmails.length} مشترك`);
    }

    // إنشاء رمز عشوائي
    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

// تهيئة النظام
window.newsletter = new Newsletter();
console.log('✅ تم تحميل نظام النشرة البريدية');

// ============================================
// 📊 نظام الإحصائيات
// ============================================
const Stats = {
    key: 'site_stats',
    
    init() {
        const data = this.getData();
        data.views = (data.views || 0) + 1;
        data.lastVisit = new Date().toISOString();
        data.browser = this.getBrowser();
        data.country = 'مصر'; // يعتمد على IP
        this.save(data);
        
        // إرسال لـ analytics خارجي (اختياري)
        this.sendToAnalytics(data);
    },
    
    getData() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : { views: 0, visitors: [] };
    },
    
    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    },
    
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'أخرى';
    },
    
    sendToAnalytics(data) {
        // يمكن إضافة كودanalytics هنا
        console.log('إحصائيات:', data);
    },
    
    getStats() {
        const data = this.getData();
        return {
            views: data.views || 0,
            uniqueVisitors: data.visitors?.length || 0,
            browsers: this.getBrowserStats(data.visitors),
            countries: this.getCountryStats(data.visitors)
        };
    },
    
    getBrowserStats(visitors) {
        if (!visitors) return {};
        const stats = {};
        visitors.forEach(v => {
            stats[v.browser] = (stats[v.browser] || 0) + 1;
        });
        return stats;
    },
    
    getCountryStats(visitors) {
        if (!visitors) return {};
        const stats = {};
        visitors.forEach(v => {
            stats[v.country] = (stats[v.country] || 0) + 1;
        });
        return stats;
    }
};

// تشغيل الإحصائيات
Stats.init();
window.siteStats = Stats;