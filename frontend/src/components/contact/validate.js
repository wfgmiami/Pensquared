const validateCandidate = (values) => {
  const errors = {};
  const requiredFields = [
    "firstName",
    "lastName",
    // "email",
    "phone",
    "streetAddress",
    "city",
    "state",
    "zipCode",
    "driversLicense",
    "dob",
    // "ssn",
    "experience",
    "formerEmployer",
    "formerEmployerPhone",
    "movingViolation",
    "preventableAccident",
    "dui",
  ];

  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const dob = /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/;

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }

  if (!values.formerEmployerPhone.match(phoneno))
    errors.phone = "Invalid employer phone number";
  if (!values.phone.match(phoneno)) errors.phone = "Invalid phone number";
  if (!values.dob.match(dob) && !errors.dob) errors.dob = "Invalid birthdate";

  return errors;
};

const validateContactForm = (values) => {
  const errors = {};
  const requiredFields = ["firstName", "lastName", "email", "phone", "comment"];
  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }

  if (!values.phone.match(phoneno)) errors.phone = "Invalid phone number";

  return errors;
};

module.exports = {
  validateCandidate,
  validateContactForm,
};
