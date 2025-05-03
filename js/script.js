document.addEventListener('DOMContentLoaded', function() {
    // Загрузка продуктов
    loadProducts();
    
    // Инициализация корзины
    initCart();
    
    // Обработчики событий
    setupEventListeners();
});

function loadProducts() {
    // Временно добавьте console.log для проверки
	fetch('products/data.json')
		.then(response => {
			if (!response.ok) {
				throw new Error('Ошибка загрузки данных');
			}
			return response.json();
		})
		.then(products => {
			console.log('Загружены товары:', products); // Проверьте данные в консоли
			const randomProducts = getRandomProducts(products, 6);
			displayProducts(randomProducts);
		})
		.catch(error => {
			console.error('Ошибка:', error);
			document.getElementById('products-container').innerHTML = 
				'<p>Ошибка загрузки товаров. Пожалуйста, попробуйте позже.</p>';
		});
}

// Функция для выбора случайных товаров
function getRandomProducts(products, count) {
    // Создаем копию массива, чтобы не изменять оригинал
    const shuffled = [...products];
    
    // Алгоритм Фишера-Йетса для перемешивания массива
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Возвращаем первые N элементов
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">${product.price} ₽</p>
            <button class="add-to-cart" data-id="${product.id}">В корзину</button>
        `;
        container.appendChild(productElement);
    });
}

function initCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    updateCartCounter();
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    document.querySelector('.cart-counter').textContent = cart.length;
}

function setupEventListeners() {
    // Каталог
    const catalogBtn = document.querySelector('.catalog-btn');
    const catalogMenu = document.getElementById('catalog-menu');
    const catalogOverlay = document.getElementById('catalog-overlay');
    
    catalogBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCatalog();
    });
    
    catalogOverlay.addEventListener('click', function() {
        toggleCatalog();
    });
    
    // Закрытие каталога при клике вне его
    document.addEventListener('click', function(e) {
        if (!catalogMenu.contains(e.target) && e.target !== catalogBtn) {
            closeCatalog();
        }
    });
    
    // Обработка выбора категории
    document.querySelectorAll('.categories li').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
            closeCatalog();
        });
    });
    
    // Остальные обработчики...
    document.querySelector('.auth-btn').addEventListener('click', function() {
        alert('Авторизация будет реализована позже');
    });
    
    document.querySelector('.orders-btn').addEventListener('click', function() {
        alert('Заказы будут реализованы позже');
    });
    
    document.querySelector('.favorites-btn').addEventListener('click', function() {
        alert('Избранное будет реализовано позже');
    });
    
    document.querySelector('.cart-btn').addEventListener('click', function() {
        alert('Корзина будет реализована позже');
    });
}

function toggleCatalog() {
    const catalogMenu = document.getElementById('catalog-menu');
    const catalogOverlay = document.getElementById('catalog-overlay');
    
    if (catalogMenu.style.display === 'block') {
        closeCatalog();
    } else {
        openCatalog();
    }
}

function openCatalog() {
    const catalogMenu = document.getElementById('catalog-menu');
    const catalogOverlay = document.getElementById('catalog-overlay');
    
    catalogMenu.style.display = 'block';
    catalogOverlay.style.display = 'block';
    
    // Анимация появления
    setTimeout(() => {
        catalogMenu.style.opacity = '1';
        catalogOverlay.style.opacity = '1';
    }, 10);
}

function closeCatalog() {
    const catalogMenu = document.getElementById('catalog-menu');
    const catalogOverlay = document.getElementById('catalog-overlay');
    
    catalogMenu.style.opacity = '0';
    catalogOverlay.style.opacity = '0';
    
    setTimeout(() => {
        catalogMenu.style.display = 'none';
        catalogOverlay.style.display = 'none';
    }, 300);
}

function filterProductsByCategory(category) {
    const promoBanner = document.querySelector('.promo-banner');
    const sectionTitle = document.querySelector('.section-title');
    
    if (category === 'all') {
        promoBanner.classList.remove('hidden');
        sectionTitle.textContent = 'Рекомендуемые товары';
        
        // При возврате к "Все товары" показываем снова случайные товары
        fetch('products/data.json')
            .then(response => response.json())
            .then(products => {
                const randomProducts = getRandomProducts(products, 6);
                displayProducts(randomProducts);
            });
    } else {
        promoBanner.classList.add('hidden');
        sectionTitle.textContent = getCategoryName(category);
        
        // Для конкретной категории показываем все товары этой категории
        fetch('products/data.json')
            .then(response => response.json())
            .then(products => {
                products = products.filter(product => product.category === category);
                displayProducts(products);
            });
    }
}

function getCategoryName(category) {
    const names = {
        'vegetables': 'Овощи',
        'fruits': 'Фрукты',
        'bakery': 'Выпечка',
        'dairy': 'Молочные продукты',
        'meat': 'Мясо',
        'fish': 'Рыба',
        'groceries': 'Бакалея'
    };
    return names[category] || category;
}

function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    
    // Можно добавить анимацию или уведомление
    alert('Товар добавлен в корзину!');
}

// User Management System
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Modal Functions
function showAuthModal() {
  document.getElementById('auth-modal').style.display = 'block';
  showLogin();
}

function closeModal() {
  document.getElementById('auth-modal').style.display = 'none';
  clearForms();
}

function clearForms() {
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('register-email').value = '';
  document.getElementById('register-password').value = '';
  document.getElementById('register-confirm').value = '';
  document.getElementById('auth-message').textContent = '';
}

// Form Toggle
function showLogin() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}

// Auth Functions
function register() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;

  if (!validateEmail(email)) {
    showMessage('Некорректный email!', 'error');
    return;
  }

  if (password !== confirm) {
    showMessage('Пароли не совпадают!', 'error');
    return;
  }

  if (users.some(user => user.email === email)) {
    showMessage('Пользователь уже существует!', 'error');
    return;
  }

  const newUser = { email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  showMessage('Регистрация успешна!', 'success');
  setTimeout(() => {
    closeModal();
    loginUser(newUser);
  }, 1500);
}

function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    loginUser(user);
    closeModal();
  } else {
    showMessage('Неверные учетные данные!', 'error');
  }
}

function loginUser(user) {
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
  updateAuthUI();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateAuthUI();
}

// Helpers
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(text, type = 'error') {
  const messageEl = document.getElementById('auth-message');
  messageEl.textContent = text;
  messageEl.className = type;
  setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = '';
  }, 3000);
}

function updateAuthUI() {
  const authBtn = document.querySelector('.auth-btn');
  if (currentUser) {
    authBtn.textContent = 'Выйти';
    authBtn.onclick = logout;
  } else {
    authBtn.textContent = 'Войти';
    authBtn.onclick = showAuthModal;
  }
}

// Инициализация
updateAuthUI();

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
  const modal = document.getElementById('auth-modal');
  if (event.target === modal) {
    closeModal();
  }
}
