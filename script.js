let slideIndex = 0;
let products = []; // برای نگهداری همه محصولات
let currentFilteredProducts = []; // برای نگهداری محصولات فیلتر شده بر اساس جستجو و برند

document.addEventListener('DOMContentLoaded', () => {
    const productListDiv = document.getElementById('product-list');
    const brandSelect = document.getElementById('brand-select');
    const searchInput = document.getElementById('search-input');
    const noProductsMessage = document.getElementById('no-products-found');

    // --- اسلایدر تصاویر ---
    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("carousel-slide");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlides, 5000); // تغییر تصویر هر 5 ثانیه
    }

    // کنترل دستی اسلایدر
    window.plusSlides = function(n) {
        let slides = document.getElementsByClassName("carousel-slide");
        slideIndex += n;
        if (slideIndex > slides.length) { slideIndex = 1 }
        if (slideIndex < 1) { slideIndex = slides.length }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }

    showSlides(); // شروع اسلایدر

    // --- مدیریت محصولات ---

    // تابع برای ساخت کارت محصول
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const availabilityClass = product.availability === 'موجود' ? 'available' : 'unavailable';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-brand">برند: ${product.brand}</p>
            ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
            <p class="product-price">${product.price.toLocaleString('fa-IR')} <span>تومان</span></p>
            <span class="product-availability ${availabilityClass}">${product.availability}</span>
        `;
        return productCard;
    }

    // تابع برای رندر کردن محصولات
    function renderProducts(productsToRender) {
        productListDiv.innerHTML = '';
        if (productsToRender.length === 0) {
            noProductsMessage.classList.remove('hidden');
        } else {
            noProductsMessage.classList.add('hidden');
            productsToRender.forEach(product => {
                productListDiv.appendChild(createProductCard(product));
            });
        }
    }

    // تابع برای پر کردن لیست انتخاب برند
    function populateBrandFilter(productsData) {
        const brands = new Set(productsData.map(product => product.brand));
        brandSelect.innerHTML = '<option value="all">همه برندها</option>';
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    }

    // تابع اصلی فیلتر و جستجو
    function applyFiltersAndSearch() {
        const selectedBrand = brandSelect.value;
        const searchTerm = searchInput.value.toLowerCase().trim();

        let filtered = products;

        // فیلتر بر اساس برند
        if (selectedBrand !== 'all') {
            filtered = filtered.filter(product => product.brand === selectedBrand);
        }

        // فیلتر بر اساس جستجو
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm))
            );
        }
        currentFilteredProducts = filtered;
        renderProducts(currentFilteredProducts);
    }

    // بارگذاری داده‌ها از data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            products = data;
            populateBrandFilter(products);
            applyFiltersAndSearch(); // نمایش اولیه همه محصولات
        })
        .catch(error => {
            console.error('خطا در بارگذاری داده‌ها:', error);
            productListDiv.innerHTML = `<p style="text-align: center; width: 100%; color: red;">خطا در بارگذاری اطلاعات محصولات: ${error.message}</p>`;
            noProductsMessage.classList.add('hidden'); // پیام خطا را نشان می‌دهد
        });

    // اضافه کردن رویدادها
    brandSelect.addEventListener('change', applyFiltersAndSearch);
    searchInput.addEventListener('input', applyFiltersAndSearch);
});
