document.addEventListener('DOMContentLoaded', () => {
    const productListDiv = document.getElementById('product-list');
    const brandSelect = document.getElementById('brand-select');
    let products = []; // برای نگهداری همه محصولات

    // تابع برای ساخت کارت محصول
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-brand">برند: ${product.brand}</p>
            <p class="product-price">${product.price.toLocaleString('fa-IR')} <span>تومان</span></p>
        `;
        return productCard;
    }

    // تابع برای رندر کردن محصولات
    function renderProducts(filteredProducts) {
        productListDiv.innerHTML = ''; // پاک کردن محصولات قبلی
        if (filteredProducts.length === 0) {
            productListDiv.innerHTML = '<p style="text-align: center; width: 100%;">محصولی با این برند یافت نشد.</p>';
            return;
        }
        filteredProducts.forEach(product => {
            productListDiv.appendChild(createProductCard(product));
        });
    }

    // تابع برای پر کردن لیست انتخاب برند
    function populateBrandFilter(productsData) {
        const brands = new Set(productsData.map(product => product.brand));
        brandSelect.innerHTML = '<option value="all">همه برندها</option>'; // همیشه گزینه "همه" وجود دارد
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    }

    // بارگذاری داده‌ها از data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            products = data; // ذخیره همه محصولات
            populateBrandFilter(products);
            renderProducts(products); // نمایش اولیه همه محصولات
        })
        .catch(error => {
            console.error('خطا در بارگذاری داده‌ها:', error);
            productListDiv.innerHTML = '<p style="text-align: center; width: 100%; color: red;">خطا در بارگذاری اطلاعات محصولات.</p>';
        });

    // اضافه کردن رویداد به فیلتر برند
    brandSelect.addEventListener('change', (event) => {
        const selectedBrand = event.target.value;
        let filteredProducts = [];

        if (selectedBrand === 'all') {
            filteredProducts = products;
        } else {
            filteredProducts = products.filter(product => product.brand === selectedBrand);
        }
        renderProducts(filteredProducts);
    });
});
