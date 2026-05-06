import { useState, useEffect, useCallback } from 'react';

// ======================== DATA ========================

interface Reference {
  id: number;
  title: string;
  url: string;
}

const references: Reference[] = [
  { id: 1, title: "الحداثة وموقفها من السنة (دكتوراه) - د. الحارث فخري عيسى - مصورات عبد الرحمن النجدي", url: "https://www.moswarat.com/books_view_1719.html" },
  { id: 2, title: "شبهات الحداثيين العرب حول تدوين السنة النبوية والرد عليها - منتدى العلماء", url: "https://www.msf-online.com/%D8%B4%D8%A8%D9%87%D8%A7%D8%AA-%D8%A7%D9%84%D8%AD%D8%AF%D8%A7%D8%AB%D9%8A%D9%8A%D9%86-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8-%D8%AD%D9%88%D9%84-%D8%AA%D8%AF%D9%88%D9%8A%D9%86-%D8%A7%D9%84%D8%B3%D9%86%D8%A9/" },
  { id: 3, title: "الحداثيون وآراءهم في السيرة النبوية | شبكة الروّاد الإلكترونية", url: "https://www.rowwad.net/home/blog/37" },
  { id: 4, title: "القراءة الحداثية للسنة النبوية عرض ونقد - ASJP", url: "https://asjp.cerist.dz/en/downArticle/834/2/1/190244" },
  { id: 5, title: "الأسس الفلسفية للحداثة", url: "https://maktab-fiqhi.com/news/photo/1394693286aosos-flsfia_2.pdf" },
  { id: 6, title: "الحداثة بين التاريخ والفلسفة - مجلة رواد الإبداع", url: "https://scpm.site/archives/1772" },
  { id: 7, title: "تأويلات الحداثيين في فهم النصوص وتوظيفها بدعوى المقاصد الشرعية - AL-ZAYTOONAH OJMS", url: "https://journals.zuj.edu.jo/zujjls/Published-Papers/55_2.pdf" },
  { id: 8, title: "دراسة نقدية - التوظيف العلماني لأسباب النزول", url: "https://ia800504.us.archive.org/33/items/20190731_20190731_1719/%D8%A7%D9%84%D8%AA%D9%88%D8%B8%D9%8A%D9%82%20%D8%A7%D9%84%D8%B9%D9%84%D9%85%D8%A7%D9%86%D9%8A%20%D9%84%D8%A7%D9%94%D8%B3%D8%A8%D8%A7%D8%A8%20%D8%A7%D9%84%D9%86%D8%B2%D9%88%D9%84-.pdf" },
  { id: 9, title: "موقف الحداثيين من نشأة علم أصول الفقه", url: "https://archives.ju.edu.jo/index.php/law/article/download/14336/9355/47661" },
  { id: 10, title: "أنسنة النص عند الحداثيين - الاتحاد العالمي لعلماء المسلمين", url: "https://iumsonline.org/ar/ContentDetails.aspx?ID=21455" },
  { id: 11, title: "كلام عن الدين والحداثة - المركز الإسلامي للدراسات الاستراتيجية", url: "https://www.iicss.iq/files/investigations/37i5w32u.pdf" },
  { id: 12, title: "دروس في الفلسفة الغربية الحديثة - جامعة سعيدة الدكتور مولاي الطاهر", url: "https://www.univ-saida.dz/ssh/wp-content/uploads/sites/9/2021/11/%D8%A7%D9%84%D9%81%D9%84%D8%B3%D9%81%D8%A9-%D8%A7%D9%84%D8%BA%D8%B1%D8%A8%D9%8A%D8%A9-%D8%A8%D9%88%D8%B4%D9%86%D8%A7%D9%82%D9%87-%D8%B3%D8%AD%D8%A7%D8%A8%D9%87.pdf" },
  { id: 13, title: "الحداثة وأثرها في تعطيل مقاصد السنة النبوية", url: "https://www.alsunan.com/wp-content/uploads/2018/02/%D8%A7%D9%84%D8%AD%D8%AF%D8%A7%D8%AB%D8%A9-%D9%88%D8%A3%D8%AB%D8%B1%D9%87%D8%A7-%D9%81%D9%8A-%D8%AA%D8%B9%D8%B7%D9%8A%D9%84-%D9%85%D9%82%D8%A7%D8%B5%D8%AF-%D8%A7%D9%84%D8%B3%D9%86%D8%A9-%D8%A7%D9%84%D9%86%D8%A8%D9%88%D9%8A%D8%A9.pdf" },
  { id: 14, title: "دراسات وأبحاث في الفلسفة الغربية الحديثة والمعاصرة - جامعة المسيلة", url: "https://www.univ-msila.dz/site/wp-content/uploads/2024/08/%D8%AF%D8%B1%D8%A7%D8%B3%D8%A7%D8%AA-%D9%88-%D8%A7%D8%A8%D8%AD%D8%A7%D8%AB-%D9%81%D9%8A-%D8%A7%D9%84%D9%81%D9%84%D8%B3%D9%81%D8%A9-%D8%A7%D9%84%D8%BA%D8%B1%D8%A8%D9%8A%D8%A9-%D8%A7%D9%84%D8%AD%D8%AF%D9%8A%D8%AB%D8%A9-%D9%88%D8%A7%D9%84%D9%85%D8%B9%D8%A7%D8%B5%D8%B1%D8%A9.pdf" },
  { id: 15, title: "القراءة الحداثية للنص الديني - ASJP", url: "https://asjp.cerist.dz/en/downArticle/238/10/3/162760" },
  { id: 16, title: "السياق الفلسفي والتاريخي للحداثة", url: "https://archives.univ-eloued.dz/bitstreams/77b5d0b7-f547-46c1-9c11-bc3147249753/download" },
  { id: 17, title: "الحداثيون والسنة النبوية - إسلام أون لاين", url: "https://islamonline.net/%D8%A7%D9%84%D8%AD%D8%AF%D8%A7%D8%AB%D9%8A%D9%88%D9%86-%D9%88%D8%A7%D9%84%D8%B3%D9%86%D8%A9-%D8%A7%D9%84%D9%86%D8%A8%D9%88%D9%8A%D8%A9/" },
  { id: 18, title: "الانحراف العقدي في القراءة المعاصرة - محمد شحرور أنموذجاً - مجلة العلوم الإسلامية", url: "https://isscj.edu.iq/api/uploads/Book_4_697_724_95a76657a6.pdf" },
  { id: 19, title: "مطالعة كتاب نصر حامد أبو زيد - المركز الإسلامي للدراسات الاستراتيجية", url: "https://www.iicss.iq/?id=3394" },
  { id: 20, title: "قراءة في كتاب مفهوم النص الديني لنصر حامد أبو زيد - ASJP", url: "https://asjp.cerist.dz/en/downArticle/146/9/1/134024" },
  { id: 21, title: "القراءة الحداثية للسنة النبوية عرض ونقد لأطروحة محمد شحرور", url: "https://journals.asianindexing.com/article.php?id=1682060055167_1827" },
  { id: 22, title: "القراءة الحداثية للسنة النبوية عرض ونقد لأطروحة محمد شحرور - Asian Research Journals Index", url: "https://journals.asianindexing.com/article.php?id=1682060055167_1827" },
  { id: 23, title: "منهج النقد الحديثي وأثره على التاريخ واللغة - الرابطة المحمدية للعلماء", url: "https://www.arrabita.ma/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%86%D9%82%D8%AF-%D8%A7%D9%84%D8%AD%D8%AF%D9%8A%D8%AB%D9%8A-%D9%88%D8%A3%D8%AB%D8%B1%D9%87-%D8%B9%D9%84%D9%89-%D8%A7%D9%84%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE-%D9%88/" },
  { id: 24, title: "أساليب الحداثيين في الطعن في السنة النبوية - شبكة الألوكة", url: "https://www.alukah.net/culture/0/156205/%D8%A3%D8%B3%D8%A7%D9%84%D9%8A%D8%A8-%D8%A7%D9%84%D8%AD%D8%AF%D8%A7%D8%AB%D9%8A%D9%8A%D9%86-%D9%81%D9%8A-%D8%A7%D9%84%D8%B7%D8%B9%D9%86-%D9%81%D9%8A-%D8%A7%D9%84%D8%B3%D9%86%D8%A9-%D8%A7%D9%84%D9%86%D8%A8%D9%88%D9%8A%D8%A9-6/" },
  { id: 25, title: "آراء محمد شحرور في السنة من خلال كتابه - دراسة تحليلية نقدية", url: "https://tadween.sa/documents/researchDatabase/KtOvPF.pdf" },
  { id: 26, title: "مطاعن الحداثيين في السنة النبوية - مركز تدوين للبحوث والدراسات الحديثية", url: "https://tadween.sa/documents/researchDatabase/jme11X.pdf" },
];

