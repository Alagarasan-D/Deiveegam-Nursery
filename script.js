// Language Translations
const translations = {
  en: {
    welcome: "Welcome to Deiveegam Nursery",
    // Add more translations as needed
  },
  ta: {
    welcome: "தெய்வீகம் நர்சரிக்கு வரவேற்கிறோம்",
    // Add more translations as needed
  },
}

// State Management
let currentLanguage = "en"
let currentTheme = "light"
let cart = []
let currentSlide = 0

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initSlider()
  initLanguage()
  initTheme()
  initCart()
  initEventListeners()
  loadCartFromStorage()
})

// Slider Functionality
function initSlider() {
  const slides = document.querySelectorAll(".slide")
  const dotsContainer = document.querySelector(".slider-dots")

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("div")
    dot.classList.add("dot")
    if (index === 0) dot.classList.add("active")
    dot.addEventListener("click", () => goToSlide(index))
    dotsContainer.appendChild(dot)
  })

  // Auto slide
  setInterval(() => {
    changeSlide(1)
  }, 3000)
}

function changeSlide(direction) {
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")

  slides[currentSlide].classList.remove("active")
  dots[currentSlide].classList.remove("active")

  currentSlide = (currentSlide + direction + slides.length) % slides.length

  slides[currentSlide].classList.add("active")
  dots[currentSlide].classList.add("active")
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")

  slides[currentSlide].classList.remove("active")
  dots[currentSlide].classList.remove("active")

  currentSlide = index

  slides[currentSlide].classList.add("active")
  dots[currentSlide].classList.add("active")
}

// Language Switching
function initLanguage() {
  const languageBtn = document.getElementById("languageBtn")
  languageBtn.addEventListener("click", toggleLanguage)
}

function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "ta" : "en"
  document.getElementById("langText").textContent = currentLanguage === "en" ? "தமிழ்" : "English"
  updateLanguage()
}

function updateLanguage() {
  const elements = document.querySelectorAll(`[data-${currentLanguage}]`)
  elements.forEach((element) => {
    const translation = element.getAttribute(`data-${currentLanguage}`)
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.placeholder = translation
    } else {
      element.textContent = translation
    }
  })
}

// Theme Switching
function initTheme() {
  const themeToggle = document.getElementById("themeToggle")
  const savedTheme = localStorage.getItem("theme") || "light"
  setTheme(savedTheme)

  themeToggle.addEventListener("click", () => {
    const newTheme = currentTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
  })
}

function setTheme(theme) {
  currentTheme = theme
  document.body.setAttribute("data-theme", theme)
  localStorage.setItem("theme", theme)

  const icon = document.querySelector("#themeToggle i")
  icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun"
}

// Cart Functionality
function initCart() {
  const cartBtn = document.getElementById("cartBtn")
  const closeCart = document.getElementById("closeCart")
  const cartSidebar = document.getElementById("cartSidebar")

  cartBtn.addEventListener("click", () => {
    cartSidebar.classList.add("active")
  })

  closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("active")
  })

  // Close cart when clicking outside
  document.addEventListener("click", (e) => {
    if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
      cartSidebar.classList.remove("active")
    }
  })
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartUI()
  }
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function addToCart(productName, price) {
  const existingItem = cart.find((item) => item.name === productName)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({
      name: productName,
      price: Number.parseInt(price),
      quantity: 1,
    })
  }

  updateCartUI()
  saveCartToStorage()

  // Show feedback
  showNotification(`${productName} ${currentLanguage === "en" ? "added to cart" : "கூடையில் சேர்க்கப்பட்டது"}`)
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount")
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")

  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems

  // Update items
  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>${currentLanguage === "en" ? "Your cart is empty" : "உங்கள் கூடை காலியாக உள்ளது"}</p>
            </div>
        `
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity('${item.name}')">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity('${item.name}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `,
      )
      .join("")
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = `₹${total}`
}

function increaseQuantity(productName) {
  const item = cart.find((item) => item.name === productName)
  if (item) {
    item.quantity++
    updateCartUI()
    saveCartToStorage()
  }
}

function decreaseQuantity(productName) {
  const item = cart.find((item) => item.name === productName)
  if (item && item.quantity > 1) {
    item.quantity--
    updateCartUI()
    saveCartToStorage()
  } else if (item && item.quantity === 1) {
    removeFromCart(productName)
  }
}

function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName)
  updateCartUI()
  saveCartToStorage()
}

// Buy Now and Checkout
function buyNow(productName, price, quantity = 1) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendToWhatsApp([{ name: productName, price: Number.parseInt(price), quantity }], position.coords)
      },
      (error) => {
        if (
          confirm(
            currentLanguage === "en"
              ? "Unable to get location. Continue without location?"
              : "இருப்பிடத்தைப் பெற முடியவில்லை. இருப்பிடம் இல்லாமல் தொடரவா?",
          )
        ) {
          sendToWhatsApp([{ name: productName, price: Number.parseInt(price), quantity }], null)
        }
      },
    )
  } else {
    sendToWhatsApp([{ name: productName, price: Number.parseInt(price), quantity }], null)
  }
}

