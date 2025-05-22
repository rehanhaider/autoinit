import { PUBLIC_RECAPATCHA_CLIENT_KEY } from "astro:env/client";

const loadRecaptcha = () => {
    // Load the reCAPTCHA script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${PUBLIC_RECAPATCHA_CLIENT_KEY}`;
    script.async = true;
    document.body.appendChild(script);
};

const getRecaptchaToken = async () => {
    const token = await (window as any).grecaptcha.execute(PUBLIC_RECAPATCHA_CLIENT_KEY, { action: "signup" });
    return token;
};

export { loadRecaptcha, getRecaptchaToken };
