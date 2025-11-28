const AUTH_KEY = "hasSessionActive";
const DASHBOARD_PAGE = "/dashboard.html";
const SIGN_IN_PAGE = "/index.html"; 

(function() {
    const sessionStatus = sessionStorage.getItem(AUTH_KEY);
    if (sessionStatus === "valid") {
        console.info("User already authorized. Redirecting to dashboard.");
        window.location.replace(DASHBOARD_PAGE);
    }
})();


const UIMessenger = {
    messageBox: document.getElementById('messageBox'),

    showMessage(message, isError = false) {
        if (!this.messageBox) return;

        this.messageBox.textContent = message;
        this.messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');
        
        if (isError) {
            this.messageBox.classList.add('bg-red-100', 'text-red-800');
            console.error("Auth Error:", message);
        } else {
            this.messageBox.classList.add('bg-green-100', 'text-green-800');
            console.log("Auth Success:", message);
        }

        // Hide message after 5 seconds
        setTimeout(() => {
            this.messageBox.classList.add('hidden');
        }, 5000);
    }
};



const FormRenderer = {
    titleEl: document.querySelector("[data-title]"),
    infoEl: document.querySelector("[data-info]"),
    fieldsContainer: document.getElementById("form-fields-container"),
    loginTab: document.getElementById("loginTab"),
    signupTab: document.getElementById("signupTab"),
    submitBtn: document.querySelector("[data-submit-btn]"),
    formEl: document.getElementById("authForm"),

    forms: {
        login: {
            title: "Welcome Back!",
            info: "Enter your details to access your account",
            fields: `
                <label>Email*</label>
                <div class="input-wrapper-email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                    <input type="email" placeholder="hello@example.com" id="email" required autocomplete="email">
                </div>

                <label>Password*</label>
                <div class="input-wrapper-password">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type="password" placeholder="•••••••" id="password" required autocomplete="current-password">
                </div>
            `,
            buttonText: "Next Step",
        },
        signup: {
            title: "Join TaskMaster",
            info: "Create an account to boost your productivity",
            fields: `
                <label>Full Name*</label>
                <div class="input-wrapper-name">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" placeholder="John Doe" id="name" required>
                </div>

                <label>Email Address*</label>
                <div class="input-wrapper-email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                    <input type="email" placeholder="hello@example.com" id="email" required autocomplete="email">
                </div>

                <label>Password*</label>
                <div class="input-wrapper-password">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type="password" placeholder="•••••••" id="password" required autocomplete="new-password">
                </div>
                <span class="text-small-note">Password must be at least 6 characters long</span>
            `,
            buttonText: "Create Account",
        },
    },

    renderForm(type) {
        const config = this.forms[type];
        this.titleEl.textContent = config.title;
        this.infoEl.textContent = config.info;
        this.fieldsContainer.innerHTML = config.fields;
        this.submitBtn.textContent = config.buttonText;

        this.loginTab.classList.remove("active");
        this.signupTab.classList.remove("active");
        if (type === 'login') {
            this.loginTab.classList.add("active");
        } else {
            this.signupTab.classList.add("active");
        }
    },

    init() {
        this.renderForm('login');
        this.loginTab.addEventListener("click", () => this.renderForm('login'));
        this.signupTab.addEventListener("click", () => this.renderForm('signup'));
    }
};

const AuthValidator = {
    form: document.getElementById("authForm"),

    validate(e) {
        e.preventDefault();


        const emailInput = document.querySelector("#email");
        const nameInput = document.querySelector("#name"); 
        const passwordInput = document.querySelector("#password");

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        let fullName = "";
        let isSignup = !!nameInput; 
        const formType = isSignup ? 'Signup' : 'Login';


        if (!emailValue || !passwordValue) {
            UIMessenger.showMessage("Please fill out all required fields.", true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            UIMessenger.showMessage("Please enter a valid email format (e.g., hello@example.com).", true);
            return;
        }

        if (passwordValue.length < 6) {
            UIMessenger.showMessage("Password must be at least 6 characters long.", true);
            return;
        }

        if (isSignup) {
            fullName = nameInput.value.trim();
            const nameRegex = /^[A-Za-z\s]{3,}$/;

            if (!fullName) {
                UIMessenger.showMessage("Please enter your full name.", true);
                return;
            }
            if (!nameRegex.test(fullName)) {
                UIMessenger.showMessage("Your name must have at least 3 letters and can only contain letters and spaces.", true);
                return;
            }
        }

        sessionStorage.setItem(AUTH_KEY, "valid"); 
        
        sessionStorage.setItem("userName", fullName || emailValue.split('@')[0]);
        sessionStorage.setItem("userEmail", emailValue);

        UIMessenger.showMessage(`${formType} successful! Redirecting to dashboard...`);

        setTimeout(() => {
            window.location.replace(DASHBOARD_PAGE);
        }, 500);
    },

    init() {
        this.form.addEventListener("submit", this.validate.bind(this));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    FormRenderer.init();
    AuthValidator.init();
});