const tableOfContents = [
  { id: "intro", label: "مقدمة الدراسة", icon: "📖" },
  { id: "section-1", label: "الفلسفة البنيوية للحداثة", icon: "🏛️" },
  { id: "section-2", label: "الجذور الفلسفية الغربية", icon: "🌍" },
  { id: "section-3", label: "السنة النبوية كمركز للاشتباك", icon: "⚡" },
  { id: "section-4", label: "نقد المنهج الألسني والتاريخي", icon: "🔬" },
  { id: "section-5", label: "نماذج من أقطاب الحداثة", icon: "👥" },
  { id: "section-6", label: "المنهج الأكاديمي في الرد", icon: "🎓" },
  { id: "section-7", label: "التحديات المعاصرة وآثارها", icon: "⚠️" },
  { id: "section-8", label: "استشراف جسور الفهم", icon: "🌉" },
  { id: "section-9", label: "الخلاصات والنتائج", icon: "✅" },
  { id: "references", label: "المصادر والمراجع", icon: "📚" },
];

// ======================== HELPER COMPONENTS ========================

function Ref({ ids }: { ids: number[] }) {
  const scrollToRef = (id: number) => {
    const el = document.getElementById(`ref-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-yellow-200');
      setTimeout(() => el.classList.remove('bg-yellow-200'), 2000);
    }
  };

  return (
    <span className="inline-flex gap-0.5 mr-1">
      {ids.map((id) => (
        <sup
          key={id}
          onClick={() => scrollToRef(id)}
          className="ref-link"
          title={references.find(r => r.id === id)?.title}
        >
          {id}
        </sup>
      ))}
    </span>
  );
}

function SectionTitle({ id, children, icon }: { id: string; children: React.ReactNode; icon?: string }) {
  return (
    <div id={id} className="scroll-mt-24 mb-8">
      <div className="flex items-center gap-3 mb-2">
        {icon && <span className="text-3xl">{icon}</span>}
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-emerald-900 leading-relaxed">
          {children}
        </h2>
      </div>
      <div className="h-1 w-24 bg-gradient-to-l from-amber-600 to-emerald-800 rounded-full"></div>
    </div>
  );
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading text-xl font-bold text-emerald-800 mt-8 mb-4 flex items-center gap-2">
      <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
      {children}
    </h3>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gray-800 leading-[2.2] text-lg mb-4 text-justify font-body">
      {children}
    </p>
  );
}

function QuoteBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="custom-quote my-6">
      {children}
    </div>
  );
}

// ======================== MAIN COMPONENTS ========================

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      setProgress(totalHeight > 0 ? (scrollPos / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="reading-progress" style={{ width: `${progress}%` }} />;
}

function Navbar({ onToggleSidebar, isSidebarOpen }: { onToggleSidebar: () => void; isSidebarOpen: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 text-emerald-800 transition-colors"
          aria-label="القائمة"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <div className={`font-heading font-bold text-lg transition-colors ${scrolled ? 'text-emerald-900' : 'text-white'}`}>
          <span className="hidden sm:inline">الحداثة في مواجهة النص</span>
          <span className="sm:hidden">📚 الدراسة</span>
        </div>
        <button
          onClick={() => window.scrollTo({ top: document.getElementById('references')?.offsetTop || 0, behavior: 'smooth' })}
          className={`font-heading text-sm px-3 py-1.5 rounded-lg transition-all ${scrolled ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          📚 المصادر
        </button>
      </div>
    </nav>
  );
}

function Sidebar({ isOpen, onClose, activeSection }: { isOpen: boolean; onClose: () => void; activeSection: string }) {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay lg:hidden ${isOpen ? 'open' : ''}`} onClick={onClose} />
      
      <aside className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shadow-lg ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-emerald-900 text-lg">📑 فهرس المحتويات</h3>
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
              ✕
            </button>
          </div>
        </div>
        
        <nav className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {tableOfContents.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`sidebar-link w-full text-right block px-4 py-3 rounded-lg text-sm font-heading transition-all ${
                activeSection === item.id
                  ? 'active bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-gray-600 hover:text-emerald-800'
              }`}
            >
              <span className="ml-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 hero-pattern" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
        {/* Ornamental top */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 text-amber-400/70">
            <span className="w-16 h-px bg-gradient-to-l from-amber-400 to-transparent"></span>
            <span className="text-2xl">✦</span>
            <span className="w-16 h-px bg-gradient-to-r from-amber-400 to-transparent"></span>
          </div>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 animate-fade-in-up">
          الحداثة في مواجهة النص
        </h1>
        
        <p className="font-heading text-lg sm:text-xl md:text-2xl text-amber-300 font-semibold mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          دراسة تحليلية نقدية
        </p>
        
        <p className="text-emerald-100/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          لموقف الفكر الحداثي من السنة النبوية في ضوء أطروحة الدكتور الحارث فخري عيسى
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2.5 rounded-full text-sm font-heading border border-white/10">
            <span>👨‍🏫</span> د. الحارث فخري عيسى
          </span>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2.5 rounded-full text-sm font-heading border border-white/10">
            <span>🏛️</span> دار السلام للطباعة والنشر
          </span>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2.5 rounded-full text-sm font-heading border border-white/10">
            <span>📖</span> رسالة دكتوراه
          </span>
        </div>

        <a
          href="#intro"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-xl font-heading font-bold text-lg transition-all hover:shadow-lg hover:shadow-amber-900/30 animate-fade-in-up"
          style={{ animationDelay: '0.8s' }}
        >
          ابدأ القراءة
          <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>

        {/* Ornamental bottom */}
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2 text-amber-400/40">
            <span className="text-sm">◆</span>
            <span className="text-lg">◆</span>
            <span className="text-sm">◆</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================== CONTENT SECTIONS ========================

function IntroSection() {
  return (
    <section id="intro" className="scroll-mt-24">
      <SectionTitle id="intro-title" icon="📖">مقدمة الدراسة</SectionTitle>
      
      <Paragraph>
        تمثل العلاقة بين العقل الحداثي والنص الديني، وبخاصة السنة النبوية، واحدة من أكثر القضايا إشكالية في الفكر الإسلامي المعاصر، حيث يتجاوز هذا الاشتباك المعرفي حدود الجدل الأكاديمي التقليدي ليلامس جوهر الصراع بين المرجعية الوحيانية والمرجعية المادية.
        <Ref ids={[1, 2]} />
      </Paragraph>

      <Paragraph>
        تبرز في هذا السياق الأطروحة العلمية التي قدمها الباحث الدكتور الحارث فخري عيسى عبد الله تحت عنوان <strong>"الحداثة وموقفها من السنة"</strong>، والصادرة عن دار السلام للطباعة والنشر، كدراسة مرجعية تفكك بنية الخطاب الحداثي العربي وتكشف عن جذوره الفلسفية الغربية وآليات تعامله مع المصدر الثاني للتشريع الإسلامي.
        <Ref ids={[1, 2, 3]} />
      </Paragraph>

      <QuoteBlock>
        <p className="text-gray-700 text-lg leading-[2.2]">
          إن هذه الدراسة لا تنظر إلى الحداثة بوصفها مجرد حقبة زمنية، بل تعتبرها <strong>"موقفاً"</strong> فكرياً ومنهجياً شاملاً تجاه الوجود والمقدس، وهو ما يستدعي فحصاً دقيقاً للتحولات التي طرأت على قراءة النصوص الشرعية في ظل هيمنة فلسفات الشك والمادية.
          <Ref ids={[4, 5]} />
        </p>
      </QuoteBlock>

      {/* Key info card */}
      <div className="bg-gradient-to-l from-emerald-50 to-amber-50 rounded-2xl p-6 my-8 border border-emerald-100">
        <h4 className="font-heading font-bold text-emerald-900 mb-4 text-lg flex items-center gap-2">
          <span>📋</span> بيانات الدراسة الأساسية
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "عنوان الدراسة", value: "الحداثة وموقفها من السنة", icon: "📖" },
            { label: "الباحث", value: "د. الحارث فخري عيسى عبد الله", icon: "👨‍🏫" },
            { label: "الدرجة العلمية", value: "رسالة دكتوراه", icon: "🎓" },
            { label: "الناشر", value: "دار السلام للطباعة والنشر", icon: "🏛️" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
              <span className="text-xl mt-1">{item.icon}</span>
              <div>
                <p className="text-sm text-gray-500 font-heading">{item.label}</p>
                <p className="font-heading font-bold text-emerald-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Section1() {
  return (
    <section id="section-1" className="scroll-mt-24">
      <SectionTitle id="section-1-title" icon="🏛️">الفلسفة البنيوية للحداثة بوصفها موقفاً معرفياً</SectionTitle>

      <Paragraph>
        ينطلق التحليل المعمق لمفهوم الحداثة من كونه يتجاوز الإطار الزمني ليشكل بنية نقدية شاملة.
        <Ref ids={[6, 7]} />
        فالحداثة في جوهرها تمثل انقطاعاً معرفياً مع التراث، حيث تنتقل المرجعية من <strong>"المصدر الإلهي"</strong> إلى <strong>"العقل البشري"</strong> المستقل.
        <Ref ids={[8, 9]} />
        هذا التحول ليس مجرد تطور في الأدوات التقنية، بل هو تغيير في <strong>"البراديغم"</strong> الحاكم للتفكير، مما يجعل التعامل مع النص الديني ينتقل من دائرة <strong>"الاستنباط"</strong> و<strong>"الامتثال"</strong> إلى دائرة <strong>"المساءلة"</strong> و<strong>"النقد"</strong>.
        <Ref ids={[1, 10]} />
      </Paragraph>

      <Paragraph>
        تتحدد الحداثة لغوياً من <strong>"الحدوث"</strong> وهو كون الشيء بعد أن لم يكن، وهي نقيض القديم.
        <Ref ids={[6]} />
        أما في الاصطلاح الفكري، فهي تيار يرفض التقليد ويسعى للتجديد المطلق دون مراعاة للثوابت أو التقاليد، مع التركيز على استغلال الموارد والتقنية لتحقيق السيادة البشرية على الطبيعة.
        <Ref ids={[7]} />
        ويرى الباحث أن هذا <strong>"الموقف"</strong> هو المفتاح الأساسي لفهم التحولات في القراءات المعاصرة للسنة، حيث أصبح النص يُعرض على مقاييس <strong>"العقلانية"</strong> المادية التي تشكلت في سياق تاريخي غربي مختلف تماماً عن السياق الإسلامي.
        <Ref ids={[1, 4, 6, 7]} />
      </Paragraph>

      {/* Comparison Table */}
      <div className="my-10 overflow-x-auto">
        <h4 className="font-heading font-bold text-emerald-900 mb-4 text-lg text-center">
          جدول المقارنة: المنظور التراثي مقابل المنظور الحداثي
        </h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>المكون المعرفي</th>
              <th>المنظور التراثي</th>
              <th>المنظور الحداثي</th>
            </tr>
          </thead>
          <tbody>
            {[
              { component: "المرجعية العليا", traditional: "الوحي الإلهي (المتعالي)", modern: "العقل البشري (المحايث)" },
              { component: "طبيعة النص", traditional: "نص مقدس عابر للزمان", modern: "منتج ثقافي مرتبط ببيئته التاريخية" },
              { component: "دور الإنسان", traditional: "التلقي، الفهم، والامتثال", modern: "النقد، التفكيك، والأنسنة" },
              { component: "المنهجية", traditional: "أصول الفقه وعلم الحديث", modern: "الألسنية، الأنثروبولوجيا، والتاريخية" },
              { component: "الغاية", traditional: "تحقيق العبودية لله", modern: "السيطرة على الواقع والمادة" },
            ].map((row, i) => (
              <tr key={i}>
                <td className="font-heading font-bold text-emerald-900 whitespace-nowrap">{row.component}</td>
                <td className="text-emerald-800">{row.traditional}</td>
                <td className="text-red-800">{row.modern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paragraph>
        إن هذا التباين الجوهري يفسر لماذا يرى الحداثيون أن السنة النبوية تمثل <strong>"عائقاً"</strong> أمام التقدم، حيث يعتبرونها مجرد <strong>"موروث لغوي"</strong> أو <strong>"تجربة تاريخية"</strong> انتهت صلاحيتها بانتهاء زمنها. وتؤكد دراسة الدكتور الحارث فخري أن هذا الموقف الحداثي يعتمد على <strong>"أنسنة الدين"</strong>، أي إرجاعه إلى أصول إنسانية بحتة وإحلال الأساطير أو التفسيرات المادية محل الغيبيات.
        <Ref ids={[4, 2]} />
      </Paragraph>
    </section>
  );
}

function Section2() {
  return (
    <section id="section-2" className="scroll-mt-24">
      <SectionTitle id="section-2-title" icon="🌍">الجذور الفلسفية الغربية للحداثة وأثرها في الفكر العربي</SectionTitle>

      <Paragraph>
        لا يمكن فهم منطلقات الحداثيين العرب تجاه السنة دون ربطها بالمحطات الفلسفية الأساسية في الفكر الغربي الحديث.
        <Ref ids={[11, 12]} />
        فالحداثة العربية هي امتداد فكري وثقافي لما وقع في الغرب منذ عصر النهضة والتنوير. لقد تأثر الحداثيون بمناهج الشك الديكارتي، والوضعية المنطقية، والديالكتيك المادي، وطبقوا هذه الأدوات على الوحي الإسلامي.
        <Ref ids={[2, 4, 13, 14]} />
      </Paragraph>

      <Paragraph>
        يعتبر الشك المنهجي الذي أرسى دعائمه ديكارت حجر الزاوية في التفكير الحداثي، حيث لا يُقبل أي شيء ما لم يكن واضحاً وضوحاً مطلقاً للعقل البشري.
        <Ref ids={[14]} />
        هذا التوجه أدى في السياق الغربي إلى صراع مع الكنيسة ونزع القداسة عن النصوص الدينية، وهو ما حاول الحداثيون العرب استنساخه في البيئة الإسلامية.
        <Ref ids={[15, 16]} />
        يرى محمد أركون أن الحداثة ليست تقليداً للغرب بل هي <strong>"ممارسة عقلية نقدية"</strong> تهدف لتفكيك المسلمات، لكنه في الحقيقة يستخدم أدوات مثل <strong>"الجينالوجيا النيتشوية"</strong> و<strong>"الحفرية الفوكاوية"</strong> لنزع الصفة المتعالية عن السنة.
        <Ref ids={[16]} />
      </Paragraph>

      <QuoteBlock>
        <p className="text-gray-700 text-lg leading-[2.2]">
          إن الانبهار بالمنجز المادي الغربي أدى إلى حالة من <strong>"الدونية المعرفية"</strong> لدى بعض المثقفين العرب، مما دفعهم لاحتقار المنجز التراثي الإسلامي والتقليل من شأنه، معتبرين أن علوم الحديث والأصول هي <strong>"علوم تقليدية"</strong> قاصرة عن مواكبة العصر.
          <Ref ids={[7, 10, 13]} />
        </p>
      </QuoteBlock>

      <Paragraph>
        هذا الموقف أدى إلى ظهور تيارات تطالب بـ <strong>"قطيعة معرفية"</strong> مع التراث، ليس فقط في الرؤية المعرفية، بل في الاهتمام بالموضوع نفسه، حيث يعتبر الانشغال بالتراث انجراراً لسلطته وسقوطاً في وهم إمكانية الإفادة منه.
        <Ref ids={[8]} />
      </Paragraph>

      {/* Timeline of influence */}
      <div className="my-10 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h4 className="font-heading font-bold text-emerald-900 mb-6 text-lg text-center">
          محطات التأثير الفلسفي الغربي على الحداثة العربية
        </h4>
        <div className="relative">
          <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-emerald-500 to-amber-500"></div>
          {[
            { era: "القرن 17", title: "الشك الديكارتي", desc: "رينيه ديكارت يؤسس للشك المنهجي ويرفع العقل إلى مرتبة الحكم المطلق", color: "bg-amber-100 border-amber-300" },
            { era: "القرن 19", title: "الديالكتيك المادي", desc: "ماركس وهيغل يحولان التاريخ إلى صراع مادي بين الطبقات والقوى", color: "bg-emerald-100 border-emerald-300" },
            { era: "القرن 20", title: "التفكيك والبنيوية", desc: "فوكا ودريدا يفككان النصوص ويعلنان موت المؤلف وموت المعنى الثابت", color: "bg-amber-100 border-amber-300" },
            { era: "العصر الحديث", title: "التطبيق العربي", desc: "أركون وأبو زيد وشحرور يستوردون هذه المناهج لتطبيقها على الوحي الإسلامي", color: "bg-emerald-100 border-emerald-300" },
          ].map((item, i) => (
            <div key={i} className="relative pr-12 pb-8 last:pb-0">
              <div className="absolute right-2 top-1 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
              </div>
              <div className={`${item.color} border rounded-xl p-4`}>
                <span className="inline-block bg-white/80 text-emerald-900 font-heading font-bold text-xs px-3 py-1 rounded-full mb-2">{item.era}</span>
                <h5 className="font-heading font-bold text-emerald-900 text-base">{item.title}</h5>
                <p className="text-gray-700 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Section3() {
  return (
    <section id="section-3" className="scroll-mt-24">
      <SectionTitle id="section-3-title" icon="⚡">السنة النبوية كمركز للاشتباك الفكري والمنهجي</SectionTitle>

      <Paragraph>
        لماذا اختار الباحث الحارث فخري <strong>"السنة النبوية"</strong> لتكون ميدان المواجهة؟ الحقيقة أن السنة تمثل التطبيق العملي للقرآن، وهي النقطة التي يلتقي فيها الوحي بالواقع البشري.
        <Ref ids={[1]} />
        هذا التجسد التاريخي للوحي جعل السنة هدفاً <strong>"سهلاً"</strong> للمناهج الحداثية التي تركز على <strong>"التاريخية"</strong> و<strong>"الأنسنة"</strong>.
        <Ref ids={[2, 4]} />
      </Paragraph>

      <SubSectionTitle>مستويات المواجهة</SubSectionTitle>

      <Paragraph>
        تنقسم مواجهة الحداثة للسنة إلى مستويين بنيويين:
        <Ref ids={[1]} />
      </Paragraph>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="hover-card bg-gradient-to-bl from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-heading font-bold">1</span>
            <h5 className="font-heading font-bold text-red-900">مستوى الثبوت</h5>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            عبر التشكيك في آليات النقل والتوثيق، وادعاء تأخر التدوين، وزعزعة اليقين التاريخي المرتبط بالصحيحين.
            <Ref ids={[1, 2]} />
          </p>
        </div>

        <div className="hover-card bg-gradient-to-bl from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-heading font-bold">2</span>
            <h5 className="font-heading font-bold text-purple-900">مستوى المنهج</h5>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            عبر استخدام أدوات فلسفية لتأويل النص ومحاولة "أنسنته" وتجريده من صفة الوحي.
            <Ref ids={[1, 10]} />
          </p>
        </div>
      </div>

      <Paragraph>
        يزعم الحداثيون أن السنة ليست وحياً، بل هي مجرد <strong>"اجتهاد بشري"</strong> أو <strong>"حديث نفس"</strong> من النبي ﷺ، وأنها كانت مخصصة لجيله فقط.
        <Ref ids={[4, 17, 18]} />
        هذا الادعاء يهدف في جوهره إلى إلغاء حجية السنة كمصدر للتشريع وجعل العقل هو الحاكم الوحيد.
        <Ref ids={[2, 4]} />
        وتؤكد الدراسة أن هذه الهجمات تهدف لإبعاد السنة عن دائرة التأثير تمهيداً لإقصائها جملة وتفصيلاً.
        <Ref ids={[4]} />
      </Paragraph>

      {/* Comparison table */}
      <div className="my-10 overflow-x-auto">
        <h4 className="font-heading font-bold text-emerald-900 mb-4 text-lg text-center">
          جدول المقارنة: شبهات الحداثيين والردود الأكاديمية
        </h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>شبهة الحداثيين</th>
              <th>الرد الأكاديمي (أطروحة الحارث فخري)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { doubt: "تأخر تدوين السنة يضعف مصداقيتها", response: "تدوين السنة بدأ في عهد النبي ﷺ وحُفظت بأدوات نقدية صارمة" },
              { doubt: "السنة اجتهاد بشري وليست وحياً", response: "السنة وحي بالمعنى (ما ينطق عن الهوى) وهي مبينة للقرآن" },
              { doubt: "النصوص النبوية تاريخية مرتبطة بزمانها", response: "الشريعة صالحة لكل زمان ومكان، والعبرة بعموم اللفظ لا بخصوص السبب" },
              { doubt: "المنهج الألسني يكشف تناقضات النص", response: "الألسنية أداة تفكيكية تهدف لنزع المرجعية وتطويع النص للأيديولوجيا" },
            ].map((row, i) => (
              <tr key={i}>
                <td className="text-red-800 font-heading font-semibold">{row.doubt}</td>
                <td className="text-emerald-800">{row.response} <Ref ids={[2, 4, 13, 17]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Section4() {
  return (
    <section id="section-4" className="scroll-mt-24">
      <SectionTitle id="section-4-title" icon="🔬">نقد المنهج الألسني والتاريخي في قراءة السنة</SectionTitle>

      <Paragraph>
        يعتبر المنهج الألسني (اللساني) من أخطر الأدوات التي استخدمها الخطاب الحداثي لتفكيك النص النبوي.
        <Ref ids={[4]} />
        يرى الدكتور الحارث فخري أن تطبيق هذه المناهج الغربية على السنة يؤدي بالضرورة إلى تحريف معانيها؛ لأن هذه المناهج نشأت أصلاً لنقد النصوص البشرية والأساطير اليونانية.
        <Ref ids={[4]} />
      </Paragraph>

      <Paragraph>
        يركز المنهج الألسني على فكرة <strong>"موت المؤلف"</strong>، حيث يتم عزل الحديث عن قائله (الرسول ﷺ) وعن سياقه الشرعي، ليصبح النص ملكاً للقارئ يفسره كيفما شاء وفقاً لـ <strong>"نظريات التلقي"</strong> الحديثة.
        <Ref ids={[4, 15]} />
        هذا المنهج يحول المعنى إلى حالة <strong>"سيالة"</strong> لا تستقر، مما يهدم القواعد المستقرة عند علماء الأصول واللغة الأوائل.
        <Ref ids={[4]} />
      </Paragraph>

      <Paragraph>
        أما المنهج التاريخي، فيسعى لإثبات أن السنة هي <strong>"منتج ثقافي"</strong> يعكس صراعات سياسية واجتماعية في القرون الهجرية الأولى.
        <Ref ids={[19, 20]} />
        يدعي أصحاب هذا الاتجاه، مثل نصر حامد أبو زيد ومحمد أركون، أن اللغة كائن تاريخي متغير، وبالتالي فإن الأحكام الواردة في السنة هي أحكام <strong>"مؤقتة"</strong> انتهت بانتهاء سياقها.
        <Ref ids={[4, 20]} />
        هذا التوجه يمارس <strong>"إسقاطاً"</strong> للمفاهيم المعاصرة على النص النبوي بدلاً من <strong>"استنباط"</strong> الأحكام منه، وهو ما يصفه الباحث بأنه <strong>"نقد منفلت وتأويل منحرف"</strong>.
        <Ref ids={[4]} />
      </Paragraph>

      {/* Methodology comparison */}
      <div className="my-8 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-l from-red-600 to-red-800 p-4">
          <h4 className="font-heading font-bold text-white text-center">⚠️ مخاطر المناهج الحداثية على النص الشرعي</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6">
            <h5 className="font-heading font-bold text-red-800 mb-3 flex items-center gap-2">
              <span>📝</span> المنهج الألسني
            </h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                <span>فكرة "موت المؤلف" تعزل النص عن قائله ﷺ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                <span>تحويل المعنى إلى حالة "سيالة" لا تستقر</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                <span>هدم القواعد المستقرة عند علماء الأصول</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                <span>نشأ لنقد الأساطير اليونانية لا النصوص المقدسة</span>
              </li>
            </ul>
          </div>
          <div className="p-6">
            <h5 className="font-heading font-bold text-purple-800 mb-3 flex items-center gap-2">
              <span>📜</span> المنهج التاريخي
            </h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">●</span>
                <span>اعتبار السنة "منتجاً ثقافياً" يعكس صراعات تاريخية</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">●</span>
                <span>القول بأن الأحكام "مؤقتة" انتهت بزمانها</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">●</span>
                <span>إسقاط المفاهيم المعاصرة على النص النبوي</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">●</span>
                <span>وصفه: "نقد منفلت وتأويل منحرف"</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Section5() {
  const thinkers = [
    {
      name: "محمد شحرور",
      title: "القراءة المعاصرة",
      icon: "🔬",
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100 text-blue-700",
      content: [
        "تعتبر أطروحة محمد شحرور من أكثر المشاريع إثارة للجدل، حيث استخدم \"الديالكتيك المادي\" واللسانيات لتفكيك السنة.",
        "شحرور يفرق بين \"محمد الرسول\" (صاحب الوحي المطلق) و\"محمد النبي\" (المجتهد البشري في شؤون الدنيا)، معتبراً أن \"السنة النبوية\" هي تشريع وضعي غير ملزم للمسلمين اليوم.",
        "وينتقد الباحث منهج شحرور التعميمي الذي يستدل بالجزء على الكل ويفتقر للأساس العلمي الرصين في التعامل مع علوم الحديث.",
      ],
      refs: [[21], [18, 21, 22], [2, 21]],
    },
    {
      name: "محمد أركون",
      title: "تفكيك العقل الإسلامي",
      icon: "🔍",
      color: "from-purple-50 to-fuchsia-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100 text-purple-700",
      content: [
        "ركز محمد أركون على استخدام \"الأنثروبولوجيا\" و\"الألسنية\" لنقد ما يسميه \"العقل الأرثوذكسي\" الجامد.",
        "أركون يرى أن السنة تحولت إلى \"أيديولوجيا\" لخدمة السلطة، ويطالب بإعادة الاعتبار لـ \"الخيال\" و\"المتخيل\" وكسر هيمنة النصوص الرسمية.",
        "منهجه يعتمد على \"تاريخية العقل\"، حيث يسعى لإثبات أن كل ما نعتبره ثوابت هو في الحقيقة نتاج صراعات تاريخية.",
      ],
      refs: [[16], [16], [16]],
    },
    {
      name: "نصر حامد أبو زيد",
      title: "أنسنة النص",
      icon: "💭",
      color: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100 text-amber-700",
      content: [
        "قدم أبو زيد رؤية تعتبر القرآن والسنة \"منتجاً ثقافياً\"، مؤكداً أن النص قبل دراسة دلالته يجب دراسة \"وقائعيته\" و\"أنطولوجيته\" المادية.",
        "هو يدعو إلى ترك الجوانب القيمية والغيبية (الملائكة، الآخرة) والتعامل مع النص كرسالة لغوية بشرية تخضع لشفرات الثقافة التي نشأت فيها.",
      ],
      refs: [[20], [19, 20]],
    },
    {
      name: "جمال البنا",
      title: "فصل السنة عن الحديث",
      icon: "✂️",
      color: "from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
      iconBg: "bg-rose-100 text-rose-700",
      content: [
        "يميز جمال البنا بين \"السنة\" (التي تعني العمل والفعل) و\"الحديث\" (الذي يعني القول)، مدعياً أن السنة الحقيقية هي الفعل النبوي فقط، أما الأحاديث القولية فهي محل شك كبير وربما وُضعت لأغراض سياسية أو أيديولوجية لاحقة.",
      ],
      refs: [[17]],
    },
  ];

  return (
    <section id="section-5" className="scroll-mt-24">
      <SectionTitle id="section-5-title" icon="👥">نماذج من أقطاب الحداثة ومواقفهم التفصيلية</SectionTitle>

      <Paragraph>
        استعرضت دراسة الحارث فخري مواقف عدد من الحداثيين العرب البارزين، مبيناً الفوارق الجوهرية بين أطروحاتهم التي تلتقي في النهاية عند نقطة التشكيك في التراث.
        <Ref ids={[3, 17]} />
      </Paragraph>

      <div className="space-y-6 mt-8">
        {thinkers.map((thinker, i) => (
          <div key={i} className={`hover-card bg-gradient-to-l ${thinker.color} rounded-2xl border ${thinker.borderColor} overflow-hidden`}>
            <div className="flex items-center gap-4 p-5 pb-3">
              <span className={`w-12 h-12 rounded-xl ${thinker.iconBg} flex items-center justify-center text-xl font-heading font-bold`}>
                {thinker.icon}
              </span>
              <div>
                <h4 className="font-heading font-bold text-gray-900 text-lg">{thinker.name}</h4>
                <p className="font-heading text-sm text-gray-500">{thinker.title}</p>
              </div>
            </div>
            <div className="px-5 pb-5">
              {thinker.content.map((para, j) => (
                <p key={j} className="text-gray-700 leading-[2] text-base mb-2">
                  {para}
                  <Ref ids={thinker.refs[j]} />
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Section6() {
  return (
    <section id="section-6" className="scroll-mt-24">
      <SectionTitle id="section-6-title" icon="🎓">المنهج الأكاديمي الصارم في الرد على الحداثة</SectionTitle>

      <Paragraph>
        تستمد أطروحة الدكتور الحارث فخري قيمتها من تجاوزها للآراء الانطباعية إلى رحاب التمحيص العلمي.
        <Ref ids={[1]} />
        لقد استخدم الباحث أدوات البحث الأكاديمي الرصين لمواجهة النقد بالنقد، وليس مجرد الخطابة الإنشائية.
        <Ref ids={[1]} />
      </Paragraph>

      <Paragraph>
        تعتمد الدراسة على ثلاث ركائز أساسية في معالجتها:
        <Ref ids={[1]} />
      </Paragraph>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
        {[
          {
            num: "1",
            title: "التفكيك الجذري",
            desc: "عبر إرجاع المقولات الحداثية إلى أصولها الفلسفية الغربية وإثبات عدم ملاءمتها للنص الإسلامي.",
            icon: "🔍",
            gradient: "from-emerald-500 to-teal-600",
          },
          {
            num: "2",
            title: "المواجهة العلمية",
            desc: "عبر استخدام قواعد علم الحديث (الجرح والتعديل، الأسانيد) لإثبات زيف الشبهات المتعلقة بتدوين السنة وثبوتها.",
            icon: "⚔️",
            gradient: "from-amber-500 to-orange-600",
            refs: [22, 23],
          },
          {
            num: "3",
            title: "التصنيف الدقيق",
            desc: "لفهم الفوارق بين التيارات الحداثية، مثل \"الحداثة العقلانية\" التي تقدس العقل، و\"الحداثة السوفسطائية\" التي تنتهي إلى العدمية والشك المطلق.",
            icon: "📊",
            gradient: "from-indigo-500 to-purple-600",
            refs: [9],
          },
        ].map((pillar, i) => (
          <div key={i} className="hover-card bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className={`bg-gradient-to-l ${pillar.gradient} p-4 flex items-center gap-3`}>
              <span className="text-2xl">{pillar.icon}</span>
              <h5 className="font-heading font-bold text-white text-lg">{pillar.title}</h5>
            </div>
            <div className="p-5">
              <p className="text-gray-700 text-sm leading-relaxed">
                {pillar.desc}
                {pillar.refs && <Ref ids={pillar.refs} />}
              </p>
            </div>
          </div>
        ))}
      </div>

      <QuoteBlock>
        <p className="text-gray-700 text-lg leading-[2.2]">
          تؤكد الدراسة أن المنهج النقدي عند المحدثين كان منهجاً موضوعياً للغاية، فيه من الحيطة والتثبت ما لا يخطر على بال بشر، وهو ما يتجاهله الحداثيون في محاولاتهم لـ <strong>"أنسنة"</strong> الوحي.
          <Ref ids={[10, 23]} />
        </p>
      </QuoteBlock>
    </section>
  );
}

function Section7() {
  return (
    <section id="section-7" className="scroll-mt-24">
      <SectionTitle id="section-7-title" icon="⚠️">التحديات المعاصرة وآثار الحداثة في تعطيل المقاصد</SectionTitle>

      <Paragraph>
        تشير الدراسات التي استشهد بها الباحث إلى أن حركة الحداثة أدت إلى آثار خطيرة في تعطيل مقاصد السنة النبوية.
        <Ref ids={[13]} />
        إن رد السنة أو التشكيك فيها يؤدي بالضرورة إلى رد القرآن؛ لأن السنة هي البيان العملي له.
        <Ref ids={[13]} />
      </Paragraph>

      <Paragraph>من أبرز الآثار السلبية التي رصدتها الدراسة: <Ref ids={[13]} /></Paragraph>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {[
          {
            title: "فصل الدين عن الدولة والسياسة",
            desc: "عبر حصر ولاية النبي ﷺ في الجانب الروحي فقط.",
            icon: "🏛️",
          },
          {
            title: "نفي وجوب الحكم بالسنة",
            desc: "والادعاء بأنها ليست كالقرآن في الإلزام.",
            icon: "⚖️",
          },
          {
            title: "تحويل الشريعة إلى مقاصد هلامية",
            desc: "حيث يتم استخدام \"علم المقاصد\" كذريعة لضرب \"علم الأصول\" وإبطال النصوص بحجة المصلحة المتغيرة.",
            icon: "🔄",
            refs: [7, 10],
          },
          {
            title: "زعزعة الإيمان بالغيبيات",
            desc: "عبر محاولة \"عقلنة\" كل شيء وتكذيب ما لا يدركه العقل المادي (مثل حديث الذبابة أو أحاديث القدر).",
            icon: "🌀",
            refs: [2, 18, 24],
          },
        ].map((item, i) => (
          <div key={i} className="hover-card bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h5 className="font-heading font-bold text-gray-900 mb-1">{item.title}</h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                  {item.refs && <Ref ids={item.refs} />}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Impact table */}
      <div className="my-10 overflow-x-auto">
        <h4 className="font-heading font-bold text-emerald-900 mb-4 text-lg text-center">
          جدول الآثار المعرفية والنتائج العملية
        </h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>الأثر المعرفي</th>
              <th>النتيجة العملية</th>
            </tr>
          </thead>
          <tbody>
            {[
              { impact: "أنسنة النص", result: "تحويل الشريعة إلى قوانين وضعية قابلة للتغيير المطلق" },
              { impact: "التشكيك في الرواة", result: "فقدان الثقة في المرجعية التاريخية للأمة (الصحابة)" },
              { impact: "هيمنة العقل المادي", result: "إنكار المعجزات والغيبيات والارتباط بالسماء" },
              { impact: "القول بالتاريخية", result: "حصر الإسلام في القرن السابع الميلادي فقط" },
            ].map((row, i) => (
              <tr key={i}>
                <td className="font-heading font-semibold text-red-800">{row.impact}</td>
                <td className="text-gray-700">{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Section8() {
  return (
    <section id="section-8" className="scroll-mt-24">
      <SectionTitle id="section-8-title" icon="🌉">استشراف جسور الفهم وحماية الهوية</SectionTitle>

      <Paragraph>
        إن الهدف النهائي من هذا الجهد العلمي ليس مجرد الرصد التاريخي، بل الوصول إلى رؤية متوازنة تنهي حالة الاغتراب بين المسلم وعصره.
        <Ref ids={[1]} />
        تساهم هذه الدراسات في تحقيق نتيجتين جوهريتين:
        <Ref ids={[1]} />
      </Paragraph>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="hover-card bg-gradient-to-bl from-emerald-50 to-teal-50 rounded-2xl p-7 border border-emerald-200">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mb-4">
            🛡️
          </div>
          <h4 className="font-heading font-bold text-emerald-900 text-xl mb-3">أولاً: حماية الهوية</h4>
          <p className="text-gray-700 leading-[2]">
            عبر تحصين الوعي الديني من الذوبان في الأنماط الفكرية الوافدة، وبيان أن السنة هي الضامن لخصوصية الأمة الإسلامية وهويتها التشريعية والقيمية.
            <Ref ids={[1, 22]} />
          </p>
        </div>

        <div className="hover-card bg-gradient-to-bl from-amber-50 to-yellow-50 rounded-2xl p-7 border border-amber-200">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center text-2xl mb-4">
            🌐
          </div>
          <h4 className="font-heading font-bold text-amber-900 text-xl mb-3">ثانياً: استيعاب المتغيرات</h4>
          <p className="text-gray-700 leading-[2]">
            عبر تقديم فهم للسنة يتسم بالمرونة والوعي بالواقع، مما يجعل النص قادراً على توجيه الراهن دون التفريط في الثوابت المنهجية. فالتجديد الحقيقي لا يكون بهدم الأصول، بل بحسن تنزيلها على الواقع المعاصر بأدوات علمية منضبطة.
            <Ref ids={[1]} />
          </p>
        </div>
      </div>

      <QuoteBlock>
        <p className="text-gray-700 text-lg leading-[2.2]">
          تؤكد الدراسة في خاتمتها أن <strong>"الصواب في التربية لا يكون إلا مع التصفية"</strong>، أي أن تخلية العقول من الشبهات الحداثية الباطلة يجب أن تسبق تحليتها بالعلوم الشرعية الصحيحة. وهذا المنهج هو السبيل الوحيد للحفاظ على <strong>"المحجة البيضاء"</strong> التي تركنا عليها النبي ﷺ.
          <Ref ids={[25, 26]} />
        </p>
      </QuoteBlock>
    </section>
  );
}

function Section9() {
  return (
    <section id="section-9" className="scroll-mt-24">
      <SectionTitle id="section-9-title" icon="✅">الخلاصات والنتائج العامة للدراسة</SectionTitle>

      <Paragraph>
        تخلص دراسة الدكتور الحارث فخري عيسى إلى مجموعة من الحقائق الجوهرية التي تشكل قاعدة صلبة للتعامل مع الفكر الحداثي:
        <Ref ids={[3, 4]} />
      </Paragraph>

      <div className="space-y-4 my-8">
        {[
          {
            num: 1,
            title: "الحداثة العربية: تبعية لا أصالة",
            desc: "الحداثة العربية هي نتاج \"تبعية فكرية\" للغرب، وليست تطوراً ذاتياً للفكر العربي، وهي تفتقر للأصالة في أدواتها النقدية.",
            refs: [3, 4],
          },
          {
            num: 2,
            title: "السنة: المستهدف الأول",
            desc: "السنة النبوية هي المستهدف الأول لأنها الحصن الذي يحمي التطبيق العملي للقرآن، وهدمها يعني تحويل الإسلام إلى مجرد أفكار نظرية هلامية.",
            refs: [13, 21],
          },
          {
            num: 3,
            title: "المناهج الحداثية: أسلحة أيديولوجية",
            desc: "المناهج الحداثية (الألسنية، التفكيكية) ليست أدوات محايدة، بل هي \"أسلحة أيديولوجية\" تهدف لنزع القداسة عن الوحي.",
            refs: [2, 4],
          },
          {
            num: 4,
            title: "تفوق علوم الحديث التقليدية",
            desc: "علوم الحديث التقليدية (مثل علم الجرح والتعديل) تتفوق بمراحل في دقتها وموضوعيتها على مناهج النقد التاريخي الغربية، وهي كفيلة بالرد على كل الشبهات المثارة.",
            refs: [22, 23],
          },
          {
            num: 5,
            title: "المواجهة العلمية لا الانغلاق",
            desc: "الحل لا يكمن في الانغلاق التام، بل في \"المواجهة العلمية الرصينة\" التي تبين زيف الادعاءات الحداثية وتقدم البديل الإسلامي القادر على مواكبة العصر دون المساس بالثوابت.",
            refs: [1, 25],
          },
        ].map((item) => (
          <div key={item.num} className="hover-card bg-white rounded-xl p-6 shadow-sm border-r-4 border-emerald-500">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-heading font-bold shrink-0">
                {item.num}
              </span>
              <div>
                <h5 className="font-heading font-bold text-emerald-900 text-lg mb-2">{item.title}</h5>
                <p className="text-gray-700 leading-[2]">
                  {item.desc}
                  <Ref ids={item.refs} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final statement */}
      <div className="bg-gradient-to-l from-emerald-900 to-emerald-800 rounded-2xl p-8 my-10 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-emerald-100 leading-[2.2] text-lg">
            إن رسالة الدكتور الحارث فخري، بصفتها عملاً أكاديمياً محكماً صادراً عن دار نشر عريقة كـ <strong>"دار السلام"</strong>، تمثل نموذجاً لما يجب أن تكون عليه الدراسات الإسلامية المعاصرة: عمق في التأصيل، وقوة في النقد، ووعي بتحديات العصر.
            <Ref ids={[1, 3]} />
          </p>
          <div className="section-divider my-6" style={{ background: 'linear-gradient(90deg, transparent, #d4a843, #fff, #d4a843, transparent)' }}></div>
          <p className="text-amber-300 font-heading font-bold text-xl leading-relaxed">
            إنها دعوة لاستعادة <span className="gold-shimmer">"السيادة المعرفية"</span> للعقل المسلم، والتمسك بالوحي كمرجع أعلى يحكم العقل والواقع، وليس العكس.
          </p>
        </div>
      </div>
    </section>
  );
}

function ReferencesSection() {
  return (
    <section id="references" className="scroll-mt-24">
      <SectionTitle id="references-title" icon="📚">المصادر والمراجع</SectionTitle>

      <p className="text-gray-600 mb-6 font-heading text-sm">
        مجموع المصادر والمراجع المعتمدة في الدراسة ({references.length} مصدر)
      </p>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {references.map((ref) => (
          <div
            key={ref.id}
            id={`ref-${ref.id}`}
            className="ref-card px-5 py-4 border-b border-gray-50 last:border-b-0 transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center font-heading font-bold text-sm shrink-0">
                {ref.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm leading-relaxed font-body">
                  {ref.title}
                </p>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-heading mt-1 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  فتح المصدر
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 mt-16">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3 text-amber-400/60">
              <span className="w-12 h-px bg-gradient-to-l from-amber-400/60 to-transparent"></span>
              <span className="text-xl">✦</span>
              <span className="w-12 h-px bg-gradient-to-r from-amber-400/60 to-transparent"></span>
            </div>
          </div>
          <h3 className="font-heading font-bold text-xl text-white mb-2">الحداثة في مواجهة النص</h3>
          <p className="text-emerald-300 text-sm font-heading mb-1">دراسة تحليلية نقدية لموقف الفكر الحداثي من السنة النبوية</p>
          <p className="text-emerald-400 text-xs font-heading mb-6">في ضوء أطروحة الدكتور الحارث فخري عيسى عبد الله</p>
          <div className="border-t border-emerald-800 pt-4">
            <p className="text-emerald-500 text-xs font-heading">
              صادر عن دار السلام للطباعة والنشر — رسالة دكتوراه محكّمة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ======================== MAIN APP ========================

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen" dir="rtl">
      <ReadingProgressBar />
      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Hero */}
      <HeroSection />

      {/* Main content with sidebar */}
      <div className="flex relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeSection={activeSection}
        />

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <IntroSection />
            <div className="section-divider my-12"></div>

            <Section1 />
            <div className="section-divider my-12"></div>

            <Section2 />
            <div className="section-divider my-12"></div>

            <Section3 />
            <div className="section-divider my-12"></div>

            <Section4 />
            <div className="section-divider my-12"></div>

            <Section5 />
            <div className="section-divider my-12"></div>

            <Section6 />
            <div className="section-divider my-12"></div>

            <Section7 />
            <div className="section-divider my-12"></div>

            <Section8 />
            <div className="section-divider my-12"></div>

            <Section9 />
            <div className="section-divider my-12"></div>

            <ReferencesSection />
          </div>

          <Footer />
        </main>
      </div>

      {/* Back to top button */}
      <BackToTopButton />
    </div>
  );
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl"
      aria-label="العودة للأعلى"
    >
      <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
