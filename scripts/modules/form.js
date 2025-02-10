import { validateCompleteName, validatePhone } from "./utils/validate.js";
import debounce from "./utils/debounce.js";
import Toast from "./utils/toast.js";

const toast = new Toast();

export default class Form {
  constructor(formSelector) {
    this.errorTypes = [
      "valueMissing",
      "typeMismatch",
      "customError",
      "patternMismatch",
      "tooShort",
    ];

    this.errorMessages = {
      name: {
        valueMissing: "O campo de nome não pode estar vazio.",
        patternMismatch: "Por favor, preencha um nome válido.",
        tooShort: "Por favor, preencha um nome válido.",
      },
      email: {
        valueMissing: "O campo de e-mail não pode estar vazio.",
        typeMismatch: "Por favor, preencha um email válido.",
        tooShort: "Por favor, preencha um email válido.",
      },
      phone: {
        valueMissing: "O campo de telefone não pode estar vazio.",
        tooShort: "O campo de celular não tem dígitos suficientes.",
      },
      "social-media": {
        valueMissing: "O campo de rede social/site não pode estar vazio.",
        tooShort: "O campo de rede social/site não tem dígitos suficientes.",
      }
    };

    this.formElement = document.querySelector(formSelector);
    this.fields = this.formElement.querySelectorAll("[required]");
    this.disableDefaultError();
    this.enabledPhoneMask();
    this.initFields();
    this.initSubmit();
  }

  initSubmit() {
    const form = this.formElement;
    const toast = new Toast();

    form.querySelector("[type='submit']").addEventListener("click", () => {
      this.fields.forEach((field) => {
        this.checkField(field);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const param = new URLSearchParams(window.location.search);
      param.forEach((value, key) => {
        formData.set(key, value);
      });

      const pixelResponse = await fetch("../php/pixel-submit.php", {
        method: "POST",
        body: formData,
      });

      try {
        const rdResponse = await fetch("../php/submit-form.php", {
          method: "POST",
          body: formData,
        });

        const result = await rdResponse.json();

        if (result.erro) {
          toast.createToast(result.errorMessage, "error");
        } else {
          const url = "https://zap.thiagobatizeli.com.br/100k-expert";
          toast.createToast("Formulário enviado com sucesso!", "success");
          this.formElement.reset();
          window.open(url, "_blank");
        }
      } catch (error) {
        toast.createToast(
          "Erro no envio do formulário. Tente novamente.",
          "error"
        );
      }
    });
  }

  disableDefaultError() {
    this.formElement
      .querySelectorAll("[required]")
      .forEach((field) =>
        field.addEventListener("invalid", (e) => e.preventDefault())
      );
  }

  initFields() {
    this.fields.forEach((field) => {
      const errorMessage = field.nextElementSibling;
      const checkFunc = debounce(() => {
        this.checkField(field);
      }, 500);

      if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
        field.addEventListener("keyup", (e) => {
          e.preventDefault();
          checkFunc();
        });
      } else if (field.tagName === "SELECT") {
        field.addEventListener("change", (e) => {
          e.preventDefault();
          checkFunc();
        });
      }
    });
  }

  enabledPhoneMask() {
    this.formElement.querySelectorAll("[type='tel']").forEach((tel) => {
      tel.addEventListener("input", (e) => {
        let formattedNumber = e.target.value.replace(/\D/g, "");
        if (formattedNumber.length > 11) {
          formattedNumber = formattedNumber.slice(0, 11);
        }
        formattedNumber = formattedNumber.replace(/^(\d{2})(\d)/g, "($1) $2");
        formattedNumber = formattedNumber.replace(/(\d)(\d{4})$/, "$1-$2");

        e.target.value = formattedNumber;
      });
    });
  }

  checkField(field) {
    let msg;
    field.setCustomValidity("");
    if (field.name == "name") {
      validateCompleteName(field, 1, 2);
    } else if (field.name == "phone") {
      validatePhone(field);
    }

    this.errorTypes.forEach((erro) => {
      if (field.validity[erro]) {
        msg = this.errorMessages[field.name][erro];
        if (erro === "customError") msg = field.validationMessage;
      }
    });

    const inputValidator = field.checkValidity();
    const messageBox = field.nextElementSibling;

    if (!inputValidator && !field.disabled) {
      messageBox.innerText = msg;
      messageBox.classList.add("error");
      field.classList.add("error");
    } else {
      messageBox.innerText = "";
      messageBox.classList.remove("error");
      field.classList.remove("error");
    }
  }
}
