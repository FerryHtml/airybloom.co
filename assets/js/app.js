(() => {
    'use strict';

    const WA_NUMBER = '6283838581778';
    const STORAGE_KEY_SIDEBAR = 'airybloom-sidebar-collapsed';
    const ROUTE_TITLES = {
        home: 'Home',
        koleksi: 'Koleksi',
        detail: 'Detail Produk',
        pricelist: 'Pricelist',
        'cara-order': 'Cara Order',
        faq: 'FAQ',
        testimoni: 'Testimoni',
        kontak: 'Kontak'
    };

    const fallbackProducts = [
        {
            id: 'candy-wings',
            slug: 'the-candy-wings',
            name: 'The Candy Wings 🦋🍭',
            shortName: 'The Candy Wings',
            subtitle: 'Varian Colorful & Pop',
            vibeKey: 'playful',
            vibeLabel: 'Playful & Fun',
            description: 'Siapa bilang bunga cuma bisa anggun? Perpaduan bunga artificial premium dengan warna pop manis dan aksen sayap kupu-kupu ikonik. Bikin momenmu secerah pelangi!',
            suitableFor: 'Wisuda, ulang tahun sahabat, atau kado buat si extraordinary person!',
            image: 'https://i.pinimg.com/736x/2a/a1/c8/2aa1c8be506dac1037a7d42a6f97cbd4.jpg',
            featured: 1,
            prices: { M: 'Rp289.000', L: 'Rp359.000', XL: 'Rp429.000' }
        },
        {
            id: 'summer-breeze',
            slug: 'summer-breeze',
            name: 'Summer Breeze 🌊🌻',
            shortName: 'Summer Breeze',
            subtitle: 'Varian Fresh & Airy',
            vibeKey: 'fresh',
            vibeLabel: 'Fresh & Airy',
            description: 'Rasakan kesegaran taman musim panas. Kombinasi bunga matahari bright dengan kertas hologram yang memantulkan cahaya pelangi ringan. Cantik, tenang, dan positif.',
            suitableFor: 'Kado penyemangat (get well soon), ucapan terima kasih, atau self-reward.',
            image: 'https://i.pinimg.com/736x/5e/c6/54/5ec654cc85e89a5a9848d73a5d0fe010.jpg',
            featured: 2,
            prices: { M: 'Rp279.000', L: 'Rp349.000', XL: 'Rp419.000' }
        },
        {
            id: 'thumbelina-dream',
            slug: 'thumbelinas-dream',
            name: 'Thumbelina’s Dream ✨🌸',
            shortName: 'Thumbelina’s Dream',
            subtitle: 'Varian Petite & Sweet',
            vibeKey: 'petite',
            vibeLabel: 'Petite & Sweet',
            description: 'Si mungil penuh keajaiban. Dirancang untuk pencinta detail minimalis. Ukuran kecil dengan sentuhan rustic dan kupu-kupu kecil. Bukti hal besar berawal dari yang kecil.',
            suitableFor: 'Hadiah meja kerja, kado anniversary singkat, atau surprise manis tak terduga.',
            image: 'https://i.pinimg.com/1200x/3d/e0/cb/3de0cbbbbc721c38c1f58a16ad5334d1.jpg',
            featured: 3,
            prices: { M: 'Rp249.000', L: 'Rp319.000', XL: 'Rp389.000' }
        }
    ];

    const state = {
        products: [],
        query: '',
        vibe: 'all',
        sort: 'featured',
        selectedProduct: null,
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    const els = {
        views: [],
        menuLinks: [],
        topbarTitle: null,
        collectionGrid: null,
        searchInput: null,
        vibeFilter: null,
        sortFilter: null,
        pricelistBody: null,
        detailEmpty: null,
        detailLayout: null,
        detailVibe: null,
        detailImage: null,
        detailSubtitle: null,
        detailName: null,
        detailDescription: null,
        detailSuitable: null,
        detailPrices: null,
        detailSizeOptions: null,
        detailForm: null,
        wrapColor: null,
        sellerNote: null,
        stickyDetailCta: null,
        stickyOrderBtn: null,
        stickyProductName: null,
        stickySizeInfo: null,
        mobileMenuToggle: null,
        sidebarToggle: null,
        sidebarOverlay: null
    };

    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        cacheElements();
        bindStaticEvents();
        restoreSidebarState();
        await loadProducts();
        renderCollection();
        renderPricelist();
        handleRouteChange();
    }

    function cacheElements() {
        els.views = Array.from(document.querySelectorAll('.view'));
        els.menuLinks = Array.from(document.querySelectorAll('.menu-link[data-route]'));
        els.topbarTitle = document.getElementById('topbar-title');
        els.collectionGrid = document.getElementById('collection-grid');
        els.searchInput = document.getElementById('search-input');
        els.vibeFilter = document.getElementById('vibe-filter');
        els.sortFilter = document.getElementById('sort-filter');
        els.pricelistBody = document.getElementById('pricelist-body');
        els.detailEmpty = document.getElementById('detail-empty');
        els.detailLayout = document.getElementById('detail-layout');
        els.detailVibe = document.getElementById('detail-vibe');
        els.detailImage = document.getElementById('detail-image');
        els.detailSubtitle = document.getElementById('detail-subtitle');
        els.detailName = document.getElementById('detail-name');
        els.detailDescription = document.getElementById('detail-description');
        els.detailSuitable = document.getElementById('detail-suitable');
        els.detailPrices = document.getElementById('detail-prices');
        els.detailSizeOptions = document.getElementById('detail-size-options');
        els.detailForm = document.getElementById('detail-form');
        els.wrapColor = document.getElementById('wrap-color');
        els.sellerNote = document.getElementById('seller-note');
        els.stickyDetailCta = document.getElementById('sticky-detail-cta');
        els.stickyOrderBtn = document.getElementById('sticky-order-btn');
        els.stickyProductName = document.getElementById('sticky-product-name');
        els.stickySizeInfo = document.getElementById('sticky-size-info');
        els.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        els.sidebarToggle = document.getElementById('sidebar-toggle');
        els.sidebarOverlay = document.getElementById('sidebar-overlay');
    }

    function bindStaticEvents() {
        window.addEventListener('hashchange', handleRouteChange);
        window.addEventListener('resize', onViewportResize);

        if (els.searchInput) {
            els.searchInput.addEventListener('input', (event) => {
                state.query = event.target.value || '';
                renderCollection();
            });
        }

        if (els.vibeFilter) {
            els.vibeFilter.addEventListener('change', (event) => {
                state.vibe = event.target.value || 'all';
                renderCollection();
            });
        }

        if (els.sortFilter) {
            els.sortFilter.addEventListener('change', (event) => {
                state.sort = event.target.value || 'featured';
                renderCollection();
            });
        }

        if (els.detailForm) {
            els.detailForm.addEventListener('submit', (event) => {
                event.preventDefault();
                submitOrder();
            });

            els.detailForm.addEventListener('change', updateStickyCTA);
            els.detailForm.addEventListener('input', updateStickyCTA);
        }

        if (els.stickyOrderBtn) {
            els.stickyOrderBtn.addEventListener('click', submitOrder);
        }

        if (els.mobileMenuToggle) {
            els.mobileMenuToggle.addEventListener('click', () => {
                if (document.body.classList.contains('drawer-open')) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });
        }

        if (els.sidebarToggle) {
            els.sidebarToggle.addEventListener('click', () => {
                if (isMobileViewport()) {
                    closeDrawer();
                    return;
                }

                const collapsed = document.body.classList.toggle('sidebar-collapsed');
                try {
                    localStorage.setItem(STORAGE_KEY_SIDEBAR, collapsed ? '1' : '0');
                } catch {
                    // ignore storage errors
                }
            });
        }

        if (els.sidebarOverlay) {
            els.sidebarOverlay.addEventListener('click', closeDrawer);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDrawer();
            }
        });

        els.menuLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (isMobileViewport()) {
                    closeDrawer();
                }
            });
        });
    }

    async function loadProducts() {
        try {
            const response = await fetch('assets/data/products.json', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid product data');
            }
            state.products = data;
        } catch {
            state.products = fallbackProducts;
        }
    }

    function handleRouteChange() {
        const { route, param } = parseHash(location.hash);
        const view = normalizeRoute(route);

        if (!location.hash) {
            location.hash = '#home';
            return;
        }

        showView(view);
        setActiveMenu(view);
        setTopbarTitle(view);

        if (view === 'detail') {
            renderDetail(param);
        } else {
            state.selectedProduct = null;
            resetDetailState();
        }

        if (view === 'koleksi') {
            renderCollection();
        }

        const pageTitle = ROUTE_TITLES[view] ? `${ROUTE_TITLES[view]} | AIRYBLOOM.CO` : 'AIRYBLOOM.CO';
        document.title = pageTitle;

        closeDrawer();
        window.scrollTo({ top: 0, behavior: state.reduceMotion ? 'auto' : 'smooth' });
    }

    function parseHash(hash) {
        const clean = (hash || '').replace(/^#/, '').trim();
        if (!clean) {
            return { route: 'home', param: '' };
        }

        const parts = clean.split('/');
        const route = (parts[0] || 'home').toLowerCase();
        const param = decodeURIComponent(parts.slice(1).join('/'));
        return { route, param };
    }

    function normalizeRoute(route) {
        if (route === 'detail') {
            return 'detail';
        }

        return Object.prototype.hasOwnProperty.call(ROUTE_TITLES, route) ? route : 'home';
    }

    function showView(view) {
        els.views.forEach((section) => {
            const active = section.dataset.view === view;
            section.hidden = !active;
        });

        document.body.classList.toggle('is-detail-view', view === 'detail');
    }

    function setActiveMenu(view) {
        els.menuLinks.forEach((link) => {
            const active = link.dataset.route === view;
            link.classList.toggle('active', active);
            link.setAttribute('aria-current', active ? 'page' : 'false');
        });
    }

    function setTopbarTitle(view) {
        if (!els.topbarTitle) {
            return;
        }
        els.topbarTitle.textContent = ROUTE_TITLES[view] || 'AIRYBLOOM.CO';
    }

    function getFilteredProducts() {
        const query = state.query.trim().toLowerCase();

        let products = state.products.filter((product) => {
            const vibeMatch = state.vibe === 'all' || product.vibeKey === state.vibe;
            if (!vibeMatch) {
                return false;
            }

            if (!query) {
                return true;
            }

            const haystack = `${product.name} ${product.subtitle} ${product.description} ${product.vibeLabel}`.toLowerCase();
            return haystack.includes(query);
        });

        if (state.sort === 'az') {
            products = [...products].sort((a, b) => a.name.localeCompare(b.name, 'id'));
        } else {
            products = [...products].sort((a, b) => (a.featured || 0) - (b.featured || 0));
        }

        return products;
    }

    function renderCollection() {
        if (!els.collectionGrid) {
            return;
        }

        const products = getFilteredProducts();

        if (products.length === 0) {
            els.collectionGrid.innerHTML = `
                <article class="glass-card empty-collection">
                    <h2>Produk tidak ditemukan</h2>
                    <p>Coba ubah kata kunci, vibe, atau opsi sort.</p>
                </article>
            `;
            return;
        }

        els.collectionGrid.innerHTML = products
            .map((product) => {
                const name = escapeHtml(product.name);
                const subtitle = escapeHtml(product.subtitle);
                const vibe = escapeHtml(product.vibeLabel);
                const description = escapeHtml(product.description);
                const image = escapeAttribute(product.image);
                const slug = encodeURIComponent(product.slug);
                return `
                    <article class="glass-card product-card">
                        <img class="thumb" src="${image}" alt="${name}" loading="lazy" decoding="async">
                        <div class="product-body">
                            <span class="vibe-chip">${vibe}</span>
                            <h2 class="product-title">${name}</h2>
                            <p class="product-subtitle">${subtitle}</p>
                            <p class="product-desc">${description}</p>
                            <div class="card-actions">
                                <a class="btn btn-primary" href="#detail/${slug}">Lihat Detail</a>
                            </div>
                        </div>
                    </article>
                `;
            })
            .join('');
    }

    function renderPricelist() {
        if (!els.pricelistBody) {
            return;
        }

        els.pricelistBody.innerHTML = state.products
            .slice()
            .sort((a, b) => (a.featured || 0) - (b.featured || 0))
            .map((product) => {
                const name = escapeHtml(product.name);
                const priceM = escapeHtml(product.prices?.M || '-');
                const priceL = escapeHtml(product.prices?.L || '-');
                const priceXL = escapeHtml(product.prices?.XL || '-');
                return `
                    <tr>
                        <td>${name}</td>
                        <td>${priceM}</td>
                        <td>${priceL}</td>
                        <td>${priceXL}</td>
                    </tr>
                `;
            })
            .join('');
    }

    function renderDetail(slug) {
        if (!slug) {
            showDetailEmpty();
            return;
        }

        const product = state.products.find((item) => item.slug === slug);
        if (!product) {
            showDetailEmpty();
            return;
        }

        state.selectedProduct = product;

        if (els.detailEmpty) {
            els.detailEmpty.hidden = true;
        }
        if (els.detailLayout) {
            els.detailLayout.hidden = false;
        }

        if (els.detailVibe) {
            els.detailVibe.textContent = product.vibeLabel;
        }
        if (els.detailImage) {
            els.detailImage.src = product.image;
            els.detailImage.alt = product.name;
        }
        if (els.detailSubtitle) {
            els.detailSubtitle.textContent = product.subtitle;
        }
        if (els.detailName) {
            els.detailName.textContent = product.name;
        }
        if (els.detailDescription) {
            els.detailDescription.textContent = product.description;
        }
        if (els.detailSuitable) {
            els.detailSuitable.textContent = product.suitableFor;
        }

        renderDetailPrices(product);
        renderSizeOptions(product);
        resetFormFields();
        updateStickyCTA();
    }

    function showDetailEmpty() {
        state.selectedProduct = null;
        if (els.detailEmpty) {
            els.detailEmpty.hidden = false;
        }
        if (els.detailLayout) {
            els.detailLayout.hidden = true;
        }
        updateStickyCTA();
    }

    function resetDetailState() {
        if (els.detailEmpty) {
            els.detailEmpty.hidden = false;
        }
        if (els.detailLayout) {
            els.detailLayout.hidden = true;
        }
    }

    function renderDetailPrices(product) {
        if (!els.detailPrices) {
            return;
        }

        const sizes = ['M', 'L', 'XL'];
        els.detailPrices.innerHTML = sizes
            .map((size) => {
                const price = escapeHtml(product.prices?.[size] || '-');
                return `<span class="price-pill">${size}: ${price}</span>`;
            })
            .join('');
    }

    function renderSizeOptions(product) {
        if (!els.detailSizeOptions) {
            return;
        }

        const productId = product.id || product.slug;
        const sizes = ['M', 'L', 'XL'];

        els.detailSizeOptions.innerHTML = sizes
            .map((size) => {
                const id = `${productId}-size-${size.toLowerCase()}`;
                return `
                    <input type="radio" id="${escapeAttribute(id)}" name="detail-size" value="${escapeAttribute(size)}">
                    <label class="size-pill" for="${escapeAttribute(id)}">${escapeHtml(size)}</label>
                `;
            })
            .join('');
    }

    function resetFormFields() {
        if (!els.detailForm) {
            return;
        }

        const checkedInputs = els.detailForm.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        checkedInputs.forEach((input) => {
            input.checked = false;
        });

        if (els.wrapColor) {
            els.wrapColor.selectedIndex = 0;
        }

        if (els.sellerNote) {
            els.sellerNote.value = '';
        }
    }

    function getSelectedSize() {
        if (!els.detailForm) {
            return '';
        }
        const selected = els.detailForm.querySelector('input[name="detail-size"]:checked');
        return selected ? selected.value : '';
    }

    function getSelectedAddons() {
        if (!els.detailForm) {
            return [];
        }

        return Array.from(els.detailForm.querySelectorAll('input[name="addon"]:checked')).map((input) => input.value);
    }

    function submitOrder() {
        if (!state.selectedProduct) {
            alert('Silakan pilih produk terlebih dahulu dari halaman Koleksi ya!');
            return;
        }

        const size = getSelectedSize();
        if (!size) {
            alert('Silakan pilih ukuran bucket (M, L, atau XL) terlebih dahulu ya! 🌸');
            return;
        }

        const addons = getSelectedAddons();
        const addonsText = addons.length > 0 ? addons.join(', ') : 'Tanpa add-on';
        const wrap = (els.wrapColor && els.wrapColor.value) ? els.wrapColor.value : 'Pink Pastel';
        const note = els.sellerNote ? els.sellerNote.value.trim() : '';

        const message = [
            'Halo AIRYBLOOM.CO! 👋',
            '',
            'Saya ingin memesan bucket ini:',
            `🌸 Varian: *${state.selectedProduct.shortName || state.selectedProduct.name}*`,
            `📏 Ukuran: *${size}*`,
            `🎀 Add-on: *${addonsText}*`,
            `📦 Warna wrap: *${wrap}*`,
            `📝 Catatan: ${note || '-'}`,
            '',
            'Boleh info total harganya? Terima kasih! ✨'
        ].join('\n');

        openWhatsApp(message);
    }

    function openWhatsApp(message) {
        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
        const popup = window.open(url, '_blank', 'noopener,noreferrer');

        if (!popup) {
            window.location.href = url;
        }
    }

    function updateStickyCTA() {
        if (!els.stickyDetailCta || !els.stickyProductName || !els.stickySizeInfo || !els.stickyOrderBtn) {
            return;
        }

        const hasProduct = Boolean(state.selectedProduct);
        if (!hasProduct) {
            els.stickyDetailCta.hidden = true;
            els.stickyOrderBtn.disabled = true;
            return;
        }

        const size = getSelectedSize();
        els.stickyDetailCta.hidden = false;
        els.stickyOrderBtn.disabled = false;

        els.stickyProductName.textContent = state.selectedProduct.shortName || state.selectedProduct.name;
        els.stickySizeInfo.textContent = size ? `Ukuran ${size} siap diorder` : 'Pilih ukuran terlebih dahulu';
    }

    function restoreSidebarState() {
        if (isMobileViewport()) {
            return;
        }

        try {
            const collapsed = localStorage.getItem(STORAGE_KEY_SIDEBAR);
            if (collapsed === '1') {
                document.body.classList.add('sidebar-collapsed');
            }
        } catch {
            // ignore storage errors
        }
    }

    function openDrawer() {
        if (!isMobileViewport()) {
            return;
        }

        document.body.classList.add('drawer-open');
        if (els.sidebarOverlay) {
            els.sidebarOverlay.hidden = false;
        }
        if (els.mobileMenuToggle) {
            els.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
    }

    function closeDrawer() {
        document.body.classList.remove('drawer-open');
        if (els.sidebarOverlay) {
            els.sidebarOverlay.hidden = true;
        }
        if (els.mobileMenuToggle) {
            els.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    function onViewportResize() {
        if (!isMobileViewport()) {
            closeDrawer();
            return;
        }

        document.body.classList.remove('sidebar-collapsed');
    }

    function isMobileViewport() {
        return window.matchMedia('(max-width: 960px)').matches;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
    }
})();
