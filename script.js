    // REDIRECTION UTILITY
        (function() {
            if (sessionStorage.getItem("userLoggedIn") === "true") {
                window.location.href = "/index.html";
            }
        })();


        // FORM GENERATION AND SWITCHING LOGIC
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
                this.renderForm('login'); // Default form
                this.loginTab.addEventListener("click", () => this.renderForm('login'));
                this.signupTab.addEventListener("click", () => this.renderForm('signup'));
            }
        };

        // SUBMISSION AND VALIDATION LOGIC
        const AuthValidator = {
            form: document.getElementById("authForm"),

            validate(e) {
                e.preventDefault();

                // Get dynamic fields
                const emailInput = document.querySelector("#email");
                const nameInput = document.querySelector("#name"); // null in login mode
                const passwordInput = document.querySelector("#password");

                const emailValue = emailInput.value.trim();
                const passwordValue = passwordInput.value;
                let fullName = "";
                let isSignup = !!nameInput; // Check if the name field exists

                // Validation Checks
                if (!emailValue || !passwordValue) {
                    alert("Please fill out all required fields.");
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailValue)) {
                    alert("Please enter a valid email format (e.g., hello@example.com).");
                    return;
                }

                if (passwordValue.length < 6) {
                    alert("Password must be at least 6 characters long.");
                    return;
                }

                if (isSignup) {
                    fullName = nameInput.value.trim();
                    const nameRegex = /^[A-Za-z\s]{3,}$/;

                    if (!fullName) {
                        alert("Please enter your full name.");
                        return;
                    }
                    if (!nameRegex.test(fullName)) {
                        alert("Your name must have at least 3 letters and can only contain letters and spaces.");
                        return;
                    }
                }

                // Successful Authentication Simulation
                sessionStorage.setItem("userLoggedIn", "true");
                sessionStorage.setItem("userName", fullName || emailValue);
                sessionStorage.setItem("userEmail", emailValue);

                alert(`${isSignup ? 'Signup' : 'Login'} successful! Redirecting...`);

                window.location.href = "/index.html";
            },

            init() {
                this.form.addEventListener("submit", this.validate.bind(this));
            }
        };

        // INITIALIZE APPLICATION
        document.addEventListener('DOMContentLoaded', () => {
            FormRenderer.init();
            AuthValidator.init();
        });