function checkout() {
  if (cart.length === 0) {
    alert(currentLanguage === "en" ? "Your cart is empty" : "உங்கள் கூடை காலியாக உள்ளது")
    return
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendToWhatsApp(cart, position.coords)
      },
      (error) => {
        if (
          confirm(
            currentLanguage === "en"
              ? "Unable to get location. Continue without location?"
              : "இருப்பிடத்தைப் பெற முடியவில்லை. இருப்பிடம் இல்லாமல் தொடரவா?",
          )
        ) {
          sendToWhatsApp(cart, null)
        }
      },
    )
  } else {
    sendToWhatsApp(cart, null)
  }
}

async function sendToWhatsApp(items, coords) {
  let message =
    currentLanguage === "en"
      ? "🌴 *New Order from Deiveegam Nursery* 🌴\n\n"
      : "🌴 *தெய்வீகம் நர்சரியிலிருந்து புதிய ஆர்டர்* 🌴\n\n"

  message += currentLanguage === "en" ? "*Order Details:*\n" : "*ஆர்டர் விவரங்கள்:*\n"

  items.forEach((item) => {
    message += `\n${item.name}\n`
    message += currentLanguage === "en" ? `Quantity: ${item.quantity}\n` : `அளவு: ${item.quantity}\n`
    message += currentLanguage === "en" ? `Price: ₹${item.price} each\n` : `விலை: ₹${item.price} ஒவ்வொன்றும்\n`
    message +=
      currentLanguage === "en"
        ? `Subtotal: ₹${item.price * item.quantity}\n`
        : `சிறிய மொத்தம்: ₹${item.price * item.quantity}\n`
  })

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  message += `\n*${currentLanguage === "en" ? "Total Amount" : "மொத்த தொகை"}: ₹${total}*\n\n`

  if (coords) {
    // Get location details using reverse geocoding
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
      )
      const data = await response.json()

      const address = data.display_name || "Address not found"
      const city = data.address?.city || data.address?.town || data.address?.village || ""
      const state = data.address?.state || ""
      const postcode = data.address?.postcode || ""

      message += currentLanguage === "en" ? "*Delivery Location:*\n" : "*விநியோக இடம்:*\n"
      message += `${address}\n\n`
      message += currentLanguage === "en" ? "*Coordinates:*\n" : "*ஆயத்தொலை குறிப்புகள்:*\n"
      message += `📍 https://maps.google.com/?q=${coords.latitude},${coords.longitude}\n\n`
    } catch (error) {
      message += currentLanguage === "en" ? "*Location:*\n" : "*இடம்:*\n"
      message += `📍 https://maps.google.com/?q=${coords.latitude},${coords.longitude}\n\n`
    }
  }

  message +=
    currentLanguage === "en"
      ? "✅ *Free Delivery within 100 KM from Salem*\n\n"
      : "✅ *சேலத்திலிருந்து 100 கி.மீ க்குள் இலவச வீடு வரை பொருள் பெறுதல்*\n\n"

  message +=
    currentLanguage === "en"
      ? "Thank you for choosing Deiveegam Nursery! 🙏"
      : "தெய்வீகம் நர்சரியைத் தேர்ந்தெடுத்ததற்கு நன்றி! 🙏"

  const phoneNumber = "919942198163"
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  window.open(whatsappURL, "_blank")
}

// Event Listeners
function initEventListeners() {
  // Add to Cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const productName = button.getAttribute("data-product")
      const price = button.getAttribute("data-price")
      addToCart(productName, price)
    })
  })

  // Buy Now buttons
  document.querySelectorAll(".buy-now").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const productName = button.getAttribute("data-product")
      const price = button.getAttribute("data-price")
      buyNow(productName, price)
    })
  })

  // Checkout button
  document.getElementById("checkoutBtn").addEventListener("click", checkout)

  // Terms and Conditions
  document.getElementById("termsLink").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("termsModal").classList.add("active")
  })

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("active")
      })
    })
  })

  // Close modals when clicking outside
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active")
      }
    })
  })

  // Search functionality
  document.getElementById("searchInput").addEventListener("input", handleSearch)
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase()
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const productName = card.querySelector("h4").textContent.toLowerCase()
    const productDesc = card.querySelector(".product-desc").textContent.toLowerCase()

    if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
      card.style.display = "block"
    } else {
      card.style.display = searchTerm ? "none" : "block"
    }
  })
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 2000)
}

// Add animation styles
const style = document.createElement("style")
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
`
document.head.appendChild(style)
