export async function sleep(timeMs) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeMs);
  })
}

export function getFormValues(formId) {
  // const inputs = $('#pispLoginForm :input');
  const inputs = $(`${formId} :input`);
  const values = {};
  inputs.each(function (input) {
    if (!this.name) {
      return;
    }
    values[this.name] = $(this).val();
  });

  return values;